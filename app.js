const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const API_SERVICE_URL = "https://api-us.libreview.io";
const API_DOCS_URL = "https://libreview-unofficial.stoplight.io";

app.use(morgan("dev"));

app.get("/", (_req, res, _next) => {
  res.send(`Proxy for the unofficial API docs for LibreView at ${API_DOCS_URL}.`);
});

app.use(
  "/*",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = API_DOCS_URL;
      proxyRes.headers["Access-Control-Allow-Headers"] = "*";
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy runnning: http://localhost:${PORT}`);
});
