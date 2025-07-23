/*
* FILE: backend/server.js
*
* DESCRIPTION:
* This file is updated to integrate the real-time Socket.IO server.
* Key changes:
* - Import the native 'http' module.
* - Import our custom 'initSocket' function and the new 'notificationRoutes'.
* - Create an HTTP server instance from the Express app.
* - Initialize Socket.IO, passing it the new server instance.
* - Add the '/api/notifications' route to the Express app.
* - Start the server using server.listen() instead of app.listen().
*/
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import http from 'http'; // <-- ADDED: Import http module

// Local Imports
import connectDB from './config/db.js';
import './config/passport.js'; 
import { initSocket } from './socket.js'; // <-- ADDED: Import socket initializer

// Import Routes
import authRoutes from './routes/authRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; // <-- ADDED: Import notification routes

// Import Middlewares
import errorHandler from './middlewares/errorHandlerMiddleware.js';

// Initial Configuration
connectDB();

const app = express();
const server = http.createServer(app); // <-- ADDED: Create HTTP server from Express app

// <-- ADDED: Initialize Socket.IO -->
initSocket(server);

// Core Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport for Google OAuth
app.use(passport.initialize());


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/notifications', notificationRoutes); // <-- ADDED: Use notification routes


// Health Check Route
app.get('/', (req, res) => {
    res.send('API is running successfully...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// <-- MODIFIED: Use the http server to listen for requests -->
server.listen(PORT, () => 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
