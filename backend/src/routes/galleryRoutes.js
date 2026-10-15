
const express = require("express");
const router = express.Router();

const {
  getGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

const upload = require("../middleware/multer");

// Get all images
router.get("/", getGallery);

// Get one image
router.get("/:id", getGalleryById);

// Upload image, convert to WebP, and save to MongoDB
router.post(
  "/",
  ...upload.single("image", "gallery"),
  createGallery
);

// Update title/category and optionally replace the image
router.put(
  "/:id",
  ...upload.single("image", "gallery"),
  updateGallery
);

// Delete image and its local file
router.delete("/:id", deleteGallery);

module.exports = router;
