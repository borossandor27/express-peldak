// =====================================================
// NAMED EXPORT (nevesített export) - 1. forma
// Az "export" kulcsszót közvetlenül a deklaráció elé írjuk.
// Egy modulból TÖBB named export is lehet.
// Importálás: import { osszead, kivon } from './utils/matek.js';
// =====================================================

export const PI = 3.14159;

export function osszead(a, b) {
  return a + b;
}

export function kivon(a, b) {
  return a - b;
}

export function szoroz(a, b) {
  return a * b;
}

export function oszt(a, b) {
  if (b === 0) return 'Nullával nem lehet osztani!';
  return a / b;
}

// Nyíl függvény is exportálható
export const negyzet = (x) => x * x;

// Ez a függvény NINCS exportálva -> kívülről nem érhető el (privát)
function titkos() {
  return 'Ezt senki nem látja kívülről';
}
