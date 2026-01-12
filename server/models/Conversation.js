const mongoose = require('mongoose');
const { SENDER_TYPES } = require('../utils/constants');

/**
 * Message subdocument schema
 */
const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: Object.values(SENDER_TYPES),
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

/**
 * Conversation schema
 * Stores all chat messages for a session with optional user context
 */
const conversationSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        messages: [messageSchema],
        context: {
            userId: {
                type: String,
                default: null,
            },
            userName: {
                type: String,
                default: null,
            },
            petName: {
                type: String,
                default: null,
            },
            source: {
                type: String,
                default: null,
            },
        },
        // Track appointment booking state for this session
        appointmentState: {
            type: String,
            default: 'idle',
        },
        // Temporary storage for appointment data being collected
        appointmentData: {
            ownerName: String,
            petName: String,
            phone: String,
            dateTime: String,
        },
    },
    {
        timestamps: true,
    }
);

conversationSchema.index({ sessionId: 1 });

conversationSchema.index({ createdAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
