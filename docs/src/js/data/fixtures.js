/**
 * Match schedule (MOCK DATA)
 * ------------------------------------------------------------
 * There's no real schedule yet, so this file generates a believable
 * one. It uses a fixed random seed, so everyone sees the same games
 * on every load.
 *
 * When the real schedule is ready, replace `fixtures` with a plain
 * array of objects in the same shape and delete the generator:
 *
 *   { id: 1, date: "2026-10-10", time: "2:30 PM", sport: "Basketball",
 *     venue: "Main Gym", teamA: "SBM Eagles", teamB: "MED Wolves",
 *     finalScore: "64 - 58" }
 *
 * teamA / teamB must match a `name` in data/teams.js. finalScore is
 * only shown once the game is finished (see components/matchCard.js).
 */
import { CONFIG } from '../config.js';
import { timeToMinutes } from '../utils/dates.js';
import { TEAMS } from './teams.js';

export const SPORTS = ["Basketball", "Volleyball", "Football", "Badminton", "Esports", "Cheerdance"];

// The 11 tournament days, Oct 10–20.
export const DATES = [
  "2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15",
  "2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20",
];

const VENUES = ["Main Gym", "Covered Court 1", "Covered Court 2", "Main Field", "XU Hall", "Covered Court 3"];
const TIME_SLOTS = ["8:00 AM", "9:30 AM", "11:00 AM", "1:00 PM", "2:30 PM", "3:30 PM", "5:00 PM"];

// On the pretend "today" (CONFIG.TODAY), games are pinned around the
// pretend clock (3:30 PM) so the page shows two finished games, three
// live ones and one upcoming.
const TODAY_TIMES = ["9:30 AM", "11:00 AM", "2:30 PM", "3:00 PM", "3:30 PM", "5:00 PM"];

// Plausible score range per sport; anything not listed uses the default.
const SCORE_RANGE = {
  Volleyball: [0, 3],   // sets won
  Esports:    [0, 3],   // maps won
  Cheerdance: [70, 98], // judges' points
  Basketball: [48, 92],
};
const DEFAULT_SCORE_RANGE = [0, 5];

export const fixtures = generateMockFixtures();

function generateMockFixtures(){
  const list = [];
  let nextId = 1;

  DATES.forEach(date => {
    const isToday = date === CONFIG.TODAY;
    const dayRng = seededRandom(seedFor(date));
    const gameCount = isToday ? TODAY_TIMES.length : 2 + Math.floor(dayRng() * 2); // 2–3 a day
    const usedTimes = new Set();

    for(let i = 0; i < gameCount; i++){
      const rng = seededRandom(seedFor(date + i));
      const sport = pick(rng, SPORTS);
      const venue = pick(rng, VENUES);

      let time = isToday ? TODAY_TIMES[i] : pick(rng, TIME_SLOTS);
      for(let tries = 0; usedTimes.has(time) && tries < 8; tries++){
        time = pick(rng, TIME_SLOTS); // avoid two games in the same slot
      }
      usedTimes.add(time);

      const teamA = Math.floor(rng() * TEAMS.length);
      let teamB = Math.floor(rng() * TEAMS.length);
      while(teamB === teamA) teamB = Math.floor(rng() * TEAMS.length);

      list.push({
        id: nextId++,
        date, sport,
        teamA: TEAMS[teamA].name, teamB: TEAMS[teamB].name,
        venue, time,
        finalScore: randomScore(sport, rng),
      });
    }
  });

  // Chronological: by date, then by kick-off time.
  return list.sort((a, b) =>
    a.date === b.date ? timeToMinutes(a.time) - timeToMinutes(b.time) : a.date.localeCompare(b.date)
  );
}

function randomScore(sport, rng){
  const [min, max] = SCORE_RANGE[sport] ?? DEFAULT_SCORE_RANGE;
  const a = randomInt(rng, min, max);
  let b = randomInt(rng, min, max);
  if(a === b) b++; // no draws
  return `${a} - ${b}`;
}

/* ---------- seeded random numbers ---------- */

// mulberry32: a tiny seeded generator. Same seed -> same sequence.
function seededRandom(seed){
  return function(){
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFor(text){
  let seed = 0;
  for(let i = 0; i < text.length; i++) seed += text.charCodeAt(i) * (i + 7);
  return seed;
}

function pick(rng, list){
  return list[Math.floor(rng() * list.length)];
}

function randomInt(rng, min, max){
  return Math.floor(rng() * (max - min + 1)) + min;
}
