import { GeminiProvider } from "./geminiProvider.js";
import { ClaudeProvider } from "./claudeProvider.js";
import { LocalProvider } from "./localProvider.js";

/**
 * AI Service Factory
 * Picks the provider using environment variable AI_PROVIDER ("claude", "gemini", "external", or "local")
 *
 * Swapping models only requires changing AI_PROVIDER in .env and the provider file.
 */
class AIService {
  constructor() {
    this.providerInstance = null;
  }

  /**
   * Initializes or returns the configured AI provider instance.
   */
  getProvider() {
    const providerName = (process.env.AI_PROVIDER || "external").toLowerCase().trim();

    switch (providerName) {
      case "claude":
        return new ClaudeProvider();
      case "local":
        return new LocalProvider();
      case "gemini":
      case "external":
      default:
        return new GeminiProvider();
    }
  }

  /**
   * Generates a reply by delegating to the chosen provider
   * @param {Array<{role: string, content: string}>} messages
   * @param {string} context
   * @returns {Promise<{ reply: string, provider: string }>}
   */
  async generateReply(messages, context = "") {
    const providerName = (process.env.AI_PROVIDER || "external").toLowerCase().trim();
    const provider = this.getProvider();

    const reply = await provider.generate(messages, context);
    return {
      reply,
      provider: providerName
    };
  }
}

export const aiService = new AIService();
export default aiService;
