/**
 * The eight competing colleges
 * ------------------------------------------------------------
 *   name    full team name, shown on match cards and used as the
 *           team's ID everywhere (fixtures refer to teams by name)
 *   mascot  short name shown under the team name on match cards
 *   img     logo sprite shown in the team picker, stored in
 *           docs/assets/pictures/teamLogos/
 *
 * To change a logo, drop the new image into teamLogos/ and update the
 * file name below. The picker shows each logo whole on a white card,
 * so transparent PNGs of any shape work.
 */
import { CONFIG } from '../config.js';

const logo = file => `${CONFIG.ASSETS_PATH}/teamLogos/${file}`;

export const TEAMS = [
  { name: "NSG Pythons",           mascot: "Pythons",       img: logo("serpent.png") },
  { name: "SBM Eagles",            mascot: "Eagles",        img: logo("eagle.png") },
  { name: "CCS Wizards",           mascot: "Wizards",       img: logo("wizard.png") },
  { name: "ENG'G Warriors",        mascot: "Warriors",      img: logo("warrior.png") },
  { name: "ARTSCIES Tigers",       mascot: "Tigers",        img: logo("tiger.png") },
  { name: "LAW Lady Justices",     mascot: "Lady Justices", img: logo("goddess.png") },
  { name: "MED Wolves",            mascot: "Wolves",        img: logo("wolf.png") },
  { name: "AGGIES & SOE Colossus", mascot: "Colossus",      img: logo("dragon.png") },
];
