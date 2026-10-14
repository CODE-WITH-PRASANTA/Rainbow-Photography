import React from 'react';
import './LeaveComment.css';

const LeaveComment = () => {
  return (
    <div className="comment-wrapper fadeInSection">
      <h2 className="comment-title">LEAVE A COMMENT</h2>

      <form className="comment-form" onSubmit={(e) => e.preventDefault()}>

        <div className="comment-table">

          <div className="table-row slideUp">
            <label>Name</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              className="comment-input"
            />
          </div>

          <div className="table-row slideUp">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              className="comment-input"
            />
          </div>

          <div className="table-row slideUp">
            <label>Message</label>
            <textarea 
              placeholder="Enter your message"
              className="comment-textarea"
            ></textarea>
          </div>

        </div>

        <button type="submit" className="submit-button bounceBtn">
          SUBMIT COMMENT
        </button>
        
      </form>
    </div>
  );
};

export default LeaveComment;