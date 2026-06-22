function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  error.code = "NOT_FOUND";
  next(error);
}

function errorHandler(error, req, res, _next) {
  const status = error.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: status === 500 ? "Server-side error." : error.message
    },
    meta: {
      requestId: req.requestId,
      responseTime: Date.now() - (req.startedAt || Date.now())
    }
  });
}

module.exports = { notFound, errorHandler };
