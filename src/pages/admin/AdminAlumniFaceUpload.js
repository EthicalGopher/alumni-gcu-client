import React, { useState, useEffect, useRef } from 'react';
import "./admin.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Trash2 } from 'lucide-react';
import api from "../../services/api";
import { compressImages } from '../../utils/imageCompressor';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const AdminAlumniFaceUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [faces, setFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const fetchFaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/alumni-faces/get-faces');
      setFaces(response.data || []);
    } catch (err) {
      console.error('Error fetching alumni faces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaces();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    setPreviewUrls([]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prevUrls => [...prevUrls, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please select at least one photo.');
      return;
    }

    setUploading(true);
    try {
      // Compress all images before uploading
      const compressedFiles = await compressImages(selectedFiles, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920
      });

      const formData = new FormData();
      formData.append('category', 'alumni-faces');
      compressedFiles.forEach(file => {
        formData.append('images', file);
      });

      await api.post('/alumni-faces/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Photos uploaded successfully to Alumni Face Show.');
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchFaces();
    } catch (err) {
      console.error('Error uploading photos:', err);
      alert(err.response?.data?.message || 'Failed to upload photos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (faceId) => {
    if (!window.confirm("Are you sure you want to delete this Alumni Face photo?")) return;

    try {
      await api.delete(`/alumni-faces/delete/${faceId}`);
      alert('Photo deleted successfully');
      setFaces(prev => prev.filter(f => f._id !== faceId));
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo.');
    }
  };

  return (
    <div className="py-4 ">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm p-4 mb-5">
            <h2 className="text-center mb-4">Upload Alumni Faces</h2>
            <p className="text-muted text-center mb-4">
              Photos uploaded here will appear in the <strong>Alumni Face Show</strong> rotating card on the Home page and in the Alumni Face Show gallery.
            </p>

            <form onSubmit={uploadImages}>
              <div className="mb-3">
                <label className="form-label font-weight-bold">Select Photos</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-control"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  required
                />
                <small className="text-muted">You can select multiple photos at once.</small>
              </div>

              {previewUrls.length > 0 && (
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                  {previewUrls.map((url, index) => (
                    <div key={index}>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={uploading || selectedFiles.length === 0}
                style={{ backgroundColor: '#27357f', borderColor: '#27357f' }}
              >
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-3">Existing Alumni Face Photos ({faces.length})</h3>
        {loading ? (
          <p>Loading photos...</p>
        ) : faces.length === 0 ? (
          <p className="text-muted">No Alumni Face photos uploaded yet.</p>
        ) : (
          <div className="row g-3">
            {faces.map((face) => (
              <div key={face._id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className="card h-100 shadow-sm position-relative overflow-hidden w-full">
                  <img
                    src={`${BASE_URL}${face.image}`}
                    alt="Alumni face"
                    className="card-img-top"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="p-2 text-center">
                    <small className="text-muted d-block text-truncate">
                      {new Date(face.createdAt).toLocaleDateString()}
                    </small>
                    <button
                      className="btn btn-sm btn-outline-danger mt-1 w-100 d-flex align-items-center justify-content-center gap-1"
                      onClick={() => handleDelete(face._id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlumniFaceUpload;
