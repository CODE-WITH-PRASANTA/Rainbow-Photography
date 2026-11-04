const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");

const {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

// GET ALL GALLERY IMAGES
router.get("/", getGallery);

// CREATE GALLERY IMAGE
router.post(
  "/",
  ...upload.single("image", "gallery"),
  createGallery
);

// UPDATE GALLERY IMAGE
router.put(
  "/:id",
  ...upload.single("image", "gallery"),
  updateGallery
);

// DELETE GALLERY IMAGE
router.delete("/:id", deleteGallery);

module.exports = router;