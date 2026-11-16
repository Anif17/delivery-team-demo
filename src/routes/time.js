import { sendJson } from "../json.js";

export default {
  method: "GET",
  path: "/time",
  handler(req, res) {
    sendJson(res, 200, { now: new Date().toISOString() });
  },
};
