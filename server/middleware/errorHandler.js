
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('❌ Error:', err);

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || null;

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errors = Object.values(err.errors).map((e) => e.message);
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry';
        const field = Object.keys(err.keyPattern)[0];
        errors = [`${field} already exists`];
    }

    // Handle Mongoose cast errors
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format';
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(errors && { errors }),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler,
};
