import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from "../../services/api";
import programmeData from '../../data/programmeData';

const BulkAddAlumni = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    programme: '',
    course: '',
    branch: '', 
  });

  const courses = formData.programme ? Object.keys(programmeData[formData.programme]?.courses || {}) : [];
  const branches = formData.course ? programmeData[formData.programme]?.courses[formData.course] || [] : [];

  // Handle dropdown changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'programme' ? { course: '', branch: '' } : {}),
      ...(name === 'course' ? { branch: '' } : {}),
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setMessage('❌ Invalid file format. Please upload a valid CSV file.');
        setSelectedFile(null);
        fileInputRef.current.value = null;
      } else {
        setSelectedFile(file);
        setMessage('');
        setErrorDetails([]);
      }
    }
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "name,roll_no,batch,email\n" +
      "John Doe,12345,2023,john@example.com\n" +
      "Jane Smith,67890,2024,jane@example.com";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_alumni.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Upload the CSV file with form data
  const uploadAlumniCSV = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a CSV file to upload.');
      return;
    }
    if (!formData.programme || !formData.course || (branches.length > 0 && !formData.branch)) {
      setMessage('❌ Please select Programme, Course, and Branch.');
      return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', selectedFile);
    uploadData.append('programme', formData.programme);
    uploadData.append('course', formData.course);
    uploadData.append('branch', formData.branch);

    try {
      const response = await api.post('/admin/bulk-add-alumni', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Alumni records uploaded successfully.');
      setErrorDetails([]);
      setSelectedFile(null);
      fileInputRef.current.value = null;

      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data;
        setMessage(errorData.error ? `❌ Error: ${errorData.error}` : '❌ Upload failed.');
        if (Array.isArray(errorData.details)) {
          setErrorDetails(errorData.details);
        }
      } else {
        setMessage('❌ An unexpected error occurred.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bulk-upload-container text-center p-4" style={{ maxWidth: "500px", margin: "auto" }}>
      <h2 className="mb-3">Add Alumni</h2>

      {/* Instructions */}
      <div className="alert alert-info text-start">
        <h5>📌 Instructions:</h5>
        <ul className="text-start">
          <li>Select the **Programme, Course, and Branch**.</li>
          <li>Click <b>"Download Sample CSV"</b> for the correct format.</li>
          <li>Ensure the CSV file contains columns: <code>name, roll_no, batch, email</code>.</li>
          <li>Upload your CSV file and click <b>"Upload CSV"</b>.</li>
        </ul>
      </div>

      <div className="admin-form-group">
        <label htmlFor="programme">Programme</label>
        <select id="programme" name="programme" className="admin-form-input" value={formData.programme} onChange={handleSelectChange}>
          <option value="" disabled>Select Programme</option>
          {Object.keys(programmeData).map((prog) => (
            <option key={prog} value={prog}>{prog}</option>
          ))}
        </select>
      </div>

      <div className="admin-form-group">
        <label htmlFor="course">Course</label>
        <select id="course" name="course" className="admin-form-input" value={formData.course} onChange={handleSelectChange} disabled={!formData.programme}>
          <option value="" disabled>Select Course</option>
          {courses.map((course) => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </div>

      <div className="admin-form-group">
        <label htmlFor="branch">Branch</label>
        <select id="branch" name="branch" className="admin-form-input" value={formData.branch} onChange={handleSelectChange} disabled={!formData.course}>
          <option value="" disabled>Select Branch</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {/* File Upload Section */}
      <div className="mb-3">
        <input type="file" onChange={handleFileChange} className="form-control" accept=".csv" ref={fileInputRef} />
      </div>

      {selectedFile && <p><strong>Selected File:</strong> {selectedFile.name}</p>}

      {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}

      {errorDetails.length > 0 && (
        <div className="alert alert-warning mt-3">
          <h5>⚠️ Errors in CSV File:</h5>
          <ul className="text-start">
            {errorDetails.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      )}

      <button onClick={downloadSampleCSV} className="btn btn-secondary w-100 mb-2">
        📥 Download Sample CSV
      </button>

      <button onClick={uploadAlumniCSV} className="btn btn-primary w-100" disabled={uploading || !selectedFile}>
        {uploading ? 'Uploading...' : '📤 Upload CSV'}
      </button>
    </div>
  );
};

export default BulkAddAlumni;
