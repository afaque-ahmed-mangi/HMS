import mongoose from "mongoose";

/**
 * Utility to scrub/mask Personally Identifiable Information (PII):
 * - Credit card numbers (13-19 digits, with or without spaces/hyphens)
 * - Email addresses
 * - Phone numbers (various international and local formats)
 */
export function maskPII(text) {
  if (typeof text !== "string") return "";

  // 1. Mask Credit Card numbers (Luhn/standard 13 to 19 digit patterns)
  const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  let sanitized = text.replace(cardRegex, "[CARD_REDACTED]");

  // 2. Mask Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  sanitized = sanitized.replace(emailRegex, "[EMAIL_REDACTED]");

  // 3. Mask Phone numbers (e.g. +1-234-567-8900, (123) 456-7890, 1234567890)
  const phoneRegex = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  sanitized = sanitized.replace(phoneRegex, "[PHONE_REDACTED]");

  return sanitized;
}

const chatLogSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
      index: true
    },
    user_message: {
      type: String,
      required: true
    },
    ai_reply: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true,
      default: "external"
    },
    ip_address_hash: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false }
  }
);

// Pre-save hook to ensure no PII ever gets persisted to the database
chatLogSchema.pre("save", function (next) {
  if (this.user_message) {
    this.user_message = maskPII(this.user_message);
  }
  if (this.ai_reply) {
    this.ai_reply = maskPII(this.ai_reply);
  }
  next();
});

export default mongoose.model("ChatLog", chatLogSchema);
