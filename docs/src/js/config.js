/**
 * Campus Compass — settings
 * ------------------------------------------------------------
 * Values you're likely to tweak live here, so you don't have to dig
 * through the app logic to change them. Import as CONFIG.
 */
export const CONFIG = {
  // Folder (relative to docs/index.html) holding team logos and event
  // photos. Data files build image paths from this instead of typing
  // "assets/pictures/..." by hand.
  ASSETS_PATH: "assets/pictures",

  // localStorage key used to remember the visitor's chosen team.
  STORAGE_KEY: "txcTeam",

  // Tab shown when the page first loads. Must match a data-tab value
  // on one of the .nav-btn buttons in index.html.
  DEFAULT_TAB: "map",

  // Pretend clock. The prototype runs on a fixed "now" so every match
  // status (finished / live / upcoming) shows up. Point these at the
  // real date and time once the schedule is real.
  TODAY: "2026-10-12",
  NOW_MINUTES: 15 * 60 + 30, // 3:30 PM, as minutes after midnight
  GAME_DURATION_MIN: 90,     // how long after kick-off a game counts as live

  // Month the Calendar tab opens on.
  CALENDAR: {
    YEAR: 2026,
    MONTH: 9, // 0-indexed -> October
  },

  // CSG Facebook Page. News cards without a link to their own post
  // (e.g. the placeholders in sections/news/news.js) send their
  // "View on Facebook" button here instead.
  CSG_FACEBOOK_URL: "https://web.facebook.com/profile.php?id=61595123270779",
};
