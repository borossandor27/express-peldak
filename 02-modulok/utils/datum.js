// =====================================================
// DEFAULT + NAMED EXPORT EGYÜTT
// Importálás példa:
//   import datumMa, { napNeve, evNapja, szokoev, husvetNapjai, punkosdNapjai } from './utils/datum.js';
// =====================================================

const NAPOK = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];

export function napNeve(datum = new Date()) {
  return NAPOK[datum.getDay()];
}

export function evNapja(datum = new Date()) {
  const evEleje = new Date(datum.getFullYear(), 0, 1);
  return Math.floor((datum - evEleje) / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Megvizsgálja, hogy a megadott év (vagy dátum éve) szökőév-e.
 * @param {number|Date} ev - Évszám vagy Date objektum
 * @returns {boolean} - Igaz, ha szökőév, egyébként hamis
 */
export function szokoev(ev = new Date().getFullYear()) {
  const year = ev instanceof Date ? ev.getFullYear() : ev;
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Kiszámítja a húsvét vasárnap dátumát a Meeus–Jones–Butcher algoritmussal.
 * @param {number|Date} ev - Évszám vagy Date objektum
 * @returns {Date} - A húsvét vasárnap Date objektumként
 */
export function husvetVasarnap(ev = new Date().getFullYear()) {
  const year = ev instanceof Date ? ev.getFullYear() : ev;
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const honap = Math.floor((h + l - 7 * m + 114) / 31); 
  const nap = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, honap - 1, nap);
}

/**
 * Visszaadja a húsvéti ünnepek napjait (vasárnap és hétfő) formázott szöveggel és objektumként is.
 * @param {number|Date} ev - Évszám vagy Date objektum
 * @returns {Object} 
 */
export function husvetNapjai(ev = new Date().getFullYear()) {
  const vasarnap = husvetVasarnap(ev);
  const hetfo = new Date(vasarnap);
  hetfo.setDate(vasarnap.getDate() + 1);

  return {
    vasarnap: vasarnap.toLocaleDateString('hu-HU'),
    hetfo: hetfo.toLocaleDateString('hu-HU'),
    vasarnapDate: vasarnap,
    hetfoDate: hetfo
  };
}

/**
 * Kiszámítja a pünkösdi ünnepek napjait (a húsvét utáni 7. hét vasárnapja és hétfője).
 * @param {number|Date} ev - Évszám vagy Date objektum
 * @returns {Object} 
 */
export function punkosdNapjai(ev = new Date().getFullYear()) {
  const husvet = husvetVasarnap(ev);
  
  const vasarnap = new Date(husvet);
  vasarnap.setDate(husvet.getDate() + 49); // Húsvét utáni 49. nap
  
  const hetfo = new Date(vasarnap);
  hetfo.setDate(vasarnap.getDate() + 1); // Pünkösdhétfő

  return {
    vasarnap: vasarnap.toLocaleDateString('hu-HU'),
    hetfo: hetfo.toLocaleDateString('hu-HU'),
    vasarnapDate: vasarnap,
    hetfoDate: hetfo
  };
}

// Default export lehet névtelen függvény is
export default function () {
  return new Date().toLocaleDateString('hu-HU');
}