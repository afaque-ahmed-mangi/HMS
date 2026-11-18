/**
 * Abstract Base Class for AI Providers
 *
 * Any AI provider (External API, Claude, Gemini, OpenAI, or local custom-trained model)
 * must extend this class and implement generate(messages, context).
 *
 * This abstraction ensures that swapping models requires ONLY changing
 * AI_PROVIDER in .env and implementing a new subclass without touching
 * the frontend or API routes.
 */
export class AIProvider {
  /**
   * Generates a reply from the AI model
   * @param {Array<{role: 'user'|'assistant'|'system', content: string}>} messages - Conversation history
   * @param {string} context - Real-time hotel data (rooms, policies, prices, etc.)
   * @returns {Promise<string>} The assistant's text reply
   */
  async generate(messages, context) {
    throw new Error("Method generate(messages, context) must be implemented by subclass.");
  }
}
