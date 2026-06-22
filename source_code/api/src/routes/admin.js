const express = require("express");
const { ok } = require("../utils");
const { users } = require("../data/mockData");
const { getDashboardAnalytics } = require("../services/analyticsService");

const router = express.Router();

router.get("/analytics", async (req, res, next) => {
  try {
    ok(req, res, await getDashboardAnalytics());
  } catch (error) {
    next(error);
  }
});

router.get("/users", (req, res) => {
  ok(req, res, users.map((user) => ({
    id: user.id,
    email: user.email,
    businessName: user.businessName,
    status: user.status,
    planType: user.planType,
    dailyLimit: user.dailyLimit,
    todayRequests: user.todayRequests
  })));
});

router.patch("/users/:id/status", (req, res) => {
  ok(req, res, { id: req.params.id, status: req.body.status, updated: true });
});

module.exports = router;
