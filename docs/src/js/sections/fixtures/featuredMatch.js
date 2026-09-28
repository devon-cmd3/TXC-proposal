/**
 * Featured Match box (top of the Fixtures tab)
 * ------------------------------------------------------------
 * A "< date >" pager and one highlighted game for that day, drawn
 * with the shared match card. It shows the day's live game if there
 * is one, otherwise the earliest game.
 *
 * Markup: #featuredMatch in index.html
 * Styles: css/sections/fixtures.css
 */
import { CONFIG } from '../../config.js';
import { DATES, fixtures } from '../../data/fixtures.js';
import { computeStatus, renderCard } from '../../components/matchCard.js';
import { formatDayLabel } from '../../utils/dates.js';

function pickFeaturedFixture(date){
  const dayFixtures = fixtures.filter(fx => fx.date === date);
  if(dayFixtures.length === 0) return null;
  const ongoing = dayFixtures.find(fx => computeStatus(fx) === "ONGOING");
  return ongoing || dayFixtures[0];
}

/**
 * Wires up the pager buttons and returns { render(savedTeam) }.
 * Call render() whenever the chosen team changes so its games are
 * highlighted on the card.
 */
export function initFeaturedMatch(){
  const dateLabel = document.getElementById('featuredDateLabel');
  const cardSlot = document.getElementById('featuredCardSlot');
  const prevBtn = document.getElementById('featuredPrevDay');
  const nextBtn = document.getElementById('featuredNextDay');

  if(!dateLabel || !cardSlot || !prevBtn || !nextBtn){
    return { render(){} };
  }

  let dayIndex = Math.max(0, DATES.indexOf(CONFIG.TODAY));
  let lastSavedTeam = "";

  function renderInternal(){
    const date = DATES[dayIndex];
    dateLabel.textContent = formatDayLabel(date);
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
