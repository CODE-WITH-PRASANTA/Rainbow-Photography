
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  CalendarDays,
  MessageSquare,
  ClipboardList,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import API from "../../api/axios";
import "./Enquiry.css";

/* =========================================
   ENQUIRY MANAGEMENT COMPONENT
========================================= */

const Enquiry = () => {
  /* ---------- States ---------- */

  const [enquiries, setEnquiries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [modalType, setModalType] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const initialForm = {
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialForm);

  /* ---------- Helper Functions ---------- */

  const getId = (item) => item?._id || item?.id;

  const getName = (item) =>
    item?.name || item?.fullName || "—";

  const getEmail = (item) =>
    item?.email || item?.emailId || "—";

  const getPhone = (item) =>
    item?.phone || item?.mobile || item?.phoneNumber || "—";

  const getEvent = (item) =>
    item?.eventType || item?.event || item?.service || "Other";

  const getMessage = (item) =>
    item?.message || item?.massage || "—";

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getApiError = (err, fallback) => {
    return (
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  };

  /* =========================================
     FETCH ENQUIRIES FROM MONGODB
  ========================================= */

  const getEnquiries = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccessMessage("");

      // GET http://localhost:5000/api/enquiries
      const response = await API.get("/enquiries");

      const result = response.data;

      const list = Array.isArray(result)
        ? result
        : result?.data ||
          result?.enquiries ||
          result?.results ||
          [];

      if (!Array.isArray(list)) {
        throw new Error("Invalid enquiry data received from server.");
      }

      // Latest enquiries first
      const sortedList = [...list].sort((a, b) => {
        return (
          new Date(b.createdAt || b.date || 0).getTime() -
          new Date(a.createdAt || a.date || 0).getTime()
        );
      });

      setEnquiries(sortedList);
    } catch (err) {
      console.error("Fetch enquiries error:", err);

      setError(
        getApiError(
          err,
          "Unable to load enquiries. Please check your backend connection."
        )
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* ---------- Initial API Call ---------- */

  useEffect(() => {
    getEnquiries();
  }, [getEnquiries]);

  /* =========================================
     EVENT TYPE FILTER
  ========================================= */

  const eventTypes = useMemo(() => {
    const types = enquiries
      .map((item) => getEvent(item))
      .filter((type) => type && type !== "—");

    return ["All", ...new Set(types)];
  }, [enquiries]);

  /* =========================================
     SEARCH AND FILTER
  ========================================= */

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries.filter((item) => {
      const searchableText = [
        getName(item),
        getEmail(item),
        getPhone(item),
        getEvent(item),
        getMessage(item),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);

      const matchesEvent =
        eventFilter === "All" ||
        getEvent(item) === eventFilter;

      return matchesSearch && matchesEvent;
    });
  }, [enquiries, search, eventFilter]);

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnquiries.length / itemsPerPage)
  );

  const currentEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, eventFilter, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =========================================
     VIEW ENQUIRY
  ========================================= */

  const openViewModal = (item) => {
    setActiveEnquiry(item);
    setModalType("view");
    setError("");
  };

  /* =========================================
     EDIT ENQUIRY
  ========================================= */

  const openEditModal = (item) => {
    setActiveEnquiry(item);

    setFormData({
      name: getName(item) === "—" ? "" : getName(item),
      email: getEmail(item) === "—" ? "" : getEmail(item),
      phone: getPhone(item) === "—" ? "" : getPhone(item),
      eventType: getEvent(item) === "—" ? "" : getEvent(item),
      message: getMessage(item) === "—" ? "" : getMessage(item),
    });

    setModalType("edit");
    setError("");
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const closeModal = () => {
    if (saving) return;

    setModalType("");
    setActiveEnquiry(null);
    setFormData(initialForm);
  };

  /* =========================================
     HANDLE FORM INPUT
  ========================================= */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     UPDATE ENQUIRY IN MONGODB
  ========================================= */

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!activeEnquiry || saving) return;

    const id = getId(activeEnquiry);

    if (!id) {
      setError("Enquiry ID is missing.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      eventType: formData.eventType.trim(),
      message: formData.message.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.eventType ||
      !payload.message
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // PUT http://localhost:5000/api/enquiries/:id
      const response = await API.put(
        `/enquiries/${id}`,
        payload
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Unable to update enquiry."
        );
      }

      // Use the updated document returned by backend.
      const updatedItem = response.data?.data || {
        ...activeEnquiry,
        ...payload,
      };

      setEnquiries((previous) =>
        previous.map((item) =>
          getId(item) === id ? updatedItem : item
        )
      );

      setModalType("");
      setActiveEnquiry(null);
      setFormData(initialForm);

      setSuccessMessage("Enquiry updated successfully.");

      // Reload from MongoDB to keep the table in sync.
      await getEnquiries(true);
    } catch (err) {
      console.error("Update enquiry error:", err);

      setError(
        getApiError(
          err,
          "Unable to update enquiry. Please try again."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     DELETE ENQUIRY FROM MONGODB
  ========================================= */

  const handleDelete = async (item) => {
    const id = getId(item);

    if (!id || deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the enquiry from ${getName(item)}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccessMessage("");

      // DELETE http://localhost:5000/api/enquiries/:id
      const response = await API.delete(`/enquiries/${id}`);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Unable to delete enquiry."
        );
      }

      setEnquiries((previous) =>
        previous.filter((enquiry) => getId(enquiry) !== id)
      );

      if (
        activeEnquiry &&
        getId(activeEnquiry) === id
      ) {
        setActiveEnquiry(null);
        setModalType("");
      }

      setSuccessMessage("Enquiry deleted successfully.");
    } catch (err) {
      console.error("Delete enquiry error:", err);

      setError(
        getApiError(
          err,
          "Unable to delete enquiry. Please try again."
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    setSearch("");
    setEventFilter("All");
    setCurrentPage(1);
  };

  /* =========================================
     RENDER COMPONENT
  ========================================= */

  return (
    <div className="Enquiry-page">

      {/* ---------- Header ---------- */}

      <div className="Enquiry-header">

        <div className="Enquiry-heading">

          <span className="Enquiry-heading-icon">
            <ClipboardList size={22} />
          </span>

          <div>
            <h2>Enquiry Management</h2>
            <p>
              Manage and respond to website contact form enquiries.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="Enquiry-refresh-btn"
          onClick={() => getEnquiries(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing || loading ? "Enquiry-spinning" : ""
            }
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* ---------- Success Message ---------- */}

      {successMessage && (
        <div className="Enquiry-success-message">
          <span>{successMessage}</span>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Close success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ---------- Error Message ---------- */}

      {error && (
        <div className="Enquiry-error">
          <AlertCircle size={17} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ---------- Statistics ---------- */}

      <div className="Enquiry-stats">

        <div className="Enquiry-stat-card">

          <div className="Enquiry-stat-icon Enquiry-stat-blue">
            <ClipboardList size={21} />
          </div>

          <div>
            <span>Total Enquiries</span>
            <h3>{enquiries.length}</h3>
          </div>

        </div>

        <div className="Enquiry-stat-card">

          <div className="Enquiry-stat-icon Enquiry-stat-green">
            <MessageSquare size={21} />
          </div>

          <div>
            <span>Filtered Results</span>
            <h3>{filteredEnquiries.length}</h3>
          </div>

        </div>

      </div>

      {/* ---------- Main Content ---------- */}

      <div className="Enquiry-content">

        {/* ---------- Toolbar ---------- */}

        <div className="Enquiry-toolbar">

          <div className="Enquiry-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}

          </div>

          <div className="Enquiry-toolbar-right">

            <div className="Enquiry-filter">

              <select
                value={eventFilter}
                onChange={(event) =>
                  setEventFilter(event.target.value)
                }
                aria-label="Filter by event type"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Event Types" : type}
                  </option>
                ))}
              </select>

            </div>

            <button
              type="button"
              className="Enquiry-clear-btn"
              onClick={clearFilters}
              title="Clear all filters"
            >
              <RotateCcw size={15} />
              Clear
            </button>

          </div>

        </div>

        {/* ---------- Table ---------- */}

        <div className="Enquiry-table-wrapper">

          <table className="Enquiry-table">

            <thead>
              <tr>
                <th>SL. No.</th>
                <th>Contact Name</th>
                <th>Email ID</th>
                <th>Phone Number</th>
                <th>Event Type</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {/* Loading */}

              {loading ? (
                <tr>
                  <td colSpan="8" className="Enquiry-table-message">

                    <RefreshCw
                      size={22}
                      className="Enquiry-spinning"
                    />

                    <span>Loading enquiries from database...</span>

                  </td>
                </tr>

              ) : currentEnquiries.length === 0 ? (

                /* Empty State */

                <tr>
                  <td colSpan="8" className="Enquiry-table-message">

                    <ClipboardList size={30} />

                    <span>No enquiries found.</span>

                    <small>
                      New contact form submissions will appear here.
                    </small>

                  </td>
                </tr>

              ) : (

                /* Enquiry Records */

                currentEnquiries.map((item, index) => {

                  const id = getId(item);

                  return (
                    <tr key={id || index}>

                      <td className="Enquiry-serial">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      {/* Name */}

                      <td>
                        <div className="Enquiry-person">

                          <span className="Enquiry-avatar">
                            {getName(item).charAt(0).toUpperCase()}
                          </span>

                          <strong>{getName(item)}</strong>

                        </div>
                      </td>

                      {/* Email */}

                      <td>
                        <span className="Enquiry-email">
                          {getEmail(item)}
                        </span>
                      </td>

                      {/* Phone */}

                      <td>{getPhone(item)}</td>

                      {/* Event Type */}

                      <td>
                        <span className="Enquiry-event-badge">
                          {getEvent(item)}
                        </span>
                      </td>

                      {/* Message */}

                      <td>
                        <span
                          className="Enquiry-message-cell"
                          title={getMessage(item)}
                        >
                          {getMessage(item)}
                        </span>
                      </td>

                      {/* Date */}

                      <td>
                        {formatDate(item.createdAt || item.date)}
                      </td>

                      {/* Actions */}

                      <td>

                        <div className="Enquiry-actions">

                          <button
                            type="button"
                            className="Enquiry-action-btn Enquiry-view-btn"
                            title="View enquiry"
                            aria-label="View enquiry"
                            onClick={() => openViewModal(item)}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="Enquiry-action-btn Enquiry-edit-btn"
                            title="Edit enquiry"
                            aria-label="Edit enquiry"
                            onClick={() => openEditModal(item)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="Enquiry-action-btn Enquiry-delete-btn"
                            title="Delete enquiry"
                            aria-label="Delete enquiry"
                            disabled={deletingId === id}
                            onClick={() => handleDelete(item)}
                          >
                            {deletingId === id ? (
                              <RefreshCw
                                size={15}
                                className="Enquiry-spinning"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

        {/* ---------- Pagination ---------- */}

        <div className="Enquiry-pagination">

          <div className="Enquiry-pagination-info">
            Showing{" "}

            <strong>
              {filteredEnquiries.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </strong>

            {" "}to{" "}

            <strong>
              {Math.min(
                currentPage * itemsPerPage,
                filteredEnquiries.length
              )}
            </strong>

            {" "}of{" "}

            <strong>{filteredEnquiries.length}</strong>

            {" "}enquiries
          </div>

          <div className="Enquiry-pagination-controls">

            <select
              value={itemsPerPage}
              onChange={(event) =>
                setItemsPerPage(Number(event.target.value))
              }
              aria-label="Rows per page"
            >
              <option value={5}>5 / page</option>
              <option value={8}>8 / page</option>
              <option value={15}>15 / page</option>
              <option value={25}>25 / page</option>
            </select>

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="Enquiry-page-number">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* =========================================
          VIEW AND EDIT MODAL
      ========================================= */}

      {modalType && activeEnquiry && (

        <div
          className="Enquiry-modal-overlay"
          onMouseDown={closeModal}
        >

          <div
            className="Enquiry-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="Enquiry-modal-header">

              <div>

                <h3>
                  {modalType === "view"
                    ? "Enquiry Details"
                    : "Edit Enquiry"}
                </h3>

                <p>
                  {modalType === "view"
                    ? "Complete contact form information"
                    : "Update the submitted enquiry information"}
                </p>

              </div>

              <button
                type="button"
                className="Enquiry-modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

            </div>

            {/* ---------- View Details ---------- */}

            {modalType === "view" ? (

              <div className="Enquiry-view-details">

                <div className="Enquiry-detail-item">

                  <span>
                    <ClipboardList size={16} />
                    Contact Name
                  </span>

                  <strong>{getName(activeEnquiry)}</strong>

                </div>

                <div className="Enquiry-detail-item">

                  <span>
                    <Mail size={16} />
                    Email ID
                  </span>

                  <strong>{getEmail(activeEnquiry)}</strong>

                </div>

                <div className="Enquiry-detail-item">

                  <span>
                    <Phone size={16} />
                    Phone Number
                  </span>

                  <strong>{getPhone(activeEnquiry)}</strong>

                </div>

                <div className="Enquiry-detail-item">

                  <span>
                    <CalendarDays size={16} />
                    Event Type
                  </span>

                  <strong>{getEvent(activeEnquiry)}</strong>

                </div>

                <div className="Enquiry-detail-item Enquiry-detail-message">

                  <span>
                    <MessageSquare size={16} />
                    Message
                  </span>

                  <p>{getMessage(activeEnquiry)}</p>

                </div>

                <div className="Enquiry-detail-item">

                  <span>Submitted On</span>

                  <strong>
                    {formatDate(
                      activeEnquiry.createdAt || activeEnquiry.date
                    )}
                  </strong>

                </div>

                <div className="Enquiry-modal-footer">

                  <button
                    type="button"
                    className="Enquiry-modal-primary"
                    onClick={closeModal}
                  >
                    Close
                  </button>

                </div>

              </div>

            ) : (

              /* ---------- Edit Form ---------- */

              <form
                className="Enquiry-edit-form"
                onSubmit={handleUpdate}
              >

                <div className="Enquiry-form-grid">

                  {/* Name */}

                  <label>
                    Contact Name *

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter contact name"
                      minLength={2}
                      maxLength={100}
                      required
                    />

                  </label>

                  {/* Email */}

                  <label>
                    Email ID *

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      maxLength={150}
                      required
                    />

                  </label>

                  {/* Phone */}

                  <label>
                    Phone Number *

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />

                  </label>

                  {/* Event Type */}

                  <label>
                    Event Type *

                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Event Type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Cinematic Film">Cinematic Film</option>
                      <option value="Birthday / Party">
                        Birthday / Party
                      </option>
                      <option value="Other">Other</option>
                    </select>

                  </label>

                  {/* Message */}

                  <label className="Enquiry-form-full">
                    Message *

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Enter enquiry message"
                      rows="5"
                      minLength={3}
                      maxLength={3000}
                      required
                    />

                  </label>

                </div>

                {/* Form Error */}

                {error && (
                  <div className="Enquiry-form-error">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* Modal Footer */}

                <div className="Enquiry-modal-footer">

                  <button
                    type="button"
                    className="Enquiry-modal-secondary"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="Enquiry-modal-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <RefreshCw
                          size={15}
                          className="Enquiry-spinning"
                        />
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>

                </div>

              </form>

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default Enquiry;
