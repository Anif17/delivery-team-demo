import http from "node:http";

import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3000);
const server = http.createServer(await createApp());
server.listen(port, () => console.log(`listening on http://localhost:${port}`));
