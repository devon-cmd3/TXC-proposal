/* PHOTO NEEDED per team: a real candid/team photo for the chip
  avatar (currently a colored initials circle). Square crop,
  ~200x200px works well for the chip size used here. */

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

function computeStatus(fx){
  if(fx.date < TODAY) return "FINISHED";
  if(fx.date > TODAY) return "UPCOMING";
  const start = timeToMinutes(fx.time);
  if(NOW_MINUTES < start) return "UPCOMING";
  if(NOW_MINUTES >= start + GAME_DURATION_MIN) return "FINISHED";
  return "ONGOING";
}

let currentTab = "fixtures";
let savedTeam = localStorage.getItem("txcTeam") || "";
let scheduleSelectedDate = TODAY;
let calViewYear = 2026;
let calViewMonth = 9; // October (0-indexed)
let newsFilter = "All";

function renderCard(fx){
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

function teamChipHtml(team){
  const selected = team.name === savedTeam ? " selected" : "";
  return `
    <div class="team-chip${selected}" data-team="${team.name}" style="background:${team.color}" title="${team.name}">
      <img class="team-chip__photo" src="${team.img}" alt="${team.name}">
    </div>
  `;
}

function renderTeamStrip(){
  const chipsHtml = TEAMS.map(t=>teamChipHtml(t)).join('');
  ['teamStripFixtures', 'teamStripSchedule'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = chipsHtml;
  });
  document.querySelectorAll('.team-strip .team-chip').forEach(chip=>{
    chip.addEventListener('click', ()=> selectTeam(chip.dataset.team));
  });
}

function highlightSelectedTeam(){
  document.querySelectorAll('.team-strip .team-chip').forEach(chip=>{
    chip.classList.toggle('selected', chip.dataset.team === savedTeam);
  });
}

function selectTeam(teamName){
  savedTeam = teamName;
  localStorage.setItem('txcTeam', teamName);
  highlightSelectedTeam();
  renderCalendar();
  renderDayDetail();
  renderFixtures();
}

function populateFilterOptions(){
  const dateSelect = document.getElementById('dateSelect');
  DATES.forEach((d,i)=>{
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = `${d.slice(5).replace('-', '/')} (Day ${i+1})`;
    dateSelect.appendChild(opt);
  });
  const sportSelect = document.getElementById('sportSelect');
  SPORTS.forEach(s=>{
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    sportSelect.appendChild(opt);
  });
}

function renderFixtures(){
  const selectedDate = document.getElementById('dateSelect').value;
  const selectedSport = document.getElementById('sportSelect').value;
  const filtered = fixtures.filter(fx =>
    (selectedDate === "ALL" || fx.date === selectedDate) &&
    (selectedSport === "ALL" || fx.sport === selectedSport)
  );
  const container = document.getElementById('fixturesContainer');
  container.innerHTML = filtered.length
    ? filtered.map(renderCard).join('')
    : `<div class="empty-state">No games found for the selected filters.</div>`;
}

function pad2(n){ return String(n).padStart(2,'0'); }
function toDateStr(y,m,d){ return `${y}-${pad2(m+1)}-${pad2(d)}`; }
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function renderCalendar(){
  document.getElementById('calendarMonthLabel').textContent = `${MONTH_NAMES[calViewMonth]} ${calViewYear}`;

  const firstOfMonth = new Date(calViewYear, calViewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(calViewYear, calViewMonth+1, 0).getDate();
  const daysInPrevMonth = new Date(calViewYear, calViewMonth, 0).getDate();

  const cells = [];
  for(let i=startWeekday-1;i>=0;i--){
    const d = daysInPrevMonth - i;
    const m = calViewMonth-1<0 ? 11 : calViewMonth-1;
    const y = calViewMonth-1<0 ? calViewYear-1 : calViewYear;
    cells.push({ dateStr: toDateStr(y,m,d), day:d, inMonth:false });
  }
  for(let d=1; d<=daysInMonth; d++){
    cells.push({ dateStr: toDateStr(calViewYear,calViewMonth,d), day:d, inMonth:true });
  }
  let nextDay = 1;
  while(cells.length % 7 !== 0){
    const m = calViewMonth+1>11 ? 0 : calViewMonth+1;
    const y = calViewMonth+1>11 ? calViewYear+1 : calViewYear;
    cells.push({ dateStr: toDateStr(y,m,nextDay), day:nextDay, inMonth:false });
    nextDay++;
  }

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = cells.map(cell=>{
    const games = savedTeam ? fixtures.filter(fx => fx.date === cell.dateStr && (fx.teamA===savedTeam || fx.teamB===savedTeam)) : [];
    const classes = ['cal-cell'];
    if(!cell.inMonth) classes.push('out-of-month');
    if(cell.dateStr === TODAY) classes.push('is-today');
    if(cell.dateStr === scheduleSelectedDate) classes.push('selected');

    const pillsHtml = games.map(fx=>{
      const status = computeStatus(fx).toLowerCase();
      const label = status === 'ongoing' ? `${fx.sport} · ON GOING` : `${fx.time} ${fx.sport}`;
      return `<div class="cal-pill ${status}">${label}</div>`;
    }).join('');

    return `<div class="${classes.join(' ')}" data-date="${cell.dateStr}">
      <div class="cal-cell__num">${cell.day}</div>
      <div class="cal-pills">${pillsHtml}</div>
    </div>`;
  }).join('');

  document.querySelectorAll('.cal-cell').forEach(cell=>{
    cell.addEventListener('click', ()=>{
      scheduleSelectedDate = cell.dataset.date;
      renderCalendar();
      renderDayDetail();
    });
  });
}

document.getElementById('calToday').addEventListener('click', ()=>{
  scheduleSelectedDate = TODAY;
  renderCalendar();
  renderDayDetail();
});

function renderDayDetail(){
  const title = document.getElementById('dayDetailTitle');
  const gamesEl = document.getElementById('dayDetailGames');

  if(!savedTeam){
    title.textContent = "Select your team above";
    gamesEl.innerHTML = `<div class="empty-state">Pick a team from the row above to see their personal schedule.</div>`;
    return;
  }

  const niceDate = new Date(scheduleSelectedDate + "T00:00:00").toLocaleDateString('en-US',{ weekday:'long', month:'short', day:'numeric' });
  title.textContent = `${savedTeam} — ${niceDate}`;

  const games = fixtures.filter(fx => fx.date === scheduleSelectedDate && (fx.teamA === savedTeam || fx.teamB === savedTeam));
  gamesEl.innerHTML = games.length
    ? games.map(renderCard).join('')
    : `<div class="empty-state">No games for ${savedTeam} on this day.</div>`;
}

/* ============ NEWS & UPDATES ============ */
let newsViewMode = "carousel";

function renderNewsFilters(){
  const sources = ["All", "CSG", ...TEAMS.map(t=>t.mascot)];
  const el = document.getElementById('newsFilters');
  el.innerHTML = sources.map(s=>
    `<button class="news-filter${s===newsFilter?' active':''}" data-source="${s}">${s}</button>`
  ).join('');
  el.querySelectorAll('.news-filter').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      newsFilter = btn.dataset.source;
      renderNewsFilters();
      renderNews();
    });
  });
}

