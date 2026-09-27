import { CONFIG } from './config.js';
import { TEAMS } from './data/teams.js';
import { 
  SPORTS, 
  DATES, 
  TODAY, 
  fixtures 
} from './data/fixtures.js';
import { computeStatus, renderCard } from './components/matchCard.js';
import { initFeaturedMatch } from './components/featuredMatch.js';
import { initNews } from './news/newsSection.js';

let currentTab = CONFIG.DEFAULT_TAB;
let savedTeam = localStorage.getItem(CONFIG.STORAGE_KEY) || "";
let scheduleSelectedDate = TODAY;
let calViewYear = CONFIG.CALENDAR.YEAR;
let calViewMonth = CONFIG.CALENDAR.MONTH;

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
  localStorage.setItem(CONFIG.STORAGE_KEY, teamName);
  highlightSelectedTeam();
  renderCalendar();
  renderDayDetail();
  renderFixtures();
  featuredMatch.render(savedTeam);
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
    ? filtered.map(fx => renderCard(fx, savedTeam)).join('')
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
    ? games.map(fx => renderCard(fx, savedTeam)).join('')
    : `<div class="empty-state">No games for ${savedTeam} on this day.</div>`;
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
const featuredMatch = initFeaturedMatch();
populateFilterOptions();
renderTeamStrip();
renderFixtures();
renderCalendar();
renderDayDetail();
initNews();
updateNavPill();
featuredMatch.render(savedTeam);

