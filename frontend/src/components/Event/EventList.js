import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import EventCard from './EventCard';
import './Events.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    date: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRetry = () => {
    fetchEvents();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || event.category === filters.category;
    const matchesDate = !filters.date || new Date(event.date).toLocaleDateString() === new Date(filters.date).toLocaleDateString();
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="events-container">
          <div className="events-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
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
        <div className="events-header">
          <h1 className="events-title">Upcoming Events</h1>
          {isAdmin && (
            <Link to="/create-event">
              <motion.button 
                className="create-event-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Create Event
              </motion.button>
            </Link>
          )}
        </div>

        <div className="events-filters">
          <div className="filter-group">
            <label>
              <Search size={16} />
              Search
            </label>
            <input
              type="text"
              name="search"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>
              <Filter size={16} />
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">All Categories</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="party">Party</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Calendar size={16} />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <motion.div 
          className="events-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard 
                key={event._id}
                event={event}
                isAdmin={isAdmin}
                fetchEvents={fetchEvents}
              />
            ))
          ) : (
            <div className="empty-state">
              <AlertCircle size={48} />
              <h3>No Events Found</h3>
              <p>
                {filters.search || filters.category !== 'all' || filters.date
                  ? 'Try adjusting your filters'
                  : isAdmin
                  ? 'Create your first event!'
                  : 'Check back later for new events'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EventList;
