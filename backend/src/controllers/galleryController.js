
const Gallery = require("../models/Gallery");
const fs = require("fs/promises");
const path = require("path");

const uploadDirectory = path.resolve(__dirname, "../uploads/gallery");

const deleteLocalImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith("/uploads/gallery/")) {
    return;
  }

  const filename = path.basename(imageUrl);
  const filePath = path.join(uploadDirectory, filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Image file cleanup failed:", error.message);
    }
  }
};

// GET /api/gallery
exports.getGallery = async (req, res, next) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/gallery/:id
exports.getGalleryById = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    res.status(200).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// POST /api/gallery
exports.createGallery = async (req, res, next) => {
  try {
    const title = req.body.title?.trim();
    const category = req.body.category?.trim() || "Other";

    if (!title) {
      if (req.file?.url) await deleteLocalImage(req.file.url);

      return res.status(400).json({
        success: false,
        message: "Image title is required",
      });
    }

    if (!req.file?.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const image = await Gallery.create({
      title,
      category,
      image: req.file.url,
      imageFormat: "webp",
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded and saved successfully",
      data: image,
    });
  } catch (error) {
    if (req.file?.url) await deleteLocalImage(req.file.url);
    next(error);
  }
};

// PUT /api/gallery/:id
exports.updateGallery = async (req, res, next) => {
  let newImageUrl = null;

  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      if (req.file?.url) await deleteLocalImage(req.file.url);

      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    const title =
      req.body.title !== undefined
        ? req.body.title.trim()
        : image.title;

    if (!title) {
      if (req.file?.url) await deleteLocalImage(req.file.url);

      return res.status(400).json({
        success: false,
        message: "Image title is required",
      });
    }

    const oldImageUrl = image.image;

    image.title = title;

    if (req.body.category !== undefined) {
      image.category = req.body.category.trim() || "Other";
    }

    if (req.file?.url) {
      newImageUrl = req.file.url;
      image.image = newImageUrl;
      image.imageFormat = "webp";
    }

    await image.save();

    if (newImageUrl && oldImageUrl !== newImageUrl) {
      await deleteLocalImage(oldImageUrl);
    }

    res.status(200).json({
      success: true,
      message: "Gallery image updated successfully",
      data: image,
    });
  } catch (error) {
    if (newImageUrl) await deleteLocalImage(newImageUrl);
    next(error);
  }
};

// DELETE /api/gallery/:id
exports.deleteGallery = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    await deleteLocalImage(image.image);

    res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