function newsCardHtml(item){
  return `
    <div class="news-card">
      <div class="news-card__title">${item.title}</div>
      <div class="news-card__snippet">${item.snippet}</div>
      <div class="news-card__foot">
        <span class="news-card__date">${item.date}</span>
        <!-- TODO: point this at the org's Facebook page once it's live -->
        <button class="news-card__more" type="button">See More</button>
      </div>
    </div>
  `;
}

function renderNews(){
  const filtered = newsFilter === "All" ? NEWS : NEWS.filter(n => n.source === newsFilter);
  const carousel = document.getElementById('newsCarousel');
  const grid = document.getElementById('newsGrid');
  const track = document.getElementById('newsTrack');
  const seeAllBtn = document.getElementById('newsSeeAll');

  seeAllBtn.classList.toggle('active', newsViewMode === 'grid');
  seeAllBtn.textContent = newsViewMode === 'grid' ? 'Back to Carousel' : 'See All';

  if(newsViewMode === 'grid'){
    carousel.hidden = true;
    grid.hidden = false;
    grid.innerHTML = filtered.length
      ? filtered.map(newsCardHtml).join('')
      : `<div class="empty-state">No news for this filter yet.</div>`;
    return;
  }

  carousel.hidden = false;
  grid.hidden = true;

  if(filtered.length === 0){
    carousel.onscroll = null;
    track.innerHTML = `<div class="empty-state">No news for this filter yet.</div>`;
    return;
  }

  const singleHtml = filtered.map(newsCardHtml).join('');
  track.innerHTML = singleHtml;

  requestAnimationFrame(()=>{
    const overflowing = track.scrollWidth > carousel.clientWidth + 4;

    if(!overflowing){
      carousel.onscroll = null;
      return;
    }

    track.innerHTML = singleHtml + singleHtml + singleHtml;
    const singleSetWidth = track.scrollWidth / 3;
    carousel.scrollLeft = singleSetWidth;

    carousel.onscroll = ()=>{
      if(carousel.scrollLeft <= 0){
        carousel.scrollLeft += singleSetWidth;
      } else if(carousel.scrollLeft >= singleSetWidth * 2){
        carousel.scrollLeft -= singleSetWidth;
      }
    };
  });
}

document.getElementById('newsSeeAll').addEventListener('click', ()=>{
  newsViewMode = newsViewMode === 'grid' ? 'carousel' : 'grid';
  renderNews();
});

/* ============ EVENTS (under News & Updates) ============ */


function renderEvents(){
  document.getElementById('eventsGrid').innerHTML = EVENTS.map(ev => `
    <div class="event-card">
      <img class="event-card__photo" src="${ev.img}" alt="${ev.title}">
      <div class="event-card__body">
        <div class="event-card__source">${ev.team}</div>
        <div class="event-card__title">${ev.title}</div>
        <div class="event-card__desc">${ev.desc}</div>
      </div>
    </div>
  `).join('');
}

/* ============ TABS ============ */
function updateNavPill(){
  const activeBtn = document.querySelector('.nav-btn.active');
  const pill = document.getElementById('navPill');
  if(!activeBtn || !pill) return;
  const navRect = activeBtn.parentElement.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  pill.style.left = (btnRect.left - navRect.left) + 'px';
  pill.style.width = btnRect.width + 'px';
}

function switchTab(tab){
  currentTab = tab;
  document.querySelectorAll('.nav-btn').forEach(b=> b.classList.toggle('active', b.dataset.tab === tab));
  updateNavPill();
  document.getElementById('mapView').hidden = tab !== 'map';
  document.getElementById('fixturesView').hidden = tab !== 'fixtures';
  document.getElementById('myScheduleView').hidden = tab !== 'my-schedule';
  document.getElementById('newsView').hidden = tab !== 'news';
}

document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> switchTab(btn.dataset.tab));
});

window.addEventListener('resize', updateNavPill);

document.getElementById('dateSelect').addEventListener('change', renderFixtures);
document.getElementById('sportSelect').addEventListener('change', renderFixtures);

/* ============ INIT ============ */
populateFilterOptions();
renderTeamStrip();
renderFixtures();
renderCalendar();
renderDayDetail();
renderNewsFilters();
renderNews();
renderEvents();
updateNavPill();
