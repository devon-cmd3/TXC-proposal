import { CONFIG } from '../config.js';

const p = (file) => `${CONFIG.ASSETS_PATH}/${file}`;

export const TEAMS = [
  { name: "NSG Pythons", mascot: "Pythons", img: p("pythons.png") },
  { name: "SBM Eagles", mascot: "Eagles", img: p("eagles.jpeg") },
  { name: "CCS Wizards", mascot: "Wizards", img: p("wizards.png") },
  { name: "ENG'G Warriors", mascot: "Warriors", img: p("warriors.jpeg") },
  { name: "ARTSCIES Tigers", mascot: "Tigers", img: p("tigers.png") },
  { name: "LAW Lady Justices", mascot: "Lady Justices", img: p("law.png") },
  { name: "MED Wolves", mascot: "Wolves", img: p("wolves.png") },
  { name: "AGGIES & SOE Colossus", mascot: "Colossus", img: p("colossus.png") },
];
