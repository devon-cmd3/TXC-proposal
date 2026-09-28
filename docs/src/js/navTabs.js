/**
 * Top navigation tabs
 * ------------------------------------------------------------
 * Shows one tab's <section> at a time and slides the navy highlight
 * pill under the active tab button.
 *
 * Markup: .nav-tabs in index.html
 * Styles: css/layout/navbar.css
 */
import { CONFIG } from './config.js';

// Each button's data-tab value -> the id of the <section> it shows.
const VIEW_FOR_TAB = {
  'map':         'mapView',
  'fixtures':    'fixturesView',
  'my-schedule': 'myScheduleView',
  'news':        'newsView',
};

function movePillToActiveTab(){
  const activeBtn = document.querySelector('.nav-btn.active');
  const pill = document.getElementById('navPill');
  if(!activeBtn || !pill) return;
  const navRect = activeBtn.parentElement.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  pill.style.left = (btnRect.left - navRect.left) + 'px';
  pill.style.width = btnRect.width + 'px';
}

function switchTab(tab){
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  movePillToActiveTab();
  Object.entries(VIEW_FOR_TAB).forEach(([name, viewId]) => {
    document.getElementById(viewId).hidden = name !== tab;
  });
}

export function initNavTabs(){
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  window.addEventListener('resize', movePillToActiveTab);
  switchTab(CONFIG.DEFAULT_TAB);
}
