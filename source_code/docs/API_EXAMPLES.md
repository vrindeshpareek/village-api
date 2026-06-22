# API Examples

## Search Villages

```bash
curl "http://localhost:3000/v1/search?q=mani&state=Maharashtra" \
  -H "X-API-Key: ak_demo_public_key_for_presentations"
```

## Autocomplete

```bash
curl "http://localhost:3000/v1/autocomplete?q=man&hierarchyLevel=village" \
  -H "X-API-Key: ak_demo_public_key_for_presentations"
```

## Standard Dropdown Item

```json
{
  "value": "village_id_525002",
  "label": "Manibeli",
  "fullAddress": "Manibeli, Akkalkuwa, Nandurbar, Maharashtra, India",
  "hierarchy": {
    "village": "Manibeli",
    "subDistrict": "Akkalkuwa",
    "district": "Nandurbar",
    "state": "Maharashtra",
    "country": "India"
  }
}
```
