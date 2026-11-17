import assert from "node:assert/strict";
import http from "node:http";
import { after, before, beforeEach, test } from "node:test";

import { createApp } from "../src/app.js";
import { reset } from "../src/todoStore.js";

let server;
let base;

before(async () => {
  server = http.createServer(await createApp());
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

beforeEach(() => reset());

const post = (body) =>
  fetch(`${base}/todos`, { method: "POST", body: JSON.stringify(body) });

test("POST /todos creates a todo", async () => {
  const res = await post({ title: "a" });
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { id: 1, title: "a", done: false });
});

test("POST /todos with missing, empty or non-string title returns 400", async () => {
  for (const body of [{}, { title: "" }, { title: 5 }]) {
    const res = await post(body);
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: "invalid_title" });
  }
  const noBody = await fetch(`${base}/todos`, { method: "POST" });
  assert.equal(noBody.status, 400);
});

test("GET /todos lists in creation order; empty store gives []", async () => {
  let res = await fetch(`${base}/todos`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { todos: [] });
  await post({ title: "a" });
  await post({ title: "b" });
  res = await fetch(`${base}/todos`);
  assert.deepEqual(await res.json(), {
    todos: [
      { id: 1, title: "a", done: false },
      { id: 2, title: "b", done: false },
    ],
  });
});

test("PATCH /todos?id=1 marks done", async () => {
  await post({ title: "a" });
  const res = await fetch(`${base}/todos?id=1`, { method: "PATCH" });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { id: 1, title: "a", done: true });
  const list = await (await fetch(`${base}/todos`)).json();
  assert.equal(list.todos[0].done, true);
});

test("DELETE /todos?id=1 removes; second delete is 404; ids are not reused", async () => {
  await post({ title: "a" });
  let res = await fetch(`${base}/todos?id=1`, { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { deleted: 1 });
  assert.deepEqual(await (await fetch(`${base}/todos`)).json(), { todos: [] });
  res = await fetch(`${base}/todos?id=1`, { method: "DELETE" });
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: "not_found" });
  const next = await (await post({ title: "b" })).json();
  assert.equal(next.id, 2);
});

test("PATCH and DELETE with unknown, missing or non-integer id return 404", async () => {
  for (const method of ["PATCH", "DELETE"]) {
    for (const q of ["?id=999", "", "?id=abc", "?id=1.5"]) {
      const res = await fetch(`${base}/todos${q}`, { method });
      assert.equal(res.status, 404, `${method} ${q}`);
      assert.deepEqual(await res.json(), { error: "not_found" });
    }
  }
});
