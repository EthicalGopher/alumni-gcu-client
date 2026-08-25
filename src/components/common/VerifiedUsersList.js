import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import "../components.css";
import ProfilePhoto from "../../components/common/ProfilePhotoComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSort, faBuilding, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const VerifiedUsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (queryParam = search, sortParam = sortBy) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (queryParam && queryParam.trim()) {
        query.append('search', queryParam.trim());
      }
      if (sortParam) {
        query.append('sortBy', sortParam);
      }

      const response = await api.get(`/user/verified-users?${query.toString()}`);
      setUsers(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching alumni users:', err);
      setError('Failed to load alumni list');
    } finally {
      setLoading(false);
    }
  }, [search, sortBy]);

  useEffect(() => {
    fetchUsers('', 'name_asc');
  }, [fetchUsers]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchUsers(val, sortBy);
  };

  const handleSortChange = (e) => {
    const sortVal = e.target.value;
    setSortBy(sortVal);
    fetchUsers(search, sortVal);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(search, sortBy);
  };

  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="verified-users-container full-width-container" style={{ padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ color: '#003366', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Alumni
          </h2>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
            Connect with verified alumni across batches and branches ({users.length} members)
          </p>
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FontAwesomeIcon icon={faSort} style={{ color: '#003366' }} />
          <select
            value={sortBy}
            onChange={handleSortChange}
            style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8f9fa', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
          >
            <option value="name_asc">Sort: Name (A-Z)</option>
            <option value="batch_desc">Sort: Batch (Newest First)</option>
            <option value="batch_asc">Sort: Batch (Oldest First)</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e2e8f0', borderRadius: '8px', padding: '4px 12px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }} />
          <input
            type="text"
            placeholder="Search by name, branch, batch year, or company..."
            value={search}
            onChange={handleInputChange}
            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px 0', fontSize: '15px' }}
          />
        </div>
      </form>

      {loading && <p style={{ textAlign: 'center', color: '#666', padding: '30px 0' }}>Loading alumni directory...</p>}
      {error && <p className="error" style={{ color: '#dc3545', textAlign: 'center', padding: '20px 0' }}>{error}</p>}

      {/* Vertical Cards Grid */}
      {!loading && users.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
            width: '100%'
          }}
        >
          {users.map((user) => {
            const companyLogo = user.company?.logo
              ? (user.company.logo.startsWith('http') ? user.company.logo : `${BASE_URL}${user.company.logo}`)
              : null;
            const companyName = user.company?.name || user.currentWorkingPlace;

            return (
              <div
                key={user._id}
                onClick={() => handleCardClick(user._id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '20px 15px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="vertical-alumni-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,51,102,0.12)';
                  e.currentTarget.style.borderColor = '#003366';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Profile Photo Avatar */}
                <div style={{ marginBottom: '14px', position: 'relative' }}>
                  <ProfilePhoto
                    userId={user._id}
                    style={{
                      width: '85px',
                      height: '85px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #003366',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                </div>

                {/* Name */}
                <h3
                  style={{
                    margin: '0 0 6px',
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#003366',
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user.name}
                </h3>

                {/* Branch & Batch */}
                <div
                  style={{
                    fontSize: '12px',
                    color: '#475569',
                    backgroundColor: '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user.branch ? user.branch : 'Alumni'} · Batch of {user.batch}
                </div>

                {/* Company / Designation Badge */}
                {companyName ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: '#059669',
                      fontWeight: '600',
                      backgroundColor: '#ecfdf5',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      width: '100%',
                      marginBottom: '15px'
                    }}
                  >
                    {companyLogo ? (
                      <img src={companyLogo} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                    ) : (
                      <FontAwesomeIcon icon={faBuilding} />
                    )}
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {companyName}
                    </span>
                  </div>
                ) : (
                  <div style={{ height: '28px', marginBottom: '15px' }} />
                )}

                {/* View Profile Action Button */}
                <div
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    padding: '8px 0',
                    backgroundColor: '#003366',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  View Profile <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '11px' }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : !loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
          <FontAwesomeIcon icon={faUser} style={{ fontSize: '32px', marginBottom: '10px', color: '#cbd5e1' }} />
          <p style={{ margin: 0, fontSize: '15px' }}>
            {search ? `No alumni found matching "${search}".` : 'No alumni records found.'}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default VerifiedUsersList;
