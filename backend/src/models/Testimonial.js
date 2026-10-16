const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    parent: {
      type: String,
      required: [true, "Parent name is required"],
      trim: true,
      maxlength: 80,
    },
    designation: {
      type: String,
      default: "Parent",
      trim: true,
      maxlength: 60,
    },
    message: {
      type: String,
      required: [true, "Testimonial message is required"],
      trim: true,
      maxlength: 500,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ["Published", "Unpublished"],
      default: "Unpublished",
    },
    photo: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);