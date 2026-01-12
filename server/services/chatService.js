const { getGeminiService } = require('../ai/geminiService');
const sessionService = require('./sessionService');
const appointmentService = require('./appointmentService');
const { SENDER_TYPES, BOOKING_KEYWORDS, NON_VET_REJECTION } = require('../utils/constants');

/**
 * Chat Service
 * Orchestrates message handling, AI responses, and appointment booking
 */
class ChatService {
    /**
     * Process incoming user message
     * Routes to either Gemini AI or appointment booking flow
     * @param {string} sessionId - Session ID
     * @param {string} message - User message
     * @param {Object} context - Optional user context
     * @returns {Promise<Object>} - Bot response and metadata
     */
    async processMessage(sessionId, message, context = {}) {
        try {
            // Get or create session
            const session = await sessionService.getOrCreateSession(sessionId, context);

            // Save user message
            await sessionService.addMessage(sessionId, SENDER_TYPES.USER, message);

            // Check if currently in appointment booking flow
            if (session.appointmentState && session.appointmentState !== 'idle') {
                return await this._handleAppointmentFlow(sessionId, message);
            }

            // Check if user wants to book appointment
            if (this._isBookingIntent(message)) {
                return await this._handleAppointmentFlow(sessionId, message);
            }

            // Otherwise, handle as regular chat with Gemini
            return await this._handleChatMessage(sessionId, message, session);
        } catch (error) {
            console.error('❌ Error processing message:', error);
            throw error;
        }
    }

    /**
     * Handle regular chat messages with Gemini AI
     */
    async _handleChatMessage(sessionId, message, session) {
        try {
            const gemini = getGeminiService();

            // Get conversation history for context (last 10 messages)
            const history = session.messages.slice(-10);

            // Generate AI response
            const aiResponse = await gemini.generateResponse(message, history);

            // Save bot response
            await sessionService.addMessage(sessionId, SENDER_TYPES.BOT, aiResponse);

            return {
                reply: aiResponse,
                sessionId,
                appointmentInProgress: false,
            };
        } catch (error) {
            console.error('❌ Gemini error:', error);

            // Fallback response on AI error
            const fallbackMessage = 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
            await sessionService.addMessage(sessionId, SENDER_TYPES.BOT, fallbackMessage);

            return {
                reply: fallbackMessage,
                sessionId,
                error: 'AI service temporarily unavailable',
            };
        }
    }

    /**
     * Handle appointment booking flow
     */
    async _handleAppointmentFlow(sessionId, message) {
        try {
            // Process through appointment state machine
            const result = await appointmentService.processAppointmentFlow(sessionId, message);

            // Save bot response
            await sessionService.addMessage(sessionId, SENDER_TYPES.BOT, result.reply);

            return {
                ...result,
                sessionId,
            };
        } catch (error) {
            console.error('❌ Appointment flow error:', error);

            // Clear appointment state on error
            await sessionService.clearAppointmentData(sessionId);

            const errorMessage = 'Sorry, something went wrong with the booking process. Let\'s start fresh. How can I help you?';
            await sessionService.addMessage(sessionId, SENDER_TYPES.BOT, errorMessage);

            return {
                reply: errorMessage,
                sessionId,
                appointmentInProgress: false,
                error: 'Appointment booking error',
            };
        }
    }

    /**
     * Check if message indicates booking intent
     */
    _isBookingIntent(message) {
        const lowerMessage = message.toLowerCase();
        return BOOKING_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
    }

    /**
     * Get conversation history for a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} - Session data with messages
     */
    async getConversationHistory(sessionId) {
        try {
            const session = await sessionService.getSession(sessionId);

            if (!session) {
                return {
                    sessionId,
                    messages: [],
                    context: {},
                };
            }

            return {
                sessionId: session.sessionId,
                messages: session.messages,
                context: session.context,
                createdAt: session.createdAt,
            };
        } catch (error) {
            console.error('❌ Error getting conversation history:', error);
            throw error;
        }
    }
}

// Export singleton instance
const chatService = new ChatService();

module.exports = chatService;
