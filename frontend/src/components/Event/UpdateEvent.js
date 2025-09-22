import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './eventform.css';

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching event with ID:', id);
      
      const response = await axios.get(`http://localhost:3001/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const eventData = response.data;
      console.log('Received event data:', eventData);
      
      setEvent(eventData);
      
      // Format date for input field
      const formattedDate = new Date(eventData.date).toISOString().split('T')[0];
      
      setFormData({
        title: eventData.title || '',
        description: eventData.description || '',
        date: formattedDate || '',
        time: eventData.time || '',
        venue: eventData.venue || '',
        capacity: eventData.capacity || '',
        price: eventData.price || '',
        category: eventData.category || ''
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch event details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    const emptyFields = requiredFields.filter(field => !formData[field]);
    
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
    const loadingToast = toast.loading('Updating event...');

    try {
      const token = localStorage.getItem('token');
      console.log('Sending update for event:', id, 'with data:', formData);
      
      const response = await axios.put(
        `http://localhost:3001/events/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);
      
      if (response.data.success) {
        toast.success('Event updated successfully!', {
          id: loadingToast,
        });

        setTimeout(() => {
          navigate('/events');
        }, 500);
      } else {
        throw new Error(response.data.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0] || 
                          'Failed to update event';
      
      toast.error(errorMessage, {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div className="loading-skeleton" style={{ height: '400px' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div className="error-state">
            <AlertTriangle size={48} />
            <h3>Error Loading Event</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={fetchEvent}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <motion.div
          className="form-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Update Event</h2>
          <p>Edit the event details</p>
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
              {loading ? 'Updating...' : 'Update Event'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateEvent;