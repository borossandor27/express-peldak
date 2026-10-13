// =====================================================
// DEFAULT EXPORT (alapértelmezett export)
// Egy modulnak LEGFELJEBB EGY default exportja lehet.
// Importáláskor tetszőleges nevet adhatunk neki, és NEM kell kapcsos zárójel:
//   import koszon from './utils/koszones.js';
//   import udvozol from './utils/koszones.js';   // ez is ugyanaz a függvény
// =====================================================

export default function koszon(nev) {
  const ora = new Date().getHours();

  if (ora < 10) return `Jó reggelt, ${nev}!`;
  if (ora < 18) return `Jó napot, ${nev}!`;
  return `Jó estét, ${nev}!`;
}
