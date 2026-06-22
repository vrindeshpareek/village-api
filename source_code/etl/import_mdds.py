import argparse
import json
import os
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

EXPECTED_COLUMNS = {
    "MDDS STC": "state_code",
    "STATE NAME": "state_name",
    "MDDS DTC": "district_code",
    "DISTRICT NAME": "district_name",
    "MDDS Sub_DT": "subdistrict_code",
    "SUB-DISTRICT NAME": "subdistrict_name",
    "MDDS PLCN": "village_code",
    "Area Name": "village_name",
}


SUPPORTED_SUFFIXES = {".csv", ".xls", ".xlsx", ".ods"}


def normalize_code(value: object) -> str:
    if pd.isna(value):
        return ""
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip().removesuffix(".0")


def read_source(path: Path) -> pd.DataFrame:
    if path.is_dir():
        frames = [read_source(child) for child in sorted(path.glob("*")) if child.suffix.lower() in SUPPORTED_SUFFIXES]
        if not frames:
            raise ValueError(f"No supported data files found in {path}")
        return pd.concat(frames, ignore_index=True)

    if path.suffix.lower() in {".ods", ".xlsx", ".xls"}:
        engine = "odf" if path.suffix.lower() == ".ods" else None
        workbook = pd.ExcelFile(path, engine=engine)
        frame = None
        for sheet_name in workbook.sheet_names:
            candidate = pd.read_excel(workbook, sheet_name=sheet_name)
            if all(column in candidate.columns for column in EXPECTED_COLUMNS):
                frame = candidate
                break
        if frame is None:
            candidate = pd.read_excel(workbook, sheet_name=workbook.sheet_names[0])
            raise ValueError(
                f"{path.name}: no sheet has expected columns; "
                f"checked sheets: {workbook.sheet_names}; first sheet columns: {list(candidate.columns)}"
            )
    else:
        frame = pd.read_csv(path)
    missing = [column for column in EXPECTED_COLUMNS if column not in frame.columns]
    if missing:
        raise ValueError(f"{path.name}: missing expected columns: {missing}; found columns: {list(frame.columns)}")
    frame = frame.rename(columns=EXPECTED_COLUMNS)
    frame = frame[list(EXPECTED_COLUMNS.values())]
    frame["source_file"] = path.name
    return frame


def clean(frame: pd.DataFrame) -> tuple[pd.DataFrame, list[dict]]:
    errors: list[dict] = []
    cleaned = frame.copy()
    for column in ["state_code", "district_code", "subdistrict_code", "village_code"]:
        cleaned[column] = [normalize_code(value) for value in cleaned[column].to_numpy(dtype=object)]
    for column in ["state_name", "district_name", "subdistrict_name", "village_name", "source_file"]:
        cleaned[column] = cleaned[column].astype(str).str.strip()

    required = list(EXPECTED_COLUMNS.values()) + ["source_file"]
    invalid = cleaned[required].isna().any(axis=1) | (cleaned[required] == "").any(axis=1)
    for index, row in cleaned[invalid].iterrows():
        errors.append({"row": int(index) + 2, "reason": "missing_required_value", "data": row.to_dict()})

    cleaned = cleaned[~invalid]

    hierarchy_rows = (
        (cleaned["district_code"] == "0")
        | (cleaned["subdistrict_code"] == "0")
        | (cleaned["village_code"] == "0")
    )
    for index, row in cleaned[hierarchy_rows].iterrows():
        errors.append({"row": int(index) + 2, "reason": "hierarchy_row_skipped", "data": row.to_dict()})

    cleaned = cleaned[~hierarchy_rows].drop_duplicates(
        subset=["state_code", "district_code", "subdistrict_code", "village_code"]
    )
    return cleaned, errors


