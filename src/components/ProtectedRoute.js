import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../services/UserContext';

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the required roles
  const roles = Array.isArray(requiredRole) ? requiredRole : (requiredRole ? [requiredRole] : []);
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return element;
};

export default ProtectedRoute;
