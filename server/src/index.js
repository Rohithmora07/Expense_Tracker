import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";

// Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env
dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

// Debug check
console.log("MISTRAL_API_KEY Loaded:", !!process.env.MISTRAL_API_KEY);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // MongoDB connection
    await connectDatabase();

    // Create express app
    const app = createApp();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);

    process.exit(1);
  }
}

startServer();