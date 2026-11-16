import { sendJson } from "../json.js";

export default {
  method: "GET",
  path: "/health",
  handler(req, res) {
    sendJson(res, 200, { status: "down" });
  },
};
