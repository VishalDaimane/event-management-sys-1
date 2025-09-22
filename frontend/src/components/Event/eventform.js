import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Image as ImageIcon,
  Save,
  X,
  Info,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import './eventform.css';

const EventForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    price: '',
    category: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'title',
      'description',
      'date',
      'time',
      'venue',
      'category',
      'capacity',
      'price'
    ];

    const emptyFields = requiredFields.filter(field => {
      const value = formData[field];
      return value === undefined || value === null || value === '';
    });
    
    if (emptyFields.length > 0) {
      toast.error(`Please fill in: ${emptyFields.join(', ')}`);
      return false;
    }

    if (parseInt(formData.capacity) <= 0) {
      toast.error('Capacity must be greater than 0');
      return false;
    }

    if (parseFloat(formData.price) < 0) {
      toast.error('Price cannot be negative');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    const loadingToast = toast.loading('Creating event...');

    try {
      // Create the event payload
      const eventPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time,
        venue: formData.venue.trim(),
        category: formData.category,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price)
      };

      console.log('Submitting event data:', eventPayload);

      // Get token
      const token = localStorage.getItem('token');
      
      // Make the API call
      const response = await axios.post(
        'http://localhost:3001/events',
        eventPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Server response:', response.data);

      if (response.data.success) {
        toast.success('Event created successfully!', {
          id: loadingToast,
        });

        setTimeout(() => {
          navigate('/events');
        }, 500);
      } else {
        toast.error(response.data.message || 'Failed to create event', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0] || 
                          'Failed to create event';
      
      toast.error(errorMessage, {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <motion.div
          className="form-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Create New Event</h2>
          <p>Fill in the details to create a new event</p>
        </motion.div>

        <motion.form 
          className={`event-form ${loading ? 'form-loading' : ''}`}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="form-section">
            <h3 className="section-title">
              <Info size={20} />
              Basic Information
            </h3>
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Event Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="party">Party</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <Calendar size={20} />
              Date & Time
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="date">Event Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Event Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <MapPin size={20} />
              Location & Capacity
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="venue">Venue</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="form-control"
                  required
                  min="1"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <DollarSign size={20} />
              Pricing
            </h3>
            <div className="form-group">
              <label htmlFor="price">Event Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
              <span className="helper-text">Enter 0 for free events</span>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <ImageIcon size={20} />
              Event Image
            </h3>
            <div className="form-group">
              <label className="image-upload" htmlFor="image">
                <div className="upload-icon">
                  <Upload size={48} />
                </div>
                <p>Click or drag image to upload</p>
                <span className="helper-text">Maximum size: 5MB</span>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={loading}
                />
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <motion.button
              type="button"
              className="cancel-btn"
              onClick={() => {
                toast('Changes discarded', { icon: '⚠️' });
                navigate('/events');
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              <X size={20} />
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="loading-spinner">⌛</span>
              ) : (
                <Save size={20} />
              )}
              {loading ? 'Creating...' : 'Create Event'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EventForm;