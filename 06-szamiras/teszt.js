// =====================================================
// A számírás modul tesztje - a Node beépített tesztelőjével
// Futtatás: npm run 06-teszt
// =====================================================

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { szamBetuvel, romaiSzam, romaiSzambol } from './utils/szamiras.js';

test('számok betűvel: egyesek, tízesek', () => {
  assert.equal(szamBetuvel(0), 'nulla');
  assert.equal(szamBetuvel(1), 'egy');
  assert.equal(szamBetuvel(2), 'kettő');
  assert.equal(szamBetuvel(10), 'tíz');
  assert.equal(szamBetuvel(11), 'tizenegy');
  assert.equal(szamBetuvel(12), 'tizenkettő');
  assert.equal(szamBetuvel(20), 'húsz');
  assert.equal(szamBetuvel(22), 'huszonkettő');
  assert.equal(szamBetuvel(30), 'harminc');
  assert.equal(szamBetuvel(45), 'negyvenöt');
  assert.equal(szamBetuvel(99), 'kilencvenkilenc');
});

test('számok betűvel: százasok', () => {
  assert.equal(szamBetuvel(100), 'száz');
  assert.equal(szamBetuvel(101), 'százegy');
  assert.equal(szamBetuvel(200), 'kétszáz');
  assert.equal(szamBetuvel(202), 'kétszázkettő');
  assert.equal(szamBetuvel(310), 'háromszáztíz');
  assert.equal(szamBetuvel(999), 'kilencszázkilencvenkilenc');
});

test('kétezerig egybeírjuk', () => {
  assert.equal(szamBetuvel(1000), 'ezer');
  assert.equal(szamBetuvel(1001), 'ezeregy');
  assert.equal(szamBetuvel(1100), 'ezeregyszáz');
  assert.equal(szamBetuvel(1848), 'ezernyolcszáznegyvennyolc');
  assert.equal(szamBetuvel(1999), 'ezerkilencszázkilencvenkilenc');
  assert.equal(szamBetuvel(2000), 'kétezer');
});

test('kétezer fölött kötőjellel tagoljuk', () => {
  assert.equal(szamBetuvel(2001), 'kétezer-egy');
  assert.equal(szamBetuvel(2002), 'kétezer-kettő');
  assert.equal(szamBetuvel(2026), 'kétezer-huszonhat');
  assert.equal(szamBetuvel(3000), 'háromezer');
  assert.equal(szamBetuvel(12000), 'tizenkétezer');
  assert.equal(szamBetuvel(22222), 'huszonkétezer-kétszázhuszonkettő');
  assert.equal(szamBetuvel(100000), 'százezer');
  assert.equal(szamBetuvel(1000000), 'egymillió');
  assert.equal(szamBetuvel(1000001), 'egymillió-egy');
  assert.equal(szamBetuvel(2000000), 'kétmillió');
  assert.equal(szamBetuvel(1234567), 'egymillió-kétszázharmincnégyezer-ötszázhatvanhét');
  assert.equal(szamBetuvel(1001000), 'egymillió-egyezer');
  assert.equal(szamBetuvel(1000000000), 'egymilliárd');
  assert.equal(szamBetuvel(2002002002), 'kétmilliárd-kétmillió-kétezer-kettő');
});

test('negatív számok', () => {
  assert.equal(szamBetuvel(-15), 'mínusz tizenöt');
  assert.equal(szamBetuvel(-2001), 'mínusz kétezer-egy');
});

test('hibás bemenet betűvel írásnál', () => {
  assert.throws(() => szamBetuvel(3.5), RangeError);
  assert.throws(() => szamBetuvel(NaN), RangeError);
  assert.throws(() => szamBetuvel('12'), RangeError);
});

test('római számok', () => {
  assert.equal(romaiSzam(1), 'I');
  assert.equal(romaiSzam(4), 'IV');
  assert.equal(romaiSzam(9), 'IX');
  assert.equal(romaiSzam(14), 'XIV');
  assert.equal(romaiSzam(40), 'XL');
  assert.equal(romaiSzam(90), 'XC');
  assert.equal(romaiSzam(400), 'CD');
  assert.equal(romaiSzam(1848), 'MDCCCXLVIII');
  assert.equal(romaiSzam(1956), 'MCMLVI');
  assert.equal(romaiSzam(2026), 'MMXXVI');
  assert.equal(romaiSzam(3999), 'MMMCMXCIX');
  assert.throws(() => romaiSzam(0), RangeError);
  assert.throws(() => romaiSzam(4000), RangeError);
});

test('római számból arab', () => {
  assert.equal(romaiSzambol('MMXXVI'), 2026);
  assert.equal(romaiSzambol('mcmlvi'), 1956);
  assert.equal(romaiSzambol('XLIX'), 49);
  assert.throws(() => romaiSzambol('IIII'), RangeError);
  assert.throws(() => romaiSzambol('IC'), RangeError);
  assert.throws(() => romaiSzambol('ABC'), RangeError);
  assert.throws(() => romaiSzambol(''), RangeError);
});

test('oda-vissza: minden 1 és 3999 közötti szám', () => {
  for (let n = 1; n <= 3999; n++) {
    assert.equal(romaiSzambol(romaiSzam(n)), n);
  }
});
