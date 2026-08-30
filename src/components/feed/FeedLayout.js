// components/layouts/FeedLayout.js
import React from "react";
import "./feed.css";

const FeedLayout = ({ leftSidebar, mainContent, rightSidebar, fullWidth }) => {
  return (
    <div className="main">
      <div className="feed-layout-container">
        <div className="left-sidebar">{leftSidebar}</div>
        <div className={`main-content ${fullWidth ? 'main-content-full' : ''}`}>{mainContent}</div>
        <div className="right-sidebar">{rightSidebar}</div>
      </div>
    </div>
  );
};

export default FeedLayout;
