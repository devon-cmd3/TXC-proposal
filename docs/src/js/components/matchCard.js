/**
 * Match card
 * ------------------------------------------------------------
 * Turns one fixture into a score card, and works out whether that
 * game is finished, live or upcoming. Used by the Fixtures list, the
 * Featured Match box and the Calendar's day detail.
 *
 * Card layout (styles in css/components/match-card.css):
 *   - a floating tag on the card's top edge showing the sport
 *   - 3 columns: home team | score VS score + time | away team
 *   - a status line under the card: status · venue · date
 */
import { CONFIG } from '../config.js';
import { TEAMS } from '../data/teams.js';
import { timeToMinutes, formatShortDate } from '../utils/dates.js';

const MASCOT_BY_TEAM = Object.fromEntries(TEAMS.map(t => [t.name, t.mascot]));

const STATUS_LABEL = {
  FINISHED: "Finished",
  ONGOING: "Live now",
  UPCOMING: "Upcoming",
};

/** "FINISHED", "ONGOING" or "UPCOMING", judged against CONFIG's pretend clock. */
export function computeStatus(fx){
  if(fx.date < CONFIG.TODAY) return "FINISHED";
  if(fx.date > CONFIG.TODAY) return "UPCOMING";
  const start = timeToMinutes(fx.time);
  if(CONFIG.NOW_MINUTES < start) return "UPCOMING";
  if(CONFIG.NOW_MINUTES >= start + CONFIG.GAME_DURATION_MIN) return "FINISHED";
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
 * @param {object} fx - one fixture from data/fixtures.js
 * @param {string} savedTeam - the visitor's chosen team, so their
 *   name and games are highlighted. Pass "" if there isn't one.
 * @returns {string} the card's HTML
 */
export function renderCard(fx, savedTeam = ""){
  const status = computeStatus(fx);
  const statusClass = status.toLowerCase();
  const isMine = fx.teamA === savedTeam || fx.teamB === savedTeam;

  // Every fixture has a finalScore so results stay consistent, but only
  // a finished game reveals it; showing it early would spoil the match.
  const [scoreA, scoreB] = status === "FINISHED" ? fx.finalScore.split(" - ") : ["–", "–"];

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
      <div class="fixture-card__footer">
        <span>${STATUS_LABEL[status]}</span>
        <span class="fixture-card__footer-sep" aria-hidden="true">&middot;</span>
        <span>📍 ${fx.venue}</span>
        <span class="fixture-card__footer-sep" aria-hidden="true">&middot;</span>
        <span>${formatShortDate(fx.date)}</span>
      </div>
    </div>
  `;
}
