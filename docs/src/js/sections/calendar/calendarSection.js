/**
 * Calendar tab ("My Schedule")
 * ------------------------------------------------------------
 * A month grid marking the chosen team's games on each day, and the
 * day-detail list under it for whichever day was tapped last.
 *
 * Markup: #myScheduleView in index.html
 * Styles: css/sections/calendar.css (+ css/components/match-card.css)
 */
import { CONFIG } from '../../config.js';
import { fixtures } from '../../data/fixtures.js';
import { computeStatus, renderCard } from '../../components/matchCard.js';
import { MONTH_NAMES, toDateStr, formatLongDay } from '../../utils/dates.js';
import { getSelectedTeam, onTeamChange } from '../../state.js';

const viewYear = CONFIG.CALENDAR.YEAR;
const viewMonth = CONFIG.CALENDAR.MONTH;
let selectedDate = CONFIG.TODAY;

function teamGamesOn(team, date){
  return fixtures.filter(fx => fx.date === date && (fx.teamA === team || fx.teamB === team));
}

/**
 * Every day shown in a month grid: the month's own days, padded with
 * days from the neighbouring months so it fills whole Sun–Sat weeks.
 * Each cell is { dateStr, day, inMonth }.
 */
function monthCells(year, month){
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const prev = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
  const next = month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
  const cells = [];

  for(let i = startWeekday - 1; i >= 0; i--){
    const day = daysInPrevMonth - i;
    cells.push({ dateStr: toDateStr(prev.year, prev.month, day), day, inMonth: false });
  }
  for(let day = 1; day <= daysInMonth; day++){
    cells.push({ dateStr: toDateStr(year, month, day), day, inMonth: true });
  }
  for(let day = 1; cells.length % 7 !== 0; day++){
    cells.push({ dateStr: toDateStr(next.year, next.month, day), day, inMonth: false });
  }
  return cells;
}

// One pill per game. On phones CSS shrinks these to coloured dots.
function gamePillHtml(fx){
  const status = computeStatus(fx).toLowerCase();
  const label = status === 'ongoing' ? `${fx.sport} · ON GOING` : `${fx.time} ${fx.sport}`;
  return `<div class="cal-pill ${status}">${label}</div>`;
}

function renderCalendar(){
  const team = getSelectedTeam();
  document.getElementById('calendarMonthLabel').textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  document.getElementById('calendarGrid').innerHTML = monthCells(viewYear, viewMonth).map(cell => {
    const games = team ? teamGamesOn(team, cell.dateStr) : [];
    const classes = ['cal-cell'];
    if(!cell.inMonth) classes.push('out-of-month');
    if(cell.dateStr === CONFIG.TODAY) classes.push('is-today');
    if(cell.dateStr === selectedDate) classes.push('selected');

    return `<div class="${classes.join(' ')}" data-date="${cell.dateStr}">
      <div class="cal-cell__num">${cell.day}</div>
      <div class="cal-pills">${games.map(gamePillHtml).join('')}</div>
    </div>`;
  }).join('');
}

function renderDayDetail(){
  const title = document.getElementById('dayDetailTitle');
  const gamesEl = document.getElementById('dayDetailGames');
  const team = getSelectedTeam();

  if(!team){
    title.textContent = "Select your team above";
    gamesEl.innerHTML = `<div class="empty-state">Pick a team from the row above to see their personal schedule.</div>`;
    return;
  }

  title.textContent = `${team} — ${formatLongDay(selectedDate)}`;
  const games = teamGamesOn(team, selectedDate);
  gamesEl.innerHTML = games.length
    ? games.map(fx => renderCard(fx, team)).join('')
    : `<div class="empty-state">No games for ${team} on this day.</div>`;
}

function selectDate(date){
  selectedDate = date;
  renderCalendar();
  renderDayDetail();
}

export function initCalendarSection(){
  // One listener on the grid (not one per day) so it survives re-renders.
  document.getElementById('calendarGrid').addEventListener('click', event => {
    const cell = event.target.closest('.cal-cell');
    if(cell) selectDate(cell.dataset.date);
  });
  document.getElementById('calToday').addEventListener('click', () => selectDate(CONFIG.TODAY));

  renderCalendar();
  renderDayDetail();

  onTeamChange(() => {
    renderCalendar();
    renderDayDetail();
  });
}
