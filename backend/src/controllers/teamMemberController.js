const fs = require("fs/promises");
const path = require("path");
const TeamMember = require("../models/TeamMember");

const uploadRoot = path.resolve(__dirname, "../uploads");

const getPhotoPath = (photoUrl) => {
  if (!photoUrl || typeof photoUrl !== "string") return null;

  const prefix = "/uploads/team-members/";

  if (!photoUrl.startsWith(prefix)) return null;

  const filename = path.basename(photoUrl);

  if (!filename.endsWith(".webp")) return null;

  return path.join(uploadRoot, "team-members", filename);
};

const removePhoto = async (photoUrl) => {
  const filePath = getPhotoPath(photoUrl);

  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Unable to remove photo:", error.message);
    }
  }
};

const cleanupNewUpload = async (req) => {
  if (req.file?.path) {
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Upload cleanup failed:", error.message);
      }
    }
  }
};

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) =>
  /^[0-9+()\-\s]{7,20}$/.test(phone);

// GET /api/team-members
exports.getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error("Get team members:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team members.",
    });
  }
};

// POST /api/team-members
exports.createTeamMember = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const designation = req.body.designation?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const phone = req.body.phone?.trim();

    if (!name || !designation || !email || !phone) {
      await cleanupNewUpload(req);

      return res.status(400).json({
        success: false,
        message: "Name, designation, email and phone are required.",
      });
    }

    if (!isValidEmail(email) || !isValidPhone(phone)) {
      await cleanupNewUpload(req);

      return res.status(400).json({
        success: false,
        message: "Please enter a valid email and phone number.",
      });
    }

    const duplicate = await TeamMember.findOne({ email });

    if (duplicate) {
      await cleanupNewUpload(req);

      return res.status(409).json({
        success: false,
        message: "This email address already exists.",
      });
    }

    const member = await TeamMember.create({
      name,
      designation,
      email,
      phone,
      status: "Active",
      photo: req.file?.url || "",
    });

    return res.status(201).json({
      success: true,
      message: "Team member created successfully.",
      data: member,
    });
  } catch (error) {
    await cleanupNewUpload(req);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email address already exists.",
      });
    }

    console.error("Create team member:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create team member.",
    });
  }
};

// PUT /api/team-members/:id
exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      await cleanupNewUpload(req);

      return res.status(400).json({
        success: false,
        message: "Invalid team member ID.",
      });
    }

    const member = await TeamMember.findById(id);

    if (!member) {
      await cleanupNewUpload(req);

      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    const name = req.body.name?.trim();
    const designation = req.body.designation?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const phone = req.body.phone?.trim();

    if (!name || !designation || !email || !phone) {
      await cleanupNewUpload(req);

      return res.status(400).json({
        success: false,
        message: "All required fields must be completed.",
      });
    }

    if (!isValidEmail(email) || !isValidPhone(phone)) {
      await cleanupNewUpload(req);

      return res.status(400).json({
        success: false,
        message: "Please enter a valid email and phone number.",
      });
    }

    const duplicate = await TeamMember.findOne({
      email,
      _id: { $ne: id },
    });

    if (duplicate) {
      await cleanupNewUpload(req);

      return res.status(409).json({
        success: false,
        message: "This email address already exists.",
      });
    }

    const oldPhoto = member.photo;

    member.name = name;
    member.designation = designation;
    member.email = email;
    member.phone = phone;

    // Replace the photo only if a new one was uploaded.
    if (req.file?.url) {
      member.photo = req.file.url;
    }

    await member.save();

    if (req.file?.url && oldPhoto && oldPhoto !== member.photo) {
      await removePhoto(oldPhoto);
    }

    return res.status(200).json({
      success: true,
      message: "Team member updated successfully.",
      data: member,
    });
  } catch (error) {
    await cleanupNewUpload(req);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email address already exists.",
      });
    }

    console.error("Update team member:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update team member.",
    });
  }
};

// PATCH /api/team-members/:id/status
exports.toggleTeamMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID.",
      });
    }

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Active or Inactive.",
      });
    }

    const member = await TeamMember.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      data: member,
    });
  } catch (error) {
    console.error("Toggle team member status:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update status.",
    });
  }
};

// DELETE /api/team-members/:id
exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID.",
      });
    }

    const member = await TeamMember.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    await removePhoto(member.photo);

    return res.status(200).json({
      success: true,
      message: "Team member deleted successfully.",
      data: member,
    });
  } catch (error) {
    console.error("Delete team member:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete team member.",
    });
  }
};