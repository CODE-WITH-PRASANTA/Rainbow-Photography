const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// =========================================
// UPLOAD DIRECTORY
// =========================================

const baseUploadDir = path.join(__dirname, "../uploads");

const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirExists(baseUploadDir);

// =========================================
// MULTER MEMORY STORAGE
// =========================================

const storage = multer.memoryStorage();

// =========================================
// FILE FILTER
// =========================================

const fileFilter = (req, file, cb) => {
  const isGallery =
    req.baseUrl === "/api/gallery" ||
    req.originalUrl.startsWith("/api/gallery");

  if (isGallery) {
    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (allowedImages.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, PNG, WEBP and AVIF images are allowed in Gallery."
      ),
      false
    );
  }

  if (file.mimetype && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  if (file.mimetype && file.mimetype.startsWith("video/")) {
    return cb(null, true);
  }

  return cb(new Error("Unsupported file type."), false);
};

// =========================================
// MULTER CONFIGURATION
// =========================================

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

// =========================================
// GENERATE UNIQUE FILE NAME
// =========================================

const generateFileName = (originalName, extension) => {
  const cleanName = path
    .parse(originalName)
    .name
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${cleanName || "image"}-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${extension}`;
};

// =========================================
// SINGLE FILE CONVERSION
// =========================================

const convertToWebp = (subFolder = "gallery") => {
  return async (req, res, next) => {
    let outputPath = null;

    try {
      if (!req.file) {
        return next();
      }

      const targetUploadPath = path.join(
        baseUploadDir,
        subFolder
      );

      ensureDirExists(targetUploadPath);

      // VIDEO PASS-THROUGH FOR OTHER MODULES
      if (req.file.mimetype.startsWith("video/")) {
        if (
          req.baseUrl === "/api/gallery" ||
          req.originalUrl.startsWith("/api/gallery")
        ) {
          return res.status(400).json({
            success: false,
            message: "Gallery accepts images only.",
          });
        }

        const extension =
          path.extname(req.file.originalname).toLowerCase() ||
          ".mp4";

        const fileName = generateFileName(
          req.file.originalname,
          extension
        );

        outputPath = path.join(targetUploadPath, fileName);

        fs.writeFileSync(outputPath, req.file.buffer);

        req.file.filename = fileName;
        req.file.path = outputPath;
        req.file.destination = targetUploadPath;
        req.file.originalname = fileName;
        req.file.size = fs.statSync(outputPath).size;
        req.file.url = `/uploads/${subFolder}/${fileName}`;

        return next();
      }

      // IMAGE TO WEBP
      const fileName = generateFileName(
        req.file.originalname,
        ".webp"
      );

      outputPath = path.join(targetUploadPath, fileName);

      await sharp(req.file.buffer)
        .rotate()
        .webp({
          quality: 85,
          effort: 4,
        })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);

      req.file.filename = fileName;
      req.file.path = outputPath;
      req.file.destination = targetUploadPath;
      req.file.mimetype = "image/webp";
      req.file.originalname = fileName;
      req.file.size = stats.size;
      req.file.url = `/uploads/${subFolder}/${fileName}`;

      req.avatarPath = req.file.url;
      req.fileUrl = req.file.url;
      req.logoPath = req.file.url;

      return next();
    } catch (error) {
      if (outputPath && fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      console.error("IMAGE/VIDEO UPLOAD ERROR:", error);

      return res.status(400).json({
        success: false,
        message: "Failed to process uploaded media.",
        error: error.message,
      });
    }
  };
};

// =========================================
// MULTIPLE FILE CONVERSION
// =========================================

const convertMultipleToWebp = (subFolder = "gallery") => {
  return async (req, res, next) => {
    const createdPaths = [];

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

      const targetUploadPath = path.join(
        baseUploadDir,
        subFolder
      );

      ensureDirExists(targetUploadPath);

      await Promise.all(
        filesArray.map(async (file) => {
          if (file.mimetype.startsWith("video/")) {
            const extension =
              path.extname(file.originalname).toLowerCase() ||
              ".mp4";

            const fileName = generateFileName(
              file.originalname,
              extension
            );

            const outputPath = path.join(
              targetUploadPath,
              fileName
            );

            fs.writeFileSync(outputPath, file.buffer);
            createdPaths.push(outputPath);

            file.filename = fileName;
            file.path = outputPath;
            file.destination = targetUploadPath;
            file.originalname = fileName;
            file.size = fs.statSync(outputPath).size;
            file.url = `/uploads/${subFolder}/${fileName}`;

            return;
          }

          const fileName = generateFileName(
            file.originalname,
            ".webp"
          );

          const outputPath = path.join(
            targetUploadPath,
            fileName
          );

          await sharp(file.buffer)
            .rotate()
            .webp({
              quality: 85,
              effort: 4,
            })
            .toFile(outputPath);

          createdPaths.push(outputPath);

          file.filename = fileName;
          file.path = outputPath;
          file.destination = targetUploadPath;
          file.mimetype = "image/webp";
          file.originalname = fileName;
          file.size = fs.statSync(outputPath).size;
          file.url = `/uploads/${subFolder}/${fileName}`;
        })
      );

      return next();
    } catch (error) {
      createdPaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      console.error("MULTIPLE MEDIA CONVERSION ERROR:", error);

      return res.status(400).json({
        success: false,
        message: "Failed to process uploaded media.",
        error: error.message,
      });
    }
  };
};

// =========================================
// UPLOAD HELPERS
// =========================================

const upload = {
  single: (fieldName, folder = "gallery") => {
    return [
      multerUpload.single(fieldName),

      async (req, res, next) => {
        let targetFolder = folder;

        if (
          req.baseUrl === "/api/settings" ||
          req.originalUrl.startsWith("/api/settings") ||
          folder === "settings" ||
          fieldName === "logoFile" ||
          fieldName === "logo"
        ) {
          targetFolder = "settings";
        } else if (
          req.baseUrl === "/api/gallery" ||
          req.originalUrl.startsWith("/api/gallery")
        ) {
          targetFolder = "gallery";
        } else if (folder === "coupen") {
          targetFolder = "coupen";
        } else if (fieldName === "avatar") {
          targetFolder = "users";
        } else if (fieldName === "image") {
          targetFolder = "team";
        }

        return convertToWebp(targetFolder)(req, res, next);
      },
    ];
  },

  array: (fieldName, maxCount, folder = "gallery") => [
    multerUpload.array(fieldName, maxCount),
    convertMultipleToWebp(folder),
  ],

  fields: (fieldsArray, folder = "gallery") => [
    multerUpload.fields(fieldsArray),
    convertMultipleToWebp(folder),
  ],

  any: (folder = "gallery") => [
    multerUpload.any(),
    convertMultipleToWebp(folder),
  ],
};

module.exports = upload;