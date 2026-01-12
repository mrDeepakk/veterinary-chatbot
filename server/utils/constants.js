/**
 * Application-wide constants and enums
 */

// Message sender types
const SENDER_TYPES = {
  USER: 'user',
  BOT: 'bot',
};

// Appointment booking states
const APPOINTMENT_STATES = {
  IDLE: 'idle',
  COLLECT_OWNER_NAME: 'collect_owner_name',
  COLLECT_PET_NAME: 'collect_pet_name',
  COLLECT_PHONE: 'collect_phone',
  COLLECT_DATETIME: 'collect_datetime',
  CONFIRM: 'confirm',
  COMPLETE: 'complete',
};

// Appointment status
const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

// Appointment booking trigger keywords
const BOOKING_KEYWORDS = [
  // Direct
  "book appointment",
  "schedule appointment",
  "make appointment",
  "take appointment",

  // Visit based
  "book a visit",
  "schedule visit",
  "vet visit",
  "doctor visit",

  // Need / Want
  "need appointment",
  "want appointment",
  "need a vet",
  "want a vet",
  "need to see a vet",
  "want to see a vet",
  "appointment booking",

  // Casual
  "see a vet",
  "visit vet",
  "go to vet",
  "check up",
  "checkup",

  // Emergency intent
  "my pet is sick",
  "my dog is sick",
  "my cat is sick",
  "urgent",
  "emergency",
  "need help"
];


// Gemini system prompt
const VETERINARY_SYSTEM_PROMPT = `You are a helpful veterinary assistant chatbot. You ONLY answer questions related to:
- Pet health and wellness
- Pet food, diet, and nutrition
- Vaccinations and preventive care
- Illness symptoms, diagnosis, and treatment
- General pet care and behavior
- Pet safety and emergency care

IMPORTANT RULES:
1. If a user asks about anything NOT related to veterinary topics, respond EXACTLY with: "I can only help with veterinary-related questions."
2. Be helpful, caring, and professional
3. If someone needs urgent care, advise them to visit a veterinarian immediately
4. Keep responses concise and actionable
5. Never provide medical diagnoses - only general guidance

Remember: You are NOT a replacement for professional veterinary care.`;

// Non-veterinary topic rejection message
const NON_VET_REJECTION = "I can only help with veterinary-related questions.";

// Phone number validation regex (supports common formats)
const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

// Error messages
const ERROR_MESSAGES = {
  INVALID_SESSION: 'Invalid session ID',
  INVALID_MESSAGE: 'Message is required',
  INVALID_PHONE: 'Please provide a valid phone number (at least 10 digits)',
  INVALID_DATETIME: 'Please provide a valid future date and time',
  GEMINI_ERROR: 'AI service temporarily unavailable. Please try again.',
  DATABASE_ERROR: 'Database error occurred. Please try again.',
  INVALID_NAME: 'Please provide a valid name',
};

module.exports = {
  SENDER_TYPES,
  APPOINTMENT_STATES,
  APPOINTMENT_STATUS,
  BOOKING_KEYWORDS,
  VETERINARY_SYSTEM_PROMPT,
  NON_VET_REJECTION,
  PHONE_REGEX,
  ERROR_MESSAGES,
};
