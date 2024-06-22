const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const PORT = process.env.PORT || 3000;
const API_SERVICE_URL = "https://api-{region}.libreview.io";
const API_DOCS_URL = "https://libreview-unofficial.stoplight.io";

const app = express();

app.use(morgan("dev"));

app.get("/", (_req, res, _next) => {
  res.send(
    `Proxy for the unofficial API docs for LibreView at ${API_DOCS_URL}.`
  );
});

app.use(
  "/:region/:path([\\s\\S]+)",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    router: function (req) {
      return API_SERVICE_URL.replace("{region}", req.params.region);
    },
    onProxyReq: function (proxyReq, req, _res) {
      proxyReq.path = `/${req.params.path}`;
    },
    onProxyRes: function (proxyRes, req, _res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = API_DOCS_URL;
      proxyRes.headers["Access-Control-Allow-Headers"] = "*";
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy runnning: http://localhost:${PORT}`);
});
