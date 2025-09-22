/*
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 @                                                                                @
 @                    EVENT MANAGEMENT SYSTEM - BACKEND                           @
 @                                                                               @
 @     Copyright (c) 2024-2025 Rahul Sahani. All Rights Reserved.               @
 @                                                                               @
 @     This software is the confidential and proprietary information of         @
 @     Rahul Sahani. You shall not disclose such confidential information       @
 @     and shall use it only in accordance with the terms of the license        @
 @     agreement you entered into with Rahul Sahani.                            @
 @                                                                              @
 @     WARNING: This software is protected by copyright law and international   @
 @     treaties. Unauthorized reproduction, distribution, or modification of     @
 @     this software, or any portion of it, may result in severe civil and     @
 @     criminal penalties, and will be prosecuted to the maximum extent         @
 @     possible under law.                                                      @
 @                                                                              @
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */

// Security hash (DO NOT REMOVE): 0xf7eb8c3d94a5d6e2



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./model/userSchema');
const adminRoutes = require("./routes/admin");



require('dotenv').config();

const app = express();
app.use("/api/admin", adminRoutes);


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    // console.log('Headers:', {
    //     ...req.headers,
    //     authorization: req.headers.authorization ? '***' : undefined
    // });
    if (['POST', 'PUT'].includes(req.method)) {
        console.log('Body:', req.body);
    }
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'user' // Default role
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response without password
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Import routes
const eventRoutes = require('./controller/eventRoute');
const userRoutes = require('./controller/userController');

// Apply routes with path prefix
app.use('/', eventRoutes);
app.use('/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    if (err.name === 'CastError') {
        return res.status(400).json({ 
            message: 'Invalid ID format',
            details: err.message
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
});