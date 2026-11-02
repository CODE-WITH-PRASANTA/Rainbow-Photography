
import React, { useEffect, useMemo, useState, useCallback } from "react";
import API from "../../api/axios";
import "./ColdLead.css";

const STATUSES = [
  "New",
  "Contacted",
  "Follow-up",
  "Converted",
  "Not Interested",
];

const SERVICES = [
  "Wedding Photography & Cinematography",
  "Pre-Wedding & Post-Wedding Shoots",
  "Candid Photography & Drone Coverage",
  "Engagement & Ring Ceremony",
  "Reception & Sangeet Nights",
  "Maternity & Baby Portfolio",
  "Birthday & Private Event Coverage",
  "Wedding Photography",
  "Pre-Wedding Shoot",
  "Maternity Shoot",
  "Birthday Event",
  "Engagement Shoot",
];

const SOURCES = ["Website Form", "WhatsApp", "Instagram", "Other"];

const STATUS_CLASS = {
  New: "new",
  Contacted: "contacted",
  "Follow-up": "followup",
  Converted: "converted",
  "Not Interested": "not-interested",
};

const ICON_PATHS = {
  search: <>
    <circle cx="11" cy="11" r="7" />
    <path d="m16 16 4 4" />
  </>,
  calendar: <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
  </>,
  eye: <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.74 2.04Z" />,
  edit: <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
  </>,
  trash: <>
    <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
    <path d="M10 11v5M14 11v5" />
  </>,
  close: <path d="m18 6-12 12M6 6l12 12" />,
  reset: <>
    <path d="M3 12a9 9 0 0 1 15.4-6.4L21 8" />
    <path d="M21 3v5h-5M21 12a9 9 0 0 1-15.4 6.4L3 16" />
    <path d="M3 21v-5h5" />
  </>,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  globe: <>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
  </>,
  message: <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z" />,
};

