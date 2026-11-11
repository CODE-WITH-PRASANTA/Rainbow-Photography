import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiCamera,
  FiMapPin,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiSearch,
} from "react-icons/fi";
import "./Myprofile.css";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  role: "",
  location: "",
  bio: "",
  status: "Active",
};

const INITIAL_PROFILES = [
  {
    id: "prf-1",
    fullName: "Rainbow Admin",
    email: "admin@rainbowphotography.com",
    role: "Studio Director & Cinematographer",
    location: "Bhubaneswar, Odisha",
    bio: "Passionate visual storyteller with over 8 years preserving destination weddings and candid memories.",
    status: "Active",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "prf-2",
    fullName: "Priya Sharma",
    email: "priya@rainbowphotography.com",
    role: "Senior Portrait & Baby Shoot Specialist",
    location: "Cuttack, Odisha",
    bio: "Specializing in natural lighting, newborn portraits, and outdoor couple pre-wedding stories.",
    status: "Active",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
];

const Myprofile = () => {
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [formData, setFormData] = useState(INITIAL_PROFILES[0]);
  const [editingId, setEditingId] = useState(INITIAL_PROFILES[0].id);
  const [avatar, setAvatar] = useState(INITIAL_PROFILES[0].avatar);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2800);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
    showToast("Profile image updated!");
  };

  const handleStartAddNew = () => {
    setEditingId(null);
    setAvatar(DEFAULT_AVATAR);
    setFormData(INITIAL_FORM);
    const fileInput = document.getElementById("myprofile-avatar-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleEditRow = (row) => {
    setEditingId(row.id);
    setAvatar(row.avatar || DEFAULT_AVATAR);
    setFormData({
      fullName: row.fullName || "",
      email: row.email || "",
      role: row.role || "",
      location: row.location || "",
      bio: row.bio || "",
      status: row.status || "Active",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteRow = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this profile?");
    if (!confirmed) return;

    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);

    if (editingId === id) {
      if (remaining.length > 0) {
        handleEditRow(remaining[0]);
      } else {
        handleStartAddNew();
      }
    }
    showToast("Profile removed successfully!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      alert("Admin Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email Address is required.");
      return;
    }

    if (editingId) {
      setProfiles((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...formData, avatar }
            : item
        )
      );
      showToast("Profile updated successfully!");
    } else {
      const newEntry = {
        ...formData,
        id: `prf-${Date.now()}`,
        avatar: avatar || DEFAULT_AVATAR,
      };
      setProfiles((prev) => [newEntry, ...prev]);
      setEditingId(newEntry.id);
      showToast("New profile saved successfully!");
    }
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="myprofile-page-wrapper">
      {toastMessage && <div className="myprofile-toast">{toastMessage}</div>}

      {/* TOP RICH BLUE BANNER */}
      <div className="myprofile-banner">
        <div className="myprofile-banner-pill-btn">
          <FiUser className="myprofile-banner-pill-icon" />
          <span className="myprofile-banner-pill-text">Account Settings</span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="myprofile-content-container">
        {/* PROFILE SETTINGS FORM CARD */}
        <div className="myprofile-card">
          <div className="myprofile-card-header">
            {/* OVERLAPPING AVATAR */}
            <div className="myprofile-avatar-wrapper">
              <img
                src={avatar || DEFAULT_AVATAR}
                alt="Profile Avatar"
                className="myprofile-avatar-img"
              />
              <label
                htmlFor="myprofile-avatar-upload"
                className="myprofile-edit-badge-btn"
                title="Change Avatar"
              >
                <FiCamera className="myprofile-edit-badge-icon" />
              </label>
              <input
                id="myprofile-avatar-upload"
                className="myprofile-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* HEADING GROUP */}
            <div className="myprofile-heading-group">
              <div className="myprofile-title-row">
                <h1 className="myprofile-title">Profile Settings</h1>
                <span className="myprofile-status-badge myprofile-status-active">
                  • {formData.status || "Active"}
                </span>
              </div>
              <p className="myprofile-subtitle">
                Manage your personal details, studio roles, and account preferences
              </p>
            </div>
          </div>

          {/* EDIT FORM */}
          <form onSubmit={handleSubmit} className="myprofile-form">
            <div className="myprofile-form-grid">
              {/* ADMIN NAME */}
              <div className="myprofile-form-group">
                <label htmlFor="fullName" className="myprofile-label">
                  Admin Name
                </label>
                <input
                  id="fullName"
                  className="myprofile-input"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="myprofile-form-group">
                <label htmlFor="email" className="myprofile-label">
                  Email Address
                </label>
                <input
                  id="email"
                  className="myprofile-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              {/* PHOTOGRAPHY STYLE / ROLE */}
              <div className="myprofile-form-group">
                <label htmlFor="role" className="myprofile-label">
                  Photography Role / Shoot Style
                </label>
                <input
                  id="role"
                  className="myprofile-input"
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Wedding Photographer, Portrait Artist"
                />
              </div>

              {/* LOCATION */}
              <div className="myprofile-form-group">
                <label htmlFor="location" className="myprofile-label">
                  Base Location / City
                </label>
                <input
                  id="location"
                  className="myprofile-input"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>

              {/* BIO TEXTAREA */}
              <div className="myprofile-form-group myprofile-form-group-full">
                <label htmlFor="bio" className="myprofile-label">
                  Photographer Bio & Highlights
                </label>
                <textarea
                  id="bio"
                  className="myprofile-textarea"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a brief intro about your visual storytelling style..."
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="myprofile-form-action-row">
              {editingId !== null && (
                <button
                  type="button"
                  className="myprofile-cancel-btn"
                  onClick={handleStartAddNew}
                >
                  <FiPlus size={15} />
                  <span>New Profile</span>
                </button>
              )}

              <button type="submit" className="myprofile-update-btn">
                <FiCheck className="myprofile-btn-icon" />
                <span>{editingId !== null ? "Update Profile" : "Save Profile"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* PROFILE DIRECTORY TABLE CARD */}
        <div className="myprofile-table-card">
          <div className="myprofile-table-header-row">
            <div className="myprofile-table-title-wrap">
              <FiUser className="myprofile-table-title-icon" />
              <div>
                <h2 className="myprofile-table-title-text">Profile Details</h2>
                <p className="myprofile-table-subtitle">
                  Authorized studio administrators and photographers
                </p>
              </div>
            </div>

            <div className="myprofile-table-actions-header">
              <div className="myprofile-search-box">
                <FiSearch className="myprofile-search-icon" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="myprofile-add-new-btn"
                onClick={handleStartAddNew}
              >
                + Add New
              </button>
            </div>
          </div>

          <div className="myprofile-table-wrapper">
            <table className="myprofile-table">
              <thead className="myprofile-thead">
                <tr className="myprofile-tr">
                  <th className="myprofile-th" style={{ width: "60px" }}>
                    S.No
                  </th>
                  <th className="myprofile-th">Name</th>
                  <th className="myprofile-th">Email</th>
                  <th className="myprofile-th">Role / Style</th>
                  <th className="myprofile-th">Base Location</th>
                  <th className="myprofile-th">Status</th>
                  <th className="myprofile-th myprofile-th-center">Actions</th>
                </tr>
              </thead>

              <tbody className="myprofile-tbody">
                {filteredProfiles.length === 0 ? (
                  <tr className="myprofile-tr">
                    <td colSpan="7" className="myprofile-td myprofile-empty-row">
                      No profiles found. Click "+ Add New" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((profile, idx) => (
                    <tr
                      key={profile.id}
                      className={`myprofile-tr ${
                        editingId === profile.id ? "myprofile-tr-active" : ""
                      }`}
                    >
                      <td className="myprofile-td">{idx + 1}</td>
                      <td className="myprofile-td">
                        <div className="myprofile-table-user-cell">
                          <img
                            src={profile.avatar || DEFAULT_AVATAR}
                            alt={profile.fullName}
                            className="myprofile-table-avatar"
                          />
                          <span className="myprofile-table-username">
                            {profile.fullName || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="myprofile-td">{profile.email || "—"}</td>
                      <td className="myprofile-td">
                        <span className="myprofile-role-pill">
                          {profile.role || "Photographer"}
                        </span>
                      </td>
                      <td className="myprofile-td">{profile.location || "—"}</td>
                      <td className="myprofile-td">
                        <span className="myprofile-status-badge myprofile-status-active">
                          • {profile.status || "Active"}
                        </span>
                      </td>
                      <td className="myprofile-td">
                        <div className="myprofile-action-buttons-group">
                          <button
                            type="button"
                            className="myprofile-action-icon-btn myprofile-action-edit"
                            title="Edit"
                            onClick={() => handleEditRow(profile)}
                          >
                            <FiEdit2 className="myprofile-action-svg" />
                          </button>
                          <button
                            type="button"
                            className="myprofile-action-icon-btn myprofile-action-delete"
                            title="Delete"
                            onClick={() => handleDeleteRow(profile.id)}
                          >
                            <FiTrash2 className="myprofile-action-svg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="myprofile-table-footer">
            <span className="myprofile-entries-count">
              Showing {filteredProfiles.length > 0 ? 1 : 0} to{" "}
              {filteredProfiles.length} of {profiles.length} entries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;