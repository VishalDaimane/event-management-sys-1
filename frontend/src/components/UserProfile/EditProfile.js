import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Lock,
  Save,
  X,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const { name, email, phone } = response.data.user;
        setUserData(prev => ({
          ...prev,
          name: name || '',
          email: email || '',
          phone: phone || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const validateForm = () => {
    if (!userData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!userData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!userData.phone.match(/^\d{10}$/)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (changePassword) {
      if (!userData.currentPassword) {
        toast.error('Current password is required to change password');
        return false;
      }
      if (userData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const loadingToast = toast.loading('Updating profile...');

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      };

      if (changePassword) {
        updateData.currentPassword = userData.currentPassword;
        updateData.newPassword = userData.newPassword;
      }

      const response = await axios.put(
        'http://localhost:3001/user/profile',
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success('Profile updated successfully!', {
          id: loadingToast
        });

        // Reset password fields
        setUserData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: ''
        }));
        setChangePassword(false);

        // Navigate back
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage, {
        id: loadingToast
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <motion.div
          className="profile-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Edit Profile</h2>
          <p>Update your personal information</p>
        </motion.div>

        <motion.form 
          className="profile-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="name">
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                placeholder="Enter your full name"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                placeholder="Enter your phone number"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <div className="password-section-header">
              <h3>Password Settings</h3>
              <button
                type="button"
                className={`toggle-password-btn ${changePassword ? 'active' : ''}`}
                onClick={() => setChangePassword(!changePassword)}
                disabled={loading}
              >
                {changePassword ? 'Cancel Password Change' : 'Change Password'}
              </button>
            </div>

            {changePassword && (
              <div className="password-fields">
                <div className="form-group">
                  <label htmlFor="currentPassword">
                    <Lock size={16} />
                    Current Password
                  </label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="currentPassword"
                      value={userData.currentPassword}
                      onChange={(e) => setUserData({ ...userData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">
                    <Lock size={16} />
                    New Password
                  </label>
                  <div className="password-input">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={userData.newPassword}
                      onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="helper-text">Password must be at least 6 characters long</span>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <motion.button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              <X size={20} />
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="save-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditProfile;