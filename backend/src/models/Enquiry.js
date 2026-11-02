
const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    eventType: {
      type: String,
      required: [true, "Event type is required"],
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 3000,
    },
  },
  {
    timestamps: true,
    collection: "enquiries",
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
