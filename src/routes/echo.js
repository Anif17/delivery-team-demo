import { sendJson } from "../json.js";

export default {
  method: "POST",
  path: "/echo",
  handler(req, res, body) {
    sendJson(res, 200, body === undefined ? null : body);
  },
};
