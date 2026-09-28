/**
 * Shared state — the visitor's chosen team
 * ------------------------------------------------------------
 * Picking a college logo on the Fixtures or Calendar tab selects that
 * team everywhere: their games get highlighted and the Calendar shows
 * their schedule. The choice is remembered between visits.
 *
 * Sections that care call onTeamChange() to re-render when it changes.
 */
import { CONFIG } from './config.js';

let selectedTeam = localStorage.getItem(CONFIG.STORAGE_KEY) || "";
const listeners = [];

/** The chosen team's name, or "" if none has been picked yet. */
export function getSelectedTeam(){
  return selectedTeam;
}

export function setSelectedTeam(teamName){
  selectedTeam = teamName;
  localStorage.setItem(CONFIG.STORAGE_KEY, teamName);
  listeners.forEach(listener => listener(teamName));
}

/** Call `listener(teamName)` every time a different team is picked. */
export function onTeamChange(listener){
  listeners.push(listener);
}
