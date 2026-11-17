import { sendJson } from "../json.js";
import { parseId, remove } from "../todoStore.js";

export default {
  method: "DELETE",
  path: "/todos",
  handler(req, res) {
    const id = parseId(req.url);
    if (id === undefined || !remove(id)) return sendJson(res, 404, { error: "not_found" });
    sendJson(res, 200, { deleted: id });
  },
};
