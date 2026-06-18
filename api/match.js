import { callClaude, cors, sanitize, sanitizeArray } from './_claude.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const projectTypes = sanitizeArray(req.body?.projectTypes);
    const needs = sanitizeArray(req.body?.needs);
    const description = sanitize(req.body?.description || '');
    const existingStack = sanitizeArray(req.body?.existingStack || []);

    if (projectTypes.length === 0 && needs.length === 0) {
      return res.status(400).json({ error: 'Select at least one project type or need' });
    }

    const system = `You are an expert software architect and developer tool advisor.
Recommendations are practical, current, and based on real-world usage.
You understand trade-offs deeply.
Return ONLY valid JSON, no markdown, no explanation outside the JSON.`;

    const userMessage = `Analyze this project and recommend the best development tools.

Project types: ${projectTypes.length ? projectTypes.join(', ') : 'not specified'}
Needs: ${needs.length ? needs.join(', ') : 'not specified'}
${description ? `Project description: ${description}` : ''}
${existingStack.length ? `Already using: ${existingStack.join(', ')}` : ''}

Return a JSON array of 4-6 tool recommendations. Each tool must have exactly these fields:
{
  "name": "Tool Name",
  "category": "Category",
  "tagline": "max 6 words",
  "why": "one sentence specific to THIS project",
  "match_score": 85,
  "free_tier": true,
  "tags": ["tag1", "tag2", "tag3"],
  "best_for": "short phrase",
  "docs_url": "https://...",
  "pricing_tier": "Free|Freemium|Paid|Open Source",
  "confidence": "high|medium|low"
}
Sort by match_score descending. Scores 70-99.
${existingStack.length ? 'Ensure recommendations are compatible with the existing stack.' : ''}`;

    const tools = await callClaude(system, userMessage, 2500);
    return res.json({ tools: Array.isArray(tools) ? tools : tools.tools || [] });
  } catch (err) {
    console.error('/api/match error:', err.message);
    if (err.status === 429) {
      if (err.retryAfter) res.setHeader('Retry-After', err.retryAfter);
      return res.status(429).json({ error: 'rate_limit' });
    }
    return res.status(500).json({ error: err.message });
  }
}
