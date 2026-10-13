// =====================================================
// Számírás modul
//   - egész számok betűvel, a magyar helyesírás szerint
//   - római számok (oda-vissza)
//
// Használat:
//   import { szamBetuvel, romaiSzam, romaiSzambol } from './utils/szamiras.js';
//
// A magyar helyesírás szabályai (AkH. 12. kiadás, 297. pont):
//   - Kétezerig egybeírjuk:        1999 -> ezerkilencszázkilencvenkilenc
//   - Kétezer fölött hármas számcsoportonként kötőjellel tagoljuk:
//                                  2001 -> kétezer-egy
//                               1234567 -> egymillió-kétszázharmincnégyezer-ötszázhatvanhét
//   - A "kettő" nagyobb egység előtt "két":   kétszáz, kétezer, huszonkétmillió
//   - A szám végén "kettő":                   tizenkettő, kétezer-kettő
//   - 10 és 20 önállóan "tíz", "húsz", összetételben "tizen-", "huszon-"
//   - A szám elején "száz" és "ezer" (nem "egyszáz", "egyezer"), de "egymillió"
// =====================================================

const EGYESEK = ['', 'egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc'];

// Kerek tízesek önállóan (pl. 20 -> húsz)
const TIZESEK = ['', 'tíz', 'húsz', 'harminc', 'negyven', 'ötven', 'hatvan', 'hetven', 'nyolcvan', 'kilencven'];

// Tízesek, ha egyes is követi őket (pl. 21 -> huszonegy)
const TIZESEK_OSSZETETT = ['', 'tizen', 'huszon', 'harminc', 'negyven', 'ötven', 'hatvan', 'hetven', 'nyolcvan', 'kilencven'];

// Hármas számcsoportok nevei: 10^3, 10^6, 10^9, 10^12, 10^15
const CSOPORTNEVEK = ['', 'ezer', 'millió', 'milliárd', 'billió', 'billiárd'];

// Egy 1 és 999 közötti szám betűvel.
//   utanaCsoportnev: követi-e csoportnév (ezer, millió...) -> ekkor "kettő" helyett "két"
//   szamElejen:      ez-e a teljes szám első csoportja -> ekkor 100 = "száz", nem "egyszáz"
function haromjegyu(n, utanaCsoportnev, szamElejen) {
  const szazas = Math.floor(n / 100);
  const tizes = Math.floor((n % 100) / 10);
  const egyes = n % 10;
  let szoveg = '';

  if (szazas > 0) {
    let elotag;
    if (szazas === 1 && szamElejen) elotag = ''; // száz
    else if (szazas === 2) elotag = 'két'; // kétszáz
    else elotag = EGYESEK[szazas]; // egyszáz (belül), háromszáz...
    szoveg += elotag + 'száz';
  }

  if (tizes > 0) {
    szoveg += egyes === 0 ? TIZESEK[tizes] : TIZESEK_OSSZETETT[tizes];
  }

  if (egyes > 0) {
    szoveg += egyes === 2 && utanaCsoportnev ? 'két' : EGYESEK[egyes];
  }

  return szoveg;
}

/**
 * Egész szám betűvel, a magyar helyesírás szabályai szerint.
 *   szamBetuvel(0)       -> "nulla"
 *   szamBetuvel(1999)    -> "ezerkilencszázkilencvenkilenc"
 *   szamBetuvel(2002)    -> "kétezer-kettő"
 *   szamBetuvel(-15)     -> "mínusz tizenöt"
 */
export function szamBetuvel(szam) {
  if (!Number.isSafeInteger(szam)) {
    throw new RangeError('Csak egész szám írható át betűvel (legfeljebb ±9 007 199 254 740 991).');
  }
  if (szam === 0) return 'nulla';
  if (szam < 0) return 'mínusz ' + szamBetuvel(-szam);

  // Hármas csoportokra bontás hátulról: 1234567 -> [567, 234, 1]
  const csoportok = [];
  for (let n = szam; n > 0; n = Math.floor(n / 1000)) {
    csoportok.push(n % 1000);
  }

  const reszek = [];
  for (let i = csoportok.length - 1; i >= 0; i--) {
    const ertek = csoportok[i];
    if (ertek === 0) continue; // pl. 1000001 -> egymillió-egy (az üres ezres csoport kimarad)

    const szamElejen = reszek.length === 0;

    // A szám elején álló 1000 egyszerűen "ezer" (nem "egyezer")
    if (szamElejen && i === 1 && ertek === 1) {
      reszek.push('ezer');
    } else {
      reszek.push(haromjegyu(ertek, i > 0, szamElejen) + CSOPORTNEVEK[i]);
    }
  }

  // Kétezerig egybeírjuk, fölötte kötőjellel tagoljuk
  return reszek.join(szam > 2000 ? '-' : '');
}

// =====================================================
// Római számok
// =====================================================

// A kivonásos alakokat (CM, XC, IV...) is felsoroljuk, csökkenő sorrendben
const ROMAI_JELEK = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

/**
 * Arab számból római szám (1-3999).
 *   romaiSzam(2026) -> "MMXXVI"
 */
export function romaiSzam(szam) {
  if (!Number.isInteger(szam) || szam < 1 || szam > 3999) {
    throw new RangeError('Római számmal csak 1 és 3999 közötti egész szám írható le.');
  }

  let maradek = szam;
  let eredmeny = '';
  for (const [ertek, jel] of ROMAI_JELEK) {
    while (maradek >= ertek) {
      eredmeny += jel;
      maradek -= ertek;
    }
  }
  return eredmeny;
}

// Szabályos római szám: legfeljebb 3 azonos jel egymás után, csak a megengedett kivonásos alakok
const SZABALYOS_ROMAI = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

/**
 * Római számból arab szám. Kisbetűvel is elfogadja.
 *   romaiSzambol("MMXXVI") -> 2026
 *   romaiSzambol("IIII")   -> hiba (nem szabályos)
 */
export function romaiSzambol(romai) {
  const s = String(romai).toUpperCase();
  if (s === '' || !SZABALYOS_ROMAI.test(s)) {
    throw new RangeError(`Nem szabályos római szám: "${romai}"`);
  }

  let eredmeny = 0;
  let i = 0;
  for (const [ertek, jel] of ROMAI_JELEK) {
    while (s.startsWith(jel, i)) {
      eredmeny += ertek;
      i += jel.length;
    }
  }
  return eredmeny;
}
