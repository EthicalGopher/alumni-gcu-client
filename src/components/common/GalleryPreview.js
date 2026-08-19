import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const GalleryPreview = () => {
    const [photos, setPhotos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/images/all-images`);
                if (!response.ok) throw new Error('Failed to fetch photos');
                const data = await response.json();
                if (Array.isArray(data)) setPhotos(data);
            } catch (err) {
                console.error('Error fetching photos:', err);
            }
        };
        fetchPhotos();
    }, []);

    return (
        <div className="gallery-preview-container">
            <div className="flex justify-between items-center w-full max-w-6xl mb-6 px-4">
                <h2 className="text-2xl font-bold text-gray-800">Gallery Preview</h2>
                <button 
                    onClick={() => navigate('/gallery')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
                >
                    View All Albums →
                </button>
            </div>

            {photos.length > 0 ? (
                <div className="gallery-masonry-grid">
                    {photos.slice(0, 10).map((photo, index) => (
                        <div 
                            key={index} 
                            className="gallery-masonry-item"
                            onClick={() => navigate('/gallery')}
                        >
                            <img
                                src={`${BASE_URL}${photo.image}`}
                                alt={`photo_${index}`}
                                className="gallery-masonry-img"
                                loading="lazy"
                            />
                            <div className="gallery-masonry-overlay">
                                <span>View Gallery</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 py-6">Loading photos...</p>
            )}
        </div>
    );
};

export default GalleryPreview;
