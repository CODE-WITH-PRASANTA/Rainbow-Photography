const express = require("express");

const {
  createColdLead,
  getColdLeads,
  updateColdLead,
  updateColdLeadStatus,
  deleteColdLead,
  deleteBulkColdLeads,
} = require("../controllers/coldLeadController");

const router = express.Router();

// Public website enquiry submission
router.post("/", createColdLead);

// Admin cold lead management
router.get("/", getColdLeads);
router.put("/:id", updateColdLead);
router.patch("/:id/status", updateColdLeadStatus);

// Keep bulk route before the dynamic :id delete route
router.delete("/bulk", deleteBulkColdLeads);
router.delete("/:id", deleteColdLead);

module.exports = router;