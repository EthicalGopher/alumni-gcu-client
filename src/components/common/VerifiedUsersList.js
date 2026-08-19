import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProfilePhoto from './ProfilePhotoComponent';
import "../components.css";
import "./verified-users.css";

const VerifiedUsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch verified students (loads all by default, or filters as query changes)
  const fetchUsers = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/user/verified-users?search=${encodeURIComponent(searchQuery)}`);
      setUsers(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching verified users:', err);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  }, []);

  // Show students by default on initial mount
  useEffect(() => {
    fetchUsers('');
  }, [fetchUsers]);

  // Search student with each letter typed
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchUsers(query);
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchUsers('');
  };

  return (
    <div className="friends-container">
      <h2 className="friends-header-title">Friends</h2>

      {/* Real-time Search Box */}
      <div className="friends-search-box">
        <input
          type="text"
          placeholder="Search by name, branch, or batch..."
          value={search}
          onChange={handleSearchChange}
          className="friends-search-input"
        />
        {search && (
          <span onClick={handleClearSearch} className="friends-clear-btn" title="Clear">
            ✕
          </span>
        )}
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>Loading students...</p>}
      {error && !loading && <p className="error" style={{ color: '#e74c3c', textAlign: 'center' }}>{error}</p>}

      {/* Flex Row Layout with Shrink & Responsiveness */}
      {!loading && !error && (
        <div className="friends-flex-row">
          {users.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              className="friends-card"
            >
              <div className="friends-avatar-container">
                <ProfilePhoto
                  userId={user._id}
                  className="friends-avatar-img"
                />
              </div>
              <h4 className="friends-card-name">{user.name}</h4>
              <p className="friends-card-branch">{user.branch || user.programme || 'Alumni'}</p>
              <p className="friends-card-batch">Batch: {user.batch || 'N/A'}</p>
              {user.currentWorkingPlace && (
                <p className="friends-card-work">🏢 {user.currentWorkingPlace}</p>
              )}
            </Link>
          ))}

          {users.length === 0 && (
            <p style={{ width: '100%', textAlign: 'center', color: '#64748b', padding: '30px 0' }}>
              No students found matching "{search}".
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifiedUsersList;
