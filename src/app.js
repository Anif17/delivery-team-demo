import { readdir } from "node:fs/promises";

import { sendJson } from "./json.js";

const ROUTES_DIR = new URL("./routes/", import.meta.url);

// Load every route file in src/routes/. Adding an endpoint means adding a file
// there; this file does not need to change.
async function loadRoutes() {
  const files = (await readdir(ROUTES_DIR)).filter((name) => name.endsWith(".js")).sort();
  const routes = new Map();
  for (const file of files) {
    const { default: route } = await import(new URL(file, ROUTES_DIR));
    routes.set(`${route.method} ${route.path}`, route.handler);
  }
  return routes;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text === "" ? undefined : JSON.parse(text);
}

// Returns the request listener for http.createServer().
export async function createApp() {
  const routes = await loadRoutes();
  return async (req, res) => {
    let body;
    try {
      body = await readBody(req);
    } catch {
      return sendJson(res, 400, { error: "invalid_json" });
    }
    const { pathname } = new URL(req.url, "http://localhost");
    const handler = routes.get(`${req.method} ${pathname}`);
    if (!handler) return sendJson(res, 404, { error: "not_found" });
    try {
      await handler(req, res, body);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) sendJson(res, 500, { error: "internal_error" });
    }
  };
}
