let todos = [];
let nextId = 1;

export function create(title) {
  const todo = { id: nextId++, title, done: false };
  todos.push(todo);
  return { ...todo };
}

export function list() {
  return todos.map((t) => ({ ...t }));
}

export function markDone(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return undefined;
  todo.done = true;
  return { ...todo };
}

export function remove(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

// For tests: empties the store and restarts ids at 1.
export function reset() {
  todos = [];
  nextId = 1;
}

// Parses ?id=<n> from a request URL; returns undefined unless it is an integer.
export function parseId(url) {
  const raw = new URL(url, "http://localhost").searchParams.get("id");
  return raw !== null && /^\d+$/.test(raw) ? Number(raw) : undefined;
}
