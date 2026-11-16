import assert from "node:assert/strict";
import http from "node:http";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";

import { createApp } from "../src/app.js";

let server;
let base;

before(async () => {
  server = http.createServer(await createApp());
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test("GET /version returns the version from package.json", async () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const res = await fetch(`${base}/version`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body, { version: pkg.version });
  assert.equal(body.version, "0.1.0");
});
