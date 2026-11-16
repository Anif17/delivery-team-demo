# delivery-team-demo

A tiny JSON HTTP API with no dependencies. It exists so a team of AI agents
(running on Hermes Agent) can be tested on delivering small features through
reviewed pull requests. Nothing here is meant for production use.

## Run it

    npm test        # runs every test in test/ with Node's built-in test runner
    npm start       # serves on http://localhost:3000 (set PORT to change it)

Requires Node 22 or newer. There is nothing to install.

## How to add an endpoint

1. Add one file under `src/routes/`, for example `src/routes/version.js`. It
   default-exports `{ method, path, handler }`:

       import { sendJson } from "../json.js";

       export default {
         method: "GET",
         path: "/health",
         handler(req, res, body) {
           sendJson(res, 200, { status: "ok" });
         },
       };

2. `body` is the parsed JSON request body, or `undefined` when there is none.
   `path` is matched exactly. A handler may be `async`.
3. Add one test file under `test/` named after the route, for example
   `test/version.test.js`. Copy the setup from `test/health.test.js`.
4. Do not edit `src/app.js` to add an endpoint; it loads every route file.

## Behaviour every endpoint gets for free

- Unknown method or path: `404 {"error":"not_found"}`
- Request body that is not valid JSON: `400 {"error":"invalid_json"}`
- A handler that throws: `500 {"error":"internal_error"}`

## Rules for changes

- Every change arrives as a pull request against `main`. The `test` check must
  pass before it can be merged. Nobody pushes to `main` directly.
- No runtime dependencies.
