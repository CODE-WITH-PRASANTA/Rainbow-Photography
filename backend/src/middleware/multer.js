const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// =========================================
// HELPER: ENSURE DIRECTORY EXISTS
// =========================================

const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Base upload directory: src/uploads
const baseUploadDir = path.join(__dirname, "../uploads");

ensureDirExists(baseUploadDir);

// =========================================
// MULTER MEMORY STORAGE
// =========================================

const storage = multer.memoryStorage();

// =========================================
// FILE FILTER
// =========================================

const fileFilter = (req, file, cb) => {
  // =========================================
  // GALLERY (IMAGE + VIDEO)
  // =========================================

  if (
    req.baseUrl === "/api/gallery" ||
    req.originalUrl.startsWith("/api/gallery")
  ) {
    const allowedImages = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    const allowedVideos = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];

    if (
      allowedImages.includes(file.mimetype) ||
      allowedVideos.includes(file.mimetype)
    ) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, AVIF, MP4, WEBM, OGG and MOV files are allowed for Gallery."
      ),
      false
    );
  }

  // =========================================
  // SETTINGS / LOGO / TEAM / COUPEN / AVATAR / OTHERS
  // =========================================

  if (file.mimetype && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  return cb(new Error("Only image files are allowed"), false);
};

// =========================================
// MULTER CONFIGURATION
// =========================================

const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // 50 MB overall buffer limit
    fileSize: 50 * 1024 * 1024,
  },
});

// =========================================
// SINGLE WEBP CONVERSION MIDDLEWARE GENERATOR
// =========================================

const convertToWebp = (subFolder = "gallery") => {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        return next();
      }

      // =========================================
      // GALLERY VIDEO (PASS THROUGH DIRECTLY)
      // =========================================

      if (
        req.file.mimetype &&
        req.file.mimetype.startsWith("video/")
      ) {
        const targetUploadPath = path.join(baseUploadDir, subFolder);
        ensureDirExists(targetUploadPath);

        const extension = path
          .extname(req.file.originalname)
          .toLowerCase();

        const originalName = path
          .parse(req.file.originalname)
          .name
          .replace(/[^a-zA-Z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase();

        const fileName = `${
          originalName || "video"
        }-${Date.now()}-${Math.round(Math.random() * 1e9)}${
          extension || ".mp4"
        }`;

        const outputPath = path.join(targetUploadPath, fileName);

        fs.writeFileSync(outputPath, req.file.buffer);

        req.file.filename = fileName;
        req.file.path = outputPath;
        req.file.destination = targetUploadPath;
        req.file.mimetype = req.file.mimetype || "video/mp4";
        req.file.originalname = fileName;
        req.file.size = fs.statSync(outputPath).size;

        const relativeUrl = `/uploads/${subFolder}/${fileName}`;
        req.file.url = relativeUrl;
        req.avatarPath = relativeUrl;
        req.fileUrl = relativeUrl;
        req.logoPath = relativeUrl;

        return next();
      }

      // =========================================
      // IMAGE CONVERSION TO WEBP VIA SHARP
      // =========================================

      const targetUploadPath = path.join(baseUploadDir, subFolder);
      ensureDirExists(targetUploadPath);

      const originalName = path
        .parse(req.file.originalname)
        .name
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

      const fileName = `${
        originalName || "image"
      }-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;

      const outputPath = path.join(targetUploadPath, fileName);

      await sharp(req.file.buffer)
        .webp({
          quality: 85,
          effort: 4,
        })
        .toFile(outputPath);

      req.file.filename = fileName;
      req.file.path = outputPath;
      req.file.destination = targetUploadPath;
      req.file.mimetype = "image/webp";
      req.file.originalname = fileName;
      req.file.size = fs.statSync(outputPath).size;

      const relativeUrl = `/uploads/${subFolder}/${fileName}`;
      req.file.url = relativeUrl;

      // Controller compatibility helpers
      req.avatarPath = relativeUrl;
      req.fileUrl = relativeUrl;
      req.logoPath = relativeUrl;

      next();
    } catch (error) {
      console.error("IMAGE/VIDEO UPLOAD ERROR:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to process uploaded media",
        error: error.message,
      });
    }
  };
};

// =========================================
// MULTIPLE WEBP CONVERSION MIDDLEWARE GENERATOR
// =========================================

const convertMultipleToWebp = (subFolder = "gallery") => {
  return async (req, res, next) => {
    try {
      let filesArray = [];

      if (Array.isArray(req.files)) {
        filesArray = req.files;
      } else if (req.files && typeof req.files === "object") {
        filesArray = Object.values(req.files).flat();
      }

      if (!filesArray.length) {
        return next();
      }

      const targetUploadPath = path.join(baseUploadDir, subFolder);
      ensureDirExists(targetUploadPath);

      await Promise.all(
        filesArray.map(async (file) => {
          // VIDEO
          if (file.mimetype && file.mimetype.startsWith("video/")) {
            const extension = path
              .extname(file.originalname)
              .toLowerCase();

            const originalName = path
              .parse(file.originalname)
              .name
              .replace(/[^a-zA-Z0-9]/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "")
              .toLowerCase();

            const fileName = `${
              originalName || "video"
            }-${Date.now()}-${Math.round(Math.random() * 1e9)}${
              extension || ".mp4"
            }`;

            const outputPath = path.join(targetUploadPath, fileName);
            fs.writeFileSync(outputPath, file.buffer);

            file.filename = fileName;
            file.path = outputPath;
            file.destination = targetUploadPath;
            file.originalname = fileName;
            file.size = fs.statSync(outputPath).size;
            file.url = `/uploads/${subFolder}/${fileName}`;
            return;
          }

          // IMAGE
          const originalName = path
            .parse(file.originalname)
            .name
            .replace(/[^a-zA-Z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
            .toLowerCase();

          const fileName = `${
            originalName || "image"
          }-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;

          const outputPath = path.join(targetUploadPath, fileName);

          await sharp(file.buffer)
            .webp({
              quality: 85,
              effort: 4,
            })
            .toFile(outputPath);

          file.filename = fileName;
          file.path = outputPath;
          file.destination = targetUploadPath;
          file.mimetype = "image/webp";
          file.originalname = fileName;
          file.size = fs.statSync(outputPath).size;
          file.url = `/uploads/${subFolder}/${fileName}`;
        })
      );

      next();
    } catch (error) {
      console.error("MULTIPLE MEDIA CONVERSION ERROR:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to process uploaded media",
        error: error.message,
      });
    }
  };
};

