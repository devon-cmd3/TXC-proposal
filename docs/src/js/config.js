/**
 * Campus Compass — app configuration
 * ------------------------------------------------------------
 * Single place for values that used to be hard-coded (and scattered)
 * across main.js and the data files. Change something here instead
 * of hunting through the app logic.
 */
export const CONFIG = {
  // Base path (relative to docs/index.html) where team/event photos live.
  // Every data file should build its image paths off this instead of
  // typing "assets/pictures/..." or "pictures/..." by hand.
  ASSETS_PATH: "assets/pictures",

  // localStorage key used to remember the visitor's chosen team.
  STORAGE_KEY: "txcTeam",

  // Which tab is shown on first load. Must match a data-tab value
  // on one of the .nav-btn buttons in index.html.
  DEFAULT_TAB: "map",

  // Calendar view shown on first load of the "My Schedule" tab.
  CALENDAR: {
    YEAR: 2026,
    MONTH: 9, // 0-indexed -> October
  },
};
