const express = require("express");
const morgan = require("morgan");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { security } = require("./middleware/security");
const { requestMeta } = require("./middleware/requestMeta");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");
const portalRoutes = require("./routes/portal");
const authRoutes = require("./routes/auth");

const app = express();
const openapi = YAML.load(path.join(__dirname, "openapi.yaml"));

app.use(requestMeta);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
app.use(security);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      service: "village-api",
      product: "Village API"
    },
    meta: { requestId: req.requestId }
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/b2b", portalRoutes);
app.use("/v1", publicRoutes);
app.use("/api/v1", publicRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
