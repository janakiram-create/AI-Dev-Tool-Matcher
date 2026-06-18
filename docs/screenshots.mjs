import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const BASE = 'http://localhost:5174';

const MOCK_TOOLS = [
  { name: 'Supabase', category: 'Database', tagline: 'Open source Firebase alternative', why: 'Perfect for Web App with real-time needs and built-in auth', match_score: 96, free_tier: true, tags: ['PostgreSQL', 'Real-time', 'REST'], best_for: 'Full-stack web apps', docs_url: 'https://supabase.com/docs', pricing_tier: 'Freemium', confidence: 'high' },
  { name: 'Auth0', category: 'Auth', tagline: 'Secure identity platform for developers', why: 'Industry-standard auth that integrates with any Web App stack', match_score: 91, free_tier: true, tags: ['OAuth', 'JWT', 'SSO'], best_for: 'Production auth flows', docs_url: 'https://auth0.com/docs', pricing_tier: 'Freemium', confidence: 'high' },
  { name: 'Vercel', category: 'Hosting', tagline: 'Deploy web apps in seconds', why: 'Zero-config deployment with global CDN ideal for React Web Apps', match_score: 88, free_tier: true, tags: ['CDN', 'CI/CD', 'Edge'], best_for: 'Frontend hosting', docs_url: 'https://vercel.com/docs', pricing_tier: 'Freemium', confidence: 'high' },
  { name: 'Stripe', category: 'Payments', tagline: 'Payments infrastructure for the internet', why: 'Best-in-class payment processing with extensive developer docs', match_score: 82, free_tier: false, tags: ['Payments', 'Webhooks', 'SDK'], best_for: 'SaaS billing', docs_url: 'https://stripe.com/docs', pricing_tier: 'Paid', confidence: 'medium' },
];

async function screenshot(page, name, width = 1280, height = 900) {
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  const path = `C:/Users/janak/OneDrive/Documents/Attachments/Desktop/may5/aipm/projects/ai-dev-tool-matcher/docs/${name}.png`;
  await page.screenshot({ path, fullPage: false, type: 'png' });
  console.log(`Saved: ${name}.png`);
  return path;
}

async function injectMockFetch(page) {
  await page.evaluate((tools) => {
    window.fetch = (url, opts) => {
      if (url === '/api/match') {
        return Promise.resolve({ ok: true, status: 200, headers: { get: () => null }, json: () => Promise.resolve({ tools }) });
      }
      return Promise.reject(new Error('mocked'));
    };
  }, MOCK_TOOLS);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Screen 1 — Landing (clean)
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await screenshot(page, '01_landing');

  // Screen 2 — Chips selected
  await page.evaluate(() => {
    const chips = [...document.querySelectorAll('button.chip')];
    ['Web App', 'Database', 'Auth', 'Hosting'].forEach(label => {
      chips.find(b => b.textContent.trim() === label)?.click();
    });
  });
  await new Promise(r => setTimeout(r, 300));
  await screenshot(page, '02_chips_selected');

  // Screen 3 — Loading / processing state
  await injectMockFetch(page);
  await page.evaluate((tools) => {
    window._slowFetch = window.fetch;
    window.fetch = (url, opts) => {
      if (url === '/api/match') {
        return new Promise(resolve => setTimeout(() => resolve({
          ok: true, status: 200, headers: { get: () => null },
          json: () => Promise.resolve({ tools })
        }), 8000));
      }
      return Promise.reject();
    };
    document.querySelector('button[class*="bg-primary-5"]')?.click();
  }, MOCK_TOOLS);
  await new Promise(r => setTimeout(r, 800));
  await screenshot(page, '03_processing');

  // Screen 4 — Results (inject mock data immediately)
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await injectMockFetch(page);
  await page.evaluate(() => {
    const chips = [...document.querySelectorAll('button.chip')];
    ['Web App', 'Database', 'Auth'].forEach(label =>
      chips.find(b => b.textContent.trim() === label)?.click()
    );
    setTimeout(() => document.querySelector('button[class*="bg-primary-5"]')?.click(), 100);
  });
  await new Promise(r => setTimeout(r, 1800));
  await screenshot(page, '04_results_top');

  // Screen 5 — Results scrolled (show more cards + sidebar)
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 300));
  await screenshot(page, '05_results_cards');

  // Screen 6 — Stack Summary visible (scroll further)
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 200));
  await screenshot(page, '06_results_sidebar');

  await browser.close();
  console.log('\nAll screenshots saved to docs/');
})();
