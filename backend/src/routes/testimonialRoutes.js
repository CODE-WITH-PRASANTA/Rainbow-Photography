const express = require("express");

const {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getPublishedTestimonials,
  updateTestimonial,
  updateTestimonialStatus,
} = require("../controllers/testimonialController");

const router = express.Router();

// PUBLIC WEBSITE
router.get("/public", getPublishedTestimonials);
router.post("/", createTestimonial);

// ADMIN PANEL
router.get("/", getAllTestimonials);
router.put("/:id", updateTestimonial);
router.patch("/:id/status", updateTestimonialStatus);
router.delete("/:id", deleteTestimonial);

module.exports = router;