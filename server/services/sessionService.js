const Conversation = require('../models/Conversation');
const { SENDER_TYPES } = require('../utils/constants');

/**
 * Manages conversation sessions and message storage
 */
class SessionService {
    /**
     * Get or create conversation session
     * @param {string} sessionId - Session ID
     * @param {Object} context - Optional user context
     * @returns {Promise<Object>} - Conversation document
     */
    async getOrCreateSession(sessionId, context = {}) {
        try {
            let conversation = await Conversation.findOne({ sessionId });

            if (!conversation) {
                // Create new conversation
                conversation = await Conversation.create({
                    sessionId,
                    context,
                    messages: [],
                    appointmentState: 'idle',
                });
                console.log(`✅ New session created: ${sessionId}`);
            } else if (context && Object.keys(context).length > 0) {
                // Update context if provided
                conversation.context = { ...conversation.context, ...context };
                await conversation.save();
            }

            return conversation;
        } catch (error) {
            console.error('❌ Error getting/creating session:', error);
            throw error;
        }
    }

    /**
     * Add message to conversation
     * @param {string} sessionId - Session ID
     * @param {string} sender - 'user' or 'bot'
     * @param {string} text - Message text
     * @returns {Promise<Object>} - Updated conversation
     */
    async addMessage(sessionId, sender, text) {
        try {
            const conversation = await Conversation.findOne({ sessionId });

            if (!conversation) {
                throw new Error('Session not found');
            }

            conversation.messages.push({
                sender,
                text,
                timestamp: new Date(),
            });

            await conversation.save();
            return conversation;
        } catch (error) {
            console.error('❌ Error adding message:', error);
            throw error;
        }
    }

    /**
     * Get conversation history
     * @param {string} sessionId - Session ID
     * @param {number} limit - Max number of messages (default: 50)
     * @returns {Promise<Array>} - Array of messages
     */
    async getHistory(sessionId, limit = 50) {
        try {
            const conversation = await Conversation.findOne({ sessionId });

            if (!conversation) {
                return [];
            }

            // Return last N messages
            const messages = conversation.messages.slice(-limit);
            return messages;
        } catch (error) {
            console.error('❌ Error getting history:', error);
            throw error;
        }
    }

    /**
     * Update appointment state
     * @param {string} sessionId - Session ID
     * @param {string} state - New state
     * @param {Object} data - Appointment data to update
     * @returns {Promise<Object>} - Updated conversation
     */
    async updateAppointmentState(sessionId, state, data = {}) {
        try {
            const conversation = await Conversation.findOne({ sessionId });

            if (!conversation) {
                throw new Error('Session not found');
            }

            conversation.appointmentState = state;
            conversation.appointmentData = {
                ...conversation.appointmentData,
                ...data,
            };

            await conversation.save();
            return conversation;
        } catch (error) {
            console.error('❌ Error updating appointment state:', error);
            throw error;
        }
    }

    /**
     * Get session with full details
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} - Conversation document
     */
    async getSession(sessionId) {
        try {
            const conversation = await Conversation.findOne({ sessionId });
            return conversation;
        } catch (error) {
            console.error('❌ Error getting session:', error);
            throw error;
        }
    }

    /**
     * Clear appointment data for session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} - Updated conversation
     */
    async clearAppointmentData(sessionId) {
        try {
            const conversation = await Conversation.findOne({ sessionId });

            if (conversation) {
                conversation.appointmentState = 'idle';
                conversation.appointmentData = {};
                await conversation.save();
            }

            return conversation;
        } catch (error) {
            console.error('❌ Error clearing appointment data:', error);
            throw error;
        }
    }
}

const sessionService = new SessionService();

module.exports = sessionService;
