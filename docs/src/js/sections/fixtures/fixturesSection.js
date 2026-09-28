/**
 * Fixtures tab
 * ------------------------------------------------------------
 * The Date / Sport filters and the list of match cards under them,
 * plus the Featured Match box (featuredMatch.js). Re-renders when a
 * different team is picked so that team's games stay highlighted.
 *
 * Markup: #fixturesView in index.html
 * Styles: css/sections/fixtures.css (+ css/components/match-card.css)
 */
import { SPORTS, DATES, fixtures } from '../../data/fixtures.js';
import { renderCard } from '../../components/matchCard.js';
import { formatShortDate } from '../../utils/dates.js';
import { getSelectedTeam, onTeamChange } from '../../state.js';
import { initFeaturedMatch } from './featuredMatch.js';

// Value of the "All Days" / "All Sports" options already in index.html.
const ALL = "ALL";

function addOption(select, value, label){
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  select.appendChild(option);
}

function renderFixtureList(dateSelect, sportSelect){
  const date = dateSelect.value;
  const sport = sportSelect.value;
  const matches = fixtures.filter(fx =>
    (date === ALL || fx.date === date) &&
    (sport === ALL || fx.sport === sport)
  );

  const team = getSelectedTeam();
  document.getElementById('fixturesContainer').innerHTML = matches.length
    ? matches.map(fx => renderCard(fx, team)).join('')
    : `<div class="empty-state">No games found for the selected filters.</div>`;
}

export function initFixturesSection(){
  const dateSelect = document.getElementById('dateSelect');
  const sportSelect = document.getElementById('sportSelect');

  DATES.forEach((date, i) => addOption(dateSelect, date, `${formatShortDate(date)} (Day ${i + 1})`));
  SPORTS.forEach(sport => addOption(sportSelect, sport, sport));

  const renderList = () => renderFixtureList(dateSelect, sportSelect);
  dateSelect.addEventListener('change', renderList);
  sportSelect.addEventListener('change', renderList);

  const featuredMatch = initFeaturedMatch();
  renderList();
  featuredMatch.render(getSelectedTeam());

  onTeamChange(team => {
    renderList();
    featuredMatch.render(team);
  });
}
