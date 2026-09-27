/**
 * Match Fixture Card component
 * ------------------------------------------------------------
 * Everything about turning one fixture into a score card:
 * working out whether it's finished/ongoing/upcoming, and
 * building the HTML for it. Used by the Fixtures tab, the
 * My Schedule day detail, and the Featured Match widget.
 *
 * Layout (see styles.css "Match Fixture Card" section):
 *   - a floating tag on the card's top edge showing the sport
 *   - a 3-column grid: home team | score — VS — score + time | away team
 *   - a muted status line below the card (status + venue + date)
 */
import { TODAY, NOW_MINUTES, GAME_DURATION_MIN, timeToMinutes } from '../data/fixtures.js';
import { TEAMS } from '../data/teams.js';

const MASCOT_BY_TEAM = Object.fromEntries(TEAMS.map(t => [t.name, t.mascot]));

const STATUS_LABEL = {
  FINISHED: "Finished",
  ONGOING: "Live now",
  UPCOMING: "Upcoming",
};

export function computeStatus(fx){
  if(fx.date < TODAY) return "FINISHED";
  if(fx.date > TODAY) return "UPCOMING";
  const start = timeToMinutes(fx.time);
  if(NOW_MINUTES < start) return "UPCOMING";
  if(NOW_MINUTES >= start + GAME_DURATION_MIN) return "FINISHED";
  return "ONGOING";
}

function teamColumnHtml(teamName, savedTeam, side){
  const isMine = teamName === savedTeam;
  const mascot = MASCOT_BY_TEAM[teamName];
  return `
    <div class="fixture-card__team fixture-card__team--${side}">
      <span class="fixture-card__team-name${isMine ? ' team-mine' : ''}">${teamName}</span>
      ${mascot ? `<span class="fixture-card__team-sub">${mascot}</span>` : ''}
    </div>
  `;
}

/**
 * @param {object} fx - a single fixture from data/fixtures.js
 * @param {string} savedTeam - the visitor's chosen team name, so
 *   their team's name and games can be highlighted. Pass "" if
 *   there isn't one.
 */
export function renderCard(fx, savedTeam = ""){
  const status = computeStatus(fx);
  const statusClass = status.toLowerCase();
  const isMine = fx.teamA === savedTeam || fx.teamB === savedTeam;

  // The dataset pre-generates a finalScore for every fixture (so results
  // are consistent), but only a FINISHED game should reveal it — showing
  // it early would spoil an ongoing/upcoming match.
  const [scoreA, scoreB] = status === "FINISHED" ? fx.finalScore.split(" - ") : ["–", "–"];

  const shortDate = fx.date.slice(5).replace('-', '/');

  return `
    <div class="fixture-card-wrap ${statusClass}${isMine ? ' mine' : ''}">
      <div class="fixture-card__tag">${fx.sport}</div>
      <div class="fixture-card">
        ${teamColumnHtml(fx.teamA, savedTeam, 'home')}
        <div class="fixture-card__center">
          <div class="fixture-card__score-row">
            <span class="fixture-card__score">${scoreA}</span>
            <span class="fixture-card__vs">VS</span>
            <span class="fixture-card__score">${scoreB}</span>
          </div>
          <span class="fixture-card__time">${fx.time}</span>
        </div>
        ${teamColumnHtml(fx.teamB, savedTeam, 'away')}
      </div>
      <div class="fixture-card__footer">${STATUS_LABEL[status]} &middot; 📍 ${fx.venue} &middot; ${shortDate}</div>
    </div>
  `;
}
