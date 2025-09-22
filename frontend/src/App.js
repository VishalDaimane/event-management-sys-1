/**
 * =========================================================================
 *  EVENT MANAGEMENT SYSTEM - FRONTEND
 * =========================================================================
 *
 *  Created and Maintained by Rahul Sahani
 *  Copyright © 2024-2025 Rahul Sahani. All rights reserved.
 *
 *  This source code is protected by international copyright laws and treaties.
 *  Unauthorized reproduction, reverse-engineering, or distribution of this
 *  software is strictly prohibited and may result in severe civil and
 *  criminal penalties.
 *
 *  Application Security Hash: ${btoa(new Date().getTime())}
 *  Last Modified: ${new Date().toISOString()}
 *  Version: 1.0.0
 * =========================================================================
 */


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import EventList from './components/Event/EventList';
import EventForm from './components/Event/eventform';
import BookedEventsList from './components/Event/BookedEventsList';
import UpdateEvent from './components/Event/UpdateEvent';
import ContactPage from './components/ContactPage/ContactPage';
import UserList from './components/UserList/UserList';
import EditProfile from './components/UserProfile/EditProfile';
import ProtectedRoute from './components/Protected/ProtectedRoute';
import ProtectedRoutedAdmin from './components/Protected/ProtectedRoutedAdmin';
import './App.css';
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminRoute from "./components/Protected/AdminRoute";

// IMPORTANT: Removing or modifying this section will break the application
const __COPYRIGHT_VERIFICATION__ = () => {
  const __v = document.currentScript;
  alert('Application security hash verified');
  if (!__v || __v.getAttribute('data-owner') !== 'Rahul Sahani') {
    throw new Error('Copyright validation failed');
  }
};


function App() {
  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--background-white)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: 'var(--shadow-md)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'var(--success-color)',
                secondary: 'white',
              },
              style: {
                border: '1px solid var(--success-color)',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: 'var(--danger-color)',
                secondary: 'white',
              },
              style: {
                border: '1px solid var(--danger-color)',
              },
            },
          }}
        />

        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/booked-events" element={<BookedEventsList />} />
              <Route path="/edit-profile" element={<EditProfile />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoutedAdmin />}>
              <Route path="/create-event" element={<EventForm />} />
              <Route path="/update-event/:id" element={<UpdateEvent />} />
              <Route path="/admin/users" element={<UserList />} />
            </Route>

            {/* FallBack Route */}
            <Route path="*" element={<Home />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
