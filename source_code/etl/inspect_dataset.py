from pathlib import Path

import pandas as pd


def main() -> None:
    dataset_dir = Path("etl/input/all-india-villages-master-list-excel/dataset")
    for path in sorted(dataset_dir.glob("*"))[:3]:
      if path.suffix.lower() not in {".xls", ".xlsx", ".ods"}:
          continue
      print(f"\nFILE {path.name}")
      frame = pd.read_excel(path, nrows=5, engine="odf" if path.suffix.lower() == ".ods" else None)
      print(list(frame.columns))
      print(frame.head(3).to_string())


if __name__ == "__main__":
    main()