// =========================================
// EXPORT MULTER HELPER
// =========================================

const upload = {
  // SINGLE FILE UPLOAD
  single: (fieldName, folder = "gallery") => {
    return [
      multerUpload.single(fieldName),

      async (req, res, next) => {
        let targetFolder = folder;

        // 1. SETTINGS / LOGO ROUTE OR FIELD
        if (
          req.baseUrl === "/api/settings" ||
          req.originalUrl.startsWith("/api/settings") ||
          folder === "settings" ||
          fieldName === "logoFile" ||
          fieldName === "logo"
        ) {
          targetFolder = "settings";
        }
        // 2. GALLERY ROUTE
        else if (
          req.baseUrl === "/api/gallery" ||
          req.originalUrl.startsWith("/api/gallery")
        ) {
          targetFolder = "gallery";
        }
        // 3. COUPEN / BANNER
        else if (folder === "coupen") {
          targetFolder = "coupen";
        }
        // 4. USERS AVATAR
        else if (fieldName === "avatar") {
          targetFolder = "users";
        }
        // 5. TEAM IMAGE
        else if (fieldName === "image") {
          targetFolder = "team";
        }

        return convertToWebp(targetFolder)(req, res, next);
      },
    ];
  },

  // MULTIPLE FILE UPLOAD
  array: (fieldName, maxCount, folder = "gallery") => [
    multerUpload.array(fieldName, maxCount),
    convertMultipleToWebp(folder),
  ],

  // MULTIPLE DIFFERENT FIELDS
  fields: (fieldsArray, folder = "gallery") => [
    multerUpload.fields(fieldsArray),
    convertMultipleToWebp(folder),
  ],

  // ANY FILES
  any: (folder = "gallery") => [
    multerUpload.any(),
    convertMultipleToWebp(folder),
  ],
};

module.exports = upload;