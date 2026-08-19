import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import "../components.css";
import ProfilePhoto from "../../components/common/ProfilePhotoComponent";
import { FaSearch, FaTimes } from 'react-icons/fa';

const RecommendedUsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch users: if search is empty, fetch priority recommendations; otherwise search verified users
  const fetchUsers = useCallback(async (query = '') => {
    setLoading(true);
    try {
      if (query.trim() === '') {
        const response = await api.get('/user/recommend-users');
        setUsers(response.data || []);
      } else {
        const response = await api.get(`/user/verified-users?search=${encodeURIComponent(query)}`);
        setUsers(response.data || []);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers('');
  }, [fetchUsers]);

  // Real-time search on each letter typed
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchUsers(query);
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchUsers('');
  };

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    margin: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const headerStyle = {
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const searchBoxStyle = {
    position: 'relative',
    width: '100%'
  };

  const searchInputStyle = {
    width: '100%',
    padding: '9px 32px 9px 34px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.88rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const userCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.15s ease, border-color 0.15s ease'
  };

  const nameStyle = {
    fontSize: '1rem',
    fontWeight: '700',
    margin: '0 0 3px',
    color: '#0f172a'
  };

  const branchBatchStyle = {
    fontSize: '0.82rem',
    color: '#64748b',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span>{search ? 'Search Alumni' : 'Recommended Mates'}</span>
      </div>

      {/* Real-time Search Bar */}
      <div style={searchBoxStyle}>
        <FaSearch style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }} />
        <input
          type="text"
          placeholder="Search mates by name, branch, batch..."
          value={search}
          onChange={handleSearchChange}
          style={searchInputStyle}
        />
        {search && (
          <FaTimes
            onClick={handleClearSearch}
            style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}
            title="Clear search"
          />
        )}
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', margin: '10px 0' }}>Searching...</p>}
      {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{error}</p>}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
          {users.map(user => (
            <Link 
              to={`/profile/${user._id}`} 
              key={user._id} 
              style={userCardStyle}
            >
              <ProfilePhoto 
                userId={user?._id}
                className="recommended-profile-picture"
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <h4 style={nameStyle}>{user.name}</h4>
                <p style={branchBatchStyle}>
                  {user.branch ? user.branch : 'Alumni'}{user.batch ? `, Batch of ${user.batch}` : ''}
                  {user.currentWorkingPlace && (
                    <span style={{ display: 'block', color: '#2563eb', fontWeight: '500', fontSize: '0.78rem', marginTop: '2px' }}>
                      🏢 {user.currentWorkingPlace}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          ))}

          {users.length === 0 && (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '16px 0' }}>
              No mates found for "{search}".
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendedUsersList;