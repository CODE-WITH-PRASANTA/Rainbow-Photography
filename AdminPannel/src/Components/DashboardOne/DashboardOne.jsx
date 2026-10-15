
import React, { useState } from "react";
import {
  Image,
  Box,
  UsersRound,
  ClipboardList,
  TrendingUp,
  MoreVertical,
  X,
  ArrowUpRight,
} from "lucide-react";
import "./DashboardOne.css";

const dashboardoneStats = [
  {
    id: 1,
    title: "Total Gallery Images",
    value: "128",
    growth: "+12",
    description: "this month",
    icon: Image,
    decoration: Image,
    detail: "128 images are currently available in your photography gallery.",
  },
  {
    id: 2,
    title: "Active Packages",
    value: "8",
    growth: "+2",
    description: "this month",
    icon: Box,
    decoration: Box,
    detail: "8 photography packages are currently active.",
  },
  {
    id: 3,
    title: "New Leads",
    value: "24",
    growth: "+18.5%",
    description: "this month",
    icon: UsersRound,
    decoration: UsersRound,
    detail: "You have received 24 new potential client leads.",
  },
  {
    id: 4,
    title: "Pending Enquiries",
    value: "12",
    growth: "+3",
    description: "this month",
    icon: ClipboardList,
    decoration: ClipboardList,
    detail: "12 client enquiries are waiting for your response.",
  },
];

const DashboardOne = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);

  const handleMenu = (id) => {
    setActiveMenu((previous) => (previous === id ? null : id));
  };

  return (
    <section
      className="dashboardone"
      aria-label="Photography studio statistics"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setActiveMenu(null);
          setSelectedStat(null);
        }
      }}
    >
      <div className="dashboardone-grid">
        {dashboardoneStats.map((stat) => {
          const Icon = stat.icon;
          const Decoration = stat.decoration;

          return (
            <article
              className="dashboardone-card"
              key={stat.id}
            >
              <div className="dashboardone-card-content">
                <div className="dashboardone-icon-box">
                  <Icon
                    className="dashboardone-icon"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </div>

                <div className="dashboardone-info">
                  <h3 className="dashboardone-title">
                    {stat.title}
                  </h3>

                  <p className="dashboardone-value">
                    {stat.value}
                  </p>

                  <div className="dashboardone-growth">
                    <TrendingUp
                      className="dashboardone-growth-icon"
                      strokeWidth={2.8}
                      aria-hidden="true"
                    />

                    <span className="dashboardone-growth-number">
                      {stat.growth}
                    </span>

                    <span className="dashboardone-growth-text">
                      {stat.description}
                    </span>
                  </div>
                </div>
              </div>

              <Decoration
                className="dashboardone-decoration"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <div className="dashboardone-menu-wrapper">
                <button
                  type="button"
                  className="dashboardone-menu-button"
                  aria-label={`More options for ${stat.title}`}
                  aria-expanded={activeMenu === stat.id}
                  onClick={() => handleMenu(stat.id)}
                >
                  {activeMenu === stat.id ? (
                    <X size={17} />
                  ) : (
                    <MoreVertical size={18} />
                  )}
                </button>

                {activeMenu === stat.id && (
                  <div className="dashboardone-menu">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStat(stat);
                        setActiveMenu(null);
                      }}
                    >
                      <ArrowUpRight size={15} />
                      View details
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {selectedStat && (
        <div
          className="dashboardone-modal-overlay"
          onClick={() => setSelectedStat(null)}
        >
          <div
            className="dashboardone-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboardone-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dashboardone-modal-close"
              aria-label="Close details"
              onClick={() => setSelectedStat(null)}
            >
              <X size={19} />
            </button>

            <div className="dashboardone-modal-icon">
              {React.createElement(selectedStat.icon, {
                size: 27,
                strokeWidth: 1.8,
              })}
            </div>

            <h2
              id="dashboardone-modal-title"
              className="dashboardone-modal-title"
            >
              {selectedStat.title}
            </h2>

            <p className="dashboardone-modal-value">
              {selectedStat.value}
            </p>

            <p className="dashboardone-modal-description">
              {selectedStat.detail}
            </p>

            <div className="dashboardone-modal-growth">
              <TrendingUp size={17} />
              <span>{selectedStat.growth} {selectedStat.description}</span>
            </div>

            <button
              type="button"
              className="dashboardone-modal-done"
              onClick={() => setSelectedStat(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardOne;
