
const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Image title is required"],
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      trim: true,
      default: "Other",
    },

    image: {
      type: String,
      required: [true, "Image URL is required"],
    },

    imageFormat: {
      type: String,
      default: "webp",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);
