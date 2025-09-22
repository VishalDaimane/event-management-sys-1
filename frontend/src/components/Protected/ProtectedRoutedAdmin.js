import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoutedAdmin = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    toast.error('Admin access required');
    return <Navigate to="/events" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutedAdmin;