# TXC Proposal

---

## The problem
Ang initial design sa fixtures section felt cluttered. Every game from every sport, every team, every day of the tournament was dumped into one long list. If you wanted to know when your own college was playing, you had scroll through a pile of cards that all looked more or less the same, and manually skip past every game that had nothing to do with you.

Daghan kaayo siya mga chechebureche. The information was technically all there, it just wasn't organized around what someone actually needed, which is usually just "kanusa magdula sunod ako college?".

## The solution: an actual calendar
Instead of making students filter their way down to what matters to them, the Schedule tab now works like a normal calendar. You pick your college once from a row of team chips at the top, and the site remembers that pick using local storage, so you don't have to do it again next time you open the page.

Once you've picked a team, the October grid fills in. Any day where your team has a game shows a little colored pill sitting right inside that date. Finished games get a plain, quiet-looking pill. A game that's happening right now gets a bright pulsing one so it's basically impossible to miss. Upcoming games get an outlined pill in the same lime accent used across the rest of the site.

Tap a day and a panel underneath shows the full details for that team's games that day: sport, opponent, venue, time, status. I leaned into making this feel like a normal calendar app on purpose, since that's something people already check on their phone constantly. There's nothing new to learn here. If you've ever used Google Calendar or the built in Calendar app on a Mac, you already know how to use this.

## Why the search bar isn't needed anymore
Earlier on I figured a search bar was going to be necessary, something where you'd type "Eagles" or "Basketball" and get a filtered list. Ga make sense siya back when the page was just one giant list, because typing a search was really the only quick way to cut through it.

Pero if maggamit og calendar, the search bar stopped doing anything useful. A search bar exists for when you don't know where something is. A calendar already shows you where it is. When someone picks their team, they're not searching anymore, they're just looking at a grid and noticing which days have pills on them. The thing they used to type a query for is just visible now.

It also sidesteps a bunch of small annoyances search bars tend to bring with them, typos, weird partial matches, empty "no results" states, typing on a phone screen while standing around at a game. Tapping a day on a calendar is quicker and a lot harder to mess up than typing "Volleyball" and hoping it spells right.

## Why this actually helps people root for their team
The whole point of a tracker like this is para aware sila sa ila mga games and maka root sila much better for their colleges, making things more competitive. If you can't easily tell when your own college is playing, you're just not going to show up. That's really the whole reason the calendar approach exists.

Even outside the Schedule tab, your team stands out. Over in All Fixtures, if a match involves your team, the team name shows up in green and the whole card gets a green edge, no matter what color the status would normally give it. So even when you're just scrolling the full list out of curiosity, your own games jump out without you having to search or filter for them.

The calendar also turns "do I have a game to watch this week" into something you can answer in about two seconds. You're not reading through text, you're scanning a grid the same way you'd check if you're free on a certain day. A day with a pill means something's happening. A day without one means it isn't. That's just a faster way to take in the information than reading rows of cards.

And the pulsing pill for ongoing games matters more than it sounds like it should. A game that's live right now needs to grab your attention in a way that plain text sitting in a list never really does, especially with something like intramurals where games are short and if you miss the window, you miss the whole thing.

## Why a calendar and not just a nicer list
I did think about just cleaning up the list instead, maybe defaulting the filters to your own team automatically. Both were on the table, and honestly neither one really solves the actual problem.

A cleaner list is still a list. You're still reading line by line to piece together your schedule across a bunch of days. A calendar shows the whole tournament at once, spatially, which is closer to how people already think about time in the first place. You don't read a calendar top to bottom like a list, you scan it, and your eyes just land on the days that matter. That's really the difference that fixes the original clutter problem, not the styling on top of it.

## Additional stuff
Some stuff I also had in mind pero I didn't want to be hasty

- Should the calendar eventually cover the whole event window (setup days, the awarding ceremony) or stay locked to just the active tournament dates like it is now
- Would it help to give All Fixtures some kind of mini calendar summary too, or is it better left as a pure list for people who genuinely want to browse everything