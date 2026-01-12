const chatService = require('../services/chatService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * POST /api/chat/message
 */
const sendMessage = asyncHandler(async (req, res) => {
    const { sessionId, message, context } = req.body;

    // Process message through chat service
    const result = await chatService.processMessage(sessionId, message, context);

    res.status(200).json({
        success: true,
        data: result,
    });
});

/**
 * GET /api/chat/history/:sessionId
 */
const getHistory = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    // Get conversation history
    const history = await chatService.getConversationHistory(sessionId);

    res.status(200).json({
        success: true,
        data: history,
    });
});

module.exports = {
    sendMessage,
    getHistory,
};
