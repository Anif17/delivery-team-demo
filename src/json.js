// Send a JSON response. Every route uses this so all replies look the same.
export function sendJson(res, status, data) {
  const text = JSON.stringify(data);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
  });
  res.end(text);
}
