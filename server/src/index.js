import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

await connectDatabase();

const app = createApp();

export default app;