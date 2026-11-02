const mongoose = require("mongoose");

const coldLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },

    eventDate: {
      type: Date,
      default: null,
    },

    source: {
      type: String,
      enum: ["Website Form", "WhatsApp", "Instagram", "Other"],
      default: "Website Form",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Follow-up",
        "Converted",
        "Not Interested",
      ],
      default: "New",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "coldleads",
  }
);

module.exports = mongoose.model("ColdLead", coldLeadSchema);