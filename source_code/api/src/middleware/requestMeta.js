const { v4: uuid } = require("uuid");

function requestMeta(req, res, next) {
  req.startedAt = Date.now();
  req.requestId = `req_${uuid().replace(/-/g, "").slice(0, 16)}`;
  res.setHeader("X-Request-Id", req.requestId);
  next();
}

module.exports = { requestMeta };
