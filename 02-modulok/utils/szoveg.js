// =====================================================
// NAMED EXPORT - 2. forma: export lista a fájl végén
// Előbb megírjuk a függvényeket, majd egyben exportáljuk.
// Tipikus felhasználás: import * as szoveg from './utils/szoveg.js';
// =====================================================

function nagybetus(s) {
  return s.toUpperCase();
}

function kisbetus(s) {
  return s.toLowerCase();
}

function megfordit(s) {
  return s.split('').reverse().join('');
}

function hossz(s) {
  return s.length;
}

function maganhangzokSzama(s) {
  const mgh = 'aáeéiíoóöőuúüű';
  return s.toLowerCase().split('').filter((b) => mgh.includes(b)).length;
}

// Export lista - itt át is nevezhetünk valamit az "as" kulcsszóval
export { nagybetus, kisbetus, megfordit, hossz, maganhangzokSzama as mghSzam };
