import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components.css";
import api from "../../services/api";

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const AlumniFaceCard = () => {
  const [faces, setFaces] = useState([]);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const navigate = useNavigate();
  const rotationInterval = 25000;

  useEffect(() => {
    const fetchFaces = async () => {
      try {
        const response = await api.get('/alumni-faces/get-faces');
        setFaces(response.data || []);
      } catch (error) {
        console.error('Error fetching alumni faces:', error);
      }
    };

    fetchFaces();
  }, []);

  useEffect(() => {
    if (faces.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFaceIndex((prevIndex) => (prevIndex + 1) % faces.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [faces]);

  const handleCardClick = () => {
    navigate('/alumni-face-show');
  };

  const currentFace = faces[currentFaceIndex];

  return (
    <div className="alumni-face-card-container">
      <h2 className="news-event-title">ALUMNI</h2>
      <div className="alumni-face-card" onClick={handleCardClick}>
        {currentFace && currentFace.image ? (
          <img
            src={`${BASE_URL}${currentFace.image}`}
            alt="Alumni Face"
            className="alumni-face-card-thumbnail"
          />
        ) : (
          <img
            src="/assets/profile-placeholder.svg"
            alt="Default Alumni Face"
            className="alumni-face-card-thumbnail"
          />
        )}
      </div>
      <span className="read-more-span" onClick={() => navigate('/alumni-face-show')}>
        View Alumni &#8594;
      </span>
    </div>
  );
};

export default AlumniFaceCard;
