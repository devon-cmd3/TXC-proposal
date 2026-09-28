import { CONFIG } from '../config.js';

const p = (file) => `${CONFIG.ASSETS_PATH}/${file}`;

export const TEAMS = [
  { name: "NSG Pythons", mascot: "Pythons", img: p("teamLogos/serpent.png") },
  { name: "SBM Eagles", mascot: "Eagles", img: p("teamLogos/eagle.png") },
  { name: "CCS Wizards", mascot: "Wizards", img: p("teamLogos/wizard.png") },
  { name: "ENG'G Warriors", mascot: "Warriors", img: p("teamLogos/warrior.png") },
  { name: "ARTSCIES Tigers", mascot: "Tigers", img: p("teamLogos/tiger.png") },
  { name: "LAW Lady Justices", mascot: "Lady Justices", img: p("teamLogos/goddess.png") },
  { name: "MED Wolves", mascot: "Wolves", img: p("teamLogos/wolf.png") },
  { name: "AGGIES & SOE Colossus", mascot: "Colossus", img: p("teamLogos/dragon.png") },
];
