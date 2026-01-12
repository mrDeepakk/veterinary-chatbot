const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { APPOINTMENT_STATUS } = require('../utils/constants');

/**
 * Appointment schema
 */
const appointmentSchema = new mongoose.Schema(
    {
        appointmentId: {
            type: String,
            default: uuidv4,
            unique: true,
            index: true,
        },
        sessionId: {
            type: String,
            required: true,
            index: true,
            ref: 'Conversation',
        },
        ownerName: {
            type: String,
            required: true,
            trim: true,
        },
        petName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        dateTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(APPOINTMENT_STATUS),
            default: APPOINTMENT_STATUS.PENDING,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
appointmentSchema.index({ sessionId: 1 });
appointmentSchema.index({ dateTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

// Virtual for formatted date display
appointmentSchema.virtual('formattedDateTime').get(function () {
    return this.dateTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
