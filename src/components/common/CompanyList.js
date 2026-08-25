import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import "../components.css";
import ProfilePhoto from "../../components/common/ProfilePhotoComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMagnifyingGlass, faGlobe, faLocationDot, faUsers, faChevronDown, faChevronUp, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const getLogoUrl = (logo) => {
  if (!logo) return null;
  if (logo.startsWith('http://') || logo.startsWith('https://')) return logo;
  return `${BASE_URL}${logo}`;
};

const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [expandedCompanyId, setExpandedCompanyId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/companies');
      setCompanies(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const industries = Array.from(
    new Set(companies.map((c) => c.industry).filter(Boolean))
  );

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.industry && c.industry.toLowerCase().includes(search.toLowerCase())) ||
      (c.location && c.location.toLowerCase().includes(search.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

    const matchesIndustry = !selectedIndustry || c.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  const toggleExpand = (id) => {
    setExpandedCompanyId(expandedCompanyId === id ? null : id);
  };

  const handleAlumniClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="companies-container full-width-container" style={{ padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ color: '#003366', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Companies
          </h2>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
            Explore companies hiring our alumni ({companies.length} companies)
          </p>
        </div>

        {industries.length > 0 && (
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8f9fa', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
          >
            <option value="">All Industries</option>
            {industries.map((ind, idx) => (
              <option key={idx} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e2e8f0', borderRadius: '8px', padding: '4px 12px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }} />
          <input
            type="text"
            placeholder="Search company by name, industry, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px 0', fontSize: '15px' }}
          />
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#666', padding: '30px 0' }}>Loading companies...</p>}
      {error && <p style={{ color: '#dc3545', textAlign: 'center', padding: '20px 0' }}>{error}</p>}

      {/* Vertical Company Cards Grid */}
      {!loading && filteredCompanies.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            width: '100%'
          }}
        >
          {filteredCompanies.map((comp) => {
            const logoUrl = getLogoUrl(comp.logo);
            const isExpanded = expandedCompanyId === comp._id;

            return (
              <div
                key={comp._id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '20px 18px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  position: 'relative'
                }}
                className="vertical-company-card"
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
                {/* Logo Top */}
                <div style={{ marginBottom: '14px' }}>
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={comp.name}
                      style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '4px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                      }}
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '12px',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #e2e8f0'
                      }}
                    >
                      <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '30px', color: '#003366' }} />
                    </div>
                  )}
                </div>

                {/* Company Name */}
                <h3
                  style={{
                    margin: '0 0 6px',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#003366',
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {comp.name}
                </h3>

                {/* Industry & Location */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '10px' }}>
                  {comp.industry && (
                    <span style={{ fontSize: '12px', color: '#003366', backgroundColor: '#e0f2fe', padding: '3px 8px', borderRadius: '10px', fontWeight: '600' }}>
                      {comp.industry}
                    </span>
                  )}
                  {comp.location && (
                    <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '10px', fontWeight: '500' }}>
                      <FontAwesomeIcon icon={faLocationDot} style={{ color: '#ef4444', marginRight: '4px' }} />
                      {comp.location}
                    </span>
                  )}
                </div>

                {/* Description Snippet */}
                {comp.description && (
                  <p
                    style={{
                      margin: '0 0 12px',
                      fontSize: '13px',
                      color: '#64748b',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {comp.description}
                  </p>
                )}

                {/* Alumni Count Badge */}
                <div style={{ marginBottom: '14px' }}>
                  <span
                    style={{
                      backgroundColor: '#003366',
                      color: '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    {comp.alumniCount || 0} Alumni Worked Here
                  </span>
                </div>

                {/* Actions Footer */}
                <div style={{ marginTop: 'auto', width: '100%', display: 'flex', gap: '8px' }}>
                  {comp.website && (
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#003366',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <FontAwesomeIcon icon={faGlobe} /> Website
                    </a>
                  )}

                  {comp.alumni && comp.alumni.length > 0 && (
                    <button
                      onClick={() => toggleExpand(comp._id)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        backgroundColor: isExpanded ? '#64748b' : '#003366',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      {isExpanded ? 'Hide' : 'View Alumni'}
                      <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </button>
                  )}
                </div>

                {/* EXPANDED ALUMNI GRID */}
                {isExpanded && comp.alumni && (
                  <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: '2px dashed #cbd5e1', width: '100%', textAlign: 'left' }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#003366', fontWeight: 'bold' }}>
                      Alumni at {comp.name} (Click to open profile):
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {comp.alumni.map((alumnus) => (
                        <div
                          key={alumnus._id}
                          onClick={() => handleAlumniClick(alumnus._id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ecfdf5';
                            e.currentTarget.style.borderColor = '#059669';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                          }}
                        >
                          <ProfilePhoto userId={alumnus._id} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <strong style={{ display: 'block', fontSize: '13px', color: '#003366', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {alumnus.name}
                            </strong>
                            <small style={{ color: '#64748b', fontSize: '11px' }}>
                              {alumnus.branch ? `${alumnus.branch}, ` : ''}Batch {alumnus.batch}
                            </small>
                          </div>
                          <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '11px', color: '#003366' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : !loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
          <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '32px', marginBottom: '10px', color: '#cbd5e1' }} />
          <p style={{ margin: 0, fontSize: '15px' }}>
            {search || selectedIndustry ? 'No companies match your filters.' : 'No companies registered yet.'}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default CompanyList;
