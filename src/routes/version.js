import { readFile } from "node:fs/promises";

import { sendJson } from "../json.js";

const PACKAGE_JSON = new URL("../../package.json", import.meta.url);

export default {
  method: "GET",
  path: "/version",
  async handler(req, res) {
    const { version } = JSON.parse(await readFile(PACKAGE_JSON, "utf8"));
    sendJson(res, 200, { version });
  },
};
