import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import API, { IMG_URL } from "../../api/axios";
import "./TeamMember.css";
const ITEMS_PER_PAGE = 6;
const emptyForm = {
  name: "",
  designation: "",
  email: "",
  phone: "",
};
const TeamMember = () => {
  // ========================= STATE =========================
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const fileInputRef = useRef(null);
  const noticeTimer = useRef(null);
  const previewRef = useRef("");
  // ========================= NOTIFICATIONS =========================
  const notify = useCallback((message, type = "success") => {
    clearTimeout(noticeTimer.current);
    setNotice({ message, type });
    noticeTimer.current = setTimeout(() => {
      setNotice(null);
    }, 3500);
  }, []);
  useEffect(() => {
    return () => {
      clearTimeout(noticeTimer.current);
      if (previewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);
  // ========================= PHOTO URL =========================
  const getPhotoUrl = useCallback((photo) => {
    if (!photo) return "";
    if (/^(https?:|blob:|data:)/i.test(photo)) {
      return photo;
    }
    return `${IMG_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
  }, []);
  const clearPreview = () => {
    if (previewRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewRef.current);
    }
    previewRef.current = "";
    setPhotoPreview("");
  };
  // ========================= FETCH MEMBERS =========================
  const fetchMembers = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const response = await API.get("/team-members");
      const list = response.data?.data;
      if (!Array.isArray(list)) {
        throw new Error("Unexpected response from team member API.");
      }
      setMembers(list);
    } catch (error) {
      console.error("Fetch team members:", error);
      notify(
        error.response?.data?.message ||
          error.message ||
          "Unable to load team members. Check the backend API.",
        "error"
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [notify]);
  useEffect(() => {
    fetchMembers();
    return () => clearTimeout(noticeTimer.current);
  }, [fetchMembers]);
  // ========================= FORM HELPERS =========================
  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPhotoFile(null);
    clearPreview();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // ========================= PHOTO SELECTION =========================
  const readPhoto = (file) => {
    if (!file) return;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      notify("Please upload a JPG, PNG, or WebP image.", "error");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify("Photo size must not exceed 5 MB.", "error");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    clearPreview();
    const preview = URL.createObjectURL(file);
    previewRef.current = preview;
    setPhotoFile(file);
    setPhotoPreview(preview);
  };
  const removePhotoSelection = () => {
    setPhotoFile(null);
    clearPreview();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // ========================= ADD / UPDATE MEMBER =========================
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const name = form.name.trim();
    const designation = form.designation.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    if (!name || !designation || !email || !phone) {
      notify("Please complete all required fields.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify("Please enter a valid email address.", "error");
      return;
    }
    if (!/^[0-9+()\-\s]{7,20}$/.test(phone)) {
      notify("Please enter a valid phone number.", "error");
      return;
    }
    const duplicateEmail = members.some(
      (member) =>
        member.email?.toLowerCase() === email &&
        member._id !== editingId
    );
    if (duplicateEmail) {
      notify("This email address already exists.", "error");
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("designation", designation);
      formData.append("email", email);
      formData.append("phone", phone);
      // Send the actual file, not a Base64 preview.
      if (photoFile) {
        formData.append("photo", photoFile);
      }
      const response = editingId
        ? await API.put(`/team-members/${editingId}`, formData)
        : await API.post("/team-members", formData);
      const savedMember = response.data?.data;
      if (!savedMember?._id) {
        throw new Error("The API did not return the saved team member.");
      }
      if (editingId) {
        setMembers((previous) =>
          previous.map((member) =>
            member._id === editingId ? savedMember : member
          )
        );
        notify("Team member updated successfully.");
      } else {
        setMembers((previous) => [savedMember, ...previous]);
        setActiveFilter("All");
        setSearch("");
        setCurrentPage(1);
        notify("Team member added successfully.");
      }
      resetForm();
    } catch (error) {
      console.error("Save team member:", error);
      notify(
        error.response?.data?.message ||
          error.message ||
          "Failed to save team member.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };
  // ========================= EDIT MEMBER =========================
  const handleEdit = (member) => {
    setForm({
      name: member.name || "",
      designation: member.designation || "",
      email: member.email || "",
      phone: member.phone || "",
    });
    setEditingId(member._id);
    setPhotoFile(null);
    clearPreview();
    if (member.photo) {
      const url = getPhotoUrl(member.photo);
      previewRef.current = url;
      setPhotoPreview(url);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // ========================= DELETE MEMBER =========================
  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    try {
      setDeleting(true);
      await API.delete(`/team-members/${deleteTarget._id}`);
      const deletedId = deleteTarget._id;
      setMembers((previous) =>
        previous.filter((member) => member._id !== deletedId)
      );
      if (editingId === deletedId) {
        resetForm();
      }
      setDeleteTarget(null);
      notify("Team member deleted successfully.");
    } catch (error) {
      console.error("Delete team member:", error);
      notify(
        error.response?.data?.message ||
          "Unable to delete team member.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };
  // ========================= STATUS UPDATE =========================
  const toggleStatus = async (id) => {
    if (statusUpdatingId) return;
    const selected = members.find((member) => member._id === id);
    if (!selected) return;
    const nextStatus =
      selected.status === "Active" ? "Inactive" : "Active";
    try {
      setStatusUpdatingId(id);
      const response = await API.patch(
        `/team-members/${id}/status`,
        { status: nextStatus }
      );
      const updatedMember = response.data?.data;
      if (!updatedMember?._id) {
        throw new Error("The API did not return the updated member.");
      }
      setMembers((previous) =>
        previous.map((member) =>
          member._id === id ? updatedMember : member
        )
      );
      notify(`${selected.name} marked ${nextStatus.toLowerCase()}.`);
    } catch (error) {
      console.error("Update member status:", error);
      notify(
        error.response?.data?.message ||
          "Unable to update member status.",
        "error"
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };
  // ========================= COUNTS / SEARCH / FILTER =========================
  const activeCount = members.filter(
    (member) => member.status === "Active"
  ).length;
  const inactiveCount = members.length - activeCount;
  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return members.filter((member) => {
      const matchesStatus =
        activeFilter === "All" || member.status === activeFilter;
      const matchesSearch =
        !query ||
        [
          member.name,
          member.designation,
          member.email,
          member.phone,
          member.status,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );
      return matchesStatus && matchesSearch;
    });
  }, [members, search, activeFilter]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const currentMembers = filteredMembers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter]);
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  // ========================= REFRESH =========================
  const refreshMembers = () => {
    setSearch("");
    setActiveFilter("All");
    setCurrentPage(1);
    fetchMembers();
  };
  // ========================= CSV EXPORT =========================
  const exportCSV = () => {
    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Name", "Designation", "Email", "Phone", "Status"],
      ...filteredMembers.map((member) => [
        member.name,
        member.designation,
        member.email,
        member.phone,
        member.status,
      ]),
    ];
    const csv =
      "\uFEFF" +
      rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "team-members.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Team members exported successfully.");
  };
  // ========================= INITIALS =========================
  const initials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  // ========================= RENDER =========================
  return (
    <div className="TeamMember">
      {notice && (
        <div
          className={`TeamMember-toast TeamMember-toast--${notice.type}`}
          role="status"
        >
          <span className="TeamMember-toastIcon">
            {notice.type === "error" ? "!" : "✓"}
          </span>
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
      <div className="TeamMember-layout">
        {/* ================= ADD / EDIT FORM ================= */}
        <aside className="TeamMember-formCard">
          <div className="TeamMember-formHeading">
            <div className="TeamMember-headingIcon">♟</div>
            <div>
              <h2>
                {editingId ? "Edit Team Member" : "Add New Team Member"}
              </h2>
              <p>Manage your team details</p>
            </div>
          </div>
          <form className="TeamMember-form" onSubmit={handleSubmit}>
            <div className="TeamMember-field">
              <label htmlFor="TeamMember-name">
                Full Name <span>*</span>
              </label>
              <div className="TeamMember-inputWrap">
                <span className="TeamMember-inputIcon">♙</span>
                <input
                  id="TeamMember-name"
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  maxLength={80}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
            <div className="TeamMember-field">
              <label htmlFor="TeamMember-designation">
                Designation <span>*</span>
              </label>
              <div className="TeamMember-inputWrap">
                <span className="TeamMember-inputIcon">▤</span>
                <input
                  id="TeamMember-designation"
                  type="text"
                  placeholder="e.g. Teacher, Admin"
                  value={form.designation}
                  onChange={(e) =>
                    updateField("designation", e.target.value)
                  }
                  maxLength={80}
                  required
                />
              </div>
            </div>
            <div className="TeamMember-field">
              <label htmlFor="TeamMember-email">
                Email <span>*</span>
              </label>
              <div className="TeamMember-inputWrap">
                <span className="TeamMember-inputIcon">✉</span>
                <input
                  id="TeamMember-email"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  maxLength={120}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            <div className="TeamMember-field">
              <label htmlFor="TeamMember-phone">
                Phone <span>*</span>
              </label>
              <div className="TeamMember-inputWrap">
                <span className="TeamMember-inputIcon">♧</span>
                <input
                  id="TeamMember-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  maxLength={20}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>
            <div className="TeamMember-field">
              <label htmlFor="TeamMember-photo">
                Upload Photo <small>(Optional)</small>
              </label>
              <input
                ref={fileInputRef}
                id="TeamMember-photo"
                className="TeamMember-fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => readPhoto(e.target.files?.[0])}
              />
              <button
                type="button"
                className={`TeamMember-uploadBox ${
                  photoPreview ? "has-preview" : ""
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  readPhoto(e.dataTransfer.files?.[0]);
                }}
              >
                {photoPreview ? (
                  <img
                    className="TeamMember-uploadPreview"
                    src={photoPreview}
                    alt="Team member preview"
                  />
                ) : (
                  <span className="TeamMember-uploadIcon">⇧</span>
                )}
                <strong>
                  {photoPreview ? "Change photo" : "Click to upload"}
                </strong>
                {!photoPreview && <span>or drag and drop</span>}
                <small>PNG, JPG, JPEG, WebP (Max 5MB)</small>
              </button>
              {photoPreview && (
                <button
                  type="button"
                  className="TeamMember-removePhoto"
                  onClick={removePhotoSelection}
                >
                  Remove selected photo
                </button>
              )}
            </div>
            <div className="TeamMember-formActions">
              <button
                type="submit"
                className="TeamMember-submitButton"
                disabled={saving}
              >
                <span>{saving ? "…" : editingId ? "✓" : "➤"}</span>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Team Member"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="TeamMember-cancelButton"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
          <div className="TeamMember-formNote">
            <span>✦</span>
            Keep your team information accurate and up to date.
          </div>
        </aside>
        {/* ================= TEAM MEMBERS TABLE ================= */}
        <main className="TeamMember-mainCard">
          <div className="TeamMember-topHeader">
            <div className="TeamMember-titleGroup">
              <div className="TeamMember-headingIcon">♟</div>
              <div>
                <h1>Team Members</h1>
                <p>Manage your team members</p>
              </div>
            </div>
            <div className="TeamMember-searchWrap">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search team members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search team members"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="TeamMember-toolbar">
            <div
              className="TeamMember-tabs"
              role="tablist"
              aria-label="Filter team members by status"
            >
              {[
                { label: "All", count: members.length },
                { label: "Active", count: activeCount },
                { label: "Inactive", count: inactiveCount },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === tab.label}
                  className={`TeamMember-tab ${
                    activeFilter === tab.label ? "is-active" : ""
                  }`}
                  onClick={() => setActiveFilter(tab.label)}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <div className="TeamMember-toolbarActions">
              <button
                type="button"
                className="TeamMember-iconButton"
                onClick={refreshMembers}
                title="Refresh"
                aria-label="Refresh team list"
                disabled={loading}
              >
                ↻
              </button>
              <button
                type="button"
                className="TeamMember-exportButton"
                onClick={exportCSV}
              >
                <span>⇩</span> Export
              </button>
            </div>
          </div>
          <div className="TeamMember-tableWrap">
            <table className="TeamMember-table">
              <thead>
                <tr>
                  <th className="TeamMember-numberCol">Sl. No.</th>
                  <th className="TeamMember-photoCol">Photo</th>
                  <th className="TeamMember-nameCol">Name</th>
                  <th className="TeamMember-designationCol">Designation</th>
                  <th className="TeamMember-emailCol">Email</th>
                  <th className="TeamMember-phoneCol">Phone</th>
                  <th className="TeamMember-statusCol">Status</th>
                  <th className="TeamMember-actionCol">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="TeamMember-emptyState">
                        <strong>Loading team members...</strong>
                        <p>Please wait while records are fetched from the API.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {currentMembers.map((member, index) => (
                      <tr key={member._id}>
                        <td className="TeamMember-numberCell">
                          {startIndex + index + 1}
                        </td>
                        <td>
                          {member.photo ? (
                            <img
                              className="TeamMember-avatar"
                              src={getPhotoUrl(member.photo)}
                              alt={member.name}
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className={`TeamMember-avatar TeamMember-avatar--${
                                index % 4
                              }`}
                              title={member.name}
                              aria-label={member.name}
                            >
                              {initials(member.name)}
                            </div>
                          )}
                        </td>
                        <td>
                          <strong className="TeamMember-nameText">
                            {member.name}
                          </strong>
                        </td>
                        <td className="TeamMember-mutedCell">
                          {member.designation}
                        </td>
                        <td className="TeamMember-emailCell">
                          {member.email}
                        </td>
                        <td className="TeamMember-phoneCell">
                          {member.phone}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`TeamMember-statusBadge ${
                              member.status === "Active"
                                ? "is-active"
                                : "is-inactive"
                            }`}
                            onClick={() => toggleStatus(member._id)}
                            disabled={statusUpdatingId !== null}
                            title="Click to change status"
                            aria-label={`Change ${member.name} status`}
                          >
                            <span />
                            {statusUpdatingId === member._id
                              ? "Updating..."
                              : member.status}
                          </button>
                        </td>
                        <td>
                          <div className="TeamMember-rowActions">
                            <button
                              type="button"
                              className="TeamMember-actionButton TeamMember-editButton"
                              onClick={() => handleEdit(member)}
                              title="Edit member"
                              aria-label={`Edit ${member.name}`}
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              className="TeamMember-actionButton TeamMember-deleteButton"
                              onClick={() => setDeleteTarget(member)}
                              title="Delete member"
                              aria-label={`Delete ${member.name}`}
                            >
                              ♜
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {currentMembers.length === 0 && (
                      <tr>
                        <td colSpan={8}>
                          <div className="TeamMember-emptyState">
                            <span>⌕</span>
                            <strong>No team members found</strong>
                            <p>
                              Try another search or choose a different status.
                            </p>
                            <button
                              type="button"
                              onClick={refreshMembers}
                            >
                              Clear filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="TeamMember-pagination">
            <p>
              Showing{" "}
              <strong>
                {filteredMembers.length ? startIndex + 1 : 0}–
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  filteredMembers.length
                )}
              </strong>{" "}
              of <strong>{filteredMembers.length}</strong> team members
            </p>
            <div className="TeamMember-paginationControls">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                ‹ <span>Previous</span>
              </button>
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`TeamMember-pageNumber ${
                    safePage === page ? "is-active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={safePage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                <span>Next</span> ›
              </button>
            </div>
          </div>
          <div className="TeamMember-bottomActions">
            <span>
              <span className="TeamMember-liveDot" />
              {activeCount} active · {inactiveCount} inactive
            </span>
            <span className="TeamMember-storageNote">
              {loading ? "Loading database..." : "Connected to API"}
            </span>
          </div>
        </main>
      </div>
      {/* ================= DELETE CONFIRMATION ================= */}
      {deleteTarget && (
        <div
          className="TeamMember-modalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="TeamMember-deleteModal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="TeamMember-deleteTitle"
            aria-describedby="TeamMember-deleteDescription"
          >
            <div className="TeamMember-deleteIcon">!</div>
            <h2 id="TeamMember-deleteTitle">
              Delete Team Member?
            </h2>
            <p id="TeamMember-deleteDescription">
              Are you sure you want to remove{" "}
              <strong>{deleteTarget.name}</strong> from your team? This action
              cannot be undone.
            </p>
            <div className="TeamMember-modalActions">
              <button
                type="button"
                className="TeamMember-modalCancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="TeamMember-modalDelete"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Member"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
export default TeamMember;
