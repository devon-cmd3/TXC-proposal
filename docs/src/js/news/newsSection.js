/**
 * News & Updates section
 * ------------------------------------------------------------
 * Everything under the "News & Updates" tab: the featured story,
 * the looping carousel / "See All" grid for the rest of NEWS, and
 * the Upcoming Events cards. main.js only needs to call initNews().
 */
import { NEWS } from './news.js';
import { EVENTS } from './events.js';

let newsExpanded = false;

function newsCardHtml(item, featured = false){
  return `
    <div class="news-card${featured ? ' news-card--featured' : ''}">
      <span class="news-card__tag">${item.source}</span>
      <div class="news-card__title">${item.title}</div>
      <div class="news-card__snippet">${item.snippet}</div>
      <span class="news-card__date">${item.date}</span>
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

  if(NEWS.length === 0){
    featureSlot.innerHTML = `<div class="empty-state">No news yet.</div>`;
    carousel.hidden = true;
    grid.hidden = true;
    seeAllWrap.hidden = true;
    return;
  }

  const [featuredItem, ...rest] = NEWS;
  featureSlot.innerHTML = newsCardHtml(featuredItem, true);

  seeAllWrap.hidden = rest.length === 0;
  seeAllBtn.textContent = newsExpanded ? 'Back to Carousel' : 'See All';

  if(newsExpanded){
    carousel.hidden = true;
    carousel.onscroll = null;
    grid.hidden = false;
    grid.innerHTML = rest.length
      ? rest.map(n => newsCardHtml(n)).join('')
      : `<div class="empty-state">No more stories yet.</div>`;
    return;
  }

  grid.hidden = true;
  if(rest.length === 0){
    carousel.hidden = true;
    return;
  }
  carousel.hidden = false;

  const singleHtml = rest.map(n => newsCardHtml(n)).join('');
  track.innerHTML = singleHtml;

  requestAnimationFrame(()=>{
    const overflowing = track.scrollWidth > carousel.clientWidth + 4;

    if(!overflowing){
      carousel.onscroll = null;
      return;
    }

    track.innerHTML = singleHtml + singleHtml + singleHtml;
    const singleSetWidth = track.scrollWidth / 3;
    carousel.scrollLeft = singleSetWidth;

    carousel.onscroll = ()=>{
      if(carousel.scrollLeft <= 0){
        carousel.scrollLeft += singleSetWidth;
      } else if(carousel.scrollLeft >= singleSetWidth * 2){
        carousel.scrollLeft -= singleSetWidth;
      }
    };
  });
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

export function initNews(){
  document.getElementById('newsSeeAll').addEventListener('click', ()=>{
    newsExpanded = !newsExpanded;
    renderNews();
  });

  renderNews();
  renderEvents();
}
