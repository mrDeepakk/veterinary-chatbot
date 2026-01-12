const Appointment = require('../models/Appointment');
const sessionService = require('./sessionService');
const chrono = require('chrono-node');
const {
    APPOINTMENT_STATES,
    APPOINTMENT_STATUS,
    PHONE_REGEX,
    ERROR_MESSAGES,
} = require('../utils/constants');

/**
 * Appointment Service
 */
class AppointmentService {
    /**
     * Process appointment booking flow
     * @param {string} sessionId - Session ID
     * @param {string} userInput - User's current input
     * @returns {Promise<Object>} - Bot response and state info
     */
    async processAppointmentFlow(sessionId, userInput) {
        try {
            // Get current session
            const session = await sessionService.getSession(sessionId);
            const currentState = session.appointmentState || APPOINTMENT_STATES.IDLE;
            const appointmentData = session.appointmentData || {};

            // Process based on current state
            switch (currentState) {
                case APPOINTMENT_STATES.IDLE:
                    return await this._startBooking(sessionId);

                case APPOINTMENT_STATES.COLLECT_OWNER_NAME:
                    return await this._collectOwnerName(sessionId, userInput);

                case APPOINTMENT_STATES.COLLECT_PET_NAME:
                    return await this._collectPetName(sessionId, userInput, appointmentData);

                case APPOINTMENT_STATES.COLLECT_PHONE:
                    return await this._collectPhone(sessionId, userInput, appointmentData);

                case APPOINTMENT_STATES.COLLECT_DATETIME:
                    return await this._collectDateTime(sessionId, userInput, appointmentData);

                case APPOINTMENT_STATES.CONFIRM:
                    return await this._handleConfirmation(sessionId, userInput, appointmentData);

                default:
                    // Reset to idle if unknown state
                    await sessionService.clearAppointmentData(sessionId);
                    return {
                        reply: 'Something went wrong. Let\'s start over. Would you like to book an appointment?',
                        appointmentInProgress: false,
                    };
            }
        } catch (error) {
            console.error('❌ Appointment flow error:', error);
            throw error;
        }
    }

    /**
     * Start booking process
     */
    async _startBooking(sessionId) {
        await sessionService.updateAppointmentState(
            sessionId,
            APPOINTMENT_STATES.COLLECT_OWNER_NAME,
            {}
        );

        return {
            reply: 'I\'d be happy to help you book an appointment! 🐾\n\nMay I have the owner\'s name?',
            appointmentInProgress: true,
            currentField: 'ownerName',
        };
    }

    /**
     * Collect owner name
     */
    async _collectOwnerName(sessionId, userInput) {
        const ownerName = userInput.trim();

        // Validate: must be at least 2 characters and letters only
        if (ownerName.length < 2 || !/^[a-zA-Z\s]+$/.test(ownerName)) {
            return {
                reply: ERROR_MESSAGES.INVALID_NAME + ' (letters only, please)',
                appointmentInProgress: true,
                currentField: 'ownerName',
            };
        }

        await sessionService.updateAppointmentState(
            sessionId,
            APPOINTMENT_STATES.COLLECT_PET_NAME,
            { ownerName }
        );

        return {
            reply: `Thank you, ${ownerName}! What is your pet's name?`,
            appointmentInProgress: true,
            currentField: 'petName',
        };
    }

    /**
     * Collect pet name
     */
    async _collectPetName(sessionId, userInput, appointmentData) {
        const petName = userInput.trim();

        // Validate: must be at least 2 characters and letters only
        if (petName.length < 2 || !/^[a-zA-Z\s]+$/.test(petName)) {
            return {
                reply: ERROR_MESSAGES.INVALID_NAME + ' (letters only, please)',
                appointmentInProgress: true,
                currentField: 'petName',
            };
        }

        await sessionService.updateAppointmentState(
            sessionId,
            APPOINTMENT_STATES.COLLECT_PHONE,
            { ...appointmentData, petName }
        );

        return {
            reply: `Great! Now, may I have your phone number?`,
            appointmentInProgress: true,
            currentField: 'phone',
        };
    }

    /**
     * Collect and validate phone number
     */
    async _collectPhone(sessionId, userInput, appointmentData) {
        const phone = userInput.trim();

        if (!PHONE_REGEX.test(phone)) {
            return {
                reply: ERROR_MESSAGES.INVALID_PHONE,
                appointmentInProgress: true,
                currentField: 'phone',
            };
        }

        await sessionService.updateAppointmentState(
            sessionId,
            APPOINTMENT_STATES.COLLECT_DATETIME,
            { ...appointmentData, phone }
        );

        return {
            reply: 'Perfect! When would you like to schedule the appointment?\n\nPlease provide your preferred date and time (e.g., "Tomorrow at 2pm" or "January 15 at 10:30am")',
            appointmentInProgress: true,
            currentField: 'dateTime',
        };
    }

    /**
     * Collect and parse date/time
     */
    async _collectDateTime(sessionId, userInput, appointmentData) {
        const dateTimeStr = userInput.trim();

        // Parse date/time - simplified validation
        const parsedDate = this._parseDateTime(dateTimeStr);

        if (!parsedDate) {
            return {
                reply: ERROR_MESSAGES.INVALID_DATETIME + '\n\nPlease try again with a format like "Tomorrow at 2pm" or "January 15 at 10:30am"',
                appointmentInProgress: true,
                currentField: 'dateTime',
            };
        }

        // Check if date is in the future
        if (parsedDate <= new Date()) {
            return {
                reply: 'The appointment must be scheduled for a future date and time. Please try again.',
                appointmentInProgress: true,
                currentField: 'dateTime',
            };
        }

        await sessionService.updateAppointmentState(
            sessionId,
            APPOINTMENT_STATES.CONFIRM,
            { ...appointmentData, dateTime: parsedDate.toISOString() }
        );

        // Show confirmation summary
        const summary = this._buildConfirmationSummary({
            ...appointmentData,
            dateTime: parsedDate,
        });

        return {
            reply: summary,
            appointmentInProgress: true,
            currentField: 'confirmation',
        };
    }

    /**
     * Handle confirmation response
     */
    async _handleConfirmation(sessionId, userInput, appointmentData) {
        const response = userInput.toLowerCase().trim();

        // Check for confirmation
        if (response === 'yes' || response === 'confirm' || response === 'y') {
            // Save appointment to database with CONFIRMED status
            const appointment = await this._saveAppointment(sessionId, appointmentData, APPOINTMENT_STATUS.CONFIRMED);

            // Clear appointment state
            await sessionService.clearAppointmentData(sessionId);

            return {
                reply: `✅ Appointment booked successfully!\n\nAppointment ID: ${appointment.appointmentId}\n\nYou will receive a confirmation call/SMS shortly at ${appointmentData.phone}.\n\nIs there anything else I can help you with?`,
                appointmentInProgress: false,
                appointmentId: appointment.appointmentId,
            };
        } else if (response === 'no' || response === 'cancel' || response === 'n') {
            // Cancel booking
            await sessionService.clearAppointmentData(sessionId);

            return {
                reply: 'No problem! The appointment has been cancelled. Feel free to book again anytime.\n\nIs there anything else I can help you with?',
                appointmentInProgress: false,
            };
        } else {
            // Invalid response
            return {
                reply: 'Please respond with "yes" to confirm the appointment or "no" to cancel.',
                appointmentInProgress: true,
                currentField: 'confirmation',
            };
        }
    }

    /**
     * Save appointment to database
     */
    async _saveAppointment(sessionId, appointmentData, status = APPOINTMENT_STATUS.PENDING) {
        try {
            const appointment = await Appointment.create({
                sessionId,
                ownerName: appointmentData.ownerName,
                petName: appointmentData.petName,
                phone: appointmentData.phone,
                dateTime: new Date(appointmentData.dateTime),
                status,
            });

            console.log(`✅ Appointment created: ${appointment.appointmentId} (${status})`);
            return appointment;
        } catch (error) {
            console.error('❌ Error saving appointment:', error);
            throw error;
        }
    }

    /**
     * Build confirmation summary
     */
    _buildConfirmationSummary(data) {
        const formattedDate = new Date(data.dateTime).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        return `📋 **Appointment Summary**\n\n` +
            `👤 Owner: ${data.ownerName}\n` +
            `🐾 Pet: ${data.petName}\n` +
            `📞 Phone: ${data.phone}\n` +
            `📅 Date & Time: ${formattedDate}\n\n` +
            `Please confirm by typing "yes" or cancel by typing "no".`;
    }

    /**
     * Parse date/time using chrono-node for robust natural language parsing
     */
    _parseDateTime(dateTimeStr) {
        try {
            // Use chrono-node to parse natural language dates
            const parsedResults = chrono.parse(dateTimeStr);

            if (parsedResults && parsedResults.length > 0) {
                const parsedDate = parsedResults[0].start.date();

                // Validate the parsed date is valid
                if (parsedDate && !isNaN(parsedDate.getTime())) {
                    return parsedDate;
                }
            }

            // Fallback: try direct Date parsing
            const directParsed = new Date(dateTimeStr);
            if (!isNaN(directParsed.getTime())) {
                return directParsed;
            }

            return null;
        } catch (error) {
            console.error('❌ Date parsing error:', error);
            return null;
        }
    }
}

// Export singleton instance
const appointmentService = new AppointmentService();

module.exports = appointmentService;
