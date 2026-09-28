/**
 * Date & time helpers
 * ------------------------------------------------------------
 * Dates are passed around as "YYYY-MM-DD" strings and kick-off times
 * as "h:mm AM/PM" strings, the same way they appear in
 * data/fixtures.js.
 */

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2:30 PM" -> 870 (minutes after midnight). */
export function timeToMinutes(time){
  const [clock, meridiem] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);
  if(meridiem === "PM" && hours !== 12) hours += 12;
  if(meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/** (2026, 9, 5) -> "2026-10-05". `month` is 0-indexed, like Date. */
export function toDateStr(year, month, day){
  const pad2 = n => String(n).padStart(2, '0');
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

/** "2026-10-12" -> "10/12" */
export function formatShortDate(dateStr){
  return dateStr.slice(5).replace('-', '/');
}

/** "2026-10-12" -> "Mon, Oct 12" */
export function formatDayLabel(dateStr){
  return toLocalDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

/** "2026-10-12" -> "Monday, Oct 12" */
export function formatLongDay(dateStr){
  return toLocalDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });
}

// Midnight local time, so the weekday doesn't shift with the timezone.
function toLocalDate(dateStr){
  return new Date(dateStr + "T00:00:00");
}
