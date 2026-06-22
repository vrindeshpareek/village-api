const express = require("express");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const { ok, ApiError } = require("../utils");

const router = express.Router();

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ApiError(400, "INVALID_QUERY", "Email and password are required."));
  const token = jwt.sign({ sub: "user_demo", email, role: email.includes("admin") ? "ADMIN" : "USER" }, jwtSecret, { expiresIn: "24h" });
  ok(req, res, { token, expiresIn: "24h" });
});

router.post("/register", (req, res) => {
  ok(req, res, {
    id: `pending_${Date.now()}`,
    email: req.body.email,
    businessName: req.body.businessName,
    status: "PENDING_APPROVAL"
  });
});

module.exports = router;
