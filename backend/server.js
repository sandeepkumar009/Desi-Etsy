import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import passport from 'passport';

// Local Imports
import connectDB from './config/db.js';
// Import the passport configuration so it gets executed
import './config/passport.js'; 

// Import Routes
import authRoutes from './routes/authRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Import Middlewares
import errorHandler from './middlewares/errorHandlerMiddleware.js';

// Initial Configuration
connectDB();

const app = express();

// Core Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
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

// Health Check Route
app.get('/', (req, res) => {
    res.send('API is running successfully...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
