
const SPORTS = ["Basketball", "Volleyball", "Football", "Badminton", "Esports", "Cheerdance"];
const VENUES = ["Main Gym", "Covered Court 1", "Covered Court 2", "Main Field", "XU Hall", "Covered Court 3"];
const TIME_SLOTS = ["8:00 AM","9:30 AM","11:00 AM","1:00 PM","2:30 PM","3:30 PM","5:00 PM"];

const DATES = ["2026-10-10","2026-10-11","2026-10-12","2026-10-13","2026-10-14",
              "2026-10-15","2026-10-16","2026-10-17","2026-10-18","2026-10-19","2026-10-20"];
const TODAY = "2026-10-12";
const NOW_MINUTES = 15*60 + 30; // 3:30 PM — the prototype's "current time"
const GAME_DURATION_MIN = 90;

function timeToMinutes(t){
  const [time, mer] = t.split(" ");
  let [h,m] = time.split(":").map(Number);
  if(mer === "PM" && h !== 12) h += 12;
  if(mer === "AM" && h === 12) h = 0;
  return h*60+m;
}

function mulberry32(seed){
  return function(){
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seedFor(str){ let s=0; for(let i=0;i<str.length;i++) s += str.charCodeAt(i)*(i+7); return s; }
function randInt(rng, min, max){ return Math.floor(rng()*(max-min+1))+min; }

function scoreFor(sport, rng){
  if(sport === "Volleyball" || sport === "Esports") { let a=randInt(rng,0,3), b=randInt(rng,0,3); if(a===b) b++; return `${a} - ${b}`; }
  if(sport === "Cheerdance") { let a=randInt(rng,70,98), b=randInt(rng,70,98); if(a===b) b++; return `${a} - ${b}`; }
  if(sport === "Basketball") { let a=randInt(rng,48,92), b=randInt(rng,48,92); if(a===b) b++; return `${a} - ${b}`; }
  let a=randInt(rng,0,5), b=randInt(rng,0,5); if(a===b) b++; return `${a} - ${b}`;
}

let idCounter = 1;
const fixtures = [];
DATES.forEach(date=>{
  const dayRng = mulberry32(seedFor(date));
  const isToday = date === TODAY;
  const count = isToday ? 6 : 2 + Math.floor(dayRng()*2); // 2-3 normally, 6 on TODAY
  const usedSlots = new Set();

  for(let i=0;i<count;i++){
    const rng = mulberry32(seedFor(date + i));
    const sport = SPORTS[Math.floor(rng()*SPORTS.length)];
    const venue = VENUES[Math.floor(rng()*VENUES.length)];

    let time;
    if(isToday){
      // Force a spread across each status: two clearly finished,
      // three overlapping "now" (ongoing), one clearly upcoming.
      const forced = ["9:30 AM","11:00 AM","2:30 PM","3:00 PM","3:30 PM","5:00 PM"];
      time = forced[i % forced.length];
    } else {
      time = TIME_SLOTS[Math.floor(rng()*TIME_SLOTS.length)];
    }
    let tries = 0;
    while(usedSlots.has(time) && tries < 8){ time = TIME_SLOTS[Math.floor(rng()*TIME_SLOTS.length)]; tries++; }
    usedSlots.add(time);

    const ta = Math.floor(rng()*TEAMS.length);
    let tb = Math.floor(rng()*TEAMS.length);
    while(tb === ta) tb = Math.floor(rng()*TEAMS.length);

    const score = scoreFor(sport, rng);

    fixtures.push({
      id: idCounter++,
      date, sport,
      teamA: TEAMS[ta].name, teamB: TEAMS[tb].name,
      venue, time,
      finalScore: score,
    });
  }
});
fixtures.sort((a,b)=> a.date === b.date ? timeToMinutes(a.time)-timeToMinutes(b.time) : a.date.localeCompare(b.date));
