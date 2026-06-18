import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DOCS = 'C:/Users/janak/OneDrive/Documents/Attachments/Desktop/may5/aipm/projects/ai-dev-tool-matcher/docs';

const SCREENS = [
  { file: '01_landing.png',       title: 'Screen 1 — Landing Page', desc: 'Hero section with headline, project type chips, needs selector, description textarea and CTA button. Clean state before any interaction.' },
  { file: '02_chips_selected.png',title: 'Screen 2 — Project Setup', desc: 'Multi-select chip interaction: Web App, Database, Auth and Hosting chips activated (purple fill). CTA button becomes enabled once a selection is made.' },
  { file: '03_processing.png',    title: 'Screen 3 — AI Processing', desc: 'Animated processing state: pulsing icon, step-by-step progress text cycling through parsing, scanning, scoring, ranking and generating stages.' },
  { file: '04_results_top.png',   title: 'Screen 4 — Results Overview', desc: 'Results header showing matched tool count, 87% satisfaction metric, stale-data disclaimer, sticky nav bar with "New search", context breadcrumb, Check compatibility and Compare buttons.' },
  { file: '05_results_cards.png', title: 'Screen 5 — Tool Cards', desc: 'Individual tool recommendation cards showing: colour-coded category badge, match score with animated progress bar, "Why it fits" reasoning box, tech tags, pricing tier, Docs/Compare/Alternatives actions and thumbs feedback.' },
  { file: '06_results_sidebar.png',title: 'Screen 6 — Stack Summary', desc: 'Results page with sidebar: Stack Summary panel listing all matched tools with match scores, plus Copy as text, Share stack and Save stack actions.' },
];

function imgToBase64(file) {
  return readFileSync(join(DOCS, file)).toString('base64');
}

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Inter, sans-serif; background: #fff; color: #111; }
  .cover { width:100%; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background: linear-gradient(135deg,#534AB7 0%,#2D2880 100%); color:#fff; page-break-after:always; }
  .cover h1 { font-size:42px; font-weight:700; margin-bottom:12px; text-align:center; }
  .cover p { font-size:18px; opacity:0.85; margin-bottom:6px; text-align:center; }
  .cover .badge { margin-top:32px; background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.4); border-radius:30px; padding:8px 24px; font-size:13px; }
  .screen { page-break-after: always; padding: 48px; }
  .screen:last-child { page-break-after: auto; }
  .screen-header { margin-bottom:20px; }
  .screen-num { font-size:11px; font-weight:700; color:#534AB7; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
  .screen-title { font-size:24px; font-weight:700; color:#111; margin-bottom:8px; }
  .screen-desc { font-size:14px; color:#555; line-height:1.6; max-width:720px; }
  .img-wrap { border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); margin-top:20px; }
  img { width:100%; display:block; }
  .divider { width:48px; height:3px; background:#534AB7; border-radius:2px; margin:12px 0; }
</style>
</head>
<body>

<div class="cover">
  <p style="font-size:13px;opacity:0.7;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">AIPM Programme · Project 2</p>
  <h1>AI Dev Tool Matcher</h1>
  <p>UI Mockup Screens</p>
  <p style="opacity:0.6;font-size:14px">React + Express · Claude claude-sonnet-4-6</p>
  <div class="badge">6 screens · Developer-grade UI · Purple #534AB7</div>
</div>

${SCREENS.map((s, i) => `
<div class="screen">
  <div class="screen-header">
    <div class="screen-num">Mockup ${i+1} of ${SCREENS.length}</div>
    <div class="screen-title">${s.title}</div>
    <div class="divider"></div>
    <div class="screen-desc">${s.desc}</div>
  </div>
  <div class="img-wrap">
    <img src="data:image/png;base64,${imgToBase64(s.file)}" alt="${s.title}"/>
  </div>
</div>
`).join('')}

</body>
</html>`;

const htmlPath = join(DOCS, '_screens.html');
writeFileSync(htmlPath, html);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(`file:///${htmlPath}`, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1000));

const pdfPath = join(DOCS, 'AI_Dev_Tool_Matcher_Mockups.pdf');
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' }
});

await browser.close();
console.log('PDF saved:', pdfPath);
