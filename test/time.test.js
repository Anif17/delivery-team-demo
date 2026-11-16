import assert from "node:assert/strict";
import http from "node:http";
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

test("GET /time returns 200 JSON with a single ISO UTC now field", async () => {
  const before = Date.now();
  const res = await fetch(`${base}/time`);
  const after = Date.now();
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /^application\/json/);
  const json = await res.json();
  assert.deepEqual(Object.keys(json), ["now"]);
  assert.equal(typeof json.now, "string");
  assert.ok(json.now.endsWith("Z"));
  assert.equal(new Date(json.now).toISOString(), json.now);
  const t = Date.parse(json.now);
  assert.ok(t >= before - 5000 && t <= after + 5000);
});

test("POST /time returns 404 not_found", async () => {
  const res = await fetch(`${base}/time`, { method: "POST" });
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: "not_found" });
});
