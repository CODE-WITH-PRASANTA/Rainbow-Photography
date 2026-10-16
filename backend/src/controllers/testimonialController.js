const path = require("path");
const fs = require("fs");
const Testimonial = require("../models/Testimonial");

// Helper to remove orphaned file on update/delete
const removeFileIfExists = (fileRelativePath) => {
  if (!fileRelativePath) return;
  const fullPath = path.join(__dirname, "..", fileRelativePath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      console.error("Failed to delete file:", err.message);
    }
  }
};

// 1. Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { parent, designation, message, rating, status } = req.body;

    if (!parent || !message) {
      return res.status(400).json({
        success: false,
        message: "Parent name and message are required.",
      });
    }

    const photoUrl = req.file?.url || "";

    const newTestimonial = await Testimonial.create({
      parent: parent.trim(),
      designation: designation?.trim() || "Parent",
      message: message.trim(),
      rating: Number(rating) || 5,
      status: status || "Unpublished",
      photo: photoUrl,
      date: new Date().toISOString().slice(0, 10),
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update testimonial (with optional photo replacement)
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { parent, designation, message, rating, status, removeExistingPhoto } = req.body;

    const existing = await Testimonial.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    let photoUrl = existing.photo;

    // If new file uploaded, delete old one and update path
    if (req.file?.url) {
      removeFileIfExists(existing.photo);
      photoUrl = req.file.url;
    } else if (removeExistingPhoto === "true" || removeExistingPhoto === true) {
      removeFileIfExists(existing.photo);
      photoUrl = "";
    }

    existing.parent = parent ? parent.trim() : existing.parent;
    existing.designation = designation ? designation.trim() : existing.designation;
    existing.message = message ? message.trim() : existing.message;
    existing.rating = rating !== undefined ? Number(rating) : existing.rating;
    if (status) existing.status = status;
    existing.photo = photoUrl;

    const updated = await existing.save();

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Toggle Published / Unpublished
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    testimonial.status =
      testimonial.status === "Published" ? "Unpublished" : "Published";

    await testimonial.save();

    return res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.status.toLowerCase()}.`,
      data: testimonial,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    removeFileIfExists(testimonial.photo);
    await Testimonial.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
      data: { id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
