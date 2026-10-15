
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  MessageSquare,
  Mail,
  MoreVertical,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  X,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Check,
} from "lucide-react";
import "./DashboardTwo.css";

const dashboardtwoChartData = {
  "3": {
    label: "Last 3 Months",
    months: ["Apr", "May", "Jun"],
    values: [43, 65, 59],
  },
  "6": {
    label: "Last 6 Months",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [15, 26, 29, 43, 65, 59],
  },
  "12": {
    label: "Last 12 Months",
    months: [
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    ],
    values: [12, 18, 24, 20, 35, 28, 15, 26, 29, 43, 65, 59],
  },
};

const dashboardtwoRangeOptions = [
  { value: "3", label: "Last 3 Months", caption: "Recent activity" },
  { value: "6", label: "Last 6 Months", caption: "Half-year overview" },
  { value: "12", label: "Last 12 Months", caption: "Yearly overview" },
];

const dashboardtwoInitialEnquiries = [
  {
    id: 1,
    name: "Rohan Mehta",
    service: "Wedding Photography",
    time: "2 hours ago",
    status: "New",
    initials: "RM",
    avatar: "one",
    email: "rohan.mehta@example.com",
    phone: "+91 98765 43210",
  },
  {
    id: 2,
    name: "Priya Sharma",
    service: "Pre-Wedding Shoot",
    time: "5 hours ago",
    status: "In Progress",
    initials: "PS",
    avatar: "two",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43211",
  },
  {
    id: 3,
    name: "Amit Kumar",
    service: "Event Photography",
    time: "1 day ago",
    status: "New",
    initials: "AK",
    avatar: "three",
    email: "amit.kumar@example.com",
    phone: "+91 98765 43212",
  },
  {
    id: 4,
    name: "Sneha Patel",
    service: "Baby Photoshoot",
    time: "2 days ago",
    status: "Contacted",
    initials: "SP",
    avatar: "four",
    email: "sneha.patel@example.com",
    phone: "+91 98765 43213",
  },
];

const dashboardtwoChartWidth = 600;
const dashboardtwoChartHeight = 180;
const dashboardtwoChartMax = 80;

const dashboardtwoCreatePoints = (values) => {
  const horizontalPadding = 8;
  const plotWidth = dashboardtwoChartWidth - horizontalPadding * 2;

  return values.map((value, index) => ({
    x:
      horizontalPadding +
      (values.length === 1
        ? plotWidth / 2
        : (index / (values.length - 1)) * plotWidth),
    y:
      dashboardtwoChartHeight -
      (value / dashboardtwoChartMax) * dashboardtwoChartHeight,
    value,
  }));
};

const dashboardtwoCreateSmoothPath = (points) => {
  if (!points.length) return "";

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previous = points[index - 1];
    const middleX = (previous.x + point.x) / 2;

    return (
      path +
      ` C ${middleX} ${previous.y}, ${middleX} ${point.y}, ${point.x} ${point.y}`
    );
  }, "");
};

const DashboardTwo = () => {
  const [timeRange, setTimeRange] = useState("6");
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enquiries, setEnquiries] = useState(
    dashboardtwoInitialEnquiries
  );

  const dropdownRef = useRef(null);
  const chartRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const optionRefs = useRef([]);

  const chartData = dashboardtwoChartData[timeRange];

  const chartPoints = useMemo(
    () => dashboardtwoCreatePoints(chartData.values),
    [chartData]
  );

  const linePath = useMemo(
    () => dashboardtwoCreateSmoothPath(chartPoints),
    [chartPoints]
  );

  const areaPath = useMemo(() => {
    if (!chartPoints.length) return "";

    const firstPoint = chartPoints[0];
    const lastPoint = chartPoints[chartPoints.length - 1];

    return (
      `${linePath} L ${lastPoint.x} ${dashboardtwoChartHeight}` +
      ` L ${firstPoint.x} ${dashboardtwoChartHeight} Z`
    );
  }, [chartPoints, linePath]);

  const selectedRange = dashboardtwoRangeOptions.find(
    (option) => option.value === timeRange
  );

  const visibleEnquiries = showAll
    ? enquiries
    : enquiries.slice(0, 3);

  // Close the custom dropdown when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setActiveMenu(null);
        setSelectedEnquiry(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Open the custom dropdown and focus the selected option.
  useEffect(() => {
    if (dropdownOpen) {
      const selectedIndex = dashboardtwoRangeOptions.findIndex(
        (option) => option.value === timeRange
      );

      requestAnimationFrame(() => {
        optionRefs.current[selectedIndex]?.focus();
      });
    }
  }, [dropdownOpen, timeRange]);

  const handleRangeSelect = (value) => {
    setTimeRange(value);
    setHoveredPoint(null);
    setDropdownOpen(false);
    dropdownButtonRef.current?.focus();
  };

  // Follow the cursor and select the nearest plotted data point.
  const handleChartPointerMove = (event) => {
    if (!chartRef.current || chartPoints.length === 0) return;

    const rect = chartRef.current.getBoundingClientRect();

    if (!rect.width) return;

    const svgX =
      ((event.clientX - rect.left) / rect.width) *
      dashboardtwoChartWidth;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    chartPoints.forEach((point, index) => {
      const distance = Math.abs(point.x - svgX);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredPoint(nearestIndex);
  };

  const handleChartPointerLeave = () => {
    setHoveredPoint(null);
  };

  const handleChartKeyDown = (event) => {
    if (event.key === "Escape") {
      setHoveredPoint(null);
      return;
    }

    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      return;
    }

    event.preventDefault();

    setHoveredPoint((previous) => {
      if (previous === null) {
        return event.key === "ArrowRight"
          ? 0
          : chartPoints.length - 1;
      }

      const direction = event.key === "ArrowRight" ? 1 : -1;

      return Math.max(
        0,
        Math.min(chartPoints.length - 1, previous + direction)
      );
    });
  };

  const handleStatusChange = (id) => {
    setEnquiries((previous) =>
      previous.map((enquiry) => {
        if (enquiry.id !== id) return enquiry;

        const nextStatus =
          enquiry.status === "New"
            ? "In Progress"
            : enquiry.status === "In Progress"
              ? "Contacted"
              : "New";

        return { ...enquiry, status: nextStatus };
      })
    );

    setActiveMenu(null);
  };

  const getStatusClass = (status) =>
    `dashboardtwo-status-${status.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section
      className="dashboardtwo"
      aria-label="Gallery performance and recent enquiries"
    >
      <div className="dashboardtwo-layout">
        {/* GALLERY PERFORMANCE */}
        <article className="dashboardtwo-panel dashboardtwo-performance">
          <header className="dashboardtwo-panel-header">
            <div className="dashboardtwo-heading-group">
              <div className="dashboardtwo-heading-icon">
                <BarChart3 size={22} strokeWidth={2.1} />
              </div>

              <div className="dashboardtwo-heading-text">
                <h2 className="dashboardtwo-panel-title">
                  Gallery Performance
                </h2>
                <p className="dashboardtwo-panel-subtitle">
                  Total images uploaded over time
                </p>
              </div>
            </div>

            {/* PREMIUM CUSTOM DROPDOWN */}
            <div
              className={`dashboardtwo-range-dropdown ${
                dropdownOpen ? "dashboardtwo-range-dropdown-open" : ""
              }`}
              ref={dropdownRef}
            >
              <button
                ref={dropdownButtonRef}
                type="button"
                className="dashboardtwo-range-trigger"
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((previous) => !previous)}
                onKeyDown={(event) => {
                  if (
                    event.key === "ArrowDown" ||
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    setDropdownOpen(true);
                  }
                }}
              >
                <span className="dashboardtwo-range-trigger-icon">
                  <CalendarDays size={15} />
                </span>

                <span className="dashboardtwo-range-trigger-text">
                  <span className="dashboardtwo-range-eyebrow">
                    REPORT PERIOD
                  </span>
                  <span className="dashboardtwo-range-current">
                    {selectedRange?.label}
                  </span>
                </span>

                <ChevronDown
                  className="dashboardtwo-range-chevron"
                  size={17}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="dashboardtwo-range-menu"
                  role="listbox"
                  aria-label="Select report period"
                >
                  <div className="dashboardtwo-range-menu-heading">
                    <span>Time period</span>
                    <span className="dashboardtwo-range-menu-badge">
                      <span />
                      LIVE VIEW
                    </span>
                  </div>

                  {dashboardtwoRangeOptions.map((option, index) => (
                    <button
                      key={option.value}
                      ref={(element) => {
                        optionRefs.current[index] = element;
                      }}
                      type="button"
                      role="option"
                      aria-selected={timeRange === option.value}
                      className={`dashboardtwo-range-option ${
                        timeRange === option.value
                          ? "dashboardtwo-range-option-active"
                          : ""
                      }`}
                      onClick={() => handleRangeSelect(option.value)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();

                          optionRefs.current[
                            (index + 1) %
                              dashboardtwoRangeOptions.length
                          ]?.focus();
                        }

                        if (event.key === "ArrowUp") {
                          event.preventDefault();

                          optionRefs.current[
                            (index - 1 +
                              dashboardtwoRangeOptions.length) %
                              dashboardtwoRangeOptions.length
                          ]?.focus();
                        }

                        if (event.key === "Escape") {
                          setDropdownOpen(false);
                          dropdownButtonRef.current?.focus();
                        }
                      }}
                    >
                      <span className="dashboardtwo-range-option-icon">
                        <CalendarDays size={17} />
                      </span>

                      <span className="dashboardtwo-range-option-copy">
                        <span className="dashboardtwo-range-option-label">
                          {option.label}
                        </span>
                        <span className="dashboardtwo-range-option-caption">
                          {option.caption}
                        </span>
                      </span>

                      <span className="dashboardtwo-range-option-check">
                        {timeRange === option.value && (
                          <Check size={16} strokeWidth={2.5} />
                        )}
                      </span>
                    </button>
                  ))}

                  <div className="dashboardtwo-range-menu-footer">
                    <CheckCircle2 size={13} />
                    <span>Choose a period to update the graph</span>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* INTERACTIVE GRAPH */}
          <div className="dashboardtwo-chart-container">
            <div className="dashboardtwo-y-axis" aria-hidden="true">
              {[80, 60, 40, 20, 0].map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>

            <div className="dashboardtwo-chart-main">
              <div
                className="dashboardtwo-svg-wrapper"
                ref={chartRef}
                onPointerMove={handleChartPointerMove}
                onPointerLeave={handleChartPointerLeave}
                onKeyDown={handleChartKeyDown}
              >
                <svg
                  className="dashboardtwo-chart-svg"
                  viewBox={`0 0 ${dashboardtwoChartWidth} ${
                    dashboardtwoChartHeight + 4
                  }`}
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`Gallery uploads for ${chartData.label}. Move your pointer across the graph to inspect monthly values.`}
                >
                  <defs>
                    <linearGradient
                      id="dashboardtwo-area-gradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#c58a48"
                        stopOpacity="0.32"
                      />
                      <stop
                        offset="75%"
                        stopColor="#d9b58a"
                        stopOpacity="0.12"
                      />
                      <stop
                        offset="100%"
                        stopColor="#ead8c2"
                        stopOpacity="0.025"
                      />
                    </linearGradient>

                    <filter
                      id="dashboardtwo-point-shadow"
                      x="-100%"
                      y="-100%"
                      width="300%"
                      height="300%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="1"
                        stdDeviation="2"
                        floodColor="#8f5a27"
                        floodOpacity="0.16"
                      />
                    </filter>
                  </defs>

                  {/* Horizontal grid */}
                  {[0, 20, 40, 60, 80].map((value) => {
                    const y =
                      dashboardtwoChartHeight -
                      (value / dashboardtwoChartMax) *
                        dashboardtwoChartHeight;

                    return (
                      <line
                        key={`horizontal-${value}`}
                        x1="0"
                        y1={y}
                        x2={dashboardtwoChartWidth}
                        y2={y}
                        className="dashboardtwo-grid-line"
                      />
                    );
                  })}

                  {/* Vertical grid */}
                  {chartPoints.map((point, index) => (
                    <line
                      key={`vertical-${index}`}
                      x1={point.x}
                      y1="0"
                      x2={point.x}
                      y2={dashboardtwoChartHeight}
                      className="dashboardtwo-grid-line dashboardtwo-grid-vertical"
                    />
                  ))}

                  {/* Filled chart area */}
                  <path
                    d={areaPath}
                    fill="url(#dashboardtwo-area-gradient)"
                    className="dashboardtwo-chart-area"
                  />

                  {/* Smooth performance line */}
                  <path
                    d={linePath}
                    className="dashboardtwo-chart-line"
                    fill="none"
                    stroke="#b97832"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Cursor-following crosshair */}
                  {hoveredPoint !== null && (
                    <line
                      x1={chartPoints[hoveredPoint].x}
                      y1="0"
                      x2={chartPoints[hoveredPoint].x}
                      y2={dashboardtwoChartHeight}
                      className="dashboardtwo-crosshair"
                    />
                  )}

                  {/* Points and tooltips */}
                  {chartPoints.map((point, index) => {
                    const tooltipX = Math.max(
                      43,
                      Math.min(
                        point.x,
                        dashboardtwoChartWidth - 43
                      )
                    );

                    const tooltipY = Math.max(18, point.y - 28);
                    const isActive = hoveredPoint === index;

                    return (
                      <g
                        key={`point-${index}`}
                        className={`dashboardtwo-point-group ${
                          isActive ? "dashboardtwo-point-active" : ""
                        }`}
                      >
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isActive ? 7 : 4.8}
                          fill={isActive ? "#8c5726" : "#b97832"}
                          stroke="#ffffff"
                          strokeWidth={isActive ? 3 : 2}
                          filter="url(#dashboardtwo-point-shadow)"
                          className="dashboardtwo-chart-point"
                        />

                        {isActive && (
                          <g className="dashboardtwo-tooltip">
                            <rect
                              x={tooltipX - 43}
                              y={tooltipY - 16}
                              width="86"
                              height="31"
                              rx="7"
                              fill="#342519"
                            />

                            <text
                              x={tooltipX}
                              y={tooltipY - 3}
                              fill="#e8c9a1"
                              fontSize="8"
                              fontWeight="500"
                              textAnchor="middle"
                            >
                              {chartData.months[index]}
                            </text>

                            <text
                              x={tooltipX}
                              y={tooltipY + 8}
                              fill="#ffffff"
                              fontSize="11"
                              fontWeight="700"
                              textAnchor="middle"
                            >
                              {point.value} images
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div
                className="dashboardtwo-x-axis"
                style={{
                  gridTemplateColumns: `repeat(${chartData.months.length}, minmax(0, 1fr))`,
                }}
              >
                {chartData.months.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    className={`dashboardtwo-x-label ${
                      hoveredPoint === index
                        ? "dashboardtwo-x-label-active"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onFocus={() => setHoveredPoint(index)}
                    onBlur={() => setHoveredPoint(null)}
                    onClick={() =>
                      setHoveredPoint((previous) =>
                        previous === index ? null : index
                      )
                    }
                    aria-label={`${month}: ${chartData.values[index]} images`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <footer className="dashboardtwo-chart-footer">
            <span className="dashboardtwo-chart-legend">
              <span className="dashboardtwo-legend-dot" />
              Images uploaded
            </span>

            <span className="dashboardtwo-chart-summary">
              <TrendingUp size={14} />
              Peak: {Math.max(...chartData.values)} images
            </span>
          </footer>
        </article>

        {/* RECENT ENQUIRIES */}
        <article className="dashboardtwo-panel dashboardtwo-enquiries">
          <header className="dashboardtwo-panel-header">
            <div className="dashboardtwo-heading-group">
              <div className="dashboardtwo-heading-icon dashboardtwo-enquiry-icon">
                <MessageSquare size={21} strokeWidth={2} />
              </div>

              <div className="dashboardtwo-heading-text">
                <h2 className="dashboardtwo-panel-title">
                  Recent Enquiries
                </h2>
                <p className="dashboardtwo-panel-subtitle">
                  Latest client enquiries and their status
                </p>
              </div>
            </div>

            <button
              type="button"
              className="dashboardtwo-view-all"
              onClick={() => {
                setShowAll((previous) => !previous);
                setActiveMenu(null);
              }}
            >
              {showAll ? "Show Less" : "View All"}
              {showAll ? <X size={14} /> : <ArrowRight size={14} />}
            </button>
          </header>

          <div className="dashboardtwo-enquiry-list">
            {visibleEnquiries.map((enquiry) => (
              <div
                className="dashboardtwo-enquiry-row"
                key={enquiry.id}
              >
                <div
                  className={`dashboardtwo-avatar dashboardtwo-avatar-${enquiry.avatar}`}
                  aria-hidden="true"
                >
                  {enquiry.initials}
                </div>

                <div className="dashboardtwo-client-info">
                  <h3 className="dashboardtwo-client-name">
                    {enquiry.name}
                  </h3>

                  <p className="dashboardtwo-client-service">
                    {enquiry.service}
                  </p>
                </div>

                <div className="dashboardtwo-enquiry-time">
                  <Mail size={14} strokeWidth={1.8} />
                  <span>{enquiry.time}</span>
                </div>

                <span
                  className={`dashboardtwo-status ${getStatusClass(
                    enquiry.status
                  )}`}
                >
                  {enquiry.status}
                </span>

                <div className="dashboardtwo-row-menu-wrapper">
                  <button
                    type="button"
                    className="dashboardtwo-row-menu-button"
                    aria-label={`Actions for ${enquiry.name}`}
                    aria-expanded={activeMenu === enquiry.id}
                    onClick={() =>
                      setActiveMenu((previous) =>
                        previous === enquiry.id ? null : enquiry.id
                      )
                    }
                  >
                    <MoreVertical size={17} />
                  </button>

                  {activeMenu === enquiry.id && (
                    <div className="dashboardtwo-row-menu">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEnquiry(enquiry);
                          setActiveMenu(null);
                        }}
                      >
                        View details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(enquiry.id)}
                      >
                        Change status
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <footer className="dashboardtwo-enquiry-footer">
            <span>
              Showing {visibleEnquiries.length} of {enquiries.length} enquiries
            </span>

            <span className="dashboardtwo-footer-dot" />

            <span className="dashboardtwo-updated">
              <CheckCircle2 size={12} />
              All caught up
            </span>
          </footer>
        </article>
      </div>

      {/* ENQUIRY DETAILS MODAL */}
      {selectedEnquiry && (
        <div
          className="dashboardtwo-modal-overlay"
          onClick={() => setSelectedEnquiry(null)}
        >
          <section
            className="dashboardtwo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboardtwo-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dashboardtwo-modal-close"
              aria-label="Close enquiry details"
              onClick={() => setSelectedEnquiry(null)}
            >
              <X size={19} />
            </button>

            <div
              className={`dashboardtwo-modal-avatar dashboardtwo-avatar dashboardtwo-avatar-${selectedEnquiry.avatar}`}
            >
              {selectedEnquiry.initials}
            </div>

            <h2
              id="dashboardtwo-modal-title"
              className="dashboardtwo-modal-title"
            >
              {selectedEnquiry.name}
            </h2>

            <p className="dashboardtwo-modal-service">
              {selectedEnquiry.service}
            </p>

            <div className="dashboardtwo-modal-detail">
              <Mail size={17} />
              <span>{selectedEnquiry.email}</span>
            </div>

            <div className="dashboardtwo-modal-detail">
              <Clock3 size={17} />
              <span>{selectedEnquiry.phone}</span>
            </div>

            <div className="dashboardtwo-modal-detail">
              <span className="dashboardtwo-modal-status-label">
                Current status
              </span>

              <span
                className={`dashboardtwo-status ${getStatusClass(
                  selectedEnquiry.status
                )}`}
              >
                {selectedEnquiry.status}
              </span>
            </div>

            <button
              type="button"
              className="dashboardtwo-modal-done"
              onClick={() => setSelectedEnquiry(null)}
            >
              Close Details
            </button>
          </section>
        </div>
      )}
    </section>
  );
};

export default DashboardTwo;
