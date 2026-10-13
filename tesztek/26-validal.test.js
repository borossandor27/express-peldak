// =====================================================
// 26. feladat - a validal() függvény tesztje (szerver nélkül!)
// Futtatás: npm run t26-fv
// Alapból a feladatok/26-regisztracio/utils/validal.js fájlt teszteli.
// Másik fájlhoz (PowerShell):  $env:VALIDAL="megoldasok/26-regisztracio/utils/validal.js"; npm run t26-fv
// =====================================================

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const fajl = resolve(import.meta.dirname, '..', process.env.VALIDAL || 'feladatok/26-regisztracio/utils/validal.js');
const { validal } = await import(pathToFileURL(fajl).href);

const JO = { felhasznalonev: 'nagy_peti', email: 'peti@pelda.hu', kor: 16, pontszam: 50, hirlevel: true };
const hibas = (body, opciok) => validal(body, opciok).length > 0;

test('érvényes adat: nincs hiba', () => {
  assert.deepEqual(validal(JO), []);
});

test('határértékek: elfogadva', () => {
  assert.deepEqual(validal({ ...JO, kor: 14 }), [], 'kor: 14');
  assert.deepEqual(validal({ ...JO, kor: 99 }), [], 'kor: 99');
  assert.deepEqual(validal({ ...JO, pontszam: 0 }), [], 'pontszam: 0');
  assert.deepEqual(validal({ ...JO, hirlevel: false }), [], 'hirlevel: false');
  assert.deepEqual(validal({ ...JO, felhasznalonev: '  anna_01 ' }), [], 'szóközök a név körül');
  assert.deepEqual(validal({ ...JO, felhasznalonev: 'abc' }), [], '3 karakteres név');
});

test('felhasznalonev: hibás értékek', () => {
  assert.ok(hibas({ ...JO, felhasznalonev: '    ' }), 'csupa szóköz');
  assert.ok(hibas({ ...JO, felhasznalonev: 'ab' }), 'túl rövid');
  assert.ok(hibas({ ...JO, felhasznalonev: 'a'.repeat(21) }), 'túl hosszú');
  assert.ok(hibas({ ...JO, felhasznalonev: 'nagy peti' }), 'szóköz a közepén');
  assert.ok(hibas({ ...JO, felhasznalonev: 123 }), 'szám');
});

test('email: hibás értékek', () => {
  assert.ok(hibas({ ...JO, email: 'anna.gmail.com' }), 'nincs @');
  assert.ok(hibas({ ...JO, email: 'anna@gmail' }), 'nincs pont a @ után');
  assert.ok(hibas({ ...JO, email: '' }), 'üres');
});

test('kor: típus és tartomány', () => {
  assert.ok(hibas({ ...JO, kor: '16' }), 'szövegként');
  assert.ok(hibas({ ...JO, kor: 15.5 }), 'nem egész');
  assert.ok(hibas({ ...JO, kor: 13 }), '13');
  assert.ok(hibas({ ...JO, kor: 100 }), '100');
});

test('pontszam és hirlevel', () => {
  assert.ok(hibas({ ...JO, pontszam: -1 }), 'negatív pontszám');
  assert.ok(hibas({ ...JO, pontszam: 2.5 }), 'nem egész pontszám');
  assert.ok(hibas({ ...JO, hirlevel: 'igen' }), 'hirlevel szövegként');
  assert.ok(hibas({ ...JO, hirlevel: 1 }), 'hirlevel számként');
});

test('hiányzó és ismeretlen mezők', () => {
  const { email, ...nincsEmail } = JO;
  assert.ok(hibas(nincsEmail), 'hiányzó email');
  assert.ok(hibas({ ...JO, admin: true }), 'ismeretlen mező');
});

test('az összes hibát visszaadja, nem csak az elsőt', () => {
  const hibak = validal({ felhasznalonev: '', email: 'x', kor: 'sok', pontszam: -5, hirlevel: 1 });
  assert.ok(hibak.length >= 5, `csak ${hibak.length} hibaüzenet jött`);
});

test('részleges ellenőrzés (PATCH)', () => {
  assert.deepEqual(validal({ kor: 30 }, { reszleges: true }), [], 'csak a kor');
  assert.deepEqual(validal({ pontszam: 0 }, { reszleges: true }), [], 'csak a pontszam, 0');
  assert.ok(hibas({}, { reszleges: true }), 'üres törzs');
  assert.ok(hibas({ email: '' }, { reszleges: true }), 'üres email');
  assert.ok(hibas({ kor: 30, admin: true }, { reszleges: true }), 'ismeretlen mező');
});
