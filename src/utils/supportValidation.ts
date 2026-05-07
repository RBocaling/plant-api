const MAX_SUPPORT_MESSAGE_LENGTH = 2000;
const MAX_AI_CHAT_MESSAGE_LENGTH = 1000;

const VALID_URGENCY = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export type SupportUrgencyValue = (typeof VALID_URGENCY)[number];

const sanitizeInput = (value: string) =>
  value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();

export const validateSupportMessage = (message: unknown): string => {
  if (typeof message !== "string") {
    throw new Error("Support message must be a string.");
  }

  const sanitized = sanitizeInput(message);
  if (!sanitized) {
    throw new Error("Support message cannot be empty.");
  }

  if (sanitized.length > MAX_SUPPORT_MESSAGE_LENGTH) {
    throw new Error(
      `Support message must not exceed ${MAX_SUPPORT_MESSAGE_LENGTH} characters.`
    );
  }

  return sanitized;
};

export const validateUrgency = (urgency: unknown): SupportUrgencyValue => {
  if (typeof urgency !== "string" || !urgency.trim()) {
    return "MEDIUM";
  }

  const normalized = sanitizeInput(urgency).toUpperCase();
  if (!VALID_URGENCY.includes(normalized as SupportUrgencyValue)) {
    throw new Error("Urgency must be one of LOW, MEDIUM, HIGH, or URGENT.");
  }

  return normalized as SupportUrgencyValue;
};

export const validateAIChatMessage = (message: unknown): string => {
  if (typeof message !== "string") {
    throw new Error("AI chat message must be a string.");
  }

  const sanitized = sanitizeInput(message);
  if (!sanitized) {
    throw new Error("AI chat message cannot be empty.");
  }

  if (sanitized.length > MAX_AI_CHAT_MESSAGE_LENGTH) {
    throw new Error(
      `AI chat message must not exceed ${MAX_AI_CHAT_MESSAGE_LENGTH} characters.`
    );
  }

  return sanitized;
};

export const getExpectedResponseHours = (
  urgency: SupportUrgencyValue
): number => {
  const mapping: Record<SupportUrgencyValue, number> = {
    LOW: 48,
    MEDIUM: 24,
    HIGH: 12,
    URGENT: 4,
  };

  return mapping[urgency];
};
