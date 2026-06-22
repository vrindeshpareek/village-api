const bcrypt = require("bcryptjs");
const { demoApiKey, demoApiSecret, planLimits } = require("../config");
const { prisma } = require("../db");
const { users } = require("../data/mockData");
const { ApiError } = require("../utils");

async function authenticateApiKey(req, _res, next) {
  try {
    const key = req.header("X-API-Key");
    if (!key) throw new ApiError(401, "INVALID_API_KEY", "API key is required.");
    if (!key.startsWith("ak_")) throw new ApiError(401, "INVALID_API_KEY", "API key format is invalid.");

    if (prisma) {
      const apiKey = await prisma.apiKey.findUnique({ where: { key }, include: { user: true } });
      if (!apiKey || apiKey.status !== "ACTIVE" || apiKey.user.status !== "ACTIVE") {
        throw new ApiError(401, "INVALID_API_KEY", "API key is inactive or invalid.");
      }

      const secret = req.header("X-API-Secret");
      if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
        const validSecret = secret && (await bcrypt.compare(secret, apiKey.secretHash));
        if (!validSecret) throw new ApiError(403, "ACCESS_DENIED", "Valid API secret is required for write operations.");
      }

      req.apiClient = { apiKeyId: apiKey.id, userId: apiKey.userId, planType: apiKey.user.planType };
      return next();
    }

    const demoUser = users.find((user) => user.apiKeys.some((apiKey) => apiKey.key === key));
    if (!demoUser && key !== demoApiKey) throw new ApiError(401, "INVALID_API_KEY", "API key is invalid.");

    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.header("X-API-Secret") !== demoApiSecret) {
      throw new ApiError(403, "ACCESS_DENIED", "Valid API secret is required for write operations.");
    }

    const planType = demoUser?.planType || "FREE";
    req.apiClient = { apiKeyId: "key_demo", userId: demoUser?.id || "user_demo", planType };
    req.rateLimitMeta = {
      remaining: planLimits[planType].daily - (demoUser?.todayRequests || 150),
      limit: planLimits[planType].daily,
      reset: new Date(Date.now() + 86400000).toISOString()
    };
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticateApiKey };
