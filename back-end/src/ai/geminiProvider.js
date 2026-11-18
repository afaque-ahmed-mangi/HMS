import { AIProvider } from "./baseProvider.js";

/**
 * GeminiProvider
 * Uses Google Generative Language API (Gemini) with the provided API key.
 */
export class GeminiProvider extends AIProvider {
  constructor(apiKey = process.env.AI_API_KEY, model = process.env.AI_MODEL || "gemini-3.5-flash-lite") {
    super();
    if (!apiKey) {
      throw new Error("GeminiProvider requires AI_API_KEY in environment variables.");
    }
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
  }

  /**
   * Generates response from Gemini with system instructions and live context
   */
  async generate(messages, context = "") {
    const systemPrompt = `You are the polite, helpful, and professional AI Assistant for our Hotel & Hostel Management System.

STRICT OPERATIONAL RULES:
1. Answer ONLY using the provided verified hotel context data below.
2. If the user asks something not covered in the context, politely reply: "I don't know, please contact the front desk for further assistance."
3. NEVER invent or assume prices, room availability, or amenities that are not explicitly listed.
4. You CANNOT create, change, or cancel bookings directly. Suggest that the guest visit the front desk, contact management, or use the official booking portal.
5. Keep answers concise, clear, and friendly.

VERIFIED HOTEL CONTEXT & CURRENT STATUS:
${context || "No current room or fee data available. Direct all queries to the front desk."}`;

    // Format previous messages for Gemini API
    const formattedContents = [];

    // Add conversation history
    for (const msg of messages) {
      const role = msg.role === "assistant" ? "model" : "user";
      formattedContents.push({
        role,
        parts: [{ text: msg.content }]
      });
    }

    // Ensure we have at least one user message
    if (formattedContents.length === 0) {
      formattedContents.push({
        role: "user",
        parts: [{ text: "Hello" }]
      });
    }

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.2, // Low temperature for deterministic, factual responses
        maxOutputTokens: 600,
      }
    };

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12-second timeout

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error [${response.status}]: ${errorText}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const reply = candidate?.content?.parts?.[0]?.text;

      if (!reply) {
        throw new Error("No response generated from Gemini API.");
      }

      return reply.trim();
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        throw new Error("AI request timed out after 12 seconds.");
      }
      throw err;
    }
  }
}
