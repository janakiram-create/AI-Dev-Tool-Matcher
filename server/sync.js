import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
try {
  const env = readFileSync(join(__dirname, '../.env'), 'utf8');
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=');
    if (k && !k.startsWith('#') && v.length) process.env[k.trim()] = v.join('=').trim();
  }
} catch {}

const SOURCES = [
  { name: 'OpenAI Blog', slug: 'openai', rss: 'https://openai.com/blog/rss.xml', company: 'OpenAI', color: '#10B981' },
  { name: 'Anthropic News', slug: 'anthropic', rss: 'https://www.anthropic.com/news/rss.xml', company: 'Anthropic', color: '#F97316' },
  { name: 'Google DeepMind', slug: 'deepmind', rss: 'https://deepmind.google/blog/rss.xml', company: 'Google', color: '#4285F4' },
  { name: 'Google AI Blog', slug: 'google-ai', rss: 'https://ai.googleblog.com/feeds/posts/default', company: 'Google', color: '#34A853' },
  { name: 'Microsoft AI', slug: 'microsoft-ai', rss: 'https://blogs.microsoft.com/ai/feed/', company: 'Microsoft', color: '#00A4EF' },
  { name: 'Meta AI', slug: 'meta-ai', rss: 'https://ai.meta.com/blog/rss/', company: 'Meta', color: '#1877F2' },
  { name: 'NVIDIA Blog', slug: 'nvidia', rss: 'https://blogs.nvidia.com/feed/', company: 'NVIDIA', color: '#76B900' },
  { name: 'Hugging Face', slug: 'huggingface', rss: 'https://huggingface.co/blog/feed.xml', company: 'Hugging Face', color: '#F59E0B' },
  { name: 'TechCrunch AI', slug: 'techcrunch-ai', rss: 'https://techcrunch.com/category/artificial-intelligence/feed/', company: null, color: '#00CC44' },
  { name: 'VentureBeat AI', slug: 'venturebeat-ai', rss: 'https://venturebeat.com/category/ai/feed/', company: null, color: '#E11D48' },
  { name: 'The Verge AI', slug: 'verge-ai', rss: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', company: null, color: '#FA4616' },
  { name: 'MIT Tech Review', slug: 'mit-tech-review', rss: 'https://www.technologyreview.com/feed/', company: null, color: '#A00000' },
  { name: 'AI News', slug: 'ai-news', rss: 'https://www.artificialintelligence-news.com/feed/', company: null, color: '#6366F1' },
];

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function categorize(title) {
  const t = title.toLowerCase();
  if (/fund|invest|rais|valuat|billion|million|series/.test(t)) return 'funding';
  if (/research|paper|arxiv|benchmark|study|dataset/.test(t)) return 'research';
  if (/open.?source|github|llama|mistral/.test(t)) return 'open-source';
  if (/api|sdk|product|launch|releas|update|feature|deploy/.test(t)) return 'products';
  if (/regulat|eu|law|policy|safety|ethic/.test(t)) return 'regulation';
  if (/hardware|gpu|chip|server|infra/.test(t)) return 'hardware';
  return 'models';
}

async function fetchRSS(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'AI-Updates-Dashboard/1.0' } });
    clearTimeout(timeout);
    const xml = await res.text();
    const items = [];
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const get = (tag) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
        return m ? m[1].trim() : '';
      };
      const title = get('title').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#\d+;/g, '');
      const link = get('link') || get('guid');
      const pubDate = get('pubDate') || get('dc:date') || get('published');
      const description = get('description').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').slice(0, 400);
      const author = get('author') || get('dc:creator') || '';
      if (title && link) items.push({ title, url: link.trim(), published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(), summary: description, author });
    }
    return items.slice(0, 20);
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

async function run() {
  console.log(`[sync] Starting RSS sync for ${SOURCES.length} sources...`);
  let total = 0;
  for (const source of SOURCES) {
    try {
      console.log(`  Fetching ${source.name}...`);
      const items = await fetchRSS(source.rss);
      let newCount = 0;
      for (const item of items) {
        const tags = item.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4).slice(0, 5);
        const category = categorize(item.title);
        const { error } = await supabase.from('ai_articles').upsert({
          source_name: source.name,
          source_color: source.color,
          title: item.title.slice(0, 300),
          summary: item.summary?.slice(0, 500) ?? null,
          url: item.url,
          author: item.author?.slice(0, 100) ?? null,
          published_at: item.published_at,
          category,
          tags,
          company: source.company,
          article_type: category === 'research' ? 'research' : category === 'funding' ? 'funding' : 'news',
          read_time: Math.max(2, Math.ceil((item.summary?.length ?? 0) / 200)),
          is_featured: false,
        }, { onConflict: 'url', ignoreDuplicates: true });
        if (!error) newCount++;
      }
      await supabase.from('ai_sources').update({ last_synced_at: new Date().toISOString() }).eq('slug', source.slug);
      console.log(`  ✓ ${source.name}: ${items.length} fetched, ${newCount} new`);
      total += newCount;
    } catch (err) {
      console.error(`  ✗ ${source.name}: ${err.message}`);
    }
  }
  console.log(`[sync] Done. ${total} new articles saved.`);
}

run().catch(console.error);
