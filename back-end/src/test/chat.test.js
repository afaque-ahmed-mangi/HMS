import { describe, it } from "node:test";
import assert from "node:assert";
import { AIProvider } from "../ai/baseProvider.js";
import { LocalProvider, NotImplementedError } from "../ai/localProvider.js";
import { maskPII } from "../models/ChatLog.js";

describe("AI Provider Abstraction Layer", () => {
  it("base AIProvider should throw if generate is called directly", async () => {
    const base = new AIProvider();
    await assert.rejects(
      async () => {
        await base.generate([], "");
      },
      /Method generate\(messages, context\) must be implemented/
    );
  });

  it("LocalProvider should throw NotImplementedError when custom model is not implemented", async () => {
    const local = new LocalProvider();
    await assert.rejects(
      async () => {
        await local.generate([{ role: "user", content: "Hi" }], "");
      },
      (err) => {
        return err instanceof NotImplementedError && err.message.includes("Local trained model provider is a placeholder");
      }
    );
  });
});

describe("Data Collection & PII Scrubbing", () => {
  it("should mask credit card numbers", () => {
    const text = "Here is my card 4532-1234-5678-9012 to pay";
    const masked = maskPII(text);
    assert.ok(!masked.includes("4532-1234-5678-9012"));
    assert.ok(masked.includes("[CARD_REDACTED]"));
  });

  it("should mask email addresses", () => {
    const text = "Contact me at student@university.edu please";
    const masked = maskPII(text);
    assert.ok(!masked.includes("student@university.edu"));
    assert.ok(masked.includes("[EMAIL_REDACTED]"));
  });

  it("should mask phone numbers", () => {
    const text = "Call me at +1 234-567-8901 tomorrow";
    const masked = maskPII(text);
    assert.ok(!masked.includes("234-567-8901"));
    assert.ok(masked.includes("[PHONE_REDACTED]"));
  });
});
