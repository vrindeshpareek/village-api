import json
from pathlib import Path


def main() -> None:
    summary_path = Path("etl/reports/import-summary.json")
    report_path = Path("docs/DATASET_REPORT.md")
    summary = json.loads(summary_path.read_text(encoding="utf-8"))

    lines = [
        "# Dataset Validation Report",
        "",
        "Source archive: `C:/Users/91950/Downloads/all-india-villages-master-list-excel.zip`",
        "",
        "Extracted project path:",
        "",
        "```text",
        "etl/input/all-india-villages-master-list-excel/dataset/",
        "```",
        "",
        "## Summary",
        "",
        f"- Files processed: {len(summary['files'])}",
        f"- States/UTs processed: {summary['states']}",
        f"- Districts: {summary['districts']}",
        f"- Sub-districts: {summary['subdistricts']}",
        f"- Village rows ready for import: {summary['rows']}",
        f"- Unique village codes: {summary['villages']}",
        "",
        "## Validation Notes",
        "",
        f"- Hierarchy-only rows skipped: {summary['errorCounts'].get('hierarchy_row_skipped', 0)}",
        f"- Rows with missing required values: {summary['errorCounts'].get('missing_required_value', 0)}",
        "- Madhya Pradesh workbook includes a front sheet; the ETL now automatically selects the sheet with MDDS columns.",
        "- Uttar Pradesh is supplied as `.ods`; the ETL supports it via `odfpy`.",
        "",
        "## State/UT Counts",
        "",
        "| Code | State/UT | Districts | Sub-districts | Villages |",
        "| --- | --- | ---: | ---: | ---: |",
    ]

    for row in summary["by_state"]:
        lines.append(
            f"| {row['state_code']} | {row['state_name']} | {row['districts']} | "
            f"{row['subdistricts']} | {row['villages']} |"
        )

    lines.extend(
        [
            "",
            "## Follow-Up",
            "",
            "The dataset zip does not include every Indian state/UT listed in the original project estimate. "
            "The current importable set contains 30 state/UT files. Add the missing source files to the same "
            "`etl/input/.../dataset/` folder and rerun the dry-run command to update this report.",
        ]
    )

    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
