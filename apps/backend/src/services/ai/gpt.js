const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});
class PromptEngineering {
  constructor() {}
  async streamResponse(payload) {
    return openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...payload.conversation,
        ...payload.systemInstructions,
        { role: "user", content: `${payload.prompt}` },
      ],
      max_tokens: 2550,
      temperature: 0.2,
      stream: true,
    });
  }
  async normalResponse(payload) {
    return openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...payload.conversation,
        ...payload.systemInstructions,
        { role: "user", content: `${payload.prompt}` },
      ],
      max_tokens: 2550,
      temperature: 0.2,
    });
  }
}

module.exports = { PromptEngineering };
