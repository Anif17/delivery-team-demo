import { sendJson } from "../json.js";
import { create } from "../todoStore.js";

export default {
  method: "POST",
  path: "/todos",
  handler(req, res, body) {
    const title = body?.title;
    if (typeof title !== "string" || title === "") {
      return sendJson(res, 400, { error: "invalid_title" });
    }
    sendJson(res, 201, create(title));
  },
};
