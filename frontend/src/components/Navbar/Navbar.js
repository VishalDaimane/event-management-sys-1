import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Calendar, 
  Settings,
  Users,
  PlusCircle,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
    setDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const navigationLinks = [
    {
      to: "/events",
      label: "Events",
      icon: <Calendar size={20} />,
      visible: true
    },
    {
      to: "/booked-events",
      label: "My Bookings",
      icon: <BookOpen size={20} />,
      visible: !!user
    },
    {
      to: "/create-event",
      label: "Create Event",
      icon: <PlusCircle size={20} />,
      visible: isAdmin
    },
    // {
    //   to: "/admin/users",
    //   label: "Manage Users",
    //   icon: <Users size={20} />,
    //   visible: isAdmin
    // }
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="https://graphicsfamily.com/wp-content/uploads/edd/2020/04/Event-management-logo-scaled.jpg" alt="GoPlanMe" height="40" />
          <span>Eventive</span>
        </Link>

        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <div className={`navbar-content ${isOpen ? 'active' : ''}`}>
          <div className="nav-links">
            {navigationLinks.map((link, index) => 
              link.visible && (
                <Link
                  key={index}
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            )}

            {!user && (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="nav-button"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {user && (
            <div className="nav-actions">
              <div className="user-dropdown">
                <button 
                  className="dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user.name}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="dropdown-menu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to="/edit-profile" className="dropdown-item" onClick={closeMenu}>
                        <User size={16} />
                        Profile
                      </Link>
                      {/* <Link to="/settings" className="dropdown-item" onClick={closeMenu}>
                        <Settings size={16} />
                        Settings
                      </Link> */}
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;