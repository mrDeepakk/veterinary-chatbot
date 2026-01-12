const express = require('express');
const { sendMessage, getHistory } = require('../controllers/chatController');
const { validateChatMessage, validateSessionId } = require('../middleware/validator');

const router = express.Router();

/**
 * POST /api/chat/message
 */
router.post('/message', validateChatMessage, sendMessage);

/**
 * GET /api/chat/history/:sessionId
 */
router.get('/history/:sessionId', validateSessionId, getHistory);

module.exports = router;
