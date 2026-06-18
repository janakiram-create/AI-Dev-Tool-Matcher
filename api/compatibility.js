import { callClaude, cors, sanitizeArray } from './_claude.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const tools = sanitizeArray(req.body?.tools);
    const projectTypes = sanitizeArray(req.body?.projectTypes || []);

    if (tools.length < 2) return res.status(400).json({ error: 'Need at least 2 tools' });

    const system = `You are an expert software architect. Assess tool compatibility honestly.
Return ONLY valid JSON, no markdown.`;

    const userMessage = `Check if these tools work well together for a ${projectTypes.join(', ') || 'general'} project:
${tools.join(', ')}

Return JSON:
{
  "compatible": true,
  "potential_conflicts": [{"tool_a": "...", "tool_b": "...", "issue": "...", "solution": "..."}],
  "integration_notes": ["note 1", "note 2", "note 3"]
}`;

    const result = await callClaude(system, userMessage, 1200);
    return res.json(result);
  } catch (err) {
    console.error('/api/compatibility error:', err.message);
    return res.status(err.status || 500).json({ error: err.message });
  }
}
