import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Testimonial.css";

const API_BASE_URL = "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/testimonials`;
const ITEMS_PER_PAGE = 4;

const emptyForm = {
  parent: "",
  designation: "",
  message: "",
  rating: 5,
};

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState(null);

  const fileInputRef = useRef(null);
  const noticeTimer = useRef(null);

  const showNotice = (message, type = "success") => {
    clearTimeout(noticeTimer.current);
    setNotice({ message, type });
    noticeTimer.current = setTimeout(() => {
      setNotice(null);
    }, 3200);
  };

  // Fetch all testimonials from backend
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const result = await res.json();
      if (result.success) {
        setTestimonials(result.data);
      } else {
        showNotice(result.message || "Failed to load testimonials", "error");
      }
    } catch {
      showNotice("Cannot connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    return () => clearTimeout(noticeTimer.current);
  }, []);

  const publishedCount = testimonials.filter(
    (item) => item.status === "Published"
  ).length;
  const unpublishedCount = testimonials.length - publishedCount;

  const filteredTestimonials = useMemo(() => {
    const query = search.trim().toLowerCase();
    return testimonials.filter((item) => {
      const matchesFilter =
        activeFilter === "All" || item.status === activeFilter;
      const matchesSearch =
        !query ||
        item.parent?.toLowerCase().includes(query) ||
        item.designation?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [testimonials, search, activeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredTestimonials.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      showNotice("Upload a JPG, PNG or WebP image.", "error");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotice("Image size must be less than 5 MB.", "error");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parent = form.parent.trim();
    const message = form.message.trim();

    if (!parent || !message) {
      showNotice("Please fill in all required fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("parent", parent);
    formData.append("designation", form.designation.trim() || "Parent");
    formData.append("message", message);
    formData.append("rating", form.rating);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else if (!previewUrl && editingId) {
      formData.append("removeExistingPhoto", "true");
    }

    try {
      setIsSubmitting(true);
      const endpoint = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        showNotice(result.message || "Operation failed", "error");
        return;
      }

      if (editingId) {
        setTestimonials((prev) =>
          prev.map((item) => (item._id === editingId ? result.data : item))
        );
        showNotice("Testimonial updated successfully.");
      } else {
        setTestimonials((prev) => [result.data, ...prev]);
        setActiveFilter("All");
        setSearch("");
        setCurrentPage(1);
        showNotice("Testimonial added as unpublished.");
      }

      resetForm();
    } catch {
      showNotice("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      parent: item.parent,
      designation: item.designation || "",
      message: item.message,
      rating: item.rating || 5,
    });

    setPreviewUrl(item.photo ? `${API_BASE_URL}${item.photo}` : "");
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`${API_URL}/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setTestimonials((prev) =>
          prev.filter((item) => item._id !== deleteTarget._id)
        );
        if (editingId === deleteTarget._id) {
          resetForm();
        }
        showNotice("Testimonial deleted successfully.");
      } else {
        showNotice(result.message || "Failed to delete.", "error");
      }
    } catch {
      showNotice("Network error during deletion.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
      });
      const result = await response.json();

      if (result.success) {
        setTestimonials((prev) =>
          prev.map((item) => (item._id === id ? result.data : item))
        );
        showNotice(result.message);
      } else {
        showNotice(result.message || "Failed to update status.", "error");
      }
    } catch {
      showNotice("Network error updating status.", "error");
    }
  };

  const downloadCSV = () => {
    const escapeCSV = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Parent", "Designation", "Testimonial", "Rating", "Status", "Date"],
      ...filteredTestimonials.map((item) => [
        item.parent,
        item.designation,
        item.message,
        item.rating,
        item.status,
        item.date,
      ]),
    ];

    const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "testimonials.csv";
    link.click();
    URL.revokeObjectURL(url);
    showNotice("CSV export downloaded.");
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const getImageUrl = (photoPath) => {
    if (!photoPath) return "";
    return photoPath.startsWith("http") ? photoPath : `${API_BASE_URL}${photoPath}`;
  };

  return (
    <div className="Testimonial">
      {notice && (
        <div
          className={`Testimonial-toast Testimonial-toast--${notice.type}`}
          role="status"
        >
          <span className="Testimonial-toastIcon">
            {notice.type === "error" ? "!" : "✓"}
          </span>
          <span>{notice.message}</span>
          <button
            type="button"
            className="Testimonial-toastClose"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="Testimonial-layout">
        <aside className="Testimonial-formCard">
          <div className="Testimonial-formHeading">
            <div className="Testimonial-headingIcon">☏</div>
            <div>
              <h2>{editingId !== null ? "Edit Testimonial" : "Add New Testimonial"}</h2>
              <p>
                {editingId !== null
                  ? "Update parent feedback"
                  : "Share a parent's experience"}
              </p>
            </div>
          </div>

          <form className="Testimonial-form" onSubmit={handleSubmit}>
            <div className="Testimonial-field">
              <label htmlFor="Testimonial-parent">
                Parent Name <span>*</span>
              </label>
              <div className="Testimonial-inputWrap">
                <span className="Testimonial-fieldIcon">♙</span>
                <input
                  id="Testimonial-parent"
                  type="text"
                  placeholder="Enter parent name"
                  value={form.parent}
                  onChange={(e) => updateForm("parent", e.target.value)}
                  maxLength={80}
                  required
                />
              </div>
            </div>

            <div className="Testimonial-field">
              <label htmlFor="Testimonial-designation">
                Designation <small>(Optional)</small>
              </label>
              <div className="Testimonial-inputWrap">
                <span className="Testimonial-fieldIcon">▱</span>
                <input
                  id="Testimonial-designation"
                  type="text"
                  placeholder="e.g. Parent, Mother, Father"
                  value={form.designation}
                  onChange={(e) => updateForm("designation", e.target.value)}
                  maxLength={60}
                />
              </div>
            </div>

            <div className="Testimonial-field">
              <label>
                Rating <span>*</span>
              </label>
              <div className="Testimonial-ratingPicker" role="radiogroup">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`Testimonial-ratingStar ${
                      star <= form.rating ? "is-active" : ""
                    }`}
                    onClick={() => updateForm("rating", star)}
                    role="radio"
                    aria-checked={form.rating === star}
                  >
                    ★
                  </button>
                ))}
                <span className="Testimonial-ratingValue">
                  {form.rating}/5
                </span>
              </div>
            </div>

            <div className="Testimonial-field">
              <label htmlFor="Testimonial-message">
                Testimonial Message <span>*</span>
              </label>
              <div className="Testimonial-textareaWrap">
                <textarea
                  id="Testimonial-message"
                  placeholder="Write testimonial message here..."
                  value={form.message}
                  onChange={(e) => updateForm("message", e.target.value)}
                  maxLength={500}
                  rows={5}
                  required
                />
                <span className="Testimonial-charCount">
                  {form.message.length}/500
                </span>
              </div>
            </div>

            <div className="Testimonial-field">
              <label>Upload Photo <small>(Optional)</small></label>
              <input
                ref={fileInputRef}
                className="Testimonial-fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
              />

              <button
                type="button"
                className={`Testimonial-uploadBox ${
                  previewUrl ? "has-preview" : ""
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  const transfer = new DataTransfer();
                  transfer.items.add(file);
                  if (fileInputRef.current) {
                    fileInputRef.current.files = transfer.files;
                    fileInputRef.current.dispatchEvent(
                      new Event("change", { bubbles: true })
                    );
                  }
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Selected parent"
                    className="Testimonial-uploadPreview"
                  />
                ) : (
                  <span className="Testimonial-uploadIcon">⇧</span>
                )}
                <strong>
                  {previewUrl ? "Change photo" : "Click to upload"}
                </strong>
                {!previewUrl && <span>or drag and drop</span>}
                <small>PNG, JPG, JPEG, WebP (Max 5MB)</small>
              </button>

              {previewUrl && (
                <button
                  type="button"
                  className="Testimonial-removePhoto"
                  onClick={() => {
                    setPreviewUrl("");
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove photo
                </button>
              )}
            </div>

            <div className="Testimonial-formActions">
              <button
                type="submit"
                className="Testimonial-submitButton"
                disabled={isSubmitting}
              >
                <span>{editingId !== null ? "✓" : "➤"}</span>
                {isSubmitting
                  ? "Saving..."
                  : editingId !== null
                  ? "Save Changes"
                  : "Submit Testimonial"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="Testimonial-cancelEdit"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="Testimonial-formNote">
            <span>✦</span>
            New testimonials are saved as unpublished until you publish them.
          </div>
        </aside>

        <main className="Testimonial-mainCard">
          <div className="Testimonial-topHeader">
            <div className="Testimonial-titleGroup">
              <div className="Testimonial-headingIcon">☏</div>
              <div>
                <h1>Testimonials</h1>
                <p>Manage parent reviews</p>
              </div>
            </div>

            <div className="Testimonial-searchWrap">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search testimonials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search testimonials"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="Testimonial-toolbar">
            <div className="Testimonial-tabs" role="tablist">
              {[
                { label: "All", count: testimonials.length },
                { label: "Published", count: publishedCount },
                { label: "Unpublished", count: unpublishedCount },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === tab.label}
                  className={`Testimonial-tab ${
                    activeFilter === tab.label ? "is-active" : ""
                  }`}
                  onClick={() => setActiveFilter(tab.label)}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="Testimonial-toolbarActions">
              <button
                type="button"
                className="Testimonial-iconButton"
                onClick={() => {
                  fetchTestimonials();
                  showNotice("List refreshed.");
                }}
                title="Refresh list"
              >
                ↻
              </button>
              <button
                type="button"
                className="Testimonial-exportButton"
                onClick={downloadCSV}
              >
                ⇩ <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="Testimonial-tableWrap">
            <table className="Testimonial-table">
              <thead>
                <tr>
                  <th className="Testimonial-numberCol">Sl. No.</th>
                  <th className="Testimonial-parentCol">Parent</th>
                  <th className="Testimonial-messageCol">Testimonial</th>
                  <th className="Testimonial-ratingCol">Rating</th>
                  <th className="Testimonial-statusCol">Status</th>
                  <th className="Testimonial-actionCol">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                      Loading testimonials...
                    </td>
                  </tr>
                ) : currentItems.map((item, index) => (
                  <tr key={item._id}>
                    <td className="Testimonial-numberCell">
                      {startIndex + index + 1}
                    </td>

                    <td>
                      <div className="Testimonial-parentInfo">
                        {item.photo ? (
                          <img
                            src={getImageUrl(item.photo)}
                            alt={item.parent}
                            className="Testimonial-avatar"
                          />
                        ) : (
                          <div
                            className={`Testimonial-avatar Testimonial-avatar--${
                              index % 4
                            }`}
                          >
                            {initials(item.parent)}
                          </div>
                        )}

                        <div className="Testimonial-parentDetails">
                          <strong>{item.parent}</strong>
                          <span>{item.designation || "Parent"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="Testimonial-messageCell">
                        {item.message}
                      </div>
                    </td>

                    <td>
                      <div
                        className="Testimonial-tableRating"
                        aria-label={`${item.rating} out of 5 stars`}
                      >
                        {"★".repeat(item.rating || 5)}
                        <span>{"★".repeat(5 - (item.rating || 5))}</span>
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`Testimonial-statusBadge ${
                          item.status === "Published"
                            ? "is-published"
                            : "is-unpublished"
                        }`}
                        onClick={() => toggleStatus(item._id)}
                        title="Click to toggle status"
                      >
                        <span />
                        {item.status}
                      </button>
                    </td>

                    <td>
                      <div className="Testimonial-rowActions">
                        <button
                          type="button"
                          className="Testimonial-actionButton Testimonial-editButton"
                          onClick={() => handleEdit(item)}
                          title="Edit testimonial"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="Testimonial-actionButton Testimonial-deleteButton"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete testimonial"
                        >
                          ♜
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && currentItems.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="Testimonial-emptyState">
                        <span>⌕</span>
                        <strong>No testimonials found</strong>
                        <p>Try a different search or select another status.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="Testimonial-pagination">
            <p>
              Showing{" "}
              <strong>
                {filteredTestimonials.length === 0 ? 0 : startIndex + 1}–
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  filteredTestimonials.length
                )}
              </strong>{" "}
              of <strong>{filteredTestimonials.length}</strong> testimonials
            </p>

            <div className="Testimonial-paginationControls">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ‹ <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`Testimonial-pageNumber ${
                    safePage === p ? "is-active" : ""
                  }`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <span>Next</span> ›
              </button>
            </div>
          </div>
        </main>
      </div>

      {deleteTarget && (
        <div
          className="Testimonial-modalOverlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <section
            className="Testimonial-deleteModal"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="Testimonial-deleteIcon">!</div>
            <h2>Delete Testimonial?</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.parent}</strong>'s testimonial? This action
              cannot be undone.
            </p>

            <div className="Testimonial-modalActions">
              <button
                type="button"
                className="Testimonial-modalCancel"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="Testimonial-modalDelete"
                onClick={confirmDelete}
              >
                Delete Testimonial
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Testimonial;