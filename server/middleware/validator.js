const { ERROR_MESSAGES } = require('../utils/constants');

/**
 * Request validation middleware
 */

/**
 * Validate chat message request
 */
const validateChatMessage = (req, res, next) => {
    const { sessionId, message } = req.body;

    // Validate sessionId
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
        return res.status(400).json({
            success: false,
            error: { message: ERROR_MESSAGES.INVALID_SESSION },
        });
    }

    // Validate message
    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
            success: false,
            error: { message: ERROR_MESSAGES.INVALID_MESSAGE },
        });
    }

    // Sanitize inputs
    req.body.sessionId = sessionId.trim();
    req.body.message = message.trim();

    next();
};

/**
 * Validate session ID parameter
 */
const validateSessionId = (req, res, next) => {
    const { sessionId } = req.params;

    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
        return res.status(400).json({
            success: false,
            error: { message: ERROR_MESSAGES.INVALID_SESSION },
        });
    }

    req.params.sessionId = sessionId.trim();
    next();
};

module.exports = {
    validateChatMessage,
    validateSessionId,
};