def import_to_postgres(frame: pd.DataFrame, database_url: str, chunk_size: int = 5000) -> None:
    try:
        import psycopg2
        from psycopg2.extras import execute_values
    except ImportError as error:
        raise RuntimeError(
            "PostgreSQL import requires psycopg2. Install it separately for your Python version, "
            "or run with --dry-run to validate source files only."
        ) from error

    with psycopg2.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO "Country" (id, code, name, "createdAt", "updatedAt")
                VALUES ('country_in', 'IN', 'India', now(), now())
                ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, "updatedAt" = now()
                """
            )
            states = frame[["state_code", "state_name"]].drop_duplicates()
            execute_values(
                cur,
                """
                INSERT INTO "State" (id, code, name, "countryId", "createdAt", "updatedAt")
                VALUES %s
                ON CONFLICT ("countryId", code) DO UPDATE SET name = EXCLUDED.name, "updatedAt" = now()
                """,
                [(f"state_{row.state_code}", row.state_code, row.state_name, "country_in") for row in states.itertuples()],
                template="(%s, %s, %s, %s, now(), now())",
            )
            districts = frame[["state_code", "district_code", "district_name"]].drop_duplicates()
            execute_values(
                cur,
                """
                INSERT INTO "District" (id, code, name, "stateId", "createdAt", "updatedAt")
                VALUES %s
                ON CONFLICT ("stateId", code) DO UPDATE SET name = EXCLUDED.name, "updatedAt" = now()
                """,
                [(f"district_{row.district_code}", row.district_code, row.district_name, f"state_{row.state_code}") for row in districts.itertuples()],
                template="(%s, %s, %s, %s, now(), now())",
            )
            subdistricts = frame[["district_code", "subdistrict_code", "subdistrict_name"]].drop_duplicates()
            execute_values(
                cur,
                """
                INSERT INTO "SubDistrict" (id, code, name, "districtId", "createdAt", "updatedAt")
                VALUES %s
                ON CONFLICT ("districtId", code) DO UPDATE SET name = EXCLUDED.name, "updatedAt" = now()
                """,
                [(f"subdistrict_{row.subdistrict_code}", row.subdistrict_code, row.subdistrict_name, f"district_{row.district_code}") for row in subdistricts.itertuples()],
                template="(%s, %s, %s, %s, now(), now())",
            )

            for start in range(0, len(frame), chunk_size):
                chunk = frame.iloc[start : start + chunk_size]
                execute_values(
                    cur,
                    """
                    INSERT INTO "Village" (id, code, name, "subDistrictId", status, "createdAt", "updatedAt")
                    VALUES %s
                    ON CONFLICT ("subDistrictId", code) DO UPDATE SET name = EXCLUDED.name, status = 'ACTIVE', "updatedAt" = now()
                    """,
                    [(f"village_{row.village_code}", row.village_code, row.village_name, f"subdistrict_{row.subdistrict_code}", "ACTIVE") for row in chunk.itertuples()],
                    template="(%s, %s, %s, %s, %s, now(), now())",
                )


def main() -> None:
    load_dotenv()
    parser = argparse.ArgumentParser(description="Clean and import MDDS village data.")
    parser.add_argument("source", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--report", type=Path, default=Path("etl/reports/import-summary.json"))
    parser.add_argument("--full-output", action="store_true", help="Print the full JSON report instead of a compact terminal summary.")
    args = parser.parse_args()

    frame, errors = clean(read_source(args.source))
    summary = {
        "rows": len(frame),
        "states": frame["state_code"].nunique(),
        "districts": frame["district_code"].nunique(),
        "subdistricts": frame["subdistrict_code"].nunique(),
        "villages": frame["village_code"].nunique(),
        "files": sorted(frame["source_file"].unique().tolist()),
        "by_state": (
            frame.groupby(["state_code", "state_name"], dropna=False)
            .agg(
                districts=("district_code", "nunique"),
                subdistricts=("subdistrict_code", "nunique"),
                villages=("village_code", "nunique"),
                rows=("village_code", "size"),
            )
            .reset_index()
            .sort_values(["state_code"])
            .to_dict(orient="records")
        ),
        "errors": errors[:100],
        "errorCounts": pd.Series([error["reason"] for error in errors]).value_counts().to_dict() if errors else {},
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    if not args.dry_run:
        database_url = os.environ.get("DATABASE_URL")
        if not database_url:
            raise RuntimeError("DATABASE_URL is required for import. Use --dry-run for validation only.")
        import_to_postgres(frame, database_url)

    terminal_summary = summary if args.full_output else {
        "rows": summary["rows"],
        "states": summary["states"],
        "districts": summary["districts"],
        "subdistricts": summary["subdistricts"],
        "villages": summary["villages"],
        "filesProcessed": len(summary["files"]),
        "errorCounts": summary["errorCounts"],
        "report": str(args.report),
    }
    print(json.dumps(terminal_summary, indent=2))


if __name__ == "__main__":
    main()
