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
      required: true,
      enum: [
        "Maternity Shoot",
        "Birthday Special",
        "Baby Shoot",
        "Advertise Shoot",
        "Pre Wedding and Post Wedding Shoot",
      ],
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    imageFormat: {
      type: String,
      default: "webp",
      enum: ["webp"],
    },

    imageSize: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);