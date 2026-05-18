import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import cors from "cors";

import { expenseRouter } from "./routes/expenseRoutes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors());

  app.use(
    express.json({
      limit: "2mb",
    })
  );

  // Static uploads folder
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
  );

  // Root route
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "AI Powered Expense Tracker API",
      endpoints: {
        health: "GET /api/health",
        listExpenses: "GET /api/expenses",
        getExpense: "GET /api/expenses/:id",
        uploadExpense:
          "POST /api/expenses/upload (multipart/form-data -> image)",
        updateExpense: "PUT /api/expenses/:id",
        deleteExpense: "DELETE /api/expenses/:id",
      },
    });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      service: "expense-tracker-api",
    });
  });

  // Expense routes
  app.use("/api/expenses", expenseRouter);

  // Error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app;
}