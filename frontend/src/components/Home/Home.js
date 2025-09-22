/*
 * =======================================================================
 *                    GOPLANME EVENT MANAGEMENT SYSTEM
 * =======================================================================
 *
 *   Copyright (c) 2024-2025 Rahul Sahani
 *   All Rights Reserved.
 *
 *   This component contains proprietary code and trade secrets.
 *   Unauthorized copying, transfer, or use is strictly prohibited.
 *
 * =======================================================================
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Calendar,
  Users,
  MapPin,
  PartyPopper,
} from "lucide-react";
import "./Home.css";
import toast from "react-hot-toast";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    // Check if user is admin and redirect to admin dashboard
    if (user?.role === "admin") {
      toast.success("Welcome Admin!");
    } else {
      toast.success("Welcome to GoPlanMe!");
    }
  }, [user]);

  return (
    <div className="landing-page">
      {/* Navigation */}
      {/* <nav className="nav-container">
        <div className="nav-content">
          <div className="logo">
            <Link to="/">
              <img src="/logo_circle.jpg" alt="GoPlanMe Logo" height="40" />
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/events" className="nav-link">
              Events
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            {
              // If user is logged in, show profile and logout links
              // Otherwise, show login link
              user ? (
                <>
                  <button
                    className="nav-button"
                    onClick={() => {localStorage.clear();
                      window.location.reload();}}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="nav-button">
                  Login
                </Link>
              )
            }
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            Event planning made easier for everyone
          </h1>
          <p className="hero-description">
            Plan and manage your events effortlessly. From birthday parties to
            corporate meetings, we've got you covered with comprehensive event
            management solutions.
          </p>

          <motion.div
            className="rating-badge"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="star-icon" size={20} fill="currentColor" />
            <span>Trusted by thousands of event planners</span>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <img width={"80%"} src="/assets/homepage.png" alt="Event Planning" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <motion.div
            className="service-card"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="service-icon">
              <Calendar size={24} />
            </div>
            <h3 className="service-title">Event Planning</h3>
            <p>
              Comprehensive event planning and scheduling services for all types
              of events.
            </p>
          </motion.div>

          <motion.div
            className="service-card"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="service-icon">
              <Users size={24} />
            </div>
            <h3 className="service-title">Vendor Management</h3>
            <p>
              Connect with trusted vendors and service providers for your
              events.
            </p>
          </motion.div>

          <motion.div
            className="service-card"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="service-icon">
              <MapPin size={24} />
            </div>
            <h3 className="service-title">Venue Selection</h3>
            <p>Find and book the perfect venue for your upcoming events.</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="how-it-works-content">
          <h2 className="section-title">How It Works</h2>
          <div className="checklist-container">
            {[
              "Create your event with all the details",
              "Browse and book vendors and venues",
              "Manage RSVPs and attendees",
              "Host successful events",
            ].map((item, index) => (
              <motion.div
                key={index}
                className="checklist-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="checklist-icon">
                  <PartyPopper size={20} />
                </div>
                <p>{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2
            className="section-title"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            Ready to Plan Your Next Event?
          </h2>
          <p>Join our platform and start planning memorable events today</p>
          <motion.button
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Home;
