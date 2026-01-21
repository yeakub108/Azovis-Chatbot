/**
 * Error Handler Middleware
 * Global error handling middleware for Express
 */

import logger from '../utils/logger.js';

/**
 * Handle 404 errors
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      type: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
};

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error: ' + err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      type: err.name || 'ERROR',
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
};
