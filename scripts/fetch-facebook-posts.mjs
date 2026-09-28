/**
 * Fetch CSG Facebook posts
 * ------------------------------------------------------------
 * Pulls the latest posts from the CSG Facebook Page through the
 * Graph API and writes them to docs/src/js/news/posts.json, which
 * the News & Updates tab reads. The newest post becomes the
 * featured story; the next five fill the carousel / grid.
 *
 * Run by .github/workflows/facebook-news.yml. The Page access token
 * comes from the FB_PAGE_TOKEN secret so it never ships to the browser.
 */
import { writeFile } from 'node:fs/promises';

const GRAPH_VERSION = 'v26.0';
// CSG Facebook Page ("Campuss Compass TEST" for now). This is the Graph API Page ID from
// the Page's About > Page transparency, not the number in its profile.php web address.
const PAGE_ID = process.env.FB_PAGE_ID || '1301081723094199';
const POST_COUNT = 6; // 1 featured + 5 in the grid
const OUT_FILE = new URL('../docs/src/js/news/posts.json', import.meta.url);

const token = process.env.FB_PAGE_TOKEN;
if(!token){
  // Skip instead of failing so the hourly run doesn't send failure emails before setup.
  console.log('::warning::FB_PAGE_TOKEN is not set. Add it under Settings > Secrets and variables > Actions.');
  process.exit(0);
}

// Counts characters by code point so styled text (e.g. 𝐁𝐎𝐋𝐃) isn't cut mid-character.
function truncate(text, max){
  const chars = Array.from(text);
  return chars.length > max ? chars.slice(0, max - 1).join('').trimEnd() + '…' : text;
}

function formatDate(createdTime){
  // Graph API sends "2026-09-27T12:34:56+0000"; add the colon so Date parses it everywhere.
  const iso = createdTime.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  return new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', timeZone:'Asia/Manila' });
}

function toNewsItem(post){
  const lines = (post.message || post.story || '').split('\n').map(l => l.trim()).filter(Boolean);
  return {
    id: post.id,
    source: 'CSG',
    title: truncate(lines[0] || 'New post from CSG', 90),
    snippet: truncate(lines.slice(1).join(' '), 180),
    date: formatDate(post.created_time),
    url: post.permalink_url,
  };
}

const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/posts`);
url.search = new URLSearchParams({
  fields: 'id,message,story,created_time,permalink_url',
  limit: String(POST_COUNT),
  access_token: token,
});

const res = await fetch(url);
const body = await res.json();
if(!res.ok){
  // Graph API error messages never include the token, so this is safe to log.
  console.error(`Graph API error ${res.status}: ${body.error?.message ?? 'unknown error'}`);
  process.exit(1);
}

const items = body.data
  .sort((a, b) => b.created_time.localeCompare(a.created_time))
  .slice(0, POST_COUNT)
  .map(toNewsItem);

await writeFile(OUT_FILE, JSON.stringify(items, null, 2) + '\n');
console.log(`Saved ${items.length} post(s) to docs/src/js/news/posts.json`);
