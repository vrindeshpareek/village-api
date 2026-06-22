const express = require("express");
const { z } = require("zod");
const { authenticateApiKey } = require("../middleware/apiKeyAuth");
const { ok, ApiError } = require("../utils");
const service = require("../services/villageService");

const router = express.Router();
router.use(authenticateApiKey);

router.get("/search", async (req, res, next) => {
  try {
    const query = z.object({
      q: z.string().optional(),
      state: z.string().optional(),
      district: z.string().optional(),
      subDistrict: z.string().optional(),
      limit: z.coerce.number().min(1).max(100).default(25)
    }).parse(req.query);
    if (query.q && query.q.length < 2) throw new ApiError(400, "INVALID_QUERY", "Search query must be at least 2 characters.");
    ok(req, res, await service.searchVillages(query));
  } catch (error) {
    next(error);
  }
});

router.get("/autocomplete", async (req, res, next) => {
  try {
    const query = z.object({
      q: z.string().min(2),
      hierarchyLevel: z.enum(["village", "subDistrict", "district", "state"]).default("village")
    }).parse(req.query);
    ok(req, res, await service.searchVillages({ q: query.q, limit: 10 }), { hierarchyLevel: query.hierarchyLevel });
  } catch (error) {
    next(error);
  }
});

router.get("/states", async (req, res, next) => {
  try {
    ok(req, res, await service.listStates());
  } catch (error) {
    next(error);
  }
});

router.get("/states/:id/districts", async (req, res, next) => {
  try {
    ok(req, res, await service.districtsByState(req.params.id));
  } catch (error) {
    next(error);
  }
});

router.get("/districts/:id/subdistricts", async (req, res, next) => {
  try {
    ok(req, res, await service.subDistrictsByDistrict(req.params.id));
  } catch (error) {
    next(error);
  }
});

router.get("/subdistricts/:id/villages", async (req, res, next) => {
  try {
    ok(req, res, await service.villagesBySubDistrict(req.params.id, req.query.page, req.query.limit));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
