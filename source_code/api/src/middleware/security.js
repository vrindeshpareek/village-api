const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { allowedOrigins, planLimits } = require("../config");

const security = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"]
      }
    }
  }),
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    }
  }),
  rateLimit({
    windowMs: 60 * 1000,
    limit: (req) => planLimits[req.apiClient?.planType || "FREE"].burst,
    standardHeaders: true,
    legacyHeaders: true
  })
];

module.exports = { security };
