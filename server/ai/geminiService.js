const { GoogleGenAI } = require("@google/genai");
const { VETERINARY_SYSTEM_PROMPT, NON_VET_REJECTION } = require("../utils/constants");

class GeminiService {
    constructor(apiKey) {
        if (!apiKey) throw new Error("Gemini API key missing");

        this.client = new GoogleGenAI({ apiKey });
        this.model = "gemini-2.5-flash";
    }

    async generateResponse(userMessage, conversationHistory = []) {
        try {
            const contents = [
                {
                    role: "user",
                    parts: [{ text: VETERINARY_SYSTEM_PROMPT }],
                },
                ...conversationHistory.map((m) => ({
                    role: m.sender === "user" ? "user" : "model",
                    parts: [{ text: m.text }],
                })),
                {
                    role: "user",
                    parts: [{ text: userMessage }],
                },
            ];

            const response = await this.client.models.generateContent({
                model: this.model,
                contents,
            });

            const text =
                response.text ||
                response.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm sorry, I couldn't generate a response.";

            if (text.includes(NON_VET_REJECTION)) return NON_VET_REJECTION;

            return text;
        } catch (err) {
            console.error("❌ Gemini error:", err);
            throw new Error("Failed to generate AI response");
        }
    }

    async isVeterinaryTopic(message) {
        try {
            const response = await this.client.models.generateContent({
                model: this.model,
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `Reply ONLY YES or NO.\nIs this veterinary related? "${message}"`,
                            },
                        ],
                    },
                ],
            });

            const text = response.text.trim().toUpperCase();
            return text === "YES";
        } catch (err) {
            console.error("❌ Topic classifier error:", err);
            return true;
        }
    }
}

let instance = null;

const initializeGeminiService = (apiKey) => {
    if (!instance) instance = new GeminiService(apiKey);
    return instance;
};

const getGeminiService = () => {
    if (!instance) throw new Error("Gemini not initialized");
    return instance;
};

module.exports = {
    initializeGeminiService,
    getGeminiService,
};
