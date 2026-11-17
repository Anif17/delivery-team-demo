import { sendJson } from "../json.js";
import { list } from "../todoStore.js";

export default {
  method: "GET",
  path: "/todos",
  handler(req, res) {
    sendJson(res, 200, { todos: list() });
  },
};
