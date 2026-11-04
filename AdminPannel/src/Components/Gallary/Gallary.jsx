import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Images,
  Image as ImageIcon,
  Upload,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Camera,
  Eye,
  Heart,
  FolderOpen,
  Loader2,
  RefreshCw,
} from "lucide-react";

import API from "../../api/axios";
import "./Gallary.css";

const ITEMS_PER_PAGE = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const SERVER_URL = (
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
).replace(/\/$/, "");

const CATEGORY_OPTIONS = {
  "Maternity Shoot": [
    "Engagement",
    "Mehendi",
    "Haldi",
    "Marriage",
    "Reception",
  ],

  "Birthday Special": [
    "Cake Smash",
    "Kids Party",
    "Themed Decor",
    "Family Moments",
  ],

  "Baby Shoot": [
    "Newborn",
    "Sitter (6-9M)",
    "Themes & Props",
    "Family Cuddles",
  ],

  "Advertise Shoot": [
    "Product & Packshot",
    "Fashion & Lookbook",
    "Brand Commercial",
    "Editorial & Print",
    "Corporate & Lifestyle",
  ],

  "Pre Wedding and Post Wedding Shoot": [
    "Pre-Wedding",
    "Post-Wedding",
    "Destinations",
    "Sunset & Candids",
    "Heritage & Royal",
  ],
};

// ========================================
// IMAGE URL HELPER
// ========================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${SERVER_URL}/${image.replace(/^\/+/, "")}`;
};

// ========================================
// GALLERY COMPONENT
// ========================================

