import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "../pages.css";
import "./articles.css";
import Spinner from "../../components/common/LoadingSpinner";
import { useUser } from "../../services/UserContext";
import api from "../../services/api";

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const AlumniFaceShow = () => {
  const { user } = useUser();
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const fetchFaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/alumni-faces/get-faces');
      setFaces(response.data || []);
    } catch (error) {
      console.error('Error fetching alumni faces:', error);
      toast.error('Failed to load alumni faces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaces();
  }, []);

  const handleDelete = async (e, faceId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await api.delete(`/alumni-faces/delete/${faceId}`);
      toast.success("Photo removed successfully");
      setFaces((prev) => prev.filter((f) => f._id !== faceId));
    } catch (error) {
      console.error("Error deleting face photo:", error);
      toast.error(error.response?.data?.message || "Failed to delete photo");
    }
  };

  const slides = faces.map((face) => ({
    src: `${BASE_URL}${face.image}`,
    title: face.uploadedByName || "Alumni"
  }));

  const isAdmin = user && (user.role === 'admin' || user.role === 'superuser');

  return (
    <div className="main">
      <div className="art-container">
        <div className="about-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h1 className="mb-0">Alumni</h1>
          {isAdmin && (
            <a
              href="/admin-alumni-faces"
              className="btn btn-primary"
              style={{ backgroundColor: '#27357f', borderColor: '#27357f' }}
            >
              Manage / Upload Photos
            </a>
          )}
        </div>


        {loading ? (
          <div><Spinner /></div>
        ) : faces.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No photos in the Alumni Face Show yet.</p>
          </div>
        ) : (
          <div className="goal-content-container">
            <div className="images-container">
              {faces.map((face, index) => (
                <div
                  key={face._id || index}
                  className="image-wrapper position-relative rounded shadow-sm"
                  onClick={() => {
                    setPhotoIndex(index);
                    setIsOpen(true);
                  }}
                >
                  <img
                    src={`${BASE_URL}${face.image}`}
                    alt={`Alumni Face ${index + 1}`}
                    className="image"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <span>Click to enlarge</span>
                  </div>

                  {isAdmin && (
                    <button
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                      style={{ zIndex: 10, padding: '4px 8px', borderRadius: '4px' }}
                      title="Delete photo"
                      onClick={(e) => handleDelete(e, face._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={slides}
          index={photoIndex}
          plugins={[Thumbnails, Fullscreen, Zoom, Download]}
          thumbnails={{
            position: "bottom",
            width: 120,
            height: 80,
            gap: 16,
            imageFit: "contain",
          }}
          zoom={{
            maxZoomPixelRatio: 3,
            scrollToZoom: true,
          }}
          on={{
            view: ({ index }) => setPhotoIndex(index),
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
          }}
        />
      </div>
    </div>
  );
};

export default AlumniFaceShow;
