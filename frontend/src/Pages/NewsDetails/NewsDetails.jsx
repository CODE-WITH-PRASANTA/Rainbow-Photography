import React from "react";
import "./NewsDetails.css";

import NewsHome from "../../Components/NewsHome/NewsHome";
import Wedding from "../../Components/Wedding/Wedding";
import CommentesTags from "../../Components/CommentesTags/CommentesTags";
import LeaveComment from "../../Components/LeaveComment/LeaveComment";
import SearchHere from "../../Components/SearchHere/SearchHere";

const NewsDetails = () => {
  return (
    <div className="news-details-wrapper">

      {/* FULLSCREEN HERO */}
      <NewsHome />

      {/* BELOW SECTION */}
      <div className="news-details-layout">

        <div className="left-section">
          <Wedding />
          <CommentesTags />
          <LeaveComment />
        </div>

        <aside className="right-sidebar">
          <SearchHere />
        </aside>

      </div>
    </div>
  );
};

export default NewsDetails;