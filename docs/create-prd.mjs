import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Header, Footer, ExternalHyperlink
} from 'docx';
import { writeFileSync } from 'fs';

const DOCS = 'C:/Users/janak/OneDrive/Documents/Attachments/Desktop/may5/aipm/projects/ai-dev-tool-matcher/docs';

const PRIMARY = '534AB7';
const LIGHT_BG = 'EEEDf9';
const GRAY_BG = 'F9FAFB';
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, color: PRIMARY, font: 'Arial' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY, space: 4 } }
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, color: '1F2937', font: 'Arial' })]
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 22, color: PRIMARY, font: 'Arial' })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: '374151', ...opts })]
  });
}

function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: '374151', bold })]
  });
}

function space(lines = 1) {
  return new Paragraph({ spacing: { before: 0, after: lines * 80 }, children: [new TextRun('')] });
}

function labeledRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2400, type: WidthType.DXA }, borders: BORDERS,
        shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: 'Arial', color: '374151' })] })]
      }),
      new TableCell({
        width: { size: 7000, type: WidthType.DXA }, borders: BORDERS,
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: 'Arial', color: '374151' })] })]
      })
    ]
  });
}

function infoTable(rows) {
  return new Table({
    width: { size: 9400, type: WidthType.DXA },
    columnWidths: [2400, 7000],
    rows: rows.map(([l, v]) => labeledRow(l, v))
  });
}

function headerBar(text, color = PRIMARY) {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
    shading: { fill: color, type: ShadingType.CLEAR },
    children: [new TextRun({ text, bold: true, size: 20, font: 'Arial', color: 'FFFFFF' })],
    indent: { left: 160 }
  });
}

function styledTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => new TableCell({
          width: { size: colWidths[i], type: WidthType.DXA }, borders: BORDERS,
          shading: { fill: PRIMARY, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, font: 'Arial', color: 'FFFFFF' })] })]
        }))
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, ci) => new TableCell({
          width: { size: colWidths[ci], type: WidthType.DXA }, borders: BORDERS,
          shading: { fill: ri % 2 === 0 ? 'FFFFFF' : GRAY_BG, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 19, font: 'Arial', color: '374151' })] })]
        }))
      }))
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: 'numbers',
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: 'Arial', color: PRIMARY }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: 'Arial', color: '1F2937' }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY, space: 4 } },
          children: [
            new TextRun({ text: 'AI Dev Tool Matcher  |  Product Requirements Document', size: 18, font: 'Arial', color: '6B7280' }),
            new TextRun({ text: '  |  Confidential', size: 18, font: 'Arial', color: 'D1D5DB' })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Page ', size: 18, font: 'Arial', color: '9CA3AF' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Arial', color: '9CA3AF' }),
            new TextRun({ text: ' of ', size: 18, font: 'Arial', color: '9CA3AF' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: 'Arial', color: '9CA3AF' })
          ]
        })]
      })
    },
    children: [

      // ─── COVER ───────────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 120 },
        children: [new TextRun({ text: 'AIPM PROGRAMME  ·  PROJECT 2', size: 22, font: 'Arial', color: '9CA3AF', bold: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: 'AI Dev Tool Matcher', size: 60, bold: true, font: 'Arial', color: PRIMARY })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: 'Product Requirements Document', size: 30, font: 'Arial', color: '374151' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 480 },
        children: [new TextRun({ text: 'AI-powered tool recommendations for developers — the right tool for the right job, instantly', size: 22, font: 'Arial', color: '6B7280', italics: true })]
      }),

      infoTable([
        ['Version', 'v1.0'],
        ['Date', 'June 2026'],
        ['Author', 'AIPM Team'],
        ['Status', 'Approved for Development'],
        ['Tech Stack', 'React · Express · Claude claude-sonnet-4-6'],
      ]),

      space(3),

      // ─── 1. EXECUTIVE SUMMARY ────────────────────────────────────────────────
      h1('1. Executive Summary'),
      body('AI Dev Tool Matcher is a developer-facing web application that uses Claude to analyse project context and instantly recommend the best development tools — with match scores, reasoning, and side-by-side comparisons.'),
      space(),
      h3('What'),
      body('A single-page web app where developers describe their project (type, needs, existing stack) and receive 4–6 ranked tool recommendations with match scores, "why it fits" explanations, and comparison features — in under 60 seconds.'),
      h3('Who'),
      body('Developers (junior to senior) starting new projects or evaluating tech stacks. Time-poor, research-fatigued, and sceptical of generic recommendations.'),
      h3('Why Now'),
      body('Developer tooling has exploded: there are now hundreds of credible choices for every category (databases, auth, hosting, payments). The manual research process — Reddit threads, Stack Overflow, benchmarks, docs-reading — takes hours and produces inconsistent decisions. LLMs can collapse this to seconds.'),
      h3('Unique Angle'),
      body('Unlike StackShare (community-driven, static) or ChatGPT (generic, no scoring), AI Dev Tool Matcher provides project-specific recommendations with quantified match scores, trust signals (confidence levels), and a structured comparison feature that mirrors how experienced engineers actually evaluate tools.'),

      space(2),

      // ─── 2. PROBLEM STATEMENT ────────────────────────────────────────────────
      h1('2. Problem Statement'),
      h3('Developer Pain'),
      body('Developers waste 2–4 hours per project researching tools across Reddit, Stack Overflow, GitHub stars, blog posts, and official documentation. The process is:'),
      bullet('Fragmented — no single source of truth'),
      bullet('Inconsistent — decisions depend on who asks the question and when'),
      bullet('Uncontextual — generic advice doesn\'t account for team size, budget, or existing stack'),
      bullet('Trust-deficient — hard to know which recommendations are current and battle-tested'),
      space(),
      h3('Market Opportunity'),
      body('Developer tooling is a $50B+ market. Tool selection happens at the start of every project — a high-frequency, high-stakes decision point. No product currently combines AI reasoning with quantified match scoring and developer trust signals in a single focused tool.'),

      space(2),

      // ─── 3. GOALS & SUCCESS METRICS ──────────────────────────────────────────
      h1('3. Goals & Success Metrics'),
      h2('OKR 1 — Recommendation Quality'),
      styledTable(
        ['Metric', 'Target', 'Measurement Method'],
        [
          ['Recommendation accuracy rate', '>80% thumbs up', 'In-app thumbs up/down per tool card'],
          ['User-accepted recommendations', '>60% implement at least 1 tool', 'Follow-up survey at 30 days'],
          ['Tool diversity score', '<40% same tool repeated across sessions', 'Server-side analytics on tool frequency'],
        ],
        [3800, 2800, 2800]
      ),
      space(),
      h2('OKR 2 — Developer Experience'),
      styledTable(
        ['Metric', 'Target', 'Measurement Method'],
        [
          ['Time to first recommendation', '<60 seconds', 'Client-side timer from page load to results'],
          ['Return usage rate', '>35% use for 2+ projects', 'Session tracking via localStorage / analytics'],
          ['Stack completion rate', '>55% reach Stack Summary', 'Funnel analytics: input → results → summary'],
        ],
        [3800, 2800, 2800]
      ),
      space(),
      h2('OKR 3 — Growth & Trust'),
      styledTable(
        ['Metric', 'Target', 'Measurement Method'],
        [
          ['Organic referral rate', '>25% new users via shared links', 'URL param tracking (?stack=)'],
          ['GitHub stars (if open-sourced)', '>500 in 90 days', 'GitHub API'],
          ['Support tickets: bad recommendations', '<5% of sessions', 'Support inbox categorisation'],
        ],
        [3800, 2800, 2800]
      ),
      space(),
      h3('North Star Metric'),
      body('User-accepted recommendation rate — the % of recommended tools that developers actually implement. This captures both recommendation quality and user trust, and is unique to a developer tool product.'),

      space(2),

      // ─── 4. USER PERSONAS ─────────────────────────────────────────────────────
      h1('4. User Personas'),
      h2('Persona A — The Junior Developer'),
      styledTable(
        ['Attribute', 'Detail'],
        [
          ['Name', 'Priya, 23, first real freelance project'],
          ['Goal', 'Ship something working without embarrassing tech choices'],
          ['Frustration', 'Overwhelmed by options; afraid of picking something that won\'t scale'],
          ['Research today', 'Reddit, YouTube tutorials, asks in Discord, copies from tutorials'],
          ['What they need', 'Confidence: "This is the right choice for someone at your level"'],
          ['Quote', '"I just need someone to tell me what to use. I don\'t have time to evaluate 10 databases."'],
        ],
        [2400, 6960]
      ),
      space(),
      h2('Persona B — The Senior Tech Lead'),
      styledTable(
        ['Attribute', 'Detail'],
        [
          ['Name', 'Marcus, 34, CTO of a 12-person startup'],
          ['Goal', 'Make defensible tool decisions fast; avoid technical debt'],
          ['Frustration', 'Generic recommendations ignore his specific constraints (team size, existing stack, budget)'],
          ['Research today', 'GitHub issues, production case studies, colleagues, architectural decision records'],
          ['What they need', 'Specificity: "Why does THIS tool fit MY context" + trade-off transparency'],
          ['Quote', '"Show me the reasoning, not just the recommendation. I can handle nuance."'],
        ],
        [2400, 6960]
      ),

      space(2),

      // ─── 5. USER STORIES ─────────────────────────────────────────────────────
      h1('5. User Stories'),
      styledTable(
        ['#', 'Story', 'Priority', 'Points'],
        [
          ['US-01', 'As a developer starting a SaaS, I want database recommendations, so I can choose one with confidence before writing any code.', 'P1', '8'],
          ['US-02', 'As a developer, I want to select my project type and needs via chips, so I can describe my project without writing a paragraph.', 'P1', '3'],
          ['US-03', 'As a developer, I want to see a match score for each tool, so I can understand how well each fits my specific project.', 'P1', '5'],
          ['US-04', 'As a developer, I want a "Why it fits" explanation per tool, so I trust the recommendation is specific to me, not generic.', 'P1', '5'],
          ['US-05', 'As a tech lead, I want to compare two tools side by side, so I can make a defensible architectural decision.', 'P1', '8'],
          ['US-06', 'As a developer, I want to check stack compatibility, so I know my chosen tools work well together before committing.', 'P2', '8'],
          ['US-07', 'As an indie hacker, I want to filter by tools with a free tier, so I can ship my MVP without spending money.', 'P2', '3'],
          ['US-08', 'As a developer, I want to see alternatives for each tool, so I understand the trade-off landscape before deciding.', 'P2', '5'],
          ['US-09', 'As a developer, I want to share my recommended stack as a URL, so I can discuss it with a co-founder or team member.', 'P2', '3'],
          ['US-10', 'As a developer, I want to save my last 3 stacks locally, so I can return to a previous recommendation set.', 'P3', '3'],
        ],
        [600, 5600, 1200, 1000]
      ),

      space(2),

      // ─── 6. FUNCTIONAL REQUIREMENTS ──────────────────────────────────────────
      h1('6. Functional Requirements'),
      h2('Core v1.0 (Must Have)'),
      styledTable(
        ['ID', 'Feature', 'Description'],
        [
          ['FR-01', 'Project type chips', 'Multi-select chips: Web App, Mobile, API, Data, AI/ML, DevOps'],
          ['FR-02', 'Needs chips', 'Multi-select chips: Database, Auth, Hosting, Testing, Monitoring, Payments, Real-time, Storage, Email, Search, Analytics, CI/CD'],
          ['FR-03', 'Description textarea', 'Optional free-text description (500 char) with validation hint (<20 chars)'],
          ['FR-04', 'AI recommendations', 'Call Claude API, return 4–6 tools with name, category, match score (70–99), tagline, why, tags, pricing, free_tier, confidence'],
          ['FR-05', 'Tool cards', 'Display each tool with animated match score bar, "Why it fits" box, tags, Docs link, Compare toggle, Alternatives, thumbs feedback'],
        ],
        [1000, 2200, 6200]
      ),
      space(),
      h2('Secondary v1.1 (Should Have)'),
      styledTable(
        ['ID', 'Feature', 'Description'],
        [
          ['FR-06', 'Tool comparison', 'Select 2–3 tools → modal with comparison table, decision guide (Choose X if…), migration path, final verdict'],
          ['FR-07', 'Compatibility check', 'Check full stack for conflicts → show conflict cards with issue + fix, integration notes'],
          ['FR-08', 'Alternative suggestions', 'Expand per tool to see 2 alternatives with pros/cons vs original'],
          ['FR-09', 'Existing stack filter', 'Let users specify current tech (React, Node, Postgres…) so recommendations are compatible'],
          ['FR-10', 'Share stack as URL', 'Encode recommended stack as base64 URL param; anyone with link sees same stack'],
        ],
        [1000, 2200, 6200]
      ),
      space(),
      h2('Out of Scope v1'),
      bullet('User accounts / authentication'),
      bullet('Persistent server-side stack storage'),
      bullet('Real-time pricing API integration'),
      bullet('Community voting or social features'),

      space(2),

      // ─── 7. NON-FUNCTIONAL REQUIREMENTS ──────────────────────────────────────
      h1('7. Non-Functional Requirements'),
      styledTable(
        ['Category', 'Requirement', 'Target'],
        [
          ['Performance', 'Time from submit to first recommendation visible', '<8 seconds (P95)'],
          ['Performance', 'Time from page load to interactive', '<2 seconds'],
          ['Accuracy', 'Recommendation accepted rate (thumbs up)', '>75% across 100 sessions'],
          ['Accuracy', 'Confidence indicator validation', 'High-confidence tools accepted ≥85% of the time'],
          ['Reliability', 'API uptime', '>99.5% monthly'],
          ['Rate limiting', 'Requests per IP per minute', '15 req/min, with countdown on breach'],
          ['Security', 'API key exposure', 'Never in frontend code; always server-side proxy'],
          ['Security', 'Input sanitisation', 'All user inputs stripped of HTML before API call'],
          ['Accessibility', 'WCAG compliance', 'AA level for keyboard navigation and colour contrast'],
          ['Mobile', 'Responsive breakpoints', 'Fully functional at 375px, 768px, 1280px'],
        ],
        [2000, 4000, 3400]
      ),

      space(2),

      // ─── 8. TECHNICAL ARCHITECTURE ───────────────────────────────────────────
      h1('8. Technical Architecture'),
      styledTable(
        ['Layer', 'Technology', 'Rationale'],
        [
          ['Frontend', 'React 18 + Vite', 'Fast HMR, component model, broad ecosystem'],
          ['Styling', 'Tailwind CSS', 'Utility-first, consistent design tokens, no stylesheet overhead'],
          ['Icons', 'lucide-react', 'Consistent icon set, tree-shakeable, developer aesthetic'],
          ['Backend', 'Express.js (Node)', 'Lightweight proxy to hide API key; adds rate limiting'],
          ['AI Model', 'Claude claude-sonnet-4-6', 'Specified in project brief; strong reasoning for tool trade-offs'],
          ['State', 'React useState / useEffect', 'No external state library needed for MVP scope'],
          ['Persistence', 'localStorage (client)', 'Saved stacks and URL share — no server DB required for v1'],
          ['Rate Limiting', 'express-rate-limit', '15 req/min/IP; standard headers for client countdown'],
          ['Dev Server', 'Vite proxy → Express', 'Vite proxies /api/* to Express on port 3002; no CORS issues'],
        ],
        [2000, 2800, 4600]
      ),
      space(),
      h3('API Endpoints'),
      styledTable(
        ['Method', 'Endpoint', 'Purpose'],
        [
          ['POST', '/api/match', 'Return 4–6 tool recommendations with scores'],
          ['POST', '/api/compare', 'Side-by-side comparison of 2–3 tools + verdict'],
          ['POST', '/api/compatibility', 'Detect conflicts + integration notes for full stack'],
          ['POST', '/api/alternatives', 'Return 2 alternatives to a specific tool with trade-offs'],
        ],
        [800, 2400, 6200]
      ),

      space(2),

      // ─── 9. MVP FEATURE LIST ─────────────────────────────────────────────────
      h1('9. MVP Feature List (v1.0)'),
      body('Maximum 5 features to ship in v1.0:'),
      space(),
      styledTable(
        ['#', 'Feature', 'Value delivered'],
        [
          ['1', 'Project input (chips + description)', 'Captures context in <30 seconds without friction'],
          ['2', 'AI recommendations with match scores', 'Core value: instant, scored, reasoned recommendations'],
          ['3', 'Tool cards with "Why it fits"', 'Builds trust; differentiates from generic lists'],
          ['4', 'Tool comparison modal', 'Resolves the "which of these two?" question senior devs always ask'],
          ['5', 'Share stack as URL', 'Viral mechanism; enables async team discussion'],
        ],
        [600, 3200, 5600]
      ),

      space(2),

      // ─── 10. SPRINT PLAN ─────────────────────────────────────────────────────
      h1('10. 4-Week Sprint Plan'),
      styledTable(
        ['Sprint', 'Focus', 'Deliverables', 'Exit Criteria'],
        [
          ['Week 1', 'Foundation', 'Project setup, chip UI, Express server, /api/match endpoint, tool card component', 'Tool cards render with mock data; API returns real Claude response'],
          ['Week 2', 'Core AI flow', 'Processing animation, results panel, match score bars, "Why it fits" box, error handling (timeout, rate limit)', 'Full golden path: select chips → submit → see results'],
          ['Week 3', 'Power features', 'Compare modal, compatibility checker, alternatives panel, existing stack filter', 'Senior developer persona fully served; compare + compat work'],
          ['Week 4', 'Polish & ship', 'Share URL, save stacks, feedback (thumbs), trust signals, mobile responsive, stale data notice, README', 'App passes manual QA on desktop + mobile; README complete'],
        ],
        [1000, 1800, 3800, 2800]
      ),

      space(2),

      // ─── 11. RISKS & MITIGATIONS ─────────────────────────────────────────────
      h1('11. Risks & Mitigations'),
      styledTable(
        ['Risk', 'Severity', 'Likelihood', 'Mitigation'],
        [
          ['AI recommends outdated or deprecated tools', 'High', 'Medium', 'Add stale data disclaimer; include confidence: low/medium/high badge; encourage users to verify with official docs'],
          ['Developer distrust of AI recommendations', 'High', 'Medium', 'Show "Why it fits" reasoning; include confidence indicator; add thumbs feedback with satisfaction %'],
          ['API rate limit exhaustion during demo/viral moment', 'Medium', 'Low', '15 req/min/IP rate limit with countdown; server-side queuing in v1.1'],
          ['Recommendation homogeneity (always same 5 tools)', 'Medium', 'Medium', 'Track tool diversity score metric; use description field to inject specificity into the Claude prompt'],
        ],
        [2800, 1200, 1200, 4200]
      ),

      space(2),

      // ─── 12. SUCCESS DEFINITION ──────────────────────────────────────────────
      h1('12. Success Definition at 90 Days'),
      h3('Quantitative'),
      bullet('>500 unique developers have used the tool to completion (input → results)'),
      bullet('>75% recommendation acceptance rate across all sessions with feedback'),
      bullet('<8 second P95 response time maintained throughout'),
      bullet('>25% of sessions originated from a shared stack URL'),
      bullet('Zero security incidents (API key never exposed client-side)'),
      space(),
      h3('Qualitative'),
      bullet('At least 3 organic mentions on Reddit r/webdev or Hacker News'),
      bullet('Developer testimonials that include the phrase "I actually used it"'),
      bullet('Internal team can demo the tool live without preparation in <2 minutes'),
      space(),
      h3('Anti-success Signals'),
      bullet('Users report the same 2–3 tools being recommended regardless of input — signals prompt needs work'),
      bullet('Bounce rate >70% before first recommendation — signals friction in input UI'),
      bullet('Support tickets about wrong/outdated tool recommendations >5% — signals knowledge staleness issue'),
      space(),
      body('The product is successful when developers say: "I used AI Dev Tool Matcher to decide my stack, and I\'m glad I did."', { italics: true, color: PRIMARY }),

      space(2),

      // ─── APPENDIX ────────────────────────────────────────────────────────────
      h1('Appendix — Developer Trust Metrics'),
      body('Unique to this product category — trust is the primary blocker to adoption.'),
      space(),
      styledTable(
        ['Trust Metric', 'Formula', 'Target', 'Owner'],
        [
          ['Recommendation acceptance rate', 'Tools implemented / tools recommended', '>60%', 'Product'],
          ['Positive feedback rate', 'Thumbs up / total feedback', '>75%', 'Product'],
          ['Bad rec support tickets', 'Tickets: wrong rec / total sessions', '<5%', 'Support'],
          ['Confidence calibration', 'High-conf tools accepted / high-conf tools shown', '>85%', 'AI / Prompt'],
        ],
        [2400, 2800, 1600, 2600]
      ),
    ]
  }]
});

const buffer = await Packer.toBuffer(doc);
const outPath = `${DOCS}/AI_Dev_Tool_Matcher_PRD.docx`;
writeFileSync(outPath, buffer);
console.log('PRD saved:', outPath);
