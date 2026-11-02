const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");

const {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

// GET ALL IMAGES
router.get("/", getGallery);

// CREATE IMAGE
router.post(
  "/",
  ...upload.single("image", "gallery"),
  createGallery
);

// UPDATE IMAGE
router.put(
  "/:id",
  ...upload.single("image", "gallery"),
  updateGallery
);

// DELETE IMAGE
router.delete("/:id", deleteGallery);

module.exports = router;