import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Events.css';

const BookedEventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('token');

  const fetchBookedEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching booked events...');
      
      const response = await axios.get(
        'http://localhost:3001/user/booked-events',
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Booked events response:', response.data);

      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        throw new Error(response.data.message || 'Failed to load booked events');
      }
    } catch (error) {
      console.error('Error fetching booked events:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load your booked events';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedEvents();
  }, []);

  const handleRetry = () => {
    fetchBookedEvents();
  };

  const handleCancelBooking = async (eventId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/events/${eventId}/book`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookedEvents(); // Refresh the list
      } else {
        throw new Error(response.data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="events-container">
          <div className="events-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="event-card">
                <div className="event-image loading-skeleton" style={{ height: '200px' }}></div>
                <div className="event-content">
                  <div className="loading-skeleton" style={{ height: '24px', width: '80%', marginBottom: '12px' }}></div>
                  <div className="loading-skeleton" style={{ height: '16px', width: '60%', marginBottom: '8px' }}></div>
                  <div className="loading-skeleton" style={{ height: '16px', width: '40%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="events-container">
          <div className="error-state">
            <AlertCircle size={48} />
            <h3>Error Loading Events</h3>
            <p>{error}</p>
            <button className="retry-button" onClick={handleRetry}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-container">
        <motion.div
          className="booked-events-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="booked-events-title">My Booked Events</h1>
        </motion.div>

        <motion.div 
          className="events-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events.length > 0 ? (
            events.map((event) => (
              <motion.div 
                key={event._id} 
                className="event-card booked-event-card"
                variants={itemVariants}
              >
                <img 
                  src={event.image || '/assets/default-image.jpeg'}
                  alt={event.title} 
                  className="event-image"
                />
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <div className="meta-item">
                      <Calendar size={16} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      {event.time}
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      {event.venue}
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      {event.capacity} spots
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
                    <div className="event-price">
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </div>
                    <div className="booking-status">
                      <button
                        className="cancel-booking-btn"
                        onClick={() => handleCancelBooking(event._id)}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="empty-bookings">
              <AlertCircle size={48} />
              <h3>No Booked Events</h3>
              <p>You haven't booked any events yet.</p>
              <Link to="/events" className="browse-events-btn">
                Browse Events <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookedEventsList;
