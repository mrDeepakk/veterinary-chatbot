const appointmentService = require('../services/appointmentService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Appointment Controller
 * Handles HTTP requests for appointment operations
 * POST /api/appointment/book
 */
const bookAppointment = asyncHandler(async (req, res) => {
    const { sessionId, userInput } = req.body;

    // Validate inputs
    if (!sessionId || !userInput) {
        return res.status(400).json({
            success: false,
            error: { message: 'SessionId and userInput are required' },
        });
    }

    // Process through appointment service
    const result = await appointmentService.processAppointmentFlow(sessionId, userInput);

    res.status(200).json({
        success: true,
        data: result,
    });
});

module.exports = {
    bookAppointment,
};
