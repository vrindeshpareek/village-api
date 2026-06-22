const express = require("express");
const crypto = require("crypto");
const { ok } = require("../utils");
const { users } = require("../data/mockData");

const router = express.Router();

router.get("/me", (req, res) => {
  ok(req, res, users[0]);
});

router.get("/api-keys", (req, res) => {
  ok(req, res, users[0].apiKeys);
});

router.post("/api-keys", (req, res) => {
  const key = `ak_${crypto.randomBytes(16).toString("hex")}`;
  const secret = `as_${crypto.randomBytes(16).toString("hex")}`;
  ok(req, res, { id: `key_${Date.now()}`, name: req.body.name || "New Key", key, secret, status: "ACTIVE" });
});

module.exports = router;
