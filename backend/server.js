require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./src/config/db");
const galleryRoutes = require("./src/routes/galleryRoutes");
const testimonialRoutes = require("./src/routes/testimonialRoutes");
const teamMemberRoutes = require("./src/routes/teamMemberRoutes");

const app = express();

// =========================================
// CORS CONFIGURATION
// =========================================
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, curl, Postman, mobile requests
      if (!origin) {
        return callback(null, true);
      }

      try {
        const parsed = new URL(origin);
        const isLocalHost = [
          "localhost",
          "127.0.0.1",
          "::1"
        ].includes(parsed.hostname);

        if (isLocalHost && ["http:", "https:"].includes(parsed.protocol)) {
          return callback(null, true);
        }
      } catch (err) {
        // Failed parsing origin header
      }

      return callback(new Error("Not allowed by CORS policy"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =========================================
// BODY PARSING MIDDLEWARES
// =========================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =========================================
// STATIC ASSETS
// =========================================
// Maps http://localhost:5000/uploads/* -> ./src/uploads/*
app.use(
  "/uploads",
  express.static(path.join(__dirname, "src", "uploads"))
);

// =========================================
// APPLICATION ROUTES
// =========================================
app.use("/api/gallery", galleryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/team-members", teamMemberRoutes);

// Health check / root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API service is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    uptime: process.uptime(),
  });
});

// =========================================
// 404 NOT FOUND HANDLER
// =========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// =========================================
// CENTRAL ERROR HANDLER
// =========================================
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(`[Error] ${req.method} ${req.originalUrl} -`, err.message);

  let statusCode = 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "MulterError") {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message = err.message;
  } else if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  } else if (err.status) {
    statusCode = err.status;
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Internal Server Error" : message,
  });
});

// =========================================
// SERVER INITIALIZATION
// =========================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("CORS enabled for local development");
    });

    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Closing server gracefully...`);
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;