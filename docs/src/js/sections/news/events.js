/**
 * Upcoming Events cards (bottom of the News & Updates tab)
 * ------------------------------------------------------------
 * Photos live in docs/assets/pictures/events/. To add an event, drop
 * its photo there and add a line below; cards show in this order.
 */
import { CONFIG } from '../../config.js';

const photo = file => `${CONFIG.ASSETS_PATH}/events/${file}`;

export const EVENTS = [
  { team: "CCS Wizards",    title: "Wizard's Most Wanted",           img: photo("wizards.png"),  desc: "CCS organization GDGC's Chief Technology Officer claims that the moon landing was fake." },
  { team: "NSG Pythons",    title: "Pythons VS Warriors",            img: photo("pythons.png"),  desc: "NSG started the kick off and are completely on par with the undefeated ENG'G Warriors." },
  { team: "ENG'G Warriors", title: "Warriors Building an Iron Wall", img: photo("warriors.png"), desc: "ENG'G's volleyball iron wall has been impenetrable so far! How will they do against the fierce Wolves.." },
  { team: "SBM Eagles",     title: "Eagles at the Top",              img: photo("eagles.png"),   desc: "SBM reigns victorious as the Champions of TXC 2025!" },
];
