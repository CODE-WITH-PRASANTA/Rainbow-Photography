
import React, { useMemo, useState, useRef, useEffect } from "react";
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
import "./Gallary.css";

const ITEMS_PER_PAGE = 5;

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

const initialImages = [
  {
    id: 1,
    title: "Golden Hour Wedding",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    title: "Wedding Rings",
    category: "Engagement",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    title: "Little Moments",
    category: "Newborn",
    image:
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    title: "Sunset Together",
    category: "Pre-Wedding",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    title: "Floral Celebration",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1519225421980-888cb6b5f3a7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    title: "Studio Essentials",
    category: "Product",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85",
  },
];

const Gallary = () => {
  const [images, setImages] = useState(initialImages);
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

  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const resetForm = () => {
    setForm({ title: "", category: "" });
    setEditingId(null);
    setPreview("");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5MB or less.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Please enter an image title.");
      return;
    }

    const existingImage = images.find(
      (item) => item.id === editingId
    );

    const selectedImage = preview || existingImage?.image;

    if (!selectedImage) {
      setError("Please upload an image.");
      return;
    }

    const imageData = {
      id: editingId ?? Date.now(),
      title: form.title.trim(),
      category: form.category || "Other",
      image: selectedImage,
    };

    if (editingId !== null) {
      setImages((previous) =>
        previous.map((item) =>
          item.id === editingId ? imageData : item
        )
      );

      setMessage("Image updated successfully.");
    } else {
      setImages((previous) => [imageData, ...previous]);
      setCurrentPage(1);
      setMessage("Image added successfully.");
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
    });
    setPreview(item.image);
    setImageFile(null);
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = () => {
    setImages((previous) =>
      previous.filter((item) => item.id !== deleteId)
    );

    if (editingId === deleteId) {
      resetForm();
    }

    setDeleteId(null);
    setMessage("Image deleted successfully.");
  };

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

  return (
    <main className="Gallary-page">
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
        {/* ADD / EDIT FORM */}
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
                  setForm({
                    ...form,
                    title: event.target.value,
                  })
                }
                maxLength={100}
                required
              />
            </div>

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
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
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
                      onClick={(event) => {
                        event.stopPropagation();
                        setPreview("");
                        setImageFile(null);

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
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

            {imageFile && (
              <div className="Gallary-selected-file">
                <Check size={15} />
                <span>{imageFile.name}</span>
              </div>
            )}

            <div className="Gallary-form-actions">
              <button
                type="submit"
                className="Gallary-submit-btn"
              >
                {editingId !== null ? (
                  <Check size={20} />
                ) : (
                  <Upload size={20} />
                )}

                {editingId !== null
                  ? "Save Changes"
                  : "Add Image"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="Gallary-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* GALLERY TABLE */}
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
                {paginatedImages.length > 0 ? (
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
                        <strong>No images found</strong>
                        <p>
                          Try another search or add a new gallery
                          image.
                        </p>
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
              Showing <strong>{firstItem}-{lastItem}</strong>{" "}
              of <strong>{filteredImages.length}</strong> images
            </p>

            <div
              className="Gallary-pagination-controls"
              aria-label="Gallery pagination"
            >
              <button
                type="button"
                className="Gallary-page-btn Gallary-page-arrow"
                onClick={() => goToPage(currentPage - 1)}
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
                    currentPage === page ? "page" : undefined
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="Gallary-page-btn Gallary-page-arrow"
                onClick={() => goToPage(currentPage + 1)}
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
              This image will be removed from the gallery list.
              This action cannot be undone.
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

      {/* IMAGE PREVIEW */}
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
