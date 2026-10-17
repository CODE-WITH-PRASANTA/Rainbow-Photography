
import React, { useCallback, useEffect, useState } from "react";
import API, { IMG_URL } from "../../api/axios";
import "./OurOrganization.css";

const OurOrganization = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH TEAM MEMBERS FROM BACKEND
  // GET http://localhost:5000/api/team-members
  // =========================================================
  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/team-members");

      // Supports common API response formats.
      const responseData = response.data;

      const members = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(responseData?.teamMembers)
            ? responseData.teamMembers
            : Array.isArray(responseData?.data?.teamMembers)
              ? responseData.data.teamMembers
              : null;

      if (!members) {
        throw new Error(
          "Invalid team members response. Please check your backend controller."
        );
      }

      // Display active members on the public website.
      // Records without a status field are also allowed.
      const formattedMembers = members
        .filter(
          (member) =>
            member &&
            (member.status == null ||
              String(member.status).toLowerCase() === "active")
        )
        .map((member) => ({
          id: member._id || member.id,
          name: member.name || member.fullName || "Team Member",
          role:
            member.designation ||
            member.role ||
            member.position ||
            "Team Member",
          image: member.photo || member.image || member.profileImage || "",
        }));

      setTeamMembers(formattedMembers);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to fetch team members:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load team members. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // =========================================================
  // RESOLVE IMAGE URL
  // Handles absolute URLs and backend-relative image paths.
  // =========================================================
  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return "";
    }

    const imagePath = image.trim();

    if (!imagePath) {
      return "";
    }

    if (
      /^(https?:\/\/|data:|blob:)/i.test(imagePath)
    ) {
      return imagePath;
    }

    return `${IMG_URL.replace(/\/$/, "")}/${
      imagePath.replace(/^\/+/, "")
    }`;
  };

  // =========================================================
  // MOBILE SLIDER NAVIGATION
  // =========================================================
  const handlePrev = () => {
    setCurrentIndex((previous) =>
      previous === 0 ? teamMembers.length - 1 : previous - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((previous) =>
      previous === teamMembers.length - 1 ? 0 : previous + 1
    );
  };

  const getInitials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

  // =========================================================
  // REUSABLE TEAM MEMBER CARD
  // =========================================================
  const renderMemberCard = (member, index, mobile = false) => {
    const imageUrl = getImageUrl(member.image);

    return (
      <div
        className={`organizer-card${mobile ? " mobile-card" : ""}`}
        key={member.id || `${member.name}-${index}`}
      >
        <div className="diamond-wrapper">
          <div className="diamond-flip">
            <div className="diamond-face front">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={member.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="organizer-avatar-fallback">
                  {getInitials(member.name)}
                </div>
              )}
            </div>

            <div className="diamond-face back">
              <p>{member.name}</p>
            </div>
          </div>
        </div>

        <div className="member-info">
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
      </div>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <section className="organizers-section">
      {/* Premium floating luxury bubbles */}
      <div className="bubbles" aria-hidden="true">
        <span className="bubble b1" />
        <span className="bubble b2" />
        <span className="bubble b3" />
        <span className="bubble b4" />
        <span className="bubble b5" />
        <span className="bubble b6" />
        <span className="bubble b7" />
      </div>

      <div className="organizers-container">
        {/* Section heading */}
        <div className="organizers-header">
          <p className="organizers-subtitle">ORGANIZERS</p>
          <h2 className="organizers-title">Our Lovely Team</h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="organizers-message" role="status">
            <span className="organizers-loader" />
            <p>Loading our lovely team...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="organizers-message organizers-error" role="alert">
            <p>{error}</p>

            <button type="button" onClick={fetchTeamMembers}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && teamMembers.length === 0 && (
          <div className="organizers-message">
            <p>Our team members will be announced soon.</p>
          </div>
        )}

        {/* Team members */}
        {!loading && !error && teamMembers.length > 0 && (
          <>
            {/* Desktop grid */}
            <div className="organizers-grid">
              {teamMembers.map((member, index) =>
                renderMemberCard(member, index)
              )}
            </div>

            {/* Mobile slider */}
            <div className="mobile-slider">
              {teamMembers.length > 1 && (
                <button
                  type="button"
                  className="mobile-nav-btn left"
                  onClick={handlePrev}
                  aria-label="Previous team member"
                >
                  ‹
                </button>
              )}

              <div className="mobile-slider-viewport">
                <div
                  className="mobile-slider-track"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {teamMembers.map((member, index) =>
                    renderMemberCard(member, index, true)
                  )}
                </div>
              </div>

              {teamMembers.length > 1 && (
                <button
                  type="button"
                  className="mobile-nav-btn right"
                  onClick={handleNext}
                  aria-label="Next team member"
                >
                  ›
                </button>
              )}

              {teamMembers.length > 1 && (
                <div
                  className="pagination"
                  aria-label="Choose team member"
                >
                  {teamMembers.map((member, index) => (
                    <button
                      type="button"
                      key={member.id || `${member.name}-${index}`}
                      className={`pagination-item ${
                        currentIndex === index ? "active" : ""
                      }`}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Show ${member.name}`}
                      aria-current={
                        currentIndex === index ? "true" : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OurOrganization;
