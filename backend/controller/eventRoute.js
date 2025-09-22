const express = require('express');
const router = express.Router();
const Event = require('../model/eventSchema');
const jwt = require('jsonwebtoken');

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Admin Authorization Middleware
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Get user's booked events (This route must come before the :id route)
router.get('/user/booked-events', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching booked events for user:', req.user.userId);
        
        const events = await Event.find({
            bookedBy: req.user.userId
        }).sort({ date: 1 });

        console.log('Found booked events:', events.length);
        
        res.json({
            success: true,
            events: events
        });
    } catch (error) {
        console.error('Error fetching booked events:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching booked events' 
        });
    }
});

// Get all events (Public)
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Get single event details
router.get('/events/:id', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching event with ID:', req.params.id);
        
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            console.log('Event not found with ID:', req.params.id);
            return res.status(404).json({ message: 'Event not found' });
        }

        console.log('Found event:', event);
        res.json(event);
    } catch (error) {
        console.error('Error fetching event details:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }
        res.status(500).json({ message: 'Error fetching event details' });
    }
});

// Create event (Admin only)
router.post('/events', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        console.log('Creating event with data:', req.body);
        
        const eventData = {
            ...req.body,
            createdBy: req.user.userId
        };

        const event = new Event(eventData);
        const savedEvent = await event.save();

        console.log('Event created:', savedEvent);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: savedEvent
        });
    } catch (error) {
        console.error('Error creating event:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Error creating event' });
    }
});

// Update event (Admin only)
router.put('/events/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        console.log('Updating event:', req.params.id, 'with data:', req.body);
        
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update fields
        Object.assign(event, req.body);
        
        // Save updated event
        const updatedEvent = await event.save();
        
        console.log('Event updated successfully:', updatedEvent);
        
        res.json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (error) {
        console.error('Error updating event:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }
        res.status(500).json({ message: 'Error updating event' });
    }
});

// Book event
router.post('/events/:id/book', authenticateToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.bookedBy.includes(req.user.userId)) {
            return res.status(400).json({ message: 'You have already booked this event' });
        }

        if (event.bookedBy.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is fully booked' });
        }

        event.bookedBy.push(req.user.userId);
        await event.save();

        res.json({
            success: true,
            message: 'Event booked successfully',
            availableSpots: event.capacity - event.bookedBy.length
        });
    } catch (error) {
        console.error('Error booking event:', error);
        res.status(500).json({ message: 'Error booking event' });
    }
});

// Cancel booking
router.delete('/events/:id/book', authenticateToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!event.bookedBy.includes(req.user.userId)) {
            return res.status(400).json({ message: 'You have not booked this event' });
        }

        event.bookedBy = event.bookedBy.filter(id => id.toString() !== req.user.userId);
        await event.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            availableSpots: event.capacity - event.bookedBy.length
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking' });
    }
});

// Delete event (Admin only)
router.delete('/events/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.deleteOne();
        res.json({ 
            success: true,
            message: 'Event deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

module.exports = router;