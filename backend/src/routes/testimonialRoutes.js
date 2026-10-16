const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // ✅ Correct path and filename
const testimonialController = require("../controllers/testimonialController");

router
  .route("/")
  .get(testimonialController.getAllTestimonials)
  .post(upload.single("photo", "testimonials"), testimonialController.createTestimonial);

router
  .route("/:id")
  .put(upload.single("photo", "testimonials"), testimonialController.updateTestimonial)
  .delete(testimonialController.deleteTestimonial);

router.patch("/:id/status", testimonialController.toggleStatus);

module.exports = router;