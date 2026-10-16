
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./TeamMember.css";

const STORAGE_KEY = "team-member-admin-v1";
const ITEMS_PER_PAGE = 6;

const initialMembers = [
  { id: 1, name: "Priya Sahu", designation: "Class Teacher", email: "priya@gmail.com", phone: "9876543210", status: "Active", photo: "" },
  { id: 2, name: "Rakesh Patra", designation: "Sports Teacher", email: "rakesh@gmail.com", phone: "9876543211", status: "Active", photo: "" },
  { id: 3, name: "Anita Das", designation: "Art Teacher", email: "anita@gmail.com", phone: "9876543212", status: "Active", photo: "" },
  { id: 4, name: "Suman Behera", designation: "Music Teacher", email: "suman@gmail.com", phone: "9876543213", status: "Inactive", photo: "" },
  { id: 5, name: "Madhuri Mohanty", designation: "Administrator", email: "madhuri@gmail.com", phone: "9876543214", status: "Active", photo: "" },
  { id: 6, name: "Arjit Kuanar", designation: "Account Manager", email: "arjit@gmail.com", phone: "9876543215", status: "Active", photo: "" },
  { id: 7, name: "Sneha Rath", designation: "Support Staff", email: "sneha@gmail.com", phone: "9876543216", status: "Active", photo: "" },
  { id: 8, name: "Karan Nayak", designation: "Support Staff", email: "karan@gmail.com", phone: "9876543217", status: "Inactive", photo: "" },
];

const emptyForm = {
  name: "",
  designation: "",
  email: "",
  phone: "",
  photo: "",
};

const TeamMember = () => {
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return initialMembers;

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialMembers;

      // Remove the old department property from saved records.
      return parsed.map(({ department, ...member }) => member);
    } catch {
      return initialMembers;
    }
  });

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const fileInputRef = useRef(null);
  const noticeTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch {
      setNotice({
        type: "error",
        message: "Browser storage is full. Try a smaller photo.",
      });
    }
  }, [members]);

  useEffect(() => {
    return () => clearTimeout(noticeTimer.current);
  }, []);

  const notify = (message, type = "success") => {
    clearTimeout(noticeTimer.current);
    setNotice({ message, type });

    noticeTimer.current = setTimeout(() => {
      setNotice(null);
    }, 3000);
  };

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

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPhotoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const readPhoto = (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      notify("Please upload a JPG, PNG or WebP image.", "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify("Photo size must not exceed 5 MB.", "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = String(reader.result);
      setPhotoPreview(image);
      updateField("photo", image);
    };

    reader.onerror = () => {
      notify("Unable to read the selected photo.", "error");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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
        member.email.toLowerCase() === email &&
        member.id !== editingId
    );

    if (duplicateEmail) {
      notify("This email address already exists.", "error");
      return;
    }

    const memberData = {
      name,
      designation,
      email,
      phone,
      photo: form.photo,
    };

    if (editingId !== null) {
      setMembers((previous) =>
        previous.map((member) =>
          member.id === editingId
            ? { ...member, ...memberData }
            : member
        )
      );

      notify("Team member updated successfully.");
    } else {
      const newMember = {
        id: Date.now(),
        ...memberData,
        status: "Active",
      };

      const nextLength = members.length + 1;

      setMembers((previous) => [...previous, newMember]);
      setActiveFilter("All");
      setSearch("");
      setCurrentPage(Math.ceil(nextLength / ITEMS_PER_PAGE));

      notify("Team member added successfully.");
    }

    resetForm();
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      designation: member.designation,
      email: member.email,
      phone: member.phone,
      photo: member.photo || "",
    });

    setPhotoPreview(member.photo || "");
    setEditingId(member.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const deletedId = deleteTarget.id;

    setMembers((previous) =>
      previous.filter((member) => member.id !== deletedId)
    );

    if (editingId === deletedId) {
      resetForm();
    }

    setDeleteTarget(null);
    notify("Team member deleted successfully.");
  };

  const toggleStatus = (id) => {
    const selected = members.find((member) => member.id === id);
    if (!selected) return;

    setMembers((previous) =>
      previous.map((member) =>
        member.id === id
          ? {
              ...member,
              status:
                member.status === "Active" ? "Inactive" : "Active",
            }
          : member
      )
    );

    notify(
      `${selected.name} marked ${
        selected.status === "Active" ? "inactive" : "active"
      }.`
    );
  };

  const refreshMembers = () => {
    setSearch("");
    setActiveFilter("All");
    setCurrentPage(1);
    notify("Team member list refreshed.");
  };

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
      rows
        .map((row) => row.map(escapeCSV).join(","))
        .join("\r\n");

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

  const initials = (name) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

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
        {/* ADD / EDIT FORM */}
        <aside className="TeamMember-formCard">
          <div className="TeamMember-formHeading">
            <div className="TeamMember-headingIcon">♟</div>

            <div>
              <h2>
                {editingId !== null
                  ? "Edit Team Member"
                  : "Add New Team Member"}
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
              <label>
                Upload Photo <small>(Optional)</small>
              </label>

              <input
                ref={fileInputRef}
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
                  onClick={() => {
                    setPhotoPreview("");
                    updateField("photo", "");

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove photo
                </button>
              )}
            </div>

            <div className="TeamMember-formActions">
              <button type="submit" className="TeamMember-submitButton">
                <span>{editingId !== null ? "✓" : "➤"}</span>
                {editingId !== null ? "Save Changes" : "Add Team Member"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="TeamMember-cancelButton"
                  onClick={resetForm}
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

        {/* TEAM MEMBERS TABLE */}
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

          {/* STATUS FILTERS */}
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
                {currentMembers.map((member, index) => (
                  <tr key={member.id}>
                    <td className="TeamMember-numberCell">
                      {startIndex + index + 1}
                    </td>

                    <td>
                      {member.photo ? (
                        <img
                          className="TeamMember-avatar"
                          src={member.photo}
                          alt={member.name}
                        />
                      ) : (
                        <div
                          className={`TeamMember-avatar TeamMember-avatar--${index % 4}`}
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
                        onClick={() => toggleStatus(member.id)}
                        title="Click to change status"
                        aria-label={`Change ${member.name} status`}
                      >
                        <span />
                        {member.status}
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
                    <td colSpan="8">
                      <div className="TeamMember-emptyState">
                        <span>⌕</span>
                        <strong>No team members found</strong>
                        <p>
                          Try another search or choose a different status.
                        </p>
                        <button type="button" onClick={refreshMembers}>
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* SIX MEMBERS PER PAGE */}
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

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
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
                )
              )}

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
              Changes saved in this browser
            </span>
          </div>
        </main>
      </div>

      {/* DELETE CONFIRMATION POPUP */}
      {deleteTarget && (
        <div
          className="TeamMember-modalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
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
              >
                Cancel
              </button>

              <button
                type="button"
                className="TeamMember-modalDelete"
                onClick={confirmDelete}
              >
                Delete Member
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default TeamMember;
