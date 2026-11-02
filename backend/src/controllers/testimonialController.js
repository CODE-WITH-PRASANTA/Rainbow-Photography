
const mongoose = require("mongoose");
const Testimonial = require("../models/Testimonial");

// ======================================
// ERROR HANDLER
// ======================================

const sendError = (res, error, message = "Server error") => {
  console.error(message, error);

  return res.status(500).json({
    success: false,
    message,
  });
};

// ======================================
// VALIDATE INPUT
// ======================================

const validatePayload = ({ name, location, message, rating }) => {
  if (!String(name || "").trim()) {
    return "Name is required.";
  }

  if (!String(location || "").trim()) {
    return "Location is required.";
  }

  if (String(message || "").trim().length < 10) {
    return "Review must contain at least 10 characters.";
  }

  if (String(message || "").trim().length > 500) {
    return "Review cannot exceed 500 characters.";
  }

  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return "Rating must be between 1 and 5.";
  }

  return null;
};

// ======================================
// PUBLIC: GET PUBLISHED TESTIMONIALS
// ======================================

const getPublishedTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find({
      status: "Published",
    })
      .sort({ createdAt: -1 })
      .select("name location message rating status createdAt");

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to load published testimonials.");
  }
};

// ======================================
// ADMIN: GET ALL TESTIMONIALS
// ======================================

const getAllTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to load testimonials.");
  }
};

// ======================================
// PUBLIC: CREATE TESTIMONIAL
// ======================================

const createTestimonial = async (req, res) => {
  try {
    const errorMessage = validatePayload(req.body || {});

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const { name, location, message, rating } = req.body;

    const data = await Testimonial.create({
      name: name.trim(),
      location: location.trim(),
      message: message.trim(),
      rating: Number(rating),
      status: "Unpublished",
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully. Awaiting approval.",
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to submit testimonial.");
  }
};

// ======================================
// ADMIN: UPDATE TESTIMONIAL
// ======================================

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID.",
      });
    }

    const errorMessage = validatePayload(req.body || {});

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const { name, location, message, rating } = req.body;

    const data = await Testimonial.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        location: location.trim(),
        message: message.trim(),
        rating: Number(rating),
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to update testimonial.");
  }
};

// ======================================
// ADMIN: PUBLISH / UNPUBLISH
// ======================================

const updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID.",
      });
    }

    if (!["Published", "Unpublished"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial status.",
      });
    }

    const data = await Testimonial.findByIdAndUpdate(
      id,
      { status },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Testimonial ${status.toLowerCase()} successfully.`,
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to update testimonial status.");
  }
};

// ======================================
// ADMIN: DELETE TESTIMONIAL
// ======================================

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID.",
      });
    }

    const data = await Testimonial.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    return sendError(res, error, "Unable to delete testimonial.");
  }
};

// ======================================
// EXPORT CONTROLLERS
// ======================================

module.exports = {
  getPublishedTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
};
