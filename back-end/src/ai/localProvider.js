import { AIProvider } from "./baseProvider.js";

/**
 * Custom Error for unimplemented local model provider
 */
export class NotImplementedError extends Error {
  constructor(message = "NotImplementedError: Local model provider is not yet implemented.") {
    super(message);
    this.name = "NotImplementedError";
  }
}

/**
 * LocalProvider (Placeholder for custom fine-tuned or locally hosted model)
 *
 * When you train your own model (e.g., using Ollama, vLLM, HuggingFace, or ONNX),
 * implement the call to your local model endpoint inside generate(messages, context).
 *
 * To activate:
 * 1. Set AI_PROVIDER=local in back-end/.env
 * 2. Implement your local model inference logic below.
 */
export class LocalProvider extends AIProvider {
  constructor(options = {}) {
    super();
    this.endpoint = options.endpoint || process.env.LOCAL_MODEL_ENDPOINT || "http://localhost:11434/api/generate";
    this.modelName = options.modelName || process.env.LOCAL_MODEL_NAME || "custom-hotel-model";
  }

  /**
   * Generates a reply using the locally deployed model.
   * Currently raises NotImplementedError until you plug in your trained weights.
   */
  async generate(_messages, _context) {
    throw new NotImplementedError(
      "Local trained model provider is a placeholder. " +
      "To use your own model, implement the inference call in back-end/src/ai/localProvider.js " +
      "or point it to your local inference server (e.g., Ollama/vLLM)."
    );
  }
}