const Gallary = () => {
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingId, setEditingId] = useState(null);

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");

  // ========================================
  // CLEAR LOCAL PREVIEW
  // ========================================

  const clearLocalPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  };

  // ========================================
  // FETCH GALLERY FROM BACKEND
  // ========================================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await API.get("/gallery");

      if (response.data.success) {
        setImages(response.data.data || []);
      } else {
        setError("Unable to load gallery images.");
      }
    } catch (err) {
      console.error("FETCH GALLERY ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to the gallery server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // ========================================
  // AUTO CLEAR FEEDBACK
  // ========================================

  useEffect(() => {
    if (!message && !error) return;

    const timer = window.setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [message, error]);

  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {
    clearLocalPreview();

    setForm({
      title: "",
      category: "",
      subCategory: "",
    });

    setEditingId(null);
    setPreview("");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ========================================
  // FILTER IMAGES
  // ========================================

  const filteredImages = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return images;

    return images.filter((item) =>
      `${item.title} ${item.category} ${
        item.subCategory || ""
      }`
        .toLowerCase()
        .includes(query)
    );
  }, [images, search]);

  // ========================================
  // PAGINATION
  // ========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredImages.length / ITEMS_PER_PAGE)
  );

  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredImages.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredImages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ========================================
  // CATEGORY CHANGE
  // ========================================

  const handleCategoryChange = (category) => {
    setForm((previous) => ({
      ...previous,
      category,
      subCategory: "",
    }));
  };

  // ========================================
  // IMAGE CHANGE
  // ========================================

  const handleImageChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be 5MB or less.");
      return;
    }

    clearLocalPreview();

    const objectUrl = URL.createObjectURL(file);

    previewUrlRef.current = objectUrl;

    setImageFile(file);
    setPreview(objectUrl);

    setError("");
    setMessage("");
  };

  // ========================================
  // REMOVE PREVIEW
  // ========================================

  const handleRemovePreview = (event) => {
    event.stopPropagation();

    clearLocalPreview();

    setPreview("");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ========================================
  // CREATE / UPDATE IMAGE
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Please enter an image title.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.subCategory) {
      setError("Please select a sub category.");
      return;
    }

    if (!editingId && !imageFile) {
      setError("Please upload an image.");
      return;
    }

    if (!editingId && !preview) {
      setError("Please upload an image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setSubmitting(true);

      let response;

      if (editingId) {
        response = await API.put(
          `/gallery/${editingId}`,
          formData
        );
      } else {
        response = await API.post("/gallery", formData);
      }

      if (response.data.success) {
        setMessage(response.data.message);

        resetForm();

        await fetchGallery();

        setCurrentPage(1);
      }
    } catch (err) {
      console.error("SAVE GALLERY ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save gallery image."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // EDIT IMAGE
  // ========================================

  const handleEdit = (item) => {
    clearLocalPreview();

    setEditingId(item._id);

    setForm({
      title: item.title || "",
      category: item.category || "",
      subCategory: item.subCategory || "",
    });

    setPreview(getImageUrl(item.image));
    setImageFile(null);

    setError("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // DELETE IMAGE
  // ========================================

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await API.delete(
        `/gallery/${deleteId}`
      );

      if (response.data.success) {
        if (editingId === deleteId) {
          resetForm();
        }

        if (lightboxImage?._id === deleteId) {
          setLightboxImage(null);
        }

        setDeleteId(null);

        setMessage(response.data.message);

        await fetchGallery();
      }
    } catch (err) {
      console.error("DELETE GALLERY ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete gallery image."
      );

      setDeleteId(null);
    }
  };

  // ========================================
  // PAGINATION ACTION
  // ========================================

  const goToPage = (page) => {
    setCurrentPage(
      Math.min(Math.max(page, 1), totalPages)
    );
  };

  const firstItem = filteredImages.length
    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
    : 0;

  const lastItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredImages.length
  );

  // ========================================
  // JSX
  // ========================================

  return (
    <main className="Gallary-page">

      {/* HEADER */}

      <header className="Gallary-heading">

        <div className="Gallary-heading-left">

          <div className="Gallary-heading-icon">
            <Images size={25} />
          </div>

          <div>
            <h1 className="Gallary-title">
              Gallery Management
            </h1>

            <p className="Gallary-subtitle">
              Organise your photography portfolio by category
              and sub category.
            </p>
          </div>

        </div>

        <div className="Gallary-breadcrumb">
          <Camera size={18} />
          <span>/</span>
          <span>Gallery</span>
        </div>

      </header>

      {/* FEEDBACK */}

      {(message || error) && (
        <div
          className={`Gallary-feedback ${
            error
              ? "Gallary-feedback-error"
              : "Gallary-feedback-success"
          }`}
          role="status"
        >
          <span>{error || message}</span>

          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => {
              setMessage("");
              setError("");
            }}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* CONTENT */}

      <div className="Gallary-content-grid">

        {/* FORM */}

        <section className="Gallary-card Gallary-form-card">

          <div className="Gallary-card-heading">

            <span className="Gallary-card-icon">
              <ImageIcon size={22} />
            </span>

            <div>
              <h2>
                {editingId
                  ? "Edit Gallery Image"
                  : "Add New Image"}
              </h2>

              <p className="Gallary-card-description">
                Add an image and assign its shoot category.
              </p>
            </div>

          </div>

          <form
            className="Gallary-form"
            onSubmit={handleSubmit}
          >

            {/* TITLE */}

            <div className="Gallary-field">

              <label htmlFor="Gallary-title-input">
                Image Title{" "}
                <span className="Gallary-required">*</span>
              </label>

              <input
                id="Gallary-title-input"
                className="Gallary-input"
                type="text"
                placeholder="Enter image title"
                value={form.title}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                maxLength={100}
                required
              />

            </div>

            {/* CATEGORY */}

            <div className="Gallary-field">

              <label htmlFor="Gallary-category-select">
                Category{" "}
                <span className="Gallary-required">*</span>
              </label>

              <div className="Gallary-select-wrap">

                <select
                  id="Gallary-category-select"
                  className="Gallary-input Gallary-select"
                  value={form.category}
                  onChange={(event) =>
                    handleCategoryChange(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Select shoot category
                  </option>

                  {Object.keys(CATEGORY_OPTIONS).map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  )}

                </select>

                <ChevronDown
                  size={18}
                  className="Gallary-select-chevron"
                />

              </div>

            </div>

            {/* SUBCATEGORY */}

            {form.category && (

              <div className="Gallary-field Gallary-subcategory-field">

                <div className="Gallary-subcategory-label-row">

                  <label htmlFor="Gallary-subcategory-select">
                    Sub Category{" "}
                    <span className="Gallary-required">*</span>
                  </label>

                  <span className="Gallary-dynamic-label">
                    Options for {form.category}
                  </span>

                </div>

                <div className="Gallary-select-wrap">

                  <select
                    id="Gallary-subcategory-select"
                    className="Gallary-input Gallary-select"
                    value={form.subCategory}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        subCategory: event.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">
                      Select sub category
                    </option>

                    {CATEGORY_OPTIONS[form.category].map(
                      (subCategory) => (
                        <option
                          key={subCategory}
                          value={subCategory}
                        >
                          {subCategory}
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown
                    size={18}
                    className="Gallary-select-chevron"
                  />

                </div>

                <div className="Gallary-subcategory-chips">

                  {CATEGORY_OPTIONS[form.category].map(
                    (subCategory) => (
                      <span
                        key={subCategory}
                        className={
                          form.subCategory === subCategory
                            ? "Gallary-subcategory-chip Gallary-subcategory-chip-active"
                            : "Gallary-subcategory-chip"
                        }
                      >
                        {subCategory}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

            {/* IMAGE UPLOAD */}

            <div className="Gallary-field Gallary-upload-field">

              <label htmlFor="Gallary-image-file">
                Upload Image{" "}
                <span className="Gallary-required">
                  {editingId ? "" : "*"}
                </span>
              </label>

              <input
                ref={fileInputRef}
                id="Gallary-image-file"
                className="Gallary-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(event) =>
                  handleImageChange(event.target.files?.[0])
                }
              />

              <div
                className={`Gallary-upload-box ${
                  preview
                    ? "Gallary-upload-box-has-image"
                    : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={(event) => {
                  event.preventDefault();
                  handleImageChange(
                    event.dataTransfer.files?.[0]
                  );
                }}
              >

                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Selected gallery preview"
                      className="Gallary-upload-preview"
                    />

                    <div className="Gallary-upload-overlay">
                      <Upload size={18} />
                      <span>Choose a different image</span>
                    </div>

                    <button
                      type="button"
                      className="Gallary-remove-preview"
                      aria-label="Remove selected image"
                      onClick={handleRemovePreview}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="Gallary-upload-prompt">

                    <span className="Gallary-upload-cloud">
                      <Upload size={30} />
                    </span>

                    <p>
                      <strong>Click to upload</strong>{" "}
                      or drag and drop
                    </p>

                    <span>
                      PNG, JPG, JPEG, WEBP (Max 5MB)
                    </span>

                  </div>
                )}

              </div>

            </div>

            {/* SELECTED FILE */}

            {imageFile && (
              <div className="Gallary-selected-file">
                <Check size={15} />
                <span>{imageFile.name}</span>
              </div>
            )}

            {/* ACTIONS */}

            <div className="Gallary-form-actions">

              <button
                type="submit"
                className="Gallary-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2
                    size={19}
                    className="Gallary-loading-icon"
                  />
                ) : editingId ? (
                  <Check size={19} />
                ) : (
                  <Upload size={19} />
                )}

                {submitting
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Add Image"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="Gallary-cancel-btn"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}

            </div>

            <p className="Gallary-storage-note">
              <Heart size={13} />
              Images are securely uploaded to your server
              and stored in MongoDB.
            </p>

          </form>

        </section>

        {/* GALLERY TABLE */}

        <section className="Gallary-card Gallary-table-card">

          <div className="Gallary-table-heading">

            <div className="Gallary-card-heading Gallary-table-title-wrap">

              <span className="Gallary-card-icon">
                <FolderOpen size={22} />
              </span>

              <div>
                <h2>Gallery Images</h2>

                <p className="Gallary-count">
                  {images.length} images in your gallery
                </p>
              </div>

            </div>

            <div className="Gallary-search-wrap">

              <Search
                size={19}
                className="Gallary-search-icon"
              />

              <input
                className="Gallary-search-input"
                type="search"
                placeholder="Search title, category..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                aria-label="Search gallery images"
              />

            </div>

          </div>

          {/* TABLE */}

          <div className="Gallary-table-scroll">

            <table className="Gallary-table">

              <thead>
                <tr>
                  <th className="Gallary-col-number">
                    Sl. No.
                  </th>

                  <th>Image Details</th>

                  <th className="Gallary-col-action">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td colSpan="3">
                      <div className="Gallary-empty-state">
                        <Loader2
                          size={30}
                          className="Gallary-loading-icon"
                        />
                        <strong>Loading gallery...</strong>
                      </div>
                    </td>
                  </tr>

                ) : paginatedImages.length > 0 ? (

                  paginatedImages.map((item, index) => (

                    <tr key={item._id}>

                      <td className="Gallary-number-cell">
                        {firstItem + index}
                      </td>

                      <td>

                        <div className="Gallary-image-cell">

                          <button
                            type="button"
                            className="Gallary-thumbnail-button"
                            onClick={() =>
                              setLightboxImage(item)
                            }
                            aria-label={`Preview ${item.title}`}
                          >
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.title}
                              className="Gallary-thumbnail"
                              loading="lazy"
                            />

                            <span className="Gallary-thumbnail-hover">
                              <Eye size={18} />
                            </span>
                          </button>

                          <div className="Gallary-image-meta">

                            <strong>{item.title}</strong>

                            <span className="Gallary-category-tag">
                              {item.category}
                            </span>

                            <span className="Gallary-subcategory-tag">
                              {item.subCategory}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <div className="Gallary-action-group">

                          <button
                            type="button"
                            className="Gallary-action-btn Gallary-edit-btn"
                            onClick={() => handleEdit(item)}
                            title="Edit image"
                            aria-label={`Edit ${item.title}`}
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            className="Gallary-action-btn Gallary-delete-btn"
                            onClick={() => setDeleteId(item._id)}
                            title="Delete image"
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="3">

                      <div className="Gallary-empty-state">

                        <ImageIcon size={28} />

                        <strong>
                          {search
                            ? "No matching images found"
                            : "Your gallery is empty"}
                        </strong>

                        <p>
                          {search
                            ? "Try another search term."
                            : "Add your first photography image using the form."}
                        </p>

                        {!search && (
                          <button
                            type="button"
                            className="Gallary-submit-btn"
                            onClick={fetchGallery}
                          >
                            <RefreshCw size={17} />
                            Refresh Gallery
                          </button>
                        )}

                      </div>

                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          <div className="Gallary-pagination">

            <p className="Gallary-pagination-info">
              Showing{" "}
              <strong>
                {firstItem}-{lastItem}
              </strong>{" "}
              of{" "}
              <strong>{filteredImages.length}</strong>{" "}
              images
            </p>

            <div
              className="Gallary-pagination-controls"
              aria-label="Gallery pagination"
            >

              <button
                type="button"
                className="Gallary-page-btn Gallary-page-arrow"
                onClick={() =>
                  goToPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={17} />
                <span>Previous</span>
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  type="button"
                  key={page}
                  className={`Gallary-page-btn Gallary-page-number ${
                    currentPage === page
                      ? "Gallary-page-active"
                      : ""
                  }`}
                  onClick={() => goToPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={
                    currentPage === page
                      ? "page"
                      : undefined
                  }
                >
                  {page}
                </button>

              ))}

              <button
                type="button"
                className="Gallary-page-btn Gallary-page-arrow"
                onClick={() =>
                  goToPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight size={17} />
              </button>

            </div>

          </div>

        </section>

      </div>

      {/* DELETE CONFIRMATION */}

      {deleteId && (

        <div
          className="Gallary-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteId(null);
            }
          }}
        >

          <div
            className="Gallary-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Gallary-delete-title"
          >

            <span className="Gallary-modal-icon">
              <Trash2 size={24} />
            </span>

            <h3 id="Gallary-delete-title">
              Delete this image?
            </h3>

            <p>
              This image will be permanently removed from
              your gallery and server storage.
            </p>

            <div className="Gallary-modal-actions">

              <button
                type="button"
                className="Gallary-modal-cancel"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="Gallary-modal-delete"
                onClick={handleDelete}
              >
                Delete Image
              </button>

            </div>

          </div>

        </div>

      )}

      {/* IMAGE LIGHTBOX */}

      {lightboxImage && (

        <div
          className="Gallary-lightbox"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLightboxImage(null);
            }
          }}
        >

          <button
            type="button"
            className="Gallary-lightbox-close"
            aria-label="Close preview"
            onClick={() => setLightboxImage(null)}
          >
            <X size={23} />
          </button>

          <div
            className="Gallary-lightbox-content"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxImage.title}
          >

            <img
              src={getImageUrl(lightboxImage.image)}
              alt={lightboxImage.title}
            />

            <div className="Gallary-lightbox-caption">

              <div>
                <strong>{lightboxImage.title}</strong>

                <span>
                  {lightboxImage.category} /{" "}
                  {lightboxImage.subCategory}
                </span>
              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
};

export default Gallary;