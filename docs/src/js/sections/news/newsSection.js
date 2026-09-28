/**
 * News & Updates tab
 * ------------------------------------------------------------
 * The newest story as a big featured card, the rest in a looping
 * carousel ("See All" swaps it for a grid), and the Upcoming Events
 * cards underneath.
 *
 * Where the content comes from (all in this folder):
 *   posts.json  latest posts from the CSG Facebook Page. Rewritten
 *               hourly by .github/workflows/facebook-news.yml, so
 *               don't edit it by hand.
 *   news.js     placeholder stories, shown only while posts.json is empty
 *   events.js   the Upcoming Events cards
 *
 * Markup: #newsView in index.html
 * Styles: css/sections/news.css
 */
import { CONFIG } from '../../config.js';
import { NEWS } from './news.js';
import { EVENTS } from './events.js';

const POSTS_URL = new URL('./posts.json', import.meta.url);

let newsItems = NEWS;
let showAll = false; // true while "See All" has swapped the carousel for the grid

// Post text comes from Facebook, so never drop it into innerHTML as-is.
function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

async function loadNews(){
  try{
    const res = await fetch(POSTS_URL, { cache: 'no-cache' });
    const posts = res.ok ? await res.json() : [];
    return Array.isArray(posts) && posts.length ? posts : NEWS;
  }catch{
    return NEWS;
  }
}

function newsCardHtml(item, featured = false){
  // Real posts link to themselves; placeholders fall back to the Page.
  const url = /^https:\/\//.test(item.url ?? '') ? item.url : CONFIG.CSG_FACEBOOK_URL;
  return `
    <div class="news-card${featured ? ' news-card--featured' : ''}">
      <span class="news-card__tag">${escapeHtml(item.source)}</span>
      <div class="news-card__title">${escapeHtml(item.title)}</div>
      <div class="news-card__snippet">${escapeHtml(item.snippet)}</div>
      <span class="news-card__date">${escapeHtml(item.date)}</span>
      <a class="news-card__link" href="${escapeHtml(url)}" target="_blank" rel="noopener">View on Facebook</a>
    </div>
  `;
}

function renderNews(){
  const featureSlot = document.getElementById('newsFeatureSlot');
  const carousel = document.getElementById('newsCarousel');
  const track = document.getElementById('newsTrack');
  const grid = document.getElementById('newsGrid');
  const seeAllWrap = document.querySelector('.news-see-all-wrap');
  const seeAllBtn = document.getElementById('newsSeeAll');

  if(newsItems.length === 0){
    featureSlot.innerHTML = `<div class="empty-state">No news yet.</div>`;
    carousel.hidden = true;
    grid.hidden = true;
    seeAllWrap.hidden = true;
    return;
  }

  const [featuredItem, ...rest] = newsItems;
  featureSlot.innerHTML = newsCardHtml(featuredItem, true);

  seeAllWrap.hidden = rest.length === 0;
  seeAllBtn.textContent = showAll ? 'Back to Carousel' : 'See All';

  if(showAll){
    carousel.hidden = true;
    carousel.onscroll = null;
    grid.hidden = false;
    grid.innerHTML = rest.length
      ? rest.map(item => newsCardHtml(item)).join('')
      : `<div class="empty-state">No more stories yet.</div>`;
    return;
  }

  grid.hidden = true;
  if(rest.length === 0){
    carousel.hidden = true;
    return;
  }
  carousel.hidden = false;

  const cardsHtml = rest.map(item => newsCardHtml(item)).join('');
  track.innerHTML = cardsHtml;
  requestAnimationFrame(() => loopCarouselIfOverflowing(carousel, track, cardsHtml));
}

/**
 * Endless carousel: if the cards don't all fit, lay out three copies
 * and start in the middle one. Whenever scrolling reaches either end,
 * jump back by one copy's width; the content there is identical, so
 * the jump is invisible and the carousel never runs out.
 */
function loopCarouselIfOverflowing(carousel, track, cardsHtml){
  const overflowing = track.scrollWidth > carousel.clientWidth + 4;
  if(!overflowing){
    carousel.onscroll = null;
    return;
  }

  track.innerHTML = cardsHtml + cardsHtml + cardsHtml;
  const oneCopyWidth = track.scrollWidth / 3;
  carousel.scrollLeft = oneCopyWidth;

  carousel.onscroll = () => {
    if(carousel.scrollLeft <= 0){
      carousel.scrollLeft += oneCopyWidth;
    } else if(carousel.scrollLeft >= oneCopyWidth * 2){
      carousel.scrollLeft -= oneCopyWidth;
    }
  };
}

function renderEvents(){
  document.getElementById('eventsGrid').innerHTML = EVENTS.map(ev => `
    <div class="event-card">
      <div class="event-card__photo-wrap">
        <img class="event-card__photo" src="${ev.img}" alt="${ev.title}">
      </div>
      <div class="event-card__body">
        <div class="event-card__source">${ev.team}</div>
        <div class="event-card__title">${ev.title}</div>
        <div class="event-card__desc">${ev.desc}</div>
      </div>
    </div>
  `).join('');
}

export async function initNewsSection(){
  document.getElementById('newsSeeAll').addEventListener('click', () => {
    showAll = !showAll;
    renderNews();
  });

  renderEvents();
  newsItems = await loadNews();
  renderNews();
}
