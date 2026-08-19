import React, { useState } from "react";
import './form.css';
import { useUser } from '../../services/UserContext';
import ProfilePhoto from "../../components/common/ProfilePhotoComponent";

const PostForm = ({ onSubmitPost, isLoading, error }) => {
    const [postContent, setPostContent] = useState("");
    const [category, setCategory] = useState("post");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useUser();
    const maxLength = 300;

    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handlePostSubmit = async () => {
        if (!postContent.trim()) {
            // Display error if the post content is empty
            return;
        }

        try {
            await onSubmitPost(postContent, category);
            setPostContent("");
            setCategory("post");
            closeModal();
        } catch (err) {
            // Handle errors (e.g., submission failure) if needed
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (!user) {
        return (
            <div className="guest-join-card">
                <h3 className="guest-join-title">Join the GCU Alumni Community</h3>
                <p className="guest-join-subtext">
                    Log in with your pre-registered student email address to share posts, like updates, and comment on alumni events.
                </p>
                <div className="guest-join-actions">
                    <button onClick={() => window.location.href = '/login'} className="guest-get-started-btn">
                        Get Started / Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="post-form-container">
            {!isModalOpen && (
                <div className="post-form-collapsed" onClick={openModal}>
                    <ProfilePhoto 
                        userId={user?._id || user?.id}
                        className="rounded-full"
                    />
                    <input
                        type="text"
                        className="collapsed-input"
                        placeholder="Create a post"
                        readOnly
                    />
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="form-modal-content">
                        <div className="modal-header">
                            <span>Create a Post</span>
                            <button className="close-btn" onClick={closeModal}>✖</button>
                        </div>
                        <textarea 
                            placeholder="What do you want to talk about?" 
                            value={postContent} 
                            onChange={handlePostChange} 
                            disabled={isLoading} 
                            maxLength={maxLength}
                            className="modal-textarea"
                        />
                        <div className="category-selector">
                            <label htmlFor="category">Choose a category:</label>
                            <select 
                                id="category"
                                value={category}
                                onChange={handleCategoryChange}
                            >
                                <option value="post">Regular Post</option>
                                <option value="job">Job Opportunity</option>
                                <option value="education">Education Opportunity</option>
                            </select>
                        </div>
                        <div className="post-footer">
                            <span className={`char-count ${postContent.length > maxLength * 0.9 ? 'warning' : ''}`}>
                                {postContent.length}/{maxLength}
                            </span>
                            <button 
                                onClick={handlePostSubmit} 
                                disabled={isLoading || postContent.length > maxLength} 
                                className={`post-btn ${isLoading ? 'loading' : ''}`}
                            >
                                {isLoading ? "Posting..." : "Post"}
                            </button>
                        </div>
                        {/* {error && <div className="error-msg">{error}</div>} */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostForm;
