import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import {
  notFoundHandler,
  errorHandler
} from "./middleware/error.middleware";


const app = express();

const PORT = Number(process.env.PORT) || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| Body parsing
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Cookies
|--------------------------------------------------------------------------
*/

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Aarambha Courier API is running.",
    environment:
      process.env.NODE_ENV || "development"
  });
});

/*
|--------------------------------------------------------------------------
| Vendor API
|--------------------------------------------------------------------------
*/

app.use(
  "/api/vendor",
  vendorRoutes
);

app.use("/api/vendor", vendorRoutes);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use(notFoundHandler);

/*
|--------------------------------------------------------------------------
| Error handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
*/

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Aarambha Courier API running on http://localhost:${PORT}`
      );

      console.log(
        `Frontend allowed origin: ${FRONTEND_URL}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
}

startServer();