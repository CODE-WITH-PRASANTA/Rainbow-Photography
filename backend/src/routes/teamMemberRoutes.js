const express = require("express");
const router = express.Router();

const {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  toggleTeamMemberStatus,
  deleteTeamMember,
} = require("../controllers/teamMemberController");

const upload = require("../middleware/multer");

// List all members
router.get("/", getTeamMembers);

// Create: Multer receives the photo, then Sharp converts it to WebP.
router.post(
  "/",
  ...upload.single("photo", "team-members"),
  createTeamMember
);

// Edit member and optionally replace the photo
router.put(
  "/:id",
  ...upload.single("photo", "team-members"),
  updateTeamMember
);

// Change status
router.patch("/:id/status", toggleTeamMemberStatus);

// Delete member and its stored photo
router.delete("/:id", deleteTeamMember);

module.exports = router;