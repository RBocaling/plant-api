"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpectedResponseHours = exports.validateAIChatMessage = exports.validateUrgency = exports.validateSupportMessage = void 0;
const MAX_SUPPORT_MESSAGE_LENGTH = 2000;
const MAX_AI_CHAT_MESSAGE_LENGTH = 1000;
const VALID_URGENCY = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const sanitizeInput = (value) => value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
const validateSupportMessage = (message) => {
    if (typeof message !== "string") {
        throw new Error("Support message must be a string.");
    }
    const sanitized = sanitizeInput(message);
    if (!sanitized) {
        throw new Error("Support message cannot be empty.");
    }
    if (sanitized.length > MAX_SUPPORT_MESSAGE_LENGTH) {
        throw new Error(`Support message must not exceed ${MAX_SUPPORT_MESSAGE_LENGTH} characters.`);
    }
    return sanitized;
};
exports.validateSupportMessage = validateSupportMessage;
const validateUrgency = (urgency) => {
    if (typeof urgency !== "string" || !urgency.trim()) {
        return "MEDIUM";
    }
    const normalized = sanitizeInput(urgency).toUpperCase();
    if (!VALID_URGENCY.includes(normalized)) {
        throw new Error("Urgency must be one of LOW, MEDIUM, HIGH, or URGENT.");
    }
    return normalized;
};
exports.validateUrgency = validateUrgency;
const validateAIChatMessage = (message) => {
    if (typeof message !== "string") {
        throw new Error("AI chat message must be a string.");
    }
    const sanitized = sanitizeInput(message);
    if (!sanitized) {
        throw new Error("AI chat message cannot be empty.");
    }
    if (sanitized.length > MAX_AI_CHAT_MESSAGE_LENGTH) {
        throw new Error(`AI chat message must not exceed ${MAX_AI_CHAT_MESSAGE_LENGTH} characters.`);
    }
    return sanitized;
};
exports.validateAIChatMessage = validateAIChatMessage;
const getExpectedResponseHours = (urgency) => {
    const mapping = {
        LOW: 48,
        MEDIUM: 24,
        HIGH: 12,
        URGENT: 4,
    };
    return mapping[urgency];
};
exports.getExpectedResponseHours = getExpectedResponseHours;
