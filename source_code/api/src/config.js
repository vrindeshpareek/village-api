require("dotenv").config();

const planLimits = {
  FREE: { daily: 5000, burst: 100 },
  PREMIUM: { daily: 50000, burst: 500 },
  PRO: { daily: 300000, burst: 2000 },
  UNLIMITED: { daily: 1000000, burst: 5000 }
};

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "local-development-secret-change-me",
  databaseUrl: process.env.DATABASE_URL,
  allowedOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174").split(","),
  planLimits,
  demoApiKey: "ak_demo_public_key_for_presentations",
  demoApiSecret: "as_demo_secret_for_write_operations"
};
