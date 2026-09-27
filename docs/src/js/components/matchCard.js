/**
 * Match card component
 * ------------------------------------------------------------
 * Everything about turning one fixture into a "score card":
 * working out whether it's finished/ongoing/upcoming, and
 * building the HTML for it. Used by both the Fixtures tab and
 * the My Schedule day detail.
 */
import { TODAY, NOW_MINUTES, GAME_DURATION_MIN, timeToMinutes } from '../data/fixtures.js';

export function computeStatus(fx){
  if(fx.date < TODAY) return "FINISHED";
  if(fx.date > TODAY) return "UPCOMING";
  const start = timeToMinutes(fx.time);
  if(NOW_MINUTES < start) return "UPCOMING";
  if(NOW_MINUTES >= start + GAME_DURATION_MIN) return "FINISHED";
  return "ONGOING";
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
  const teamAHtml = fx.teamA === savedTeam ? `<span class="team-mine">${fx.teamA}</span>` : fx.teamA;
  const teamBHtml = fx.teamB === savedTeam ? `<span class="team-mine">${fx.teamB}</span>` : fx.teamB;

  // Only a FINISHED game gets a score element — ONGOING and UPCOMING
  // are fully described by the badge, so nothing duplicates it here.
  const scoreHtml = status === "FINISHED" ? `<div class="score">${fx.finalScore}</div>` : '';

  return `
    <div class="card ${statusClass}${isMine ? ' mine' : ''}">
      <div class="match-info">
        <div class="sport-name">${fx.sport} &bull; ${fx.date}</div>
        <div class="teams">${teamAHtml}&nbsp;vs&nbsp;${teamBHtml}</div>
        <div class="time-venue">📍 ${fx.venue} &nbsp;|&nbsp; ${fx.time}</div>
      </div>
      <div>
        <span class="badge ${statusClass}">${status === "ONGOING" ? "ON GOING" : status}</span>
        ${scoreHtml}
      </div>
    </div>
  `;
}

