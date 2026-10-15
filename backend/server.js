
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./src/config/db");
const galleryRoutes = require("./src/routes/galleryRoutes");

const app = express();

// Middleware — allow localhost on any port
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. Postman)
      if (!origin) {
        return callback(null, true);
      }

      try {
        const url = new URL(origin);

        if (
          ["localhost", "127.0.0.1", "::1"].includes(url.hostname) &&
          ["http:", "https:"].includes(url.protocol)
        ) {
          return callback(null, true);
        }
      } catch (error) {
        // Invalid origin
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "src", "uploads"))
);

// Routes
app.use("/api/gallery", galleryRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Rainbow Photography Backend is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    err.name === "MulterError"
      ? err.code === "LIMIT_FILE_SIZE"
        ? 413
        : 400
      : err.name === "ValidationError" ||
          err.name === "CastError"
        ? 400
        : err.status || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "Internal Server Error"
        : err.message || "Request failed",
  });
});

// Database and server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("CORS enabled for localhost on any port");
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
