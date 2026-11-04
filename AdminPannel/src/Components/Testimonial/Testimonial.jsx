import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./Testimonial.css";
import API from "../../api/axios";

const ITEMS_PER_PAGE = 4;

const emptyForm = {
  name: "",
  location: "",
  message: "",
  rating: 5,
};

const Testimonial = () => {
  /* ================= STATES ================= */

  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState(null);

  const noticeTimer = useRef(null);

  /* ================= NOTIFICATIONS ================= */

  const showNotice = useCallback((message, type = "success") => {
    clearTimeout(noticeTimer.current);

    setNotice({
      message,
      type,
    });

    noticeTimer.current = setTimeout(() => {
      setNotice(null);
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(noticeTimer.current);
    };
  }, []);

  /* ================= API: FETCH TESTIMONIALS ================= */

  const fetchTestimonials = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        /*
          GET:
          http://localhost:5000/api/testimonials

          Returns all published and unpublished records.
        */

        const response = await API.get("/testimonials");

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Unable to fetch testimonials."
          );
        }

        const records = response.data?.data;

        setTestimonials(
          Array.isArray(records) ? records : []
        );
      } catch (error) {
        console.error(
          "Fetch testimonials error:",
          error.response?.data || error.message
        );

        showNotice(
          error.response?.data?.message ||
            error.message ||
            "Unable to load testimonials.",
          "error"
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [showNotice]
  );

  /* Load data when admin page opens */

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  /* ================= COUNTS ================= */

  const publishedCount = testimonials.filter(
    (item) => item.status === "Published"
  ).length;

  const unpublishedCount = testimonials.filter(
    (item) => item.status === "Unpublished"
  ).length;

  /* ================= SEARCH AND FILTER ================= */

  const filteredTestimonials = useMemo(() => {
    const query = search.trim().toLowerCase();

    return testimonials.filter((item) => {
      const matchesFilter =
        activeFilter === "All" ||
        item.status === activeFilter;

      const matchesSearch =
        !query ||
        (item.name || "").toLowerCase().includes(query) ||
        (item.location || "").toLowerCase().includes(query) ||
        (item.message || "").toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [testimonials, search, activeFilter]);

  /* ================= PAGINATION ================= */

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

  /* ================= FORM HELPERS ================= */

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  /* ================= API: ADD / UPDATE ================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      message: form.message.trim(),
      rating: Number(form.rating),
    };

    /* Frontend validation */

    if (!payload.name || !payload.location || !payload.message) {
      showNotice(
        "Please fill in all required fields.",
        "error"
      );
      return;
    }

    if (payload.message.length < 10) {
      showNotice(
        "Testimonial must contain at least 10 characters.",
        "error"
      );
      return;
    }

    if (payload.message.length > 500) {
      showNotice(
        "Testimonial cannot exceed 500 characters.",
        "error"
      );
      return;
    }

    if (
      !Number.isInteger(payload.rating) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      showNotice(
        "Please select a valid rating.",
        "error"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      let response;

      if (editingId) {
        /*
          UPDATE:
          PUT /api/testimonials/:id
        */

        response = await API.put(
          `/testimonials/${editingId}`,
          payload
        );
      } else {
        /*
          CREATE:
          POST /api/testimonials

          Backend automatically saves as Unpublished.
        */

        response = await API.post(
          "/testimonials",
          payload
        );
      }

      if (!response.data?.success || !response.data?.data) {
        throw new Error(
          response.data?.message ||
            "Unable to save testimonial."
        );
      }

      const savedTestimonial = response.data.data;

      if (editingId) {
        setTestimonials((previous) =>
          previous.map((item) =>
            item._id === editingId
              ? savedTestimonial
              : item
          )
        );

        showNotice(
          "Testimonial updated successfully."
        );
      } else {
        setTestimonials((previous) => [
          savedTestimonial,
          ...previous,
        ]);

        setActiveFilter("All");
        setSearch("");
        setCurrentPage(1);

        showNotice(
          "Testimonial added successfully."
        );
      }

      resetForm();
    } catch (error) {
      console.error(
        "Save testimonial error:",
        error.response?.data || error.message
      );

      showNotice(
        error.response?.data?.message ||
          error.message ||
          "Unable to save testimonial.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= EDIT TESTIMONIAL ================= */

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      name: item.name || "",
      location: item.location || "",
      message: item.message || "",
      rating: Number(item.rating) || 5,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= API: DELETE TESTIMONIAL ================= */

  const confirmDelete = async () => {
    if (!deleteTarget?._id || deleting) return;

    try {
      setDeleting(true);

      /*
        DELETE:
        DELETE /api/testimonials/:id
      */

      const response = await API.delete(
        `/testimonials/${deleteTarget._id}`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to delete testimonial."
        );
      }

      setTestimonials((previous) =>
        previous.filter(
          (item) => item._id !== deleteTarget._id
        )
      );

      if (editingId === deleteTarget._id) {
        resetForm();
      }

      showNotice(
        response.data?.message ||
          "Testimonial deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete testimonial error:",
        error.response?.data || error.message
      );

      showNotice(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete testimonial.",
        "error"
      );
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* ================= API: PUBLISH / UNPUBLISH ================= */

  const toggleStatus = async (item) => {
    if (!item?._id || updatingStatus === item._id) {
      return;
    }

    const nextStatus =
      item.status === "Published"
        ? "Unpublished"
        : "Published";

    try {
      setUpdatingStatus(item._id);

      /*
        PATCH:
        PATCH /api/testimonials/:id/status

        Body:
        { status: "Published" }
      */

      const response = await API.patch(
        `/testimonials/${item._id}/status`,
        {
          status: nextStatus,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to update testimonial status."
        );
      }

      const updatedTestimonial = response.data.data;

      if (!updatedTestimonial) {
        throw new Error(
          "The server did not return the updated testimonial."
        );
      }

      setTestimonials((previous) =>
        previous.map((row) =>
          row._id === item._id
            ? updatedTestimonial
            : row
        )
      );

      showNotice(
        `Testimonial ${nextStatus.toLowerCase()} successfully.`
      );
    } catch (error) {
      console.error(
        "Update testimonial status error:",
        error.response?.data || error.message
      );

      showNotice(
        error.response?.data?.message ||
          error.message ||
          "Unable to update status.",
        "error"
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  /* ================= CSV EXPORT ================= */

  const downloadCSV = () => {
    if (filteredTestimonials.length === 0) {
      showNotice(
        "No testimonials available to export.",
        "error"
      );
      return;
    }

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      [
        "Name",
        "Location",
        "Testimonial",
        "Rating",
        "Status",
        "Date",
      ],

      ...filteredTestimonials.map((item) => [
        item.name,
        item.location,
        item.message,
        item.rating,
        item.status,
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
      ]),
    ];

    const csv = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "testimonials.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showNotice("CSV export downloaded.");
  };

  /* ================= INITIALS ================= */

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  /* ================= JSX ================= */

  return (
    <div className="Testimonial">

      {/* Notification */}

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

        {/* ================= FORM ================= */}

        <aside className="Testimonial-formCard">

          <div className="Testimonial-formHeading">

            <div className="Testimonial-headingIcon">
              ☏
            </div>

            <div>
              <h2>
                {editingId
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </h2>

              <p>
                {editingId
                  ? "Update customer feedback"
                  : "Share a customer's experience"}
              </p>
            </div>

          </div>

          <form
            className="Testimonial-form"
            onSubmit={handleSubmit}
          >

            {/* Name */}

            <div className="Testimonial-field">
              <label htmlFor="Testimonial-name">
                Name <span>*</span>
              </label>

              <div className="Testimonial-inputWrap">

                <span className="Testimonial-fieldIcon">
                  ♙
                </span>

                <input
                  id="Testimonial-name"
                  type="text"
                  placeholder="Enter name"
                  value={form.name}
                  onChange={(event) =>
                    updateForm("name", event.target.value)
                  }
                  maxLength={80}
                  required
                />

              </div>
            </div>

            {/* Location */}

            <div className="Testimonial-field">
              <label htmlFor="Testimonial-location">
                Location <span>*</span>
              </label>

              <div className="Testimonial-inputWrap">

                <span className="Testimonial-fieldIcon">
                  ⌖
                </span>

                <input
                  id="Testimonial-location"
                  type="text"
                  placeholder="Enter city or location"
                  value={form.location}
                  onChange={(event) =>
                    updateForm("location", event.target.value)
                  }
                  maxLength={100}
                  required
                />

              </div>
            </div>

            {/* Rating */}

            <div className="Testimonial-field">
              <label>
                Rating <span>*</span>
              </label>

              <div
                className="Testimonial-ratingPicker"
                role="radiogroup"
                aria-label="Select rating"
              >

                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`Testimonial-ratingStar ${
                      star <= form.rating ? "is-active" : ""
                    }`}
                    onClick={() =>
                      updateForm("rating", star)
                    }
                    role="radio"
                    aria-checked={form.rating === star}
                    aria-label={`${star} star`}
                  >
                    ★
                  </button>
                ))}

                <span className="Testimonial-ratingValue">
                  {form.rating}/5
                </span>

              </div>
            </div>

            {/* Message */}

            <div className="Testimonial-field">
              <label htmlFor="Testimonial-message">
                Testimonial Message <span>*</span>
              </label>

              <div className="Testimonial-textareaWrap">

                <textarea
                  id="Testimonial-message"
                  placeholder="Write testimonial message here..."
                  value={form.message}
                  onChange={(event) =>
                    updateForm("message", event.target.value)
                  }
                  maxLength={500}
                  rows={5}
                  required
                />

                <span className="Testimonial-charCount">
                  {form.message.length}/500
                </span>

              </div>
            </div>

            {/* Form Actions */}

            <div className="Testimonial-formActions">

              <button
                type="submit"
                className="Testimonial-submitButton"
                disabled={isSubmitting}
              >
                <span>
                  {editingId ? "✓" : "➤"}
                </span>

                {isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Submit Testimonial"}
              </button>

              {editingId && (
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

        {/* ================= TABLE ================= */}

        <main className="Testimonial-mainCard">

          {/* Header */}

          <div className="Testimonial-topHeader">

            <div className="Testimonial-titleGroup">

              <div className="Testimonial-headingIcon">
                ☏
              </div>

              <div>
                <h1>Testimonials</h1>
                <p>Manage customer reviews</p>
              </div>

            </div>

            <div className="Testimonial-searchWrap">

              <span>⌕</span>

              <input
                type="search"
                placeholder="Search name, location or message..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                aria-label="Search testimonials"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}

            </div>

          </div>

          {/* Toolbar */}

          <div className="Testimonial-toolbar">

            <div
              className="Testimonial-tabs"
              role="tablist"
            >

              {[
                {
                  label: "All",
                  count: testimonials.length,
                },
                {
                  label: "Published",
                  count: publishedCount,
                },
                {
                  label: "Unpublished",
                  count: unpublishedCount,
                },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === tab.label}
                  className={`Testimonial-tab ${
                    activeFilter === tab.label
                      ? "is-active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveFilter(tab.label)
                  }
                >
                  {tab.label} ({tab.count})
                </button>
              ))}

            </div>

            <div className="Testimonial-toolbarActions">

              {/* Refresh from MongoDB */}

              <button
                type="button"
                className="Testimonial-iconButton"
                onClick={() => fetchTestimonials()}
                disabled={loading}
                title="Refresh list"
              >
                ↻
              </button>

              {/* CSV Export */}

              <button
                type="button"
                className="Testimonial-exportButton"
                onClick={downloadCSV}
              >
                ⇩ <span>Export CSV</span>
              </button>

            </div>

          </div>

          {/* ================= TABLE DATA ================= */}

          <div className="Testimonial-tableWrap">

            <table className="Testimonial-table">

              <thead>
                <tr>

                  <th className="Testimonial-numberCol">
                    Sl. No.
                  </th>

                  <th className="Testimonial-parentCol">
                    Name & Location
                  </th>

                  <th className="Testimonial-messageCol">
                    Testimonial
                  </th>

                  <th className="Testimonial-ratingCol">
                    Rating
                  </th>

                  <th className="Testimonial-statusCol">
                    Status
                  </th>

                  <th className="Testimonial-actionCol">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {/* Loading */}

                {loading && (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      Loading testimonials...
                    </td>
                  </tr>
                )}

                {/* Data */}

                {!loading &&
                  currentItems.map((item, index) => {
                    const rating = Math.min(
                      5,
                      Math.max(1, Number(item.rating) || 5)
                    );

                    return (
                      <tr key={item._id}>

                        {/* Serial number */}

                        <td className="Testimonial-numberCell">
                          {startIndex + index + 1}
                        </td>

                        {/* Name and location */}

                        <td>
                          <div className="Testimonial-parentInfo">

                            <div
                              className={`Testimonial-avatar Testimonial-avatar--${
                                index % 4
                              }`}
                            >
                              {initials(item.name)}
                            </div>

                            <div className="Testimonial-parentDetails">

                              <strong>{item.name}</strong>

                              <span>
                                <span aria-hidden="true">
                                  ⌖{" "}
                                </span>
                                {item.location}
                              </span>

                            </div>

                          </div>
                        </td>

                        {/* Message */}

                        <td>
                          <div className="Testimonial-messageCell">
                            {item.message}
                          </div>
                        </td>

                        {/* Rating */}

                        <td>
                          <div
                            className="Testimonial-tableRating"
                            aria-label={`${rating} out of 5 stars`}
                          >
                            {"★".repeat(rating)}

                            <span>
                              {"★".repeat(5 - rating)}
                            </span>
                          </div>
                        </td>

                        {/* Status */}

                        <td>
                          <button
                            type="button"
                            className={`Testimonial-statusBadge ${
                              item.status === "Published"
                                ? "is-published"
                                : "is-unpublished"
                            }`}
                            onClick={() => toggleStatus(item)}
                            disabled={updatingStatus === item._id}
                            title={
                              item.status === "Published"
                                ? "Click to Unpublish"
                                : "Click to Publish"
                            }
                          >
                            <span />

                            {updatingStatus === item._id
                              ? "Updating..."
                              : item.status}
                          </button>
                        </td>

                        {/* Actions */}

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
                    );
                  })}

                {/* Empty state */}

                {!loading && currentItems.length === 0 && (
                  <tr>
                    <td colSpan="6">

                      <div className="Testimonial-emptyState">
                        <span>⌕</span>

                        <strong>
                          No testimonials found
                        </strong>

                        <p>
                          Add a testimonial or try a different search.
                        </p>
                      </div>

                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* ================= PAGINATION ================= */}

          <div className="Testimonial-pagination">

            <p>
              Showing{" "}

              <strong>
                {filteredTestimonials.length === 0
                  ? 0
                  : startIndex + 1}
                –
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  filteredTestimonials.length
                )}
              </strong>{" "}

              of{" "}

              <strong>
                {filteredTestimonials.length}
              </strong>{" "}

              testimonials
            </p>

            <div className="Testimonial-paginationControls">

              <button
                type="button"
                disabled={safePage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
              >
                ‹ <span>Previous</span>
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`Testimonial-pageNumber ${
                    safePage === page ? "is-active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
              >
                <span>Next</span> ›
              </button>

            </div>

          </div>

        </main>

      </div>

      {/* ================= DELETE MODAL ================= */}

      {deleteTarget && (
        <div
          className="Testimonial-modalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteTarget(null);
            }
          }}
        >

          <section
            className="Testimonial-deleteModal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="Testimonial-delete-title"
          >

            <div className="Testimonial-deleteIcon">
              !
            </div>

            <h2 id="Testimonial-delete-title">
              Delete Testimonial?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>'s testimonial?
              This action cannot be undone.
            </p>

            <div className="Testimonial-modalActions">

              <button
                type="button"
                className="Testimonial-modalCancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="Testimonial-modalDelete"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Testimonial"}
              </button>

            </div>

          </section>

        </div>
      )}

    </div>
  );
};

export default Testimonial;