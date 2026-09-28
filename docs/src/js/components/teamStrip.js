/**
 * Team picker (row of college logos)
 * ------------------------------------------------------------
 * Fills every .team-strip in index.html (one on the Fixtures tab,
 * one on the Calendar tab) with a logo per team. Clicking a logo
 * selects that team for the whole page (see state.js).
 *
 * Styles: css/components/team-strip.css
 */
import { TEAMS } from '../data/teams.js';
import { getSelectedTeam, setSelectedTeam, onTeamChange } from '../state.js';

const STRIP_IDS = ['teamStripFixtures', 'teamStripSchedule'];

function teamChipHtml(team, selectedTeam){
  const selected = team.name === selectedTeam ? " selected" : "";
  return `
    <div class="team-chip${selected}" data-team="${team.name}" title="${team.name}">
      <img class="team-chip__photo" src="${team.img}" alt="${team.name}">
    </div>
  `;
}

function highlightSelectedTeam(teamName){
  document.querySelectorAll('.team-strip .team-chip').forEach(chip => {
    chip.classList.toggle('selected', chip.dataset.team === teamName);
  });
}

export function initTeamStrips(){
  const chipsHtml = TEAMS.map(team => teamChipHtml(team, getSelectedTeam())).join('');

  STRIP_IDS.forEach(id => {
    const strip = document.getElementById(id);
    if(!strip) return;
    strip.innerHTML = chipsHtml;
    strip.addEventListener('click', event => {
      const chip = event.target.closest('.team-chip');
      if(chip) setSelectedTeam(chip.dataset.team);
    });
  });

  onTeamChange(highlightSelectedTeam);
}
