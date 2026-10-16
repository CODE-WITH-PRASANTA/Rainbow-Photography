import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./HomeNews.css";

/* images */
import bgFlower from "../../assets/LeftFlower-2.webp";
import headingFlower from "../../assets/TwinFlower-1.webp";
import cardFlower from "../../assets/Flower-33.webp";
import fallbackPerson from "../../assets/News-1.webp";

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/testimonials`;

const getImageUrl = (photoPath) => {
  if (!photoPath) return fallbackPerson;
  return photoPath.startsWith("http")
    ? photoPath
    : `${API_BASE_URL}${photoPath}`;
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

/* cards per page: 3 desktop, 2 tablet, 1 mobile */
const getPerPage = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
};

/* page numbers with "…" when there are many pages */
const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("left-dots");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("right-dots");

  pages.push(total);
  return pages;
};

const HomeNews = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(getPerPage());

  /* ===== FETCH ===== */
  useEffect(() => {
    const controller = new AbortController();

    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(API_URL, {
          signal: controller.signal,
        });

        if (data?.success) {
          const published = (data.data || []).filter(
            (item) => item.status === "Published"
          );
          setTestimonials(published);
        } else {
          setError(data?.message || "Failed to load testimonials.");
        }
      } catch (err) {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") return;
        setError("Unable to load testimonials right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchTestimonials();
    return () => controller.abort();
  }, []);

  /* ===== RESPONSIVE ITEMS PER PAGE ===== */
  useEffect(() => {
    const handleResize = () => setPerPage(getPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===== PAGINATION ===== */
  const totalPages = Math.max(1, Math.ceil(testimonials.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * perPage;

  const currentItems = useMemo(
    () => testimonials.slice(startIndex, startIndex + perPage),
    [testimonials, startIndex, perPage]
  );

  const pageNumbers = useMemo(
    () => getPageNumbers(safePage, totalPages),
    [safePage, totalPages]
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === safePage) return;
    setCurrentPage(page);
  };

  const showFrom = testimonials.length === 0 ? 0 : startIndex + 1;
  const showTo = Math.min(startIndex + perPage, testimonials.length);

  return (
    <section className="HomeNews">
      {/* background flowers */}
      <img src={bgFlower} className="HomeNews__bg HomeNews__bg--bottom" alt="" />
      <img src={bgFlower} className="HomeNews__bg HomeNews__bg--top" alt="" />

      {/* ===== HEADER ===== */}
      <div className="HomeNews__header">
        <span className="HomeNews__label">RECENT ARTICLES</span>
        <h2 className="HomeNews__title">News & Updates</h2>
        <img src={headingFlower} className="HomeNews__headingFlower" alt="" />
      </div>

      {/* ===== STATUS MESSAGES ===== */}
      {loading && <p className="HomeNews__status">Loading...</p>}

      {!loading && error && (
        <p className="HomeNews__status HomeNews__status--error">{error}</p>
      )}

      {!loading && !error && testimonials.length === 0 && (
        <p className="HomeNews__status">No testimonials published yet.</p>
      )}

      {/* ===== CARDS ===== */}
      {!loading && !error && testimonials.length > 0 && (
        <>
          <div className="HomeNews__grid" key={safePage}>
            {currentItems.map((item) => {
              const rating = Math.min(5, Math.max(1, item.rating || 5));
              return (
                <article className="HomeNews__card" key={item._id}>
                  {/* decorative flower */}
                  <img
                    src={cardFlower}
                    className="HomeNews__cardFlower"
                    alt=""
                  />

                  {/* top row: date + quote mark */}
                  <div className="HomeNews__top">
                    <span className="HomeNews__date">
                      {formatDate(item.date || item.createdAt)}
                    </span>
                    <span className="HomeNews__quoteMark" aria-hidden="true">
                      ”
                    </span>
                  </div>

                  {/* stars */}
                  <div
                    className="HomeNews__stars"
                    aria-label={`${rating} out of 5 stars`}
                  >
                    {"★".repeat(rating)}
                    <span>{"★".repeat(5 - rating)}</span>
                  </div>

                  {/* message */}
                  <p className="HomeNews__desc">{item.message}</p>

                  {/* author footer */}
                  <div className="HomeNews__author">
                    <img src={getImageUrl(item.photo)} alt={item.parent} />
                    <div className="HomeNews__authorInfo">
                      <h3 className="HomeNews__cardTitle">{item.parent}</h3>
                      <span className="HomeNews__role">
                        {item.designation || "Parent"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ===== PAGINATION ===== */}
          {totalPages > 1 && (
            <nav className="HomeNews__pagination" aria-label="Testimonials pages">
              <p className="HomeNews__pageInfo">
                Showing <strong>{showFrom}–{showTo}</strong> of{" "}
                <strong>{testimonials.length}</strong>
              </p>

              <div className="HomeNews__pageControls">
                <button
                  type="button"
                  className="HomeNews__pageBtn HomeNews__pageBtn--nav"
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {pageNumbers.map((p) =>
                  typeof p === "string" ? (
                    <span key={p} className="HomeNews__dots">
                      …
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={p}
                      className={`HomeNews__pageBtn ${
                        safePage === p ? "is-active" : ""
                      }`}
                      onClick={() => goToPage(p)}
                      aria-label={`Page ${p}`}
                      aria-current={safePage === p ? "page" : undefined}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="HomeNews__pageBtn HomeNews__pageBtn--nav"
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </nav>
          )}
        </>
      )}

      {/* ===== BOTTOM CTA ===== */}
      <div className="HomeNews__cta">
        <p>
          Take a look at Real Life Weddings and hints, tips and advice for
          finding the perfect wedding venue
        </p>

        <button className="HomeNews__btn">View All Venue</button>
      </div>
    </section>
  );
};

export default HomeNews;