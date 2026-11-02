const fs = require("fs");
const path = require("path");
const Gallery = require("../models/Gallery");

const CATEGORY_OPTIONS = {
  "Maternity Shoot": [
    "Engagement",
    "Mehendi",
    "Haldi",
    "Marriage",
    "Reception",
  ],

  "Birthday Special": [
    "Cake Smash",
    "Kids Party",
    "Themed Decor",
    "Family Moments",
  ],

  "Baby Shoot": [
    "Newborn",
    "Sitter (6-9M)",
    "Themes & Props",
    "Family Cuddles",
  ],

  "Advertise Shoot": [
    "Product & Packshot",
    "Fashion & Lookbook",
    "Brand Commercial",
    "Editorial & Print",
    "Corporate & Lifestyle",
  ],

  "Pre Wedding and Post Wedding Shoot": [
    "Pre-Wedding",
    "Post-Wedding",
    "Destinations",
    "Sunset & Candids",
    "Heritage & Royal",
  ],
};

// ========================================
// DELETE IMAGE FROM UPLOADS
// ========================================

const deleteStoredImage = (imageUrl) => {
  if (!imageUrl) return;

  try {
    const uploadRoot = path.resolve(__dirname, "../uploads");

    const filename = String(imageUrl)
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    if (!filename.startsWith("uploads/")) {
      console.warn("Invalid gallery image URL:", imageUrl);
      return;
    }

    const absolutePath = path.resolve(
      __dirname,
      "..",
      filename
    );

    if (
      !absolutePath.startsWith(uploadRoot + path.sep)
    ) {
      console.warn("Unsafe image deletion path:", imageUrl);
      return;
    }

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log("Gallery image deleted:", absolutePath);
    }
  } catch (error) {
    console.error("IMAGE DELETE ERROR:", error);
  }
};

// ========================================
// VALIDATE GALLERY DATA
// ========================================

const validateGalleryFields = (body) => {
  const { title, category, subCategory } = body;

  if (!title || !String(title).trim()) {
    return "Image title is required.";
  }

  if (String(title).trim().length > 100) {
    return "Image title cannot exceed 100 characters.";
  }

  if (!Object.prototype.hasOwnProperty.call(
    CATEGORY_OPTIONS,
    category
  )) {
    return "Please select a valid category.";
  }

  if (!CATEGORY_OPTIONS[category].includes(subCategory)) {
    return "Please select a valid sub category.";
  }

  return null;
};

// ========================================
// GET ALL GALLERY IMAGES
// ========================================

const getGallery = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      subCategory = "",
    } = req.query;

    const filter = {};

    if (category) {
      if (!Object.prototype.hasOwnProperty.call(
        CATEGORY_OPTIONS,
        category
      )) {
        return res.status(400).json({
          success: false,
          message: "Invalid category.",
        });
      }

      filter.category = category;
    }

    if (subCategory) {
      filter.subCategory = subCategory;
    }

    if (String(search).trim()) {
      const escapedSearch = String(search)
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { title: regex },
        { category: regex },
        { subCategory: regex },
      ];
    }

    const gallery = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    console.error("GET GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch gallery images.",
    });
  }
};

// ========================================
// CREATE GALLERY IMAGE
// ========================================

const createGallery = async (req, res) => {
  let savedImagePath = null;

  try {
    const validationError = validateGalleryFields(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (!req.file || !req.file.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    savedImagePath = req.file.url;

    const gallery = await Gallery.create({
      title: String(req.body.title).trim(),
      category: req.body.category,
      subCategory: req.body.subCategory,
      image: req.file.url,
      imageFormat: "webp",
      imageSize: req.file.size || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Gallery image created successfully.",
      data: gallery,
    });
  } catch (error) {
    if (savedImagePath) {
      deleteStoredImage(savedImagePath);
    }

    console.error("CREATE GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save gallery image.",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE GALLERY IMAGE
// ========================================

const updateGallery = async (req, res) => {
  let newImagePath = null;

  try {
    const validationError = validateGalleryFields(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    if (req.file?.url) {
      newImagePath = req.file.url;
    }

    const oldImagePath = gallery.image;

    gallery.title = String(req.body.title).trim();
    gallery.category = req.body.category;
    gallery.subCategory = req.body.subCategory;

    if (req.file?.url) {
      gallery.image = req.file.url;
      gallery.imageFormat = "webp";
      gallery.imageSize = req.file.size || 0;
    }

    await gallery.save();

    // Delete old image only after successful database update
    if (
      newImagePath &&
      oldImagePath &&
      oldImagePath !== newImagePath
    ) {
      deleteStoredImage(oldImagePath);
    }

    return res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      data: gallery,
    });
  } catch (error) {
    if (newImagePath) {
      deleteStoredImage(newImagePath);
    }

    console.error("UPDATE GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update gallery image.",
      error: error.message,
    });
  }
};

// ========================================
// DELETE GALLERY IMAGE
// ========================================

const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    deleteStoredImage(gallery.image);

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete gallery image.",
    });
  }
};

module.exports = {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
};