/**
 * Campus Compass — entry point
 * ------------------------------------------------------------
 * index.html loads only this file. It starts each part of the page;
 * the real work is in the files imported below. README.md has a map
 * of every folder.
 */
import { initTeamStrips } from './components/teamStrip.js';
import { initFixturesSection } from './sections/fixtures/fixturesSection.js';
import { initCalendarSection } from './sections/calendar/calendarSection.js';
import { initNewsSection } from './sections/news/newsSection.js';
import { initNavTabs } from './navTabs.js';

initTeamStrips();      // college logo rows on the Fixtures and Calendar tabs
initFixturesSection(); // Fixtures tab: filters, match list, Featured Match
initCalendarSection(); // Calendar tab: month grid + day detail
initNewsSection();     // News & Updates tab: Facebook posts + events
initNavTabs();         // top tabs; last, so the highlight pill measures the finished layout
