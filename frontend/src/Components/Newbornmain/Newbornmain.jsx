import React, { useEffect, useMemo, useState } from "react";
import "./Newbornmain.css";

const photos = [
  {
    id: 1,
    category: "Newborn",
    title: "Little Dreamer",
    image:
      "https://cdn.pixabay.com/photo/2020/11/24/23/26/newborn-5774107_1280.jpg",
    height: "tall",
  },
  {
    id: 2,
    category: "Twins",
    title: "Double the Love",
    image:
      "https://cdn.pixabay.com/photo/2015/05/18/16/21/babies-772439_640.jpg",
    height: "medium",
  },
  {
    id: 3,
    category: "Newborn",
    title: "Pure Innocence",
    image:
      "https://cdn.pixabay.com/photo/2023/06/11/14/38/baby-8056153_640.jpg",
    height: "short",
  },
  {
    id: 4,
    category: "Krishna Setup",
    title: "Little Sunshine",
    image:
      "https://cdn.pixabay.com/photo/2021/07/09/13/55/newborn-6399132_1280.jpg",
    height: "tall",
  },
  {
    id: 5,
    category: "Newborn",
    title: "Precious Moments",
    image:
      "https://cdn.pixabay.com/photo/2021/04/14/07/03/newborn-6177485_1280.jpg",
    height: "medium",
  },
  {
    id: 6,
    category: "Newborn",
    title: "Sweet Dreams",
    image:
      "https://images.unsplash.com/photo-1679919996303-1824ae520235?auto=format&fit=crop&w=1200&q=85",
    height: "short",
  },
  {
    id: 7,
    category: "Twins",
    title: "Together Forever",
    image:
      "https://images.unsplash.com/photo-1633611609072-9ad77e869fec?auto=format&fit=crop&w=1200&q=85",
    height: "tall",
  },
  {
    id: 8,
    category: "Krishna Setup",
    title: "Tiny Miracle",
    image:
      "https://images.unsplash.com/photo-1773243086631-962baefccd8a?auto=format&fit=crop&w=1200&q=85",
    height: "medium",
  },
  {
    id: 9,
    category: "Newborn",
    title: "Heavenly Smile",
    image:
      "https://cdn.pixabay.com/photo/2020/11/24/23/26/newborn-5774107_1280.jpg",
    height: "short",
  },
];

const categories = ["All", "Newborn", "Twins", "Krishna Setup"];

const PHOTOS_PER_PAGE = 6;

export default function Newbornmain() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") return photos;

    return photos.filter(
      (photo) => photo.category === activeCategory
    );
  }, [activeCategory]);

  const totalPages = Math.ceil(
    filteredPhotos.length / PHOTOS_PER_PAGE
  );

  const visiblePhotos = filteredPhotos.slice(
    (currentPage - 1) * PHOTOS_PER_PAGE,
    currentPage * PHOTOS_PER_PAGE
  );

  const selectedIndex = filteredPhotos.findIndex(
    (photo) => photo.id === selectedPhoto?.id
  );

  const changeCategory = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    setSelectedPhoto(null);
  };

  const showNext = () => {
    if (selectedIndex === -1) return;

    setSelectedPhoto(
      filteredPhotos[(selectedIndex + 1) % filteredPhotos.length]
    );
  };

  const showPrevious = () => {
    if (selectedIndex === -1) return;

    const previousIndex =
      (selectedIndex - 1 + filteredPhotos.length) %
      filteredPhotos.length;

    setSelectedPhoto(filteredPhotos[previousIndex]);
  };

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedPhoto(null);
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto, selectedIndex]);

  return (
    <section className="Newbornmain">
      <header className="gallery-heading">
        <span className="gallery-eyebrow">
          RAINBOW PHOTOGRAPHY
        </span>

        <h1>
          Rainbow Photography <br />
          
          <span>forever memories.</span>
        </h1>

        <p>
          Every tiny detail tells a beautiful story.
          Discover our collection of newborn portraits
          and treasured first moments.
        </p>
      </header>

      <nav className="gallery-filters" aria-label="Photo categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              activeCategory === category ? "active" : ""
            }
            onClick={() => changeCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      <div className="gallery-grid">
        {visiblePhotos.map((photo, index) => (
          <article
            key={photo.id}
            className={`gallery-card ${photo.height}`}
            style={{ "--card-index": index }}
            onClick={() => setSelectedPhoto(photo)}
            role="button"
            tabIndex={0}
            aria-label={`View ${photo.title}`}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedPhoto(photo);
              }
            }}
          >
            <img
              src={photo.image}
              alt={photo.title}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.parentElement.classList.add(
                  "image-error"
                );
              }}
            />

            <div className="gallery-card-overlay">
              <span className="gallery-card-category">
                {photo.category}
              </span>

              <h2>{photo.title}</h2>

              <span className="gallery-view">
                View photograph <span aria-hidden="true">↗</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      {visiblePhotos.length === 0 && (
        <p className="gallery-empty">No photographs found.</p>
      )}

      {totalPages > 1 && (
        <div className="gallery-pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((page) => page - 1);
              document
                .querySelector(".gallery-grid")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ← Previous
          </button>

          <div className="gallery-page-numbers">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                type="button"
                className={
                  currentPage === index + 1 ? "active" : ""
                }
                onClick={() => setCurrentPage(index + 1)}
                aria-label={`Page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((page) => page + 1);
              document
                .querySelector(".gallery-grid")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Next →
          </button>
        </div>
      )}

      {selectedPhoto && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph preview"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close photo"
          >
            &times;
          </button>

          <button
            type="button"
            className="lightbox-arrow lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous photo"
          >
            &#8249;
          </button>

          <img
            className="lightbox-image"
            src={selectedPhoto.image}
            alt={selectedPhoto.title}
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            className="lightbox-arrow lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
          >
            &#8250;
          </button>

          <div className="lightbox-caption">
            <span>{selectedPhoto.category}</span>
            <h2>{selectedPhoto.title}</h2>
            <p>
              {selectedIndex + 1} / {filteredPhotos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}