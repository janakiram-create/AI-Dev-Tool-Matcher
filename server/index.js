import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
try {
  const env = readFileSync(join(__dirname, '../.env'), 'utf8');
  env.split('\n').forEach(line => {
    const [k, v] = line.split('=');
    if (k && v) process.env[k.trim()] = v.trim();
  });
} catch {}

const app = express();
const PORT = process.env.PORT || 3002;
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  message: { error: 'rate_limit', retryAfter: 60 },
});
app.use('/api', limiter);

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').slice(0, 500);
}

function sanitizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(sanitize).filter(Boolean).slice(0, 20);
}

async function callClaude(system, userMessage, maxTokens = 2000) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: userMessage }],
  });
  const text = msg.content[0].text.trim();
  const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');
  return JSON.parse(jsonMatch[0]);
}

// POST /api/match
app.post('/api/match', async (req, res) => {
  try {
    const projectTypes = sanitizeArray(req.body.projectTypes);
    const needs = sanitizeArray(req.body.needs);
    const description = sanitize(req.body.description || '');
    const existingStack = sanitizeArray(req.body.existingStack || []);

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

Return a JSON array of 4-6 tool recommendations. Each tool object must have exactly these fields:
{
  "name": "Tool Name",
  "category": "Category (e.g. Database, Auth, Hosting)",
  "tagline": "max 6 words",
  "why": "one sentence specific to THIS project context",
  "match_score": 85,
  "free_tier": true,
  "tags": ["tag1", "tag2", "tag3"],
  "best_for": "short phrase",
  "docs_url": "https://...",
  "pricing_tier": "Free|Freemium|Paid|Open Source",
  "confidence": "high|medium|low"
}

Sort by match_score descending. Scores range 70-99.
${existingStack.length ? `Ensure recommendations are compatible with the existing stack.` : ''}`;

    const tools = await callClaude(system, userMessage, 2500);
    res.json({ tools: Array.isArray(tools) ? tools : tools.tools || [] });
  } catch (err) {
    console.error('/api/match error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/compare
app.post('/api/compare', async (req, res) => {
  try {
    const tools = sanitizeArray(req.body.tools);
    const projectTypes = sanitizeArray(req.body.projectTypes || []);
    const context = sanitize(req.body.context || '');

    if (tools.length < 2) {
      return res.status(400).json({ error: 'Select at least 2 tools to compare' });
    }

    const system = `You are an expert software architect. Compare developer tools objectively.
Return ONLY valid JSON, no markdown.`;

    const toolLabels = tools.map((t, i) => `Tool ${String.fromCharCode(65 + i)}: ${t}`).join('\n');

    const userMessage = `Compare these developer tools for a ${projectTypes.join(', ') || 'general'} project:
${toolLabels}
${context ? `Project context: ${context}` : ''}

Return JSON with exactly this structure:
{
  "comparison_table": [
    {"attribute": "attribute name", ${tools.map((_, i) => `"tool_${String.fromCharCode(97 + i)}_value": "value"`).join(', ')}}
  ],
  "decision_guide": [
    {"scenario": "when to use scenario", "recommended_tool": "Tool Name", "reason": "brief reason"}
  ],
  "migration_path": {
    "from": "${tools[0]}",
    "to": "${tools[1]}",
    "complexity": "Low|Medium|High",
    "steps": ["step 1", "step 2"]
  },
  "final_verdict": {
    "winner": "Tool Name",
    "reason": "clear reason",
    "caveats": ["caveat 1", "caveat 2"]
  }
}

Include 8-10 attributes in comparison_table (setup complexity, learning curve, pricing, scalability, community, docs quality, performance, integrations).
Include 3-4 decision scenarios.`;

    const result = await callClaude(system, userMessage, 2000);
    res.json(result);
  } catch (err) {
    console.error('/api/compare error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/compatibility
app.post('/api/compatibility', async (req, res) => {
  try {
    const tools = sanitizeArray(req.body.tools);
    const projectTypes = sanitizeArray(req.body.projectTypes || []);

    if (tools.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 tools to check compatibility' });
    }

    const system = `You are an expert software architect. Assess tool compatibility honestly.
Return ONLY valid JSON, no markdown.`;

    const userMessage = `Check if these tools work well together for a ${projectTypes.join(', ') || 'general'} project:
${tools.join(', ')}

Return JSON:
{
  "compatible": true,
  "potential_conflicts": [
    {"tool_a": "name", "tool_b": "name", "issue": "description", "solution": "how to resolve"}
  ],
  "integration_notes": ["note 1", "note 2", "note 3"]
}

Be thorough. If no conflicts exist, return empty array for potential_conflicts.`;

    const result = await callClaude(system, userMessage, 1200);
    res.json(result);
  } catch (err) {
    console.error('/api/compatibility error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alternatives
app.post('/api/alternatives', async (req, res) => {
  try {
    const toolName = sanitize(req.body.toolName || '');
    const toolWhy = sanitize(req.body.toolWhy || '');
    const projectTypes = sanitizeArray(req.body.projectTypes || []);
    const needs = sanitizeArray(req.body.needs || []);

    const system = `You are an expert software architect. Suggest practical alternatives.
Return ONLY valid JSON, no markdown.`;

    const userMessage = `Suggest 2 alternatives to ${toolName} for a ${projectTypes.join(', ') || 'general'} project.
Original recommendation reason: ${toolWhy}
Project needs: ${needs.join(', ')}

Return JSON:
{
  "alternatives": [
    {
      "name": "Tool Name",
      "tagline": "max 6 words",
      "why_different": "key differentiator in one sentence",
      "pros_vs_original": ["pro 1", "pro 2"],
      "cons_vs_original": ["con 1", "con 2"],
      "best_when": "use this when...",
      "free_tier": true,
      "pricing_tier": "Free|Freemium|Paid|Open Source",
      "docs_url": "https://..."
    }
  ]
}`;

    const result = await callClaude(system, userMessage, 1200);
    res.json(result);
  } catch (err) {
    console.error('/api/alternatives error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`AI Dev Tool Matcher server running on http://localhost:${PORT}`);
});
