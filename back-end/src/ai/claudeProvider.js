import { AIProvider } from "./baseProvider.js";

/**
 * ClaudeProvider
 * Implementation using the Anthropic Messages API (v1/messages).
 */
export class ClaudeProvider extends AIProvider {
  constructor(apiKey = process.env.ANTHROPIC_API_KEY || process.env.AI_API_KEY, model = process.env.CLAUDE_MODEL || "claude-3-haiku-20240307") {
    super();
    if (!apiKey) {
      throw new Error("ClaudeProvider requires an Anthropic API key (ANTHROPIC_API_KEY or AI_API_KEY).");
    }
    this.apiKey = apiKey;
    this.model = model;
    this.url = "https://api.anthropic.com/v1/messages";
  }

  /**
   * Generates response from Claude with Anthropic API
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

    // Anthropic messages format: array of { role: 'user'|'assistant', content: string }
    const formattedMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    if (formattedMessages.length === 0) {
      formattedMessages.push({ role: "user", content: "Hello" });
    }

    const payload = {
      model: this.model,
      max_tokens: 600,
      temperature: 0.2,
      system: systemPrompt,
      messages: formattedMessages
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic Claude API error [${response.status}]: ${errorText}`);
      }

      const data = await response.json();
      const reply = data.content?.[0]?.text;

      if (!reply) {
        throw new Error("No response generated from Anthropic API.");
      }

      return reply.trim();
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        throw new Error("Claude API request timed out after 12 seconds.");
      }
      throw err;
    }
  }
}
