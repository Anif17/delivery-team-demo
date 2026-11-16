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

const post = (body) => fetch(`${base}/echo`, { method: "POST", body });

test("POST /echo returns the same JSON object", async () => {
  const value = { a: 1, b: [1, 2, { c: null }] };
  const res = await post(JSON.stringify(value));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), value);
});

test("POST /echo returns arrays, strings, numbers and nested objects", async () => {
  for (const value of [[1, "x", null], "hello", 42, { o: { p: { q: [true] } } }]) {
    const res = await post(JSON.stringify(value));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), value);
  }
});

test("POST /echo with no body returns null", async () => {
  const res = await fetch(`${base}/echo`, { method: "POST" });
  assert.equal(res.status, 200);
  assert.equal(await res.json(), null);
});

test("POST /echo with invalid JSON returns 400 invalid_json", async () => {
  const res = await post("{bad");
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: "invalid_json" });
});

test("GET /echo returns 404 not_found", async () => {
  const res = await fetch(`${base}/echo`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: "not_found" });
});
