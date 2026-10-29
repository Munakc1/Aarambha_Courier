import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import vendorRoutes from "./routes/vendorRoutes.js";
// import vendorProfileRoutes from "./routes/vendor.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import esewaRoutes from "./routes/esewa.routes.js";
import calculatorRoutes from "./routes/calculator.routes";
import aboutRoutes from "./routes/about.routes";
import contactRoutes from "./routes/contact.routes";
import vendorProfileRoutes from "./routes/vendorProfile.routes.js";
// import blogRoutes from "./routes/blog.routes";
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


app.use("/api/vendor", vendorRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/payments/esewa", esewaRoutes);
app.use("/api/calculator", calculatorRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/vendor/profile", vendorProfileRoutes);

app.use(express.json({ limit: "1mb" }));

// app.use("/api/blog", blogRoutes);


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