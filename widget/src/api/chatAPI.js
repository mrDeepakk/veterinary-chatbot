/**
 * API Communication Layer
 * Handles all backend communication for the chatbot widget
 */

// Get API base URL from environment or default to localhost
const API_BASE_URL = window.VET_CHATBOT_API_URL || 'http://localhost:3000';

/**
 * Send message to chatbot
 * @param {string} sessionId - Session ID
 * @param {string} message - User message
 * @param {Object} context - Optional context
 * @returns {Promise<Object>} - Bot response
 */
export const sendMessage = async (sessionId, message, context = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId,
                message,
                context,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Error sending message:', error);
        throw error;
    }
};

/**
 * Get conversation history
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Conversation history
 */
export const getHistory = async (sessionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Error getting history:', error);
        throw error;
    }
};
