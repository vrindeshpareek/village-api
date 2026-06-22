# ETL Workflow

The provided dataset is extracted under:

```text
etl/input/all-india-villages-master-list-excel/dataset/
```

It contains one file per state/UT. Most files are legacy `.xls`; Uttar Pradesh is `.ods`.

## Setup

Python 3.14 may not have prebuilt wheels for every database driver. For validation and report generation, use the lightweight environment that reuses system pandas:

```powershell
python -m venv --system-site-packages .venv-data
.venv-data\Scripts\python -m pip install xlrd==2.0.1 odfpy==1.4.1 openpyxl==3.1.5 python-dotenv==1.0.1
```

## Validate Dataset

```powershell
.venv-data\Scripts\python etl\import_mdds.py etl\input\all-india-villages-master-list-excel\dataset --dry-run
```

This creates:

```text
etl/reports/import-summary.json
```

## Import To PostgreSQL

Set `DATABASE_URL` first. PostgreSQL import also requires a compatible `psycopg2` installation for your Python version.

```powershell
$env:DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"
.venv-data\Scripts\python etl\import_mdds.py etl\input\all-india-villages-master-list-excel\dataset
```

The script skips hierarchy-only rows where district, sub-district, or village code is `0`, then upserts normalized country, state, district, sub-district, and village rows.
