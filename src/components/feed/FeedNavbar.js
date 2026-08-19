import React from "react";
import "./feed.css";
import { FaBriefcase, FaGraduationCap, FaHome, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../services/UserContext";

const FeedNavbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate('/');
  };

  return (
    <div className="feed-sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
        <button className="toggle-btn" onClick={() => document.querySelector(".feed-sidebar").classList.toggle("closed")}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {!user && (
        <div className="guest-profile-card">
          <div className="guest-avatar-badge">ME</div>
          <h4 className="guest-name-heading">Guest User</h4>
          <p className="guest-subtext-para">Sign in to customize your profile</p>
          <button onClick={() => navigate('/login')} className="guest-signin-button">
            Sign In
          </button>
        </div>
      )}

      <ul className="feed-navbar-list">
        <li className={`feed-nav-item ${activeTab === "home" ? "active" : ""}`} onClick={() => handleTabClick("home")}>
          <FaHome className="nav-icon" />
          <span>Home</span>
        </li>
        {user && (
          <li className={`feed-nav-item ${activeTab === "my-posts" ? "active" : ""}`} onClick={() => handleTabClick("my-posts")}>
            <FaUser className="nav-icon" />
            <span>My Posts</span>
          </li>
        )}
        <li className={`feed-nav-item ${activeTab === "jobs" ? "active" : ""}`} onClick={() => handleTabClick("jobs")}>
          <FaBriefcase className="nav-icon" />
          <span>Jobs</span>
        </li>
        <li className={`feed-nav-item ${activeTab === "education" ? "active" : ""}`} onClick={() => handleTabClick("education")}>
          <FaGraduationCap className="nav-icon" />
          <span>Education</span>
        </li>
      </ul>
    </div>
  );
};

export default FeedNavbar;
