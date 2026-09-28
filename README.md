# Campus Compass · Xavier Ateneo

Website for **The Xavier Cup 2026** (Oct 10–20): every fixture, a personal
team calendar, and CSG news pulled straight from Facebook.

**Live site:** https://devon-cmd3.github.io/TXC-proposal/

## Run it locally

Plain HTML, CSS and JavaScript, no build step. The JavaScript uses ES
modules, which browsers refuse to load from a `file://` path, so serve the
`docs/` folder instead of double-clicking `index.html`:

- **VS Code:** install the *Live Server* extension, right-click
  `docs/index.html` and choose **Open with Live Server**.
- **Python:** `python -m http.server 8000 --directory docs`, then open
  http://localhost:8000.

GitHub Pages serves `docs/` from `main`, so anything pushed to `main` is live
a minute or two later.

## Folder map

```
docs/                             the website (GitHub Pages serves this folder)
├── index.html                    all page markup; each tab is a <section>
├── assets/pictures/
│   ├── teamLogos/                college sprites for the team picker
│   └── events/                   photos for the Upcoming Events cards
└── src/
    ├── css/
    │   ├── styles.css            entry point: imports the files below, in order
    │   ├── base/                 colours & fonts (variables.css), reset, background
    │   ├── layout/               top bar + tabs, page column, tab banners, footer
    │   ├── components/           team picker, match card (used on several tabs)
    │   └── sections/             one file per tab: map, fixtures, calendar, news
    └── js/
        ├── main.js               entry point: starts every section
        ├── config.js             settings: pretend "today", first tab, Facebook link…
        ├── state.js              the visitor's chosen team, shared by all tabs
        ├── navTabs.js            switching tabs + the sliding highlight
        ├── data/                 teams.js, fixtures.js (mock schedule)
        ├── components/           matchCard.js, teamStrip.js
        ├── utils/                dates.js (date & time formatting)
        └── sections/
            ├── fixtures/         filters + match list, Featured Match box
            ├── calendar/         month grid + day detail
            └── news/             news & events, placeholder stories, posts.json
scripts/fetch-facebook-posts.mjs     pulls the latest Facebook posts into posts.json
.github/workflows/facebook-news.yml  runs that script every hour
```

## How the code fits together

- `index.html` loads one stylesheet (`styles.css`) and one script (`main.js`).
- Each tab has its own folder in `src/js/sections/` with an `init…Section()`
  function, and its own stylesheet in `src/css/sections/`. `main.js` calls
  each `init` once, in order.
- Anything used by more than one tab lives in `components/`, `data/` or
  `utils/`, never inside a section folder.
- Picking a team calls `setSelectedTeam()` in `state.js`. Sections that care
  subscribe with `onTeamChange()` and re-render themselves.
- Every CSS file keeps its own phone rules at the bottom. Breakpoints:
  **760px** tablets & phones, **560px** phones, **420px** small phones.
- Class names follow `block__element--modifier`, e.g.
  `.fixture-card__team--home`. Search a class name to find its CSS and JS.
- Every file starts with a comment saying what it does and where its markup
  and styles live.

## Common edits

| I want to… | Edit |
|---|---|
| Change colours or fonts | `src/css/base/variables.css` |
| Change a college's name or logo | `src/js/data/teams.js` (+ image in `assets/pictures/teamLogos/`) |
| Use the real match schedule | `src/js/data/fixtures.js` (see the note at the top) |
| Change "today" or the live-game clock | `src/js/config.js` (`TODAY`, `NOW_MINUTES`) |
| Change which tab opens first | `src/js/config.js` (`DEFAULT_TAB`) |
| Edit the Upcoming Events | `src/js/sections/news/events.js` (+ photo in `assets/pictures/events/`) |
| Edit the placeholder news | `src/js/sections/news/news.js` (only shown when there are no Facebook posts) |
| Change a tab's banner text | that tab's `<section>` in `index.html` |
| Add the campus map | replace `#campusMapSlot` in `index.html`; styles go in `src/css/sections/map.css`, code in a new `src/js/sections/map/` started from `main.js` |

## Facebook news

The News & Updates tab shows the latest posts from the CSG Facebook Page.
The newest post is the featured card, the next five fill the carousel, and
each **View on Facebook** button opens that exact post.

- `.github/workflows/facebook-news.yml` runs `scripts/fetch-facebook-posts.mjs`
  every hour. To run it now: **Actions → Update Facebook news → Run workflow**.
- The script reads the Page with a Page access token stored as the repository
  secret **`FB_PAGE_TOKEN`**. The token is never in the code or the site.
- Posts are saved to `docs/src/js/sections/news/posts.json`. Don't edit that
  file by hand; the next run overwrites it.
- If a run fails, its log shows Facebook's error. Code `190` means the token
  expired or was revoked: make a new one and update the secret.

**Switching to a different Facebook Page:**

1. Set `PAGE_ID` in `scripts/fetch-facebook-posts.mjs`. Use the **Page ID**
   from the Page's *About → Page transparency*, not the number in its web
   address.
2. Set `CSG_FACEBOOK_URL` in `src/js/config.js` to the Page's web address.
3. Make a Page token for it: in the Meta app (*Manage everything on your
   Page* use case, with `pages_show_list` and `pages_read_engagement`), open
   the Graph API Explorer, **Generate Access Token**, **Extend** it in the
   Access Token Tool, run `me/accounts`, and copy that Page's
   `access_token`. The Access Token Debugger should say *Type: Page,
   Expires: Never*.
4. Paste it into **Settings → Secrets and variables → Actions →
   `FB_PAGE_TOKEN`**, then run the workflow.

## Team to-do list

1. Phone Responsiveness 💔 Goods na
2. Addition of the map wla pa
3. College Banners goods.

4. Integrate to CC - WLA PA
5. Goods na api
6. Fixed design flaws