function ColdLeadIcon({ name, size = 16, strokeWidth = 1.9 }) {
  return (
    <svg
      className="ColdLeadIcon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

const getId = (lead) => String(lead._id || lead.id || "");

const normalizeLead = (lead) => ({
  ...lead,
  id: getId(lead),
  name: lead.name || lead.fullName || "",
  email: lead.email || "",
  phone: lead.phone || lead.mobile || "",
  service: lead.service || "",
  eventDate: lead.eventDate
    ? String(lead.eventDate).slice(0, 10)
    : "",
  source: lead.source || "Website Form",
  status: lead.status || "New",
  createdAt: lead.createdAt || lead.submittedAt || "",
  message: lead.message || "",
});

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCreatedAt(dateString) {
  if (!dateString) return { date: "—", time: "" };

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return { date: "—", time: "" };
  }

  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function getInitials(name) {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getSourceClass(source) {
  if (source === "WhatsApp") return "whatsapp";
  if (source === "Instagram") return "instagram";
  return "website";
}

function getSourceIcon(source) {
  return source === "WhatsApp" ? "message" : "globe";
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

const ColdLead = () => {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [dateFilter, setDateFilter] = useState("All Time");

  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [modal, setModal] = useState(null);
  const [activeLead, setActiveLead] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState("");
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // FETCH LEADS FROM MONGODB
  const fetchLeads = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setPageError("");

      const response = await API.get("/cold-leads");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to fetch leads."
        );
      }

      const records = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      const normalized = records.map(normalizeLead);

      setLeads(normalized);

      // Remove selected IDs that no longer exist.
      setSelectedIds((previous) =>
        previous.filter((id) =>
          normalized.some((lead) => lead.id === id)
        )
      );
    } catch (error) {
      console.error("FETCH COLD LEADS:", error);
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ESCAPE KEY
  useEffect(() => {
    if (!modal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !actionLoading) {
        setModal(null);
        setDeleteTarget(null);
        setBulkDeleteOpen(false);
        setFormError("");
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [modal, actionLoading]);

  // FILTER LEADS
  const filteredLeads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const now = new Date();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        [
          lead.name,
          lead.email,
          lead.phone,
          lead.service,
          lead.source,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All Status" ||
        lead.status === statusFilter;

      const matchesService =
        serviceFilter === "All Services" ||
        lead.service === serviceFilter;

      let matchesDate = true;

      if (dateFilter !== "All Time") {
        const createdDate = new Date(lead.createdAt);
        const difference =
          now.getTime() - createdDate.getTime();

        const days = difference / (1000 * 60 * 60 * 24);

        if (dateFilter === "Last 7 Days") {
          matchesDate = days >= 0 && days <= 7;
        } else if (dateFilter === "Last 30 Days") {
          matchesDate = days >= 0 && days <= 30;
        } else if (dateFilter === "Last 90 Days") {
          matchesDate = days >= 0 && days <= 90;
        } else if (dateFilter === "This Year") {
          matchesDate =
            createdDate.getFullYear() === now.getFullYear();
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService &&
        matchesDate
      );
    });
  }, [
    leads,
    searchTerm,
    statusFilter,
    serviceFilter,
    dateFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / pageSize)
  );

  const currentPageLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const currentPageIds = currentPageLeads.map((lead) => lead.id);

  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  const someCurrentPageSelected = currentPageIds.some((id) =>
    selectedIds.includes(id)
  );

  const startIndex =
    filteredLeads.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endIndex = Math.min(
    currentPage * pageSize,
    filteredLeads.length
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  // RESET FILTERS
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setServiceFilter("All Services");
    setDateFilter("All Time");
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // SELECTION
  const toggleSelectAll = () => {
    setSelectedIds((previous) => {
      if (allCurrentPageSelected) {
        return previous.filter(
          (id) => !currentPageIds.includes(id)
        );
      }

      return [...new Set([...previous, ...currentPageIds])];
    });
  };

  const toggleSelectLead = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id]
    );
  };

  // MODALS
  const openViewModal = (lead) => {
    setActiveLead(lead);
    setModal("view");
  };

  const openEditModal = (lead) => {
    setActiveLead(lead);
    setEditForm({
      ...lead,
      eventDate: lead.eventDate || "",
      message: lead.message || "",
    });
    setFormError("");
    setModal("edit");
  };

  const openDeleteModal = (lead) => {
    setDeleteTarget(lead);
    setModal("delete");
  };

  const openCallModal = (lead) => {
    setActiveLead(lead);
    setModal("call");
  };

  const closeModal = () => {
    if (actionLoading) return;

    setModal(null);
    setDeleteTarget(null);
    setBulkDeleteOpen(false);
    setFormError("");
  };

  // UPDATE LEAD THROUGH AXIOS
  const saveLead = async (event) => {
    event.preventDefault();

    if (!editForm) return;

    const name = editForm.name.trim();
    const email = editForm.email.trim();
    const phone = editForm.phone.replace(/\D/g, "");
    const service = editForm.service.trim();

    if (name.length < 3) {
      setFormError("Name must contain at least 3 characters.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setFormError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!service) {
      setFormError("Please select a photography service.");
      return;
    }

    try {
      setActionLoading(true);
      setFormError("");

      const payload = {
        name,
        email,
        phone,
        service,
        eventDate: editForm.eventDate || null,
        message: editForm.message || "",
        source: editForm.source || "Website Form",
        status: editForm.status || "New",
      };

      const response = await API.put(
        `/cold-leads/${editForm.id}`,
        payload
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to update lead."
        );
      }

      const updatedLead = normalizeLead(
        response.data.data || {
          ...editForm,
          ...payload,
        }
      );

      setLeads((previous) =>
        previous.map((lead) =>
          lead.id === editForm.id ? updatedLead : lead
        )
      );

      setActiveLead(updatedLead);
      setModal(null);
      setEditForm(null);
      setFormError("");
    } catch (error) {
      console.error("UPDATE COLD LEAD:", error);
      setFormError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE SINGLE LEAD THROUGH AXIOS
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setActionLoading(true);
      setFormError("");

      await API.delete(
        `/cold-leads/${deleteTarget.id}`
      );

      setLeads((previous) =>
        previous.filter(
          (lead) => lead.id !== deleteTarget.id
        )
      );

      setSelectedIds((previous) =>
        previous.filter((id) => id !== deleteTarget.id)
      );

      setDeleteTarget(null);
      setModal(null);
    } catch (error) {
      console.error("DELETE COLD LEAD:", error);
      setFormError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  // BULK DELETE THROUGH AXIOS
  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setActionLoading(true);
      setFormError("");

      await API.delete("/cold-leads/bulk", {
        data: {
          ids: selectedIds,
        },
      });

      const deletedIds = new Set(selectedIds);

      setLeads((previous) =>
        previous.filter((lead) => !deletedIds.has(lead.id))
      );

      setSelectedIds([]);
      setBulkDeleteOpen(false);
      setModal(null);
    } catch (error) {
      console.error("BULK DELETE COLD LEADS:", error);
      setFormError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  // UPDATE STATUS THROUGH AXIOS
  const updateStatus = async (leadId, newStatus) => {
    const previousLead = leads.find(
      (lead) => lead.id === leadId
    );

    if (!previousLead || previousLead.status === newStatus) {
      return;
    }

    // Optimistic UI update
    setLeads((previous) =>
      previous.map((lead) =>
        lead.id === leadId
          ? { ...lead, status: newStatus }
          : lead
      )
    );

    setActiveLead((previous) =>
      previous?.id === leadId
        ? { ...previous, status: newStatus }
        : previous
    );

    try {
      const response = await API.patch(
        `/cold-leads/${leadId}/status`,
        { status: newStatus }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to update status."
        );
      }

      const updatedLead = normalizeLead(response.data.data);

      setLeads((previous) =>
        previous.map((lead) =>
          lead.id === leadId ? updatedLead : lead
        )
      );

      setActiveLead((previous) =>
        previous?.id === leadId ? updatedLead : previous
      );
    } catch (error) {
      console.error("UPDATE LEAD STATUS:", error);

      // Roll back if API fails
      setLeads((previous) =>
        previous.map((lead) =>
          lead.id === leadId
            ? { ...lead, status: previousLead.status }
            : lead
        )
      );

      setActiveLead((previous) =>
        previous?.id === leadId
          ? { ...previous, status: previousLead.status }
          : previous
      );

      window.alert(getErrorMessage(error));
    }
  };

  // PAGINATION
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const pageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const phoneDigits = (phone) =>
    String(phone || "").replace(/\D/g, "");

  return (
    <div className="ColdLead">
      <div className="ColdLead-breadcrumb">
        <span className="ColdLead-breadcrumb-home">⌂</span>
        <span>Workspace</span>
        <ColdLeadIcon name="chevronRight" size={12} />
        <span className="ColdLead-breadcrumb-current">
          Cold Leads
        </span>
      </div>

      <section className="ColdLead-panel">
        {/* TOOLBAR */}
        <div className="ColdLead-toolbar">
          <div className="ColdLead-search">
            <ColdLeadIcon name="search" size={19} />

            <input
              type="search"
              placeholder="Search name, email or phone..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search leads"
            />

            {searchTerm && (
              <button
                type="button"
                className="ColdLead-clear-search"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <ColdLeadIcon name="close" size={15} />
              </button>
            )}
          </div>

          <select
            className="ColdLead-filter"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
          >
            <option>All Status</option>
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>

          <select
            className="ColdLead-filter ColdLead-service-filter"
            value={serviceFilter}
            onChange={(event) => {
              setServiceFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by service"
          >
            <option>All Services</option>
            {SERVICES.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>

          <div className="ColdLead-date-filter">
            <ColdLeadIcon name="calendar" size={16} />

            <select
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by date"
            >
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
          </div>

          <button
            type="button"
            className="ColdLead-reset-button"
            onClick={resetFilters}
          >
            <ColdLeadIcon name="reset" size={15} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="ColdLead-reset-button"
            onClick={() => fetchLeads(false)}
            disabled={refreshing}
            title="Refresh leads"
          >
            <ColdLeadIcon name="reset" size={15} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {/* API ERROR */}
        {pageError && (
          <div className="ColdLead-empty">
            <strong>Unable to load leads</strong>
            <span>{pageError}</span>

            <button
              type="button"
              className="ColdLead-empty-reset"
              onClick={() => fetchLeads()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* SELECTED LEADS */}
        {!pageError && selectedIds.length > 0 && (
          <div className="ColdLead-selection-bar">
            <span>
              <strong>{selectedIds.length}</strong> lead
              {selectedIds.length !== 1 ? "s" : ""} selected
            </span>

            <button
              type="button"
              className="ColdLead-bulk-delete"
              onClick={() => {
                setBulkDeleteOpen(true);
                setFormError("");
                setModal("bulk-delete");
              }}
            >
              <ColdLeadIcon name="trash" size={15} />
              Delete Selected
            </button>

            <button
              type="button"
              className="ColdLead-clear-selection"
              onClick={() => setSelectedIds([])}
            >
              Clear selection
            </button>
          </div>
        )}

        {/* TABLE */}
        {!pageError && (
          <div className="ColdLead-table-scroll">
            <table className="ColdLead-table">
              <thead>
                <tr>
                  <th className="ColdLead-checkbox-column">
                    <input
                      type="checkbox"
                      checked={allCurrentPageSelected}
                      ref={(element) => {
                        if (element) {
                          element.indeterminate =
                            someCurrentPageSelected &&
                            !allCurrentPageSelected;
                        }
                      }}
                      onChange={toggleSelectAll}
                      aria-label="Select all leads on this page"
                    />
                  </th>

                  <th className="ColdLead-number-column">#</th>
                  <th className="ColdLead-details-column">
                    Lead Details
                  </th>
                  <th className="ColdLead-contact-column">
                    Contact
                  </th>
                  <th className="ColdLead-service-column">
                    Photography Service
                  </th>
                  <th className="ColdLead-event-column">
                    Event Date
                  </th>
                  <th className="ColdLead-source-column">
                    Lead Source
                  </th>
                  <th className="ColdLead-status-column">
                    Status
                  </th>
                  <th className="ColdLead-created-column">
                    Created At
                  </th>
                  <th className="ColdLead-action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="ColdLead-empty">
                      Loading leads from database...
                    </td>
                  </tr>
                ) : currentPageLeads.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="ColdLead-empty">
                      <div className="ColdLead-empty-icon">
                        <ColdLeadIcon name="search" size={25} />
                      </div>

                      <strong>No leads found</strong>

                      <span>
                        No matching records were found in your database.
                      </span>

                      <button
                        type="button"
                        onClick={resetFilters}
                        className="ColdLead-empty-reset"
                      >
                        Clear all filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  currentPageLeads.map((lead, index) => {
                    const created = formatCreatedAt(lead.createdAt);

                    return (
                      <tr key={lead.id}>
                        <td className="ColdLead-checkbox-column">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(lead.id)}
                            onChange={() => toggleSelectLead(lead.id)}
                            aria-label={`Select ${lead.name}`}
                          />
                        </td>

                        <td className="ColdLead-number-column">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>

                        <td className="ColdLead-details-column">
                          <div className="ColdLead-person">
                            <div
                              className={`ColdLead-avatar ColdLead-avatar-${index % 6}`}
                            >
                              {getInitials(lead.name)}
                            </div>

                            <span
                              className="ColdLead-person-name"
                              title={lead.name}
                            >
                              {lead.name}
                            </span>
                          </div>
                        </td>

                        <td className="ColdLead-contact-column">
                          <div className="ColdLead-contact">
                            <div
                              className="ColdLead-contact-line"
                              title={lead.email}
                            >
                              <span className="ColdLead-contact-icon">
                                ✉
                              </span>
                              <span>{lead.email || "—"}</span>
                            </div>

                            <div
                              className="ColdLead-contact-line"
                              title={lead.phone}
                            >
                              <ColdLeadIcon name="phone" size={12} />
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                        </td>

                        <td className="ColdLead-service-column">
                          <span className="ColdLead-service-badge">
                            <span className="ColdLead-service-symbol">
                              ◎
                            </span>
                            {lead.service}
                          </span>
                        </td>

                        <td className="ColdLead-event-column">
                          <div className="ColdLead-event-date">
                            <ColdLeadIcon name="calendar" size={13} />
                            <span>{formatDate(lead.eventDate)}</span>
                          </div>
                        </td>

                        <td className="ColdLead-source-column">
                          <span
                            className={`ColdLead-source-badge ColdLead-source-${getSourceClass(lead.source)}`}
                          >
                            <ColdLeadIcon
                              name={getSourceIcon(lead.source)}
                              size={14}
                            />
                            {lead.source}
                          </span>
                        </td>

                        <td className="ColdLead-status-column">
                          <select
                            className={`ColdLead-status-badge ColdLead-status-${STATUS_CLASS[lead.status] || "new"}`}
                            value={lead.status}
                            onChange={(event) =>
                              updateStatus(lead.id, event.target.value)
                            }
                            aria-label={`Change status for ${lead.name}`}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="ColdLead-created-column">
                          <div className="ColdLead-created">
                            <span>{created.date}</span>
                            <span>{created.time}</span>
                          </div>
                        </td>

                        <td className="ColdLead-action-column">
                          <div className="ColdLead-actions">
                            <button
                              type="button"
                              className="ColdLead-action-button ColdLead-view-button"
                              onClick={() => openViewModal(lead)}
                              title="View lead"
                              aria-label={`View ${lead.name}`}
                            >
                              <ColdLeadIcon name="eye" size={17} />
                            </button>

                            <button
                              type="button"
                              className="ColdLead-action-button ColdLead-call-button"
                              onClick={() => openCallModal(lead)}
                              title="Call lead"
                              aria-label={`Call ${lead.name}`}
                            >
                              <ColdLeadIcon name="phone" size={16} />
                            </button>

                            <button
                              type="button"
                              className="ColdLead-action-button ColdLead-edit-button"
                              onClick={() => openEditModal(lead)}
                              title="Edit lead"
                              aria-label={`Edit ${lead.name}`}
                            >
                              <ColdLeadIcon name="edit" size={16} />
                            </button>

                            <button
                              type="button"
                              className="ColdLead-action-button ColdLead-delete-button"
                              onClick={() => openDeleteModal(lead)}
                              title="Delete lead"
                              aria-label={`Delete ${lead.name}`}
                            >
                              <ColdLeadIcon name="trash" size={16} />
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
        )}

        {/* PAGINATION */}
        {!pageError && (
          <>
            <div className="ColdLead-pagination">
              <div className="ColdLead-pagination-info">
                Showing{" "}
                <strong>
                  {loading ? 0 : startIndex}–{loading ? 0 : endIndex}
                </strong>{" "}
                of <strong>{filteredLeads.length}</strong> leads

                {selectedIds.length > 0 && (
                  <span className="ColdLead-selected-count">
                    ({selectedIds.length} selected)
                  </span>
                )}
              </div>

              <div className="ColdLead-pagination-controls">
                <button
                  type="button"
                  className="ColdLead-page-navigation"
                  disabled={currentPage === 1 || loading}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  <ColdLeadIcon name="chevronLeft" size={14} />
                  Previous
                </button>

                <div className="ColdLead-page-numbers">
                  {pageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="ColdLead-page-ellipsis"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        type="button"
                        key={page}
                        className={`ColdLead-page-number ${
                          currentPage === page
                            ? "ColdLead-page-active"
                            : ""
                        }`}
                        onClick={() => goToPage(page)}
                        aria-label={`Go to page ${page}`}
                        aria-current={
                          currentPage === page ? "page" : undefined
                        }
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  className="ColdLead-page-navigation"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                  <ColdLeadIcon name="chevronRight" size={14} />
                </button>
              </div>
            </div>

            <div className="ColdLead-footer-options">
              <label htmlFor="ColdLead-page-size">
                Rows per page
              </label>

              <select
                id="ColdLead-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </>
        )}
      </section>

      {/* VIEW LEAD MODAL */}
      {modal === "view" && activeLead && (
        <div
          className="ColdLead-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="ColdLead-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ColdLead-view-title"
          >
            <div className="ColdLead-modal-header">
              <div>
                <span className="ColdLead-modal-eyebrow">
                  LEAD INFORMATION
                </span>
                <h2 id="ColdLead-view-title">Lead Details</h2>
              </div>

              <button
                type="button"
                className="ColdLead-modal-close"
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <ColdLeadIcon name="close" size={19} />
              </button>
            </div>

            <div className="ColdLead-view-person">
              <div className="ColdLead-avatar ColdLead-modal-avatar">
                {getInitials(activeLead.name)}
              </div>

              <div>
                <h3>{activeLead.name}</h3>
                <span
                  className={`ColdLead-status-badge ColdLead-status-${STATUS_CLASS[activeLead.status] || "new"}`}
                >
                  {activeLead.status}
                </span>
              </div>
            </div>

            <div className="ColdLead-detail-grid">
              <div className="ColdLead-detail-item">
                <span>Email Address</span>
                <strong>{activeLead.email || "—"}</strong>
              </div>

              <div className="ColdLead-detail-item">
                <span>Phone Number</span>
                <strong>{activeLead.phone}</strong>
              </div>

              <div className="ColdLead-detail-item">
                <span>Photography Service</span>
                <strong>{activeLead.service}</strong>
              </div>

              <div className="ColdLead-detail-item">
                <span>Event Date</span>
                <strong>{formatDate(activeLead.eventDate)}</strong>
              </div>

              <div className="ColdLead-detail-item">
                <span>Lead Source</span>
                <strong>{activeLead.source}</strong>
              </div>

              <div className="ColdLead-detail-item">
                <span>Created At</span>
                <strong>
                  {formatCreatedAt(activeLead.createdAt).date}
                </strong>
              </div>

              <div className="ColdLead-detail-item ColdLead-detail-message">
                <span>Message</span>
                <p>{activeLead.message || "No message provided."}</p>
              </div>
            </div>

            <div className="ColdLead-modal-footer">
              <button
                type="button"
                className="ColdLead-secondary-button"
                onClick={closeModal}
              >
                Close
              </button>

              <button
                type="button"
                className="ColdLead-primary-button"
                onClick={() => openEditModal(activeLead)}
              >
                <ColdLeadIcon name="edit" size={15} />
                Edit Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {modal === "edit" && editForm && (
        <div
          className="ColdLead-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <form
            className="ColdLead-modal"
            onSubmit={saveLead}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ColdLead-edit-title"
          >
            <div className="ColdLead-modal-header">
              <div>
                <span className="ColdLead-modal-eyebrow">
                  LEAD MANAGEMENT
                </span>
                <h2 id="ColdLead-edit-title">Edit Lead</h2>
              </div>

              <button
                type="button"
                className="ColdLead-modal-close"
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <ColdLeadIcon name="close" size={19} />
              </button>
            </div>

            <div className="ColdLead-form-grid">
              <label className="ColdLead-form-field">
                Full Name *
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={80}
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter full name"
                />
              </label>

              <label className="ColdLead-form-field">
                Email Address
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      email: event.target.value,
                    })
                  }
                  placeholder="Enter email address"
                />
              </label>

              <label className="ColdLead-form-field">
                Phone Number *
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={editForm.phone}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      phone: event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    })
                  }
                  placeholder="10 digit mobile number"
                />
              </label>

              <label className="ColdLead-form-field">
                Photography Service *
                <select
                  required
                  value={editForm.service}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      service: event.target.value,
                    })
                  }
                >
                  {[...new Set([...SERVICES, editForm.service])].filter(Boolean).map(
                    (service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="ColdLead-form-field">
                Event Date
                <input
                  type="date"
                  value={editForm.eventDate || ""}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      eventDate: event.target.value,
                    })
                  }
                />
              </label>

              <label className="ColdLead-form-field">
                Lead Status
                <select
                  value={editForm.status}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      status: event.target.value,
                    })
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ColdLead-form-field">
                Lead Source
                <select
                  value={editForm.source}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      source: event.target.value,
                    })
                  }
                >
                  {SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ColdLead-form-field ColdLead-form-full">
                Message
                <textarea
                  rows="3"
                  value={editForm.message || ""}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      message: event.target.value,
                    })
                  }
                  placeholder="Enter lead message"
                />
              </label>
            </div>

            {formError && (
              <p className="ColdLead-form-error" role="alert">
                {formError}
              </p>
            )}

            <div className="ColdLead-modal-footer">
              <button
                type="button"
                className="ColdLead-secondary-button"
                onClick={closeModal}
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="ColdLead-primary-button"
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CALL LEAD MODAL */}
      {modal === "call" && activeLead && (
        <div
          className="ColdLead-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="ColdLead-modal ColdLead-call-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ColdLead-call-title"
          >
            <div className="ColdLead-modal-header">
              <div>
                <span className="ColdLead-modal-eyebrow">
                  CONTACT LEAD
                </span>
                <h2 id="ColdLead-call-title">Call Lead</h2>
              </div>

              <button
                type="button"
                className="ColdLead-modal-close"
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <ColdLeadIcon name="close" size={19} />
              </button>
            </div>

            <div className="ColdLead-call-content">
              <div className="ColdLead-call-icon">
                <ColdLeadIcon name="phone" size={25} />
              </div>

              <h3>{activeLead.name}</h3>
              <p>{activeLead.phone}</p>

              <a
                className="ColdLead-primary-button ColdLead-real-call"
                href={`tel:${phoneDigits(activeLead.phone)}`}
              >
                <ColdLeadIcon name="phone" size={16} />
                Call Now
              </a>

              <a
                className="ColdLead-secondary-button ColdLead-real-call"
                href={`https://wa.me/${phoneDigits(activeLead.phone)}`}
                target="_blank"
                rel="noreferrer"
              >
                <ColdLeadIcon name="message" size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SINGLE LEAD MODAL */}
      {modal === "delete" && deleteTarget && (
        <div
          className="ColdLead-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="ColdLead-modal ColdLead-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ColdLead-delete-title"
          >
            <div className="ColdLead-confirm-icon">
              <ColdLeadIcon name="trash" size={24} />
            </div>

            <h2 id="ColdLead-delete-title">Delete Lead?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action
              cannot be undone.
            </p>

            {formError && (
              <p className="ColdLead-form-error" role="alert">
                {formError}
              </p>
            )}

            <div className="ColdLead-modal-footer">
              <button
                type="button"
                className="ColdLead-secondary-button"
                onClick={closeModal}
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ColdLead-danger-confirm"
                onClick={confirmDelete}
                disabled={actionLoading}
              >
                <ColdLeadIcon name="trash" size={15} />
                {actionLoading ? "Deleting..." : "Delete Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE MODAL */}
      {modal === "bulk-delete" && bulkDeleteOpen && (
        <div
          className="ColdLead-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="ColdLead-modal ColdLead-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ColdLead-bulk-delete-title"
          >
            <div className="ColdLead-confirm-icon">
              <ColdLeadIcon name="trash" size={24} />
            </div>

            <h2 id="ColdLead-bulk-delete-title">
              Delete Selected Leads?
            </h2>

            <p>
              You are about to delete{" "}
              <strong>{selectedIds.length}</strong> selected lead
              {selectedIds.length !== 1 ? "s" : ""}. This action
              cannot be undone.
            </p>

            {formError && (
              <p className="ColdLead-form-error" role="alert">
                {formError}
              </p>
            )}

            <div className="ColdLead-modal-footer">
              <button
                type="button"
                className="ColdLead-secondary-button"
                onClick={closeModal}
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ColdLead-danger-confirm"
                onClick={confirmBulkDelete}
                disabled={actionLoading}
              >
                <ColdLeadIcon name="trash" size={15} />
                {actionLoading ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColdLead;
