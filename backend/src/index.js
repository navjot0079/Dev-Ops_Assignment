/**
 * Sales Insight Automator - Express Backend
 * Main entry point for the API server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import uploadRoutes from './routes/upload.js';
import summaryRoutes from './routes/summary.js';
import emailRoutes from './routes/email.js';
import processRoutes from './routes/process.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sales Insight Automator API',
            version: '1.0.0',
            description: `
## Overview
A secure API for processing sales data files and generating AI-powered executive summaries.

## Features
- **File Upload**: Accept CSV and XLSX files up to 10MB
- **AI Analysis**: Generate professional executive summaries using Google Gemini
- **Email Delivery**: Send formatted reports directly to stakeholders

## Security
- Rate limiting (10 requests per minute)
- File type validation
- Input sanitization
- File size limits
      `,
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: process.env.BACKEND_URL || `http://localhost:${PORT}`,
                description: 'API Server'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // In production, allow if origin is in allowedOrigins OR ends with .vercel.app or .netlify.app
        if (allowedOrigins.indexOf(origin) !== -1 ||
            process.env.NODE_ENV === 'development' ||
            origin.endsWith('.vercel.app') ||
            origin.endsWith('.netlify.app') ||
            origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: {
        success: false,
        error: 'Too many requests, please try again later.',
        status_code: 429
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Sales Insight Automator API Docs'
}));

// API Routes
app.use('/api', uploadRoutes);
app.use('/api', summaryRoutes);
app.use('/api', emailRoutes);
app.use('/api', processRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
app.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Detailed health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server health status
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        status_code: 404
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack || err);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            error: 'CORS not allowed',
            status_code: 403
        });
    }

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
        status_code: err.status || 500
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Swagger docs available at http://localhost:${PORT}/docs`);
});

export default app;
