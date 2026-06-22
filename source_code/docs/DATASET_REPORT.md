# Dataset Validation Report

Source archive: `C:/Users/91950/Downloads/all-india-villages-master-list-excel.zip`

Extracted project path:

```text
etl/input/all-india-villages-master-list-excel/dataset/
```

## Summary

- Files processed: 30
- States/UTs processed: 30
- Districts: 580
- Sub-districts: 5655
- Village rows ready for import: 619245
- Unique village codes: 619224

## Validation Notes

- Hierarchy-only rows skipped: 6380
- Rows with missing required values: 1
- Madhya Pradesh workbook includes a front sheet; the ETL now automatically selects the sheet with MDDS columns.
- Uttar Pradesh is supplied as `.ods`; the ETL supports it via `odfpy`.

## State/UT Counts

| Code | State/UT | Districts | Sub-districts | Villages |
| --- | --- | ---: | ---: | ---: |
| 10 | BIHAR | 38 | 534 | 44937 |
| 11 | SIKKIM | 4 | 9 | 452 |
| 12 | ARUNACHAL PRADESH | 16 | 188 | 5590 |
| 13 | NAGALAND | 11 | 114 | 1435 |
| 15 | MIZORAM | 8 | 26 | 830 |
| 16 | TRIPURA | 4 | 40 | 901 |
| 17 | MEGHALAYA | 7 | 39 | 6851 |
| 18 | ASSAM | 27 | 152 | 26549 |
| 19 | WEST BENGAL | 18 | 342 | 40996 |
| 2 | HIMACHAL PRADESH | 12 | 116 | 20696 |
| 20 | JHARKHAND | 24 | 259 | 32583 |
| 21 | ODISHA | 30 | 471 | 51476 |
| 22 | CHHATTISGARH | 18 | 149 | 20167 |
| 23 | MADHYA PRADESH | 50 | 342 | 55065 |
| 24 | GUJARAT | 26 | 223 | 18481 |
| 25 | DAMAN & DIU | 2 | 2 | 25 |
| 26 | DADRA & NAGAR HAVELI | 1 | 1 | 70 |
| 27 | MAHARASHTRA | 33 | 353 | 43946 |
| 28 | ANDHRA PRADESH | 23 | 1100 | 28168 |
| 29 | KARNATAKA | 30 | 176 | 29521 |
| 3 | PUNJAB | 20 | 77 | 12715 |
| 30 | GOA | 2 | 11 | 397 |
| 31 | LAKSHADWEEP | 1 | 10 | 27 |
| 32 | KERALA | 14 | 63 | 1494 |
| 33 | TAMIL NADU | 31 | 214 | 16369 |
| 34 | PUDUCHERRY | 2 | 5 | 95 |
| 35 | ANDAMAN & NICOBAR ISLANDS | 3 | 9 | 559 |
| 6 | HARYANA | 21 | 74 | 6927 |
| 8 | RAJASTHAN | 33 | 244 | 44796 |
| 9 | UTTAR PRADESH | 71 | 312 | 107106 |

## Follow-Up

The dataset zip does not include every Indian state/UT listed in the original project estimate. The current importable set contains 30 state/UT files. Add the missing source files to the same `etl/input/.../dataset/` folder and rerun the dry-run command to update this report.
