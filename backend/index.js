/**
 * Main Application Entry Point
 * Professional OpenAI Chatbot Server
 */

import express from 'express';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  logger.error('Please copy .env.example to .env and add your API keys');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Azovis Chatbot Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Azovis Chatbot API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      reset: '/api/chat/reset',
      stats: '/api/chat/stats/:sessionId'
    }
  });
});

// API Routes
app.use('/api', chatRoutes);

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server (only for local development, not for Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.success(`\n
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           🤖 AZOVIS CHATBOT SERVER                         ║
║                                                            ║
║           Server running on port ${PORT}                        ║
║           Environment: ${process.env.NODE_ENV || 'development'}                            ║
║           Model: ${process.env.MODEL || 'gpt-4o-mini'}                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

  Available endpoints:
  → GET  /health
  → POST /api/chat
  → POST /api/chat/reset
  → GET  /api/chat/stats/:sessionId?

  Press Ctrl+C to stop the server
`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
