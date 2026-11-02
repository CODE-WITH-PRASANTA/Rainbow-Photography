
const express = require("express");

const {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const router = express.Router();

// Public contact form submission
router.post("/", createEnquiry);

// Admin enquiry management
router.get("/", getEnquiries);
router.put("/:id", updateEnquiry);
router.delete("/:id", deleteEnquiry);

module.exports = router;
