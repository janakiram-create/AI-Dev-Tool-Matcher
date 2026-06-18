import { callClaude, cors, sanitize, sanitizeArray } from './_claude.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const tools = sanitizeArray(req.body?.tools);
    const projectTypes = sanitizeArray(req.body?.projectTypes || []);
    const context = sanitize(req.body?.context || '');

    if (tools.length < 2) return res.status(400).json({ error: 'Select at least 2 tools' });

    const system = `You are an expert software architect. Compare developer tools objectively.
Return ONLY valid JSON, no markdown.`;

    const toolLabels = tools.map((t, i) => `Tool ${String.fromCharCode(65 + i)}: ${t}`).join('\n');
    const userMessage = `Compare these developer tools for a ${projectTypes.join(', ') || 'general'} project:
${toolLabels}
${context ? `Project context: ${context}` : ''}

Return JSON:
{
  "comparison_table": [{"attribute": "...", ${tools.map((_, i) => `"tool_${String.fromCharCode(97+i)}_value": "..."`).join(', ')}}],
  "decision_guide": [{"scenario": "...", "recommended_tool": "...", "reason": "..."}],
  "migration_path": {"from": "${tools[0]}", "to": "${tools[1]}", "complexity": "Low|Medium|High", "steps": ["..."]},
  "final_verdict": {"winner": "...", "reason": "...", "caveats": ["..."]}
}
Include 8-10 attributes (setup, learning curve, pricing, scalability, community, docs, performance, integrations).
Include 3-4 decision scenarios.`;

    const result = await callClaude(system, userMessage, 2000);
    return res.json(result);
  } catch (err) {
    console.error('/api/compare error:', err.message);
    return res.status(err.status || 500).json({ error: err.message });
  }
}
