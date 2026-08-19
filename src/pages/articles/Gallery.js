import React, { useState, useEffect } from 'react';
import '../pages.css';
import './articles.css';
import '../../components/components.css';
import { useNavigate } from 'react-router-dom';


const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/images/albums`);
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const sortedAlbums = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setAlbums(sortedAlbums);
        } else {
          console.error('Unexpected data format received:', data);
        }
      } catch (err) {
        console.error('Error fetching albums:', err);
      }
    };

    fetchAlbums();
  }, []);

  if (!albums) {
    return null; 
  }

  const handleAlbumClick = (id) => {
    if (id) {
      navigate(`/gallery/album/${id}`);
    } else {
      console.error('Album ID is undefined');
    }
  };

  return (
    <div className='main'>
      <div className="art-container">
        <div className="about-header">
          <h1>Gallery Albums</h1>
        </div>
        <div className="goal-content-container py-8 px-4 w-full">
            <div className="gallery-masonry-grid">
              {albums.map((album) => (
                <div key={album._id} className="gallery-masonry-item" onClick={() => handleAlbumClick(album._id)}>
                  <img
                    src={`${BASE_URL}${album.lastImage}`}
                    alt={`${album.albumName}_thumbnail`}
                    className="gallery-masonry-img"
                    loading="lazy"
                  />
                  <div className="p-3 bg-white border-t border-gray-100 text-center">
                    <h2 className="text-base font-bold text-gray-800 m-0">{album.albumName}</h2>
                  </div>
                  <div className="gallery-masonry-overlay">
                    <span>View Album</span>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;