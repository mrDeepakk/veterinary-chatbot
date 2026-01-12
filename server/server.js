require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./db/connection');
const { initializeGeminiService } = require('./ai/geminiService');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Initialize Express app
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veterinary-chatbot';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Veterinary Chatbot API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/appointment', appointmentRoutes);

// Serve static files (SDK and demo)
const path = require('path');
const fs = require('fs');

// Determine correct paths for local vs Docker environment
const publicPath = fs.existsSync(path.join(__dirname, 'public')) 
    ? path.join(__dirname, 'public')  // Docker: public is sibling to server.js
    : path.join(__dirname, '../public'); // Local: public is in parent directory

const demoPath = fs.existsSync(path.join(__dirname, 'public/demo'))
    ? path.join(__dirname, 'public/demo')  // Docker: demo is in public/demo
    : path.join(__dirname, '../demo');  // Local: demo is in parent/demo

app.use(express.static(publicPath));
app.use('/demo', express.static(demoPath));

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

/**
 * Initialize services and start server
 */
const startServer = async () => {
    try {
        // Validate required environment variables
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY environment variable is required');
        }

        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await dbConnection.connect(MONGODB_URI);

        // Initialize Gemini service
        console.log('🤖 Initializing Gemini AI service...');
        initializeGeminiService(GEMINI_API_KEY);

        // Start Express server
        app.listen(PORT, () => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 Veterinary Chatbot Server is running');
            console.log(`📍 Port: ${PORT}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📡 Health check: http://localhost:${PORT}/health`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();

module.exports = app;
