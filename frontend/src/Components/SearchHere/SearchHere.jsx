import React from "react";
import "./SearchHere.css";

import post1 from "../../assets/Latest1.webp";
import post2 from "../../assets/Latest2.webp";
import post3 from "../../assets/Latest3.webp";

const SearchHere = () => {
  return (
    <aside className="sidebar">

      {/* SEARCH */}
      <div className="widget searchWidget">
        <input type="text" placeholder="Search here" />
        <button>
          <i className="fa fa-search"></i>
        </button>
      </div>

      {/* LATEST POSTS */}
      <div className="widget card">
        <h3 className="widgetTitle">Latest Posts</h3>

        <div className="postItem">
          <img src={post1} alt="post" />
          <div>
            <span className="meta">Admin</span>
            <p>Top crypto exchange influencers</p>
          </div>
        </div>

        <div className="postItem">
          <img src={post2} alt="post" />
          <div>
            <span className="meta">Admin</span>
            <p>Necessity may give us best virtual court</p>
          </div>
        </div>

        <div className="postItem">
          <img src={post3} alt="post" />
          <div>
            <span className="meta">Admin</span>
            <p>You should know about business plan</p>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="widget card">
        <h3 className="widgetTitle">Categories</h3>

        <ul className="categories">
          <li>Business</li>
          <li className="active">Digital Agency</li>
          <li>Introductions</li>
          <li>New Technologies</li>
          <li>Parallax Effects</li>
          <li>Web Development</li>
        </ul>
      </div>

      {/* TAGS */}
      <div className="widget card">
        <h3 className="widgetTitle">Tags</h3>

        <div className="tags">
          <span>Consulting</span>
          <span>Agency</span>
          <span>Business</span>
          <span>Digital</span>
          <span>Experience</span>
          <span>Technology</span>
        </div>
      </div>

      {/* RECENT COMMENTS */}
      <div className="widget card">
        <h3 className="widgetTitle">Recent Comments</h3>

        <div className="commentItem">
          <div className="icon">💬</div>
          <p>A wordpress commenter on launch new mobile app</p>
        </div>

        <div className="commentItem">
          <div className="icon">💬</div>
          <p><strong>John Doe</strong> on template: Comments</p>
        </div>

        <div className="commentItem">
          <div className="icon">💬</div>
          <p>A wordpress commenter on launch new mobile app</p>
        </div>

        <div className="commentItem">
          <div className="icon">💬</div>
          <p><strong>John Doe</strong> on template: Comments</p>
        </div>
      </div>

    </aside>
  );
};

export default SearchHere;