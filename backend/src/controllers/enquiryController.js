
const mongoose = require("mongoose");
const Enquiry = require("../models/Enquiry");

// Validate enquiry data
const validateEnquiry = (data) => {
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const phone = String(data.phone || "").replace(/\D/g, "");
  const eventType = String(data.eventType || "").trim();
  const message = String(data.message || "").trim();

  if (name.length < 2) {
    return { error: "Please enter a valid name." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!/^\d{10}$/.test(phone)) {
    return { error: "Please enter a valid 10-digit phone number." };
  }

  if (!eventType) {
    return { error: "Please select an event type." };
  }

  if (message.length < 3) {
    return { error: "Please enter your message." };
  }

  return {
    value: {
      name,
      email,
      phone,
      eventType,
      message,
    },
  };
};

// POST: Submit enquiry from public contact form
exports.createEnquiry = async (req, res) => {
  try {
    const validation = validateEnquiry(req.body);

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const enquiry = await Enquiry.create(validation.value);

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
      data: enquiry,
    });
  } catch (error) {
    console.error("Create enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your enquiry. Please try again.",
    });
  }
};

// GET: Get all enquiries for admin panel
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enquiries.",
    });
  }
};

// PUT: Update enquiry from admin panel
exports.updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    const validation = validateEnquiry(req.body);

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      validation.value,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully.",
      data: updatedEnquiry,
    });
  } catch (error) {
    console.error("Update enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update enquiry.",
    });
  }
};

// DELETE: Delete one enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully.",
      data: deletedEnquiry,
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete enquiry.",
    });
  }
};
