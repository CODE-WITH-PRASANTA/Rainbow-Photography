
import React, { useState } from "react";
import {
  Image as ImageIcon,
  Zap,
  Box,
  Users,
  ArrowRight,
  CalendarDays,
  MoreVertical,
  X,
  Eye,
  Plus,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import "./DashboardThree.css";

const dashboardthreeGalleryData = [
  {
    id: 1,
    title: "Golden Hour Wedding",
    category: "Wedding",
    date: "Oct 14, 2026",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=85",
    description: "Beautiful wedding moments captured in warm golden light.",
  },
  {
    id: 2,
    title: "Wedding Rings",
    category: "Engagement",
    date: "Oct 13, 2026",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85",
    description: "Elegant details and timeless engagement memories.",
  },
  {
    id: 3,
    title: "Little Moments",
    category: "Newborn",
    date: "Oct 12, 2026",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=85",
    description: "Natural smiles and precious family moments.",
  },
  {
    id: 4,
    title: "Sunset Together",
    category: "Pre-Wedding",
    date: "Oct 11, 2026",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=85",
    description: "Romantic portraits in a beautiful sunset setting.",
  },
  {
    id: 5,
    title: "Forever Begins",
    category: "Wedding",
    date: "Oct 10, 2026",
    image:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=85",
    description: "A beautiful celebration of love and togetherness.",
  },
  {
    id: 6,
    title: "Golden Memories",
    category: "Couple",
    date: "Oct 09, 2026",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=600&q=85",
    description: "Candid photographs filled with emotion and warmth.",
  },
];

const dashboardthreeQuickActions = [
  {
    id: "image",
    title: "Add New Image",
    description: "Upload and manage gallery images",
    icon: ImageIcon,
    className: "dashboardthree-action-image",
  },
  {
    id: "package",
    title: "Create Package",
    description: "Add new photography package",
    icon: Box,
    className: "dashboardthree-action-package",
  },
  {
    id: "leads",
    title: "View Leads",
    description: "Check and manage potential clients",
    icon: Users,
    className: "dashboardthree-action-leads",
  },
];

const DashboardThree = ({
  onAddImage,
  onCreatePackage,
  onViewLeads,
  onViewAll,
}) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const visibleImages = showAllImages
    ? dashboardthreeGalleryData
    : dashboardthreeGalleryData.slice(0, 4);

  const handleViewAll = () => {
    const nextValue = !showAllImages;

    setShowAllImages(nextValue);
    setActiveMenu(null);

    if (onViewAll) {
      onViewAll(nextValue);
    }
  };

  const handleQuickAction = (actionId) => {
    setActionMessage("");

    const callbacks = {
      image: onAddImage,
      package: onCreatePackage,
      leads: onViewLeads,
    };

    if (callbacks[actionId]) {
      callbacks[actionId]();
      return;
    }

    const action = dashboardthreeQuickActions.find(
      (item) => item.id === actionId
    );

    setActionMessage(
      `${action.title} selected. Connect this action to your admin page or form.`
    );
  };

  const handleImageMenu = (image) => {
    setSelectedImage(image);
    setActiveMenu(null);
  };

  return (
    <section
      className="dashboardthree"
      aria-label="Recent gallery uploads and quick actions"
    >
      <div className="dashboardthree-layout">
        {/* ==================================
            RECENT GALLERY UPLOADS
        ================================== */}
        <article className="dashboardthree-panel dashboardthree-gallery-panel">
          <header className="dashboardthree-panel-header">
            <div className="dashboardthree-heading-group">
              <div className="dashboardthree-heading-icon">
                <ImageIcon size={19} strokeWidth={2} />
              </div>

              <div className="dashboardthree-heading-text">
                <h2 className="dashboardthree-panel-title">
                  Recent Gallery Uploads
                </h2>

                <p className="dashboardthree-panel-subtitle">
                  Latest images added to your gallery
                </p>
              </div>
            </div>

            <button
              type="button"
              className="dashboardthree-view-all"
              onClick={handleViewAll}
              aria-expanded={showAllImages}
            >
              {showAllImages ? "Show Less" : "View All"}

              {showAllImages ? (
                <X size={13} />
              ) : (
                <ArrowRight size={14} />
              )}
            </button>
          </header>

          {/* Gallery image cards */}
          <div
            className={`dashboardthree-gallery-grid ${
              showAllImages
                ? "dashboardthree-gallery-grid-expanded"
                : ""
            }`}
          >
            {visibleImages.map((image) => (
              <article
                className="dashboardthree-gallery-card"
                key={image.id}
              >
                <button
                  type="button"
                  className="dashboardthree-image-preview"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View ${image.title}`}
                >
                  <img
                    className="dashboardthree-gallery-image"
                    src={image.image}
                    alt={image.title}
                    loading="lazy"
                    decoding="async"
                  />

                  <span className="dashboardthree-image-overlay">
                    <span className="dashboardthree-image-eye">
                      <Eye size={17} />
                    </span>
                    <span>View image</span>
                  </span>
                </button>

                <div className="dashboardthree-gallery-info">
                  <button
                    type="button"
                    className="dashboardthree-gallery-title"
                    onClick={() => setSelectedImage(image)}
                    title={image.title}
                  >
                    {image.title}
                  </button>

                  <p className="dashboardthree-gallery-category">
                    {image.category}
                  </p>

                  <div className="dashboardthree-gallery-meta">
                    <span className="dashboardthree-gallery-date">
                      <CalendarDays size={12} />
                      {image.date}
                    </span>

                    <div className="dashboardthree-image-menu-wrapper">
                      <button
                        type="button"
                        className="dashboardthree-image-menu-button"
                        aria-label={`More options for ${image.title}`}
                        aria-expanded={activeMenu === image.id}
                        onClick={() =>
                          setActiveMenu((previous) =>
                            previous === image.id ? null : image.id
                          )
                        }
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenu === image.id && (
                        <div className="dashboardthree-image-menu">
                          <button
                            type="button"
                            onClick={() => handleImageMenu(image)}
                          >
                            <Eye size={14} />
                            View details
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard
                                ?.writeText(image.image)
                                .then(() =>
                                  setActionMessage(
                                    "Image link copied successfully."
                                  )
                                )
                                .catch(() =>
                                  setActionMessage(
                                    "Unable to copy the image link."
                                  )
                                );

                              setActiveMenu(null);
                            }}
                          >
                            <ExternalLink size={14} />
                            Copy image link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {showAllImages && (
            <div className="dashboardthree-gallery-footer">
              <CheckCircle2 size={14} />
              Showing all {dashboardthreeGalleryData.length} recent uploads
            </div>
          )}
        </article>

        {/* ==================================
            QUICK ACTIONS
        ================================== */}
        <article className="dashboardthree-panel dashboardthree-actions-panel">
          <header className="dashboardthree-panel-header">
            <div className="dashboardthree-heading-group">
              <div className="dashboardthree-heading-icon dashboardthree-zap-icon">
                <Zap size={20} strokeWidth={2.2} fill="currentColor" />
              </div>

              <div className="dashboardthree-heading-text">
                <h2 className="dashboardthree-panel-title">
                  Quick Actions
                </h2>

                <p className="dashboardthree-panel-subtitle">
                  Frequently used actions
                </p>
              </div>
            </div>
          </header>

          <div className="dashboardthree-action-list">
            {dashboardthreeQuickActions.map((action, index) => {
              const ActionIcon = action.icon;

              return (
                <button
                  key={action.id}
                  type="button"
                  className={`dashboardthree-action-card ${
                    index === 0
                      ? "dashboardthree-action-card-featured"
                      : ""
                  } ${action.className}`}
                  onClick={() => handleQuickAction(action.id)}
                >
                  <span className="dashboardthree-action-icon">
                    <ActionIcon size={19} strokeWidth={2} />
                  </span>

                  <span className="dashboardthree-action-content">
                    <span className="dashboardthree-action-title">
                      {action.title}
                    </span>

                    <span className="dashboardthree-action-description">
                      {action.description}
                    </span>
                  </span>

                  <ArrowRight
                    className="dashboardthree-action-arrow"
                    size={16}
                  />
                </button>
              );
            })}
          </div>

          {actionMessage && (
            <div
              className="dashboardthree-action-feedback"
              role="status"
            >
              <span className="dashboardthree-feedback-icon">
                <CheckCircle2 size={16} />
              </span>

              <span>{actionMessage}</span>

              <button
                type="button"
                className="dashboardthree-feedback-close"
                aria-label="Dismiss message"
                onClick={() => setActionMessage("")}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <footer className="dashboardthree-actions-footer">
            <span className="dashboardthree-footer-status-dot" />

            <span>Your studio workspace</span>

            <span className="dashboardthree-footer-divider" />

            <span>Quick access</span>
          </footer>
        </article>
      </div>

      {/* ==================================
          IMAGE DETAILS MODAL
      ================================== */}
      {selectedImage && (
        <div
          className="dashboardthree-modal-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <section
            className="dashboardthree-image-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboardthree-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dashboardthree-modal-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image details"
            >
              <X size={19} />
            </button>

            <div className="dashboardthree-modal-image-wrapper">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="dashboardthree-modal-image"
              />
            </div>

            <div className="dashboardthree-modal-content">
              <span className="dashboardthree-modal-category">
                {selectedImage.category}
              </span>

              <h2 id="dashboardthree-modal-title">
                {selectedImage.title}
              </h2>

              <p className="dashboardthree-modal-description">
                {selectedImage.description}
              </p>

              <div className="dashboardthree-modal-date">
                <CalendarDays size={15} />
                Uploaded {selectedImage.date}
              </div>

              <button
                type="button"
                className="dashboardthree-modal-done"
                onClick={() => setSelectedImage(null)}
              >
                Close Preview
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default DashboardThree;
