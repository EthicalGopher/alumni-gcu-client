import React, { useState } from 'react';
import "./admin.css";
import api from "../../services/api";
import Modal from "./AdminModal";  // Assuming you have this Modal component
import programmeData from '../../data/programmeData';

const AlumniEmailSender = () => {
  const [searchParams, setSearchParams] = useState({
    batch: '',
    programme: '',
    course: '',
    branch: ''
  });
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get courses based on selected programme
  const courses = searchParams.programme ? Object.keys(programmeData[searchParams.programme]?.courses) : [];

  // Get branches based on selected course
  const branches = searchParams.course ? programmeData[searchParams.programme]?.courses[searchParams.course] || [] : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await api.post(`/admin/send-emails?${query}`, {
        subject,
        message,
      });
      if (response.status === 200) {
        alert('Emails sent successfully!');
      } else {
        alert('Failed to send emails.');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('An error occurred while sending emails.');
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="dashboard-container">
      <div className='dashboard-header'>
        <h1 className='admin-form-header'>Alumni Email Sender</h1>
      </div>

      <div className="search-group">
        <form onSubmit={(e) => {
          e.preventDefault();
          openModal();
        }}>
          <div className="admin-form-group">
            <label htmlFor="batch">Batch (Passing Year)</label>
            <input
              type="number"
              className="admin-form-input"
              name="batch"
              id="batch"
              value={searchParams.batch}
              onChange={handleInputChange}
              placeholder="Enter Batch Year"
              min="2006"
              max={new Date().getFullYear() + 4}
            />
          </div>

          {/* Programme Dropdown */}
          <div className="admin-form-group">
              <label htmlFor="programme">Programme</label>
              <select id="programme" name="programme" className="admin-form-input" value={searchParams.programme} onChange={handleInputChange} >
                  <option value="" disabled>Select Programme</option>
                  {Object.keys(programmeData).map((prog) => (
                      <option key={prog} value={prog}>{prog}</option>
                  ))}
              </select>
          </div>

          {/* Course Dropdown */}
          <div className="admin-form-group">
              <label htmlFor="course">
                  Course
              </label>
              <select id="course" name="course" className="admin-form-input" value={searchParams.course} onChange={handleInputChange} disabled={!searchParams.programme} >
                  <option value="" disabled>Select Course</option>
                  {courses.map((course) => (
                      <option key={course} value={course}>{course}</option>
                  ))}
              </select>
          </div>

          {/* Branch Dropdown */}
          <div className="admin-form-group">
              <label htmlFor="branch">
                  Branch
              </label>
              <select id="branch" name="branch" className="admin-form-input" value={searchParams.branch} onChange={handleInputChange} disabled={!searchParams.course} >
                  <option value="" disabled>Select Branch</option>
                  {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                  ))}
              </select>
          </div>

          <button 
            type="submit" 
            className="admin-form-button" 
            disabled={!searchParams.batch && !searchParams.branch}  // Disable until batch or branch is selected
          >
            Compose Email
          </button>
        </form>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Compose Email"
        content={
          <form onSubmit={handleSubmitEmail}>
            <div className="admin-form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                className="admin-form-input"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className="email-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="email-submit-button">
              Send Email
            </button>
            <button type="button" className="email-submit-button" onClick={closeModal}>
              Cancel
            </button>
          </form>
        }
      />


    </div>
  );
};

export default AlumniEmailSender;
