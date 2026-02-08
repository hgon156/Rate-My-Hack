// pages/api/predict.js - Hackathon prediction via Dedalus Labs (Gemini, GPT-4, etc.).
const LLMWrapper = require('../../llm/llmWrapper');
const { buildPromptParts } = require('../../llm/prompts');
const { getExampleProjects } = require('../../utils/exampleProjects');

let requestCount = 0;
setInterval(() => { requestCount = 0; }, 60000);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  requestCount++;
  if (requestCount > 30) {
    console.warn('[predict] High request volume - consider rate limiting');
  }

  try {
    const { title, tagline, description } = req.body || {};
    if (!title || !tagline || !description) {
      return res.status(400).json({ error: 'Missing title, tagline, or description' });
    }

    const userProject = { title, tagline, description };
    const examples = getExampleProjects();
    const { system, user } = buildPromptParts(userProject, examples);
    const llm = new LLMWrapper(process.env.DEDALUS_MODEL);
    const rawText = await llm.generate({ system, user });

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : rawText;
    const parsed = JSON.parse(jsonStr);

    const score = Math.min(6, Math.max(1, Number(parsed.score) || 0));
    const phrase = String(parsed.phrase || '');
    const reasons = Array.isArray(parsed.reasons) ? parsed.reasons.slice(0, 3) : [];

    return res.status(200).json({ score, phrase, reasons });
  } catch (err) {
    console.error('[predict]', err.message);
    return res.status(500).json({
      error: err.message || 'Prediction failed. Check DEDALUS_API_KEY in .env'
    });
  }
}
