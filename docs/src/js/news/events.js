import { CONFIG } from '../config.js';

const p = (file) => `${CONFIG.ASSETS_PATH}/${file}`;

export const EVENTS = [
  { team:"CCS Wizards",     title:"Wizard's Most Wanted",             img:p("wizardsEvent.png"),  desc:"CCS organization GDGC's Chief Technology Officer claims that the moon landing was fake." },
  { team:"NSG Pythons",     title:"Pythons VS Warriors",              img:p("pythonsEvent.png"),  desc:"NSG started the kick off and are completely on par with the undefeated ENG'G Warriors." },
  { team:"ENG'G Warriors",  title:"Warriors Building an Iron Wall",   img:p("warriorsEvent.png"), desc:"ENG'G's volleyball iron wall has been impenetrable so far! How will they do against the fierce Wolves.." },
  { team:"SBM Eagles",      title:"Eagles at the Top",                img:p("eaglesEvent.png"),   desc:"SBM reigns victorious as the Champions of TXC 2025!" },
];
