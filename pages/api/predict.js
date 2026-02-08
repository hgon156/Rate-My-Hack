// pages/api/predict.js - Hackathon prediction via Dedalus Labs (Gemini, GPT-4, etc.).
const LLMWrapper = require('../../llm/llmWrapper');
const { buildPromptParts } = require('../../llm/prompts');
const { EXAMPLE_PROJECTS } = require('../../utils/exampleProjects');

let requestCount = 0;
setInterval(() => { requestCount = 0; }, 60000);

function getErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  if (err.error && typeof err.error === 'object' && err.error.message) return err.error.message;
  return String(err);
}

function send500(res, message) {
  if (res.headersSent) return;
  const body = JSON.stringify({ error: message });
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'));
  res.status(500).end(body);
}

export default async function handler(req, res) {
  const sendErr = (msg) => {
    send500(res, msg);
  };

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.DEDALUS_API_KEY;
    if (!apiKey || apiKey === 'your-dedalus-api-key') {
      return sendErr('Server misconfigured: DEDALUS_API_KEY is missing or invalid. Add your key to .env (see .env.example).');
    }

    requestCount++;
    if (requestCount > 30) {
      console.warn('[predict] High request volume - consider rate limiting');
    }

    const { title, tagline, description } = req.body || {};
    if (!title || !tagline || !description) {
      return res.status(400).json({ error: 'Missing title, tagline, or description' });
    }

    const userProject = { title, tagline, description };
    const examples = Array.isArray(EXAMPLE_PROJECTS) ? EXAMPLE_PROJECTS : [];
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
    console.error('[predict]', getErrorMessage(err));
    if (!res.headersSent) {
      send500(res, getErrorMessage(err) || 'Prediction failed. Check DEDALUS_API_KEY in .env');
    }
  }
}
