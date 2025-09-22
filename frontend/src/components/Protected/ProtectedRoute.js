import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!token || !user) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access to protected routes
  return <Outlet />;
};

export default ProtectedRoute;