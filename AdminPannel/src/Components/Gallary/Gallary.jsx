import React, {
  useCallback,
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
} from "lucide-react";

import API, { IMG_URL } from "../../api/axios";
import "./Gallary.css";

const ITEMS_PER_PAGE = 5;
const API_URL = "/gallery";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const categories = [
  "Wedding",
  "Engagement",
  "Pre-Wedding",
  "Maternity",
  "Newborn",
  "Birthday",
  "Events",
  "Portrait",
  "Product",
  "Nature",
  "Other",
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const normalizeImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  const imageBase = String(IMG_URL || "").replace(/\/+$/, "");
  const imagePath = image.startsWith("/") ? image : `/${image}`;

  return `${imageBase}${imagePath}`;
};

const normalizeGalleryItem = (item) => ({
  ...item,
  id: item._id || item.id,
  title: item.title || "",
  category: item.category || "Other",
  image: normalizeImageUrl(item.image || item.imageUrl || item.url),
});

/* =========================================================
   GALLERY COMPONENT
========================================================= */

const Gallary = () => {
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
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
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");

  /* =========================================================
     FETCH GALLERY IMAGES
  ========================================================= */

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get(API_URL);

      const responseData = response.data;

      const galleryData = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(responseData?.gallery)
            ? responseData.gallery
            : Array.isArray(responseData?.images)
              ? responseData.images
              : [];

      setImages(galleryData.map(normalizeGalleryItem));
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Unable to load gallery images."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  /* =========================================================
     FILTER AND PAGINATION
  ========================================================= */

  const filteredImages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return images.filter((item) =>
      `${item.title} ${item.category} ${item.id}`
        .toLowerCase()
        .includes(query)
    );
  }, [images, search]);

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
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* =========================================================
     AUTO-DISMISS FEEDBACK
  ========================================================= */

  useEffect(() => {
    if (!message && !error) return undefined;

    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, error]);

  /* =========================================================
     PREVIEW URL CLEANUP
  ========================================================= */

  const clearLocalPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    clearLocalPreview();

    setForm({
      title: "",
      category: "",
    });

    setEditingId(null);
    setPreview("");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     IMAGE VALIDATION AND PREVIEW
  ========================================================= */

  const handleImageChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
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

  const handleRemovePreview = (event) => {
    event.stopPropagation();

    clearLocalPreview();

    setPreview("");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     CREATE / UPDATE GALLERY IMAGE
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Please enter an image title.");
      return;
    }

    if (form.title.trim().length > 100) {
      setError("Image title cannot exceed 100 characters.");
      return;
    }

    if (editingId === null && !imageFile) {
      setError("Please upload an image.");
      return;
    }

    if (editingId !== null && !imageFile && !preview) {
      setError("Please upload an image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("category", form.category || "Other");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    setSubmitting(true);

    try {
      let response;

      if (editingId !== null) {
        response = await API.put(
          `${API_URL}/${editingId}`,
          formData
        );
      } else {
        response = await API.post(API_URL, formData);
      }

      const responseData = response.data;

      const savedItem =
        responseData?.data ||
        responseData?.gallery ||
        responseData?.image ||
        responseData;

      if (savedItem && (savedItem._id || savedItem.id)) {
        const normalizedItem = normalizeGalleryItem(savedItem);

        if (editingId !== null) {
          setImages((previous) =>
            previous.map((item) =>
              String(item.id) === String(editingId)
                ? normalizedItem
                : item
            )
          );
        } else {
          setImages((previous) => [
            normalizedItem,
            ...previous,
          ]);

          setCurrentPage(1);
        }
      } else {
        await fetchGallery();
      }

      setMessage(
        editingId !== null
          ? "Image updated successfully."
          : "Image added successfully."
      );

      resetForm();
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          editingId !== null
            ? "Unable to update image."
            : "Unable to upload image."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     EDIT IMAGE
  ========================================================= */

  const handleEdit = (item) => {
    clearLocalPreview();

    setEditingId(item.id);

    setForm({
      title: item.title,
      category: item.category || "Other",
    });

    setPreview(item.image);
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

  /* =========================================================
     DELETE IMAGE
  ========================================================= */

  const handleDelete = async () => {
    if (deleteId === null || deleting) return;

    setDeleting(true);
    setError("");
    setMessage("");

    try {
      await API.delete(`${API_URL}/${deleteId}`);

      setImages((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(deleteId)
        )
      );

      if (String(editingId) === String(deleteId)) {
        resetForm();
      }

      if (
        lightboxImage &&
        String(lightboxImage.id) === String(deleteId)
      ) {
        setLightboxImage(null);
      }

      setDeleteId(null);
      setMessage("Image deleted successfully.");
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Unable to delete image."
        )
      );

      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     PAGINATION HELPERS
  ========================================================= */

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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="Gallary-page">
      {/* PAGE HEADER */}
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
              Add new images to your gallery and manage existing ones.
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

      <div className="Gallary-content-grid">
        {/* ===============================================
            ADD / EDIT FORM
        =============================================== */}

        <section className="Gallary-card Gallary-form-card">
          <div className="Gallary-card-heading">
            <span className="Gallary-card-icon">
              <ImageIcon size={22} />
            </span>

            <h2>
              {editingId !== null
                ? "Edit Image"
                : "Add New Image"}
            </h2>
          </div>

          <form
            className="Gallary-form"
            onSubmit={handleSubmit}
          >
            {/* IMAGE TITLE */}
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
                Category (Optional)
              </label>

              <div className="Gallary-select-wrap">
                <select
                  id="Gallary-category-select"
                  className="Gallary-input Gallary-select"
                  value={form.category}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      category: event.target.value,
                    }))
                  }
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="Gallary-select-chevron"
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="Gallary-field Gallary-upload-field">
              <label>
                Upload Image{" "}
                <span className="Gallary-required">*</span>
              </label>

              <input
                ref={fileInputRef}
                className="Gallary-file-input"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageChange(
                    event.target.files?.[0]
                  )
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
                onClick={() =>
                  fileInputRef.current?.click()
                }
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

            {/* FORM ACTIONS */}
            <div className="Gallary-form-actions">
              <button
                type="submit"
                className="Gallary-submit-btn"
                disabled={submitting}
              >
                {editingId !== null ? (
                  <Check size={20} />
                ) : (
                  <Upload size={20} />
                )}

                {submitting
                  ? "Please wait..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Add Image"}
              </button>

              {editingId !== null && (
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
          </form>
        </section>

        {/* ===============================================
            GALLERY TABLE
        =============================================== */}

        <section className="Gallary-card Gallary-table-card">
          <div className="Gallary-table-heading">
            <div className="Gallary-card-heading Gallary-table-title-wrap">
              <span className="Gallary-card-icon">
                <ImageIcon size={22} />
              </span>

              <div>
                <h2>Gallery Images</h2>

                <p className="Gallary-count">
                  {images.length} images in your gallery
                </p>
              </div>
            </div>

            {/* SEARCH */}
            <div className="Gallary-search-wrap">
              <Search
                size={19}
                className="Gallary-search-icon"
              />

              <input
                className="Gallary-search-input"
                type="search"
                placeholder="Search images..."
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

                  <th>Image</th>

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
                        <ImageIcon size={27} />
                        <strong>Loading gallery...</strong>
                        <p>Please wait while images load.</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedImages.length > 0 ? (
                  paginatedImages.map((item, index) => (
                    <tr key={item.id}>
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
                              src={item.image}
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
                            <span>{item.category}</span>
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
                            onClick={() =>
                              setDeleteId(item.id)
                            }
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
                        <ImageIcon size={27} />

                        <strong>
                          {search
                            ? "No matching images found"
                            : "No images found"}
                        </strong>

                        <p>
                          {search
                            ? "Try another search term."
                            : "Add a new gallery image to get started."}
                        </p>

                        {!search && (
                          <button
                            type="button"
                            className="Gallary-submit-btn"
                            onClick={fetchGallery}
                          >
                            <Images size={17} />
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
          {!loading && (
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
          )}
        </section>
      </div>

      {/* ===============================================
          DELETE CONFIRMATION MODAL
      =============================================== */}

      {deleteId !== null && (
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
              This image will be removed from the gallery.
              This action cannot be undone.
            </p>

            <div className="Gallary-modal-actions">
              <button
                type="button"
                className="Gallary-modal-cancel"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="Gallary-modal-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================
          IMAGE LIGHTBOX
      =============================================== */}

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
              src={lightboxImage.image}
              alt={lightboxImage.title}
            />

            <div className="Gallary-lightbox-caption">
              <strong>{lightboxImage.title}</strong>
              <span>{lightboxImage.category}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Gallary;