/**
 * Featured Match widget
 * ------------------------------------------------------------
 * The chrome that sits above the Fixtures list: a top section
 * bar, a "< date >" pagination row, and — reusing the existing
 * Match Fixture Card component from matchCard.js — one featured
 * game for whichever day is selected.
 *
 * Picks the day's most notable game (an ongoing one if there is
 * one, otherwise the earliest) rather than requiring a second
 * level of pagination within a day.
 */
import { DATES, TODAY, fixtures } from '../data/fixtures.js';
import { computeStatus, renderCard } from './matchCard.js';

function pickFeaturedFixture(date){
  const dayFixtures = fixtures.filter(fx => fx.date === date);
  if(dayFixtures.length === 0) return null;
  const ongoing = dayFixtures.find(fx => computeStatus(fx) === "ONGOING");
  return ongoing || dayFixtures[0];
}

function formatDate(dateStr){
  return new Date(dateStr + "T00:00:00").toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

export function initFeaturedMatch(){
  const dateLabel = document.getElementById('featuredDateLabel');
  const cardSlot = document.getElementById('featuredCardSlot');
  const prevBtn = document.getElementById('featuredPrevDay');
  const nextBtn = document.getElementById('featuredNextDay');

  if(!dateLabel || !cardSlot || !prevBtn || !nextBtn){
    return { render(){} };
  }

  let dayIndex = Math.max(0, DATES.indexOf(TODAY));
  let lastSavedTeam = "";

  function renderInternal(){
    const date = DATES[dayIndex];
    dateLabel.textContent = formatDate(date);
    prevBtn.disabled = dayIndex === 0;
    nextBtn.disabled = dayIndex === DATES.length - 1;

    const fx = pickFeaturedFixture(date);
    cardSlot.innerHTML = fx
      ? renderCard(fx, lastSavedTeam)
      : `<div class="empty-state">No games scheduled for this day.</div>`;
  }

  prevBtn.addEventListener('click', () => {
    if(dayIndex > 0){ dayIndex--; renderInternal(); }
  });
  nextBtn.addEventListener('click', () => {
    if(dayIndex < DATES.length - 1){ dayIndex++; renderInternal(); }
  });

  return {
    render(savedTeam = ""){
      lastSavedTeam = savedTeam;
      renderInternal();
    },
  };
}

