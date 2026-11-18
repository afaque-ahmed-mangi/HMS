import express from "express";
import crypto from "crypto";
import aiService from "../ai/aiService.js";
import { getHotelContext } from "../services/hotelContext.js";
import ChatLog, { maskPII } from "../models/ChatLog.js";

const router = express.Router();

// -------------------------------------------------------------
// In-Memory Rate Limiting: 20 requests per minute per IP
// -------------------------------------------------------------
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function rateLimiter(req, res, next) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();

  const timestamps = rateLimitMap.get(ip) || [];
  const recentTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      reply: "Rate limit exceeded. You can only send 20 messages per minute. Please wait a moment.",
      error: "Too many requests"
    });
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);

  // Periodic cleanup of stale IPs
  if (rateLimitMap.size > 2000) {
    for (const [key, times] of rateLimitMap.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(key);
      }
    }
  }

  next();
}

// -------------------------------------------------------------
// In-Memory Session History: Keep last 10 messages per session_id
// -------------------------------------------------------------
const sessionHistories = new Map();
const MAX_HISTORY_MESSAGES = 10;

function getSessionHistory(sessionId) {
  if (!sessionHistories.has(sessionId)) {
    sessionHistories.set(sessionId, []);
  }
  return sessionHistories.get(sessionId);
}

function addToSessionHistory(sessionId, role, content) {
  const history = getSessionHistory(sessionId);
  history.push({ role, content });
  if (history.length > MAX_HISTORY_MESSAGES) {
    history.splice(0, history.length - MAX_HISTORY_MESSAGES);
  }
  sessionHistories.set(sessionId, history);
}

// -------------------------------------------------------------
// Input Sanitizer: Max 500 chars, strip HTML, mask PII before AI
// -------------------------------------------------------------
function sanitizeInput(raw) {
  if (typeof raw !== "string") return "";
  // Strip HTML tags
  let cleaned = raw.replace(/<[^>]*>?/gm, "").trim();
  // Limit to 500 characters
  if (cleaned.length > 500) {
    cleaned = cleaned.substring(0, 500);
  }
  return cleaned;
}

// -------------------------------------------------------------
// POST /api/chat & POST /api/v1/chat
// Accepts: { message: string, session_id?: string }
// Returns: { reply: string }
// -------------------------------------------------------------
router.post("/", rateLimiter, async (req, res) => {
  try {
    const rawMessage = req.body?.message;
    let sessionId = req.body?.session_id;

    if (!rawMessage || typeof rawMessage !== "string" || !rawMessage.trim()) {
      return res.status(400).json({
        success: false,
        reply: "Please provide a valid message.",
        error: "Message is required"
      });
    }

    // Auto-generate session_id if none provided
    if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = sanitizeInput(sessionId).substring(0, 64);
    }

    // Sanitize user message
    const sanitizedUserMessage = sanitizeInput(rawMessage);
    const safePromptMessage = maskPII(sanitizedUserMessage);

    // Retrieve conversation history for this session
    const history = getSessionHistory(sessionId);

    // Fetch live hotel context from database
    const context = await getHotelContext();

    // Prepare message history payload for the AI model
    const messagesToSend = [...history, { role: "user", content: safePromptMessage }];

    let reply = "";
    let providerName = process.env.AI_PROVIDER || "external";

    try {
      const aiResult = await aiService.generateReply(messagesToSend, context);
      reply = aiResult.reply;
      providerName = aiResult.provider;
    } catch (aiErr) {
      console.error("AI Generation Error:", aiErr.message);
      // Friendly fallback reply
      reply =
        "I'm sorry, our AI assistant is momentarily unavailable. " +
        "For immediate room availability, booking inquiries, or assistance, please contact the front desk at +1 (555) 019-2834 or visit the reception office on the ground floor.";
    }

    // Update conversation history
    addToSessionHistory(sessionId, "user", sanitizedUserMessage);
    addToSessionHistory(sessionId, "assistant", reply);

    // Async log to MongoDB chat_logs (with PII automatically masked by model hook)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16) : "";

    ChatLog.create({
      session_id: sessionId,
      user_message: sanitizedUserMessage,
      ai_reply: reply,
      provider: providerName,
      ip_address_hash: ipHash
    }).catch((logErr) => {
      console.warn("Could not save chat log:", logErr.message);
    });

    return res.json({
      success: true,
      reply,
      session_id: sessionId
    });
  } catch (err) {
    console.error("Chat route unhandled error:", err);
    return res.status(500).json({
      success: false,
      reply: "An unexpected error occurred. Please contact the front desk.",
      error: err.message
    });
  }
});

export default router;
