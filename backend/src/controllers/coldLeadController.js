const mongoose = require("mongoose");
const ColdLead = require("../models/ColdLead");

// Validate MongoDB ID
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Normalize incoming frontend and admin data
const normalizeLead = (body = {}) => ({
  name: String(body.name ?? body.fullName ?? "").trim(),
  email: String(body.email ?? "").trim().toLowerCase(),
  phone: String(body.phone ?? body.mobile ?? "").trim(),
  service: String(body.service ?? "").trim(),
  eventDate: body.eventDate || null,
  source: body.source || "Website Form",
  status: body.status || "New",
  message: String(body.message ?? "").trim(),
});

// CREATE COLD LEAD
exports.createColdLead = async (req, res) => {
  try {
    const leadData = normalizeLead(req.body);

    if (!leadData.name || !leadData.phone || !leadData.service) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number and service are required.",
      });
    }

    // Basic Indian mobile number validation
    const mobile = leadData.phone.replace(/\D/g, "").slice(-10);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    if (
      leadData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const newLead = await ColdLead.create({
      ...leadData,
      phone: mobile,
      source: "Website Form",
      status: "New",
    });

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: newLead,
    });
  } catch (error) {
    console.error("Create cold lead error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to submit enquiry.",
    });
  }
};

// GET ALL COLD LEADS
exports.getColdLeads = async (req, res) => {
  try {
    const leads = await ColdLead.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Get cold leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cold leads.",
    });
  }
};

// UPDATE COLD LEAD
exports.updateColdLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    const leadData = normalizeLead(req.body);

    if (!leadData.name || !leadData.phone || !leadData.service) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number and service are required.",
      });
    }

    const mobile = leadData.phone.replace(/\D/g, "").slice(-10);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const updatedLead = await ColdLead.findByIdAndUpdate(
      id,
      {
        ...leadData,
        phone: mobile,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Cold lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cold lead updated successfully.",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update cold lead error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update cold lead.",
    });
  }
};

// UPDATE LEAD STATUS
exports.updateColdLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "Contacted",
      "Follow-up",
      "Converted",
      "Not Interested",
    ];

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead status.",
      });
    }

    const updatedLead = await ColdLead.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Cold lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully.",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update lead status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update lead status.",
    });
  }
};

// DELETE SINGLE LEAD
exports.deleteColdLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    const deletedLead = await ColdLead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: "Cold lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cold lead deleted successfully.",
      data: deletedLead,
    });
  } catch (error) {
    console.error("Delete cold lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete cold lead.",
    });
  }
};

// DELETE MULTIPLE LEADS
exports.deleteBulkColdLeads = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide lead IDs.",
      });
    }

    if (!ids.every(isValidId)) {
      return res.status(400).json({
        success: false,
        message: "One or more lead IDs are invalid.",
      });
    }

    const result = await ColdLead.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} cold lead(s) deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete cold leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete selected cold leads.",
    });
  }
};