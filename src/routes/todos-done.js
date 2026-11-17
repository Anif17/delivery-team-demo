import { sendJson } from "../json.js";
import { markDone, parseId } from "../todoStore.js";

export default {
  method: "PATCH",
  path: "/todos",
  handler(req, res) {
    const id = parseId(req.url);
    const todo = id === undefined ? undefined : markDone(id);
    if (!todo) return sendJson(res, 404, { error: "not_found" });
    sendJson(res, 200, todo);
  },
};
