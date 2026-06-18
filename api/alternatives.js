import { callClaude, cors, sanitize, sanitizeArray } from './_claude.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const toolName = sanitize(req.body?.toolName || '');
    const toolWhy = sanitize(req.body?.toolWhy || '');
    const projectTypes = sanitizeArray(req.body?.projectTypes || []);
    const needs = sanitizeArray(req.body?.needs || []);

    const system = `You are an expert software architect. Suggest practical alternatives.
Return ONLY valid JSON, no markdown.`;

    const userMessage = `Suggest 2 alternatives to ${toolName} for a ${projectTypes.join(', ') || 'general'} project.
Original recommendation reason: ${toolWhy}
Project needs: ${needs.join(', ')}

Return JSON:
{
  "alternatives": [{
    "name": "...", "tagline": "max 6 words", "why_different": "one sentence",
    "pros_vs_original": ["pro 1", "pro 2"],
    "cons_vs_original": ["con 1", "con 2"],
    "best_when": "use this when...",
    "free_tier": true,
    "pricing_tier": "Free|Freemium|Paid|Open Source",
    "docs_url": "https://..."
  }]
}`;

    const result = await callClaude(system, userMessage, 1200);
    return res.json(result);
  } catch (err) {
    console.error('/api/alternatives error:', err.message);
    return res.status(err.status || 500).json({ error: err.message });
  }
}
