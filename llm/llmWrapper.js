// llmWrapper.js - Dedalus Labs unified API. One key for Gemini, GPT-4, Claude, etc.
require('dotenv').config();

const OpenAI = require("openai").default;

const DEDALUS_BASE = "https://api.dedaluslabs.ai/v1";

class LLMWrapper {
  constructor(model) {
    this.client = new OpenAI({
      apiKey: process.env.DEDALUS_API_KEY,
      baseURL: DEDALUS_BASE
    });
    this.model = model || process.env.DEDALUS_MODEL || "google/gemini-2.0-flash";
  }

  async generate(promptData) {
    const messages = [];
    if (promptData.system) {
      messages.push({ role: "system", content: promptData.system });
    }
    if (promptData.user) {
      messages.push({ role: "user", content: promptData.user });
    } else if (typeof promptData === "string") {
      messages.push({ role: "user", content: promptData });
    }
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages
    });
    return completion.choices[0].message.content;
  }
}

module.exports = LLMWrapper;
