// =====================================================
// Dátumkezelő modul - NAMED EXPORTOK
//
// Minden dátumot UTC szerint kezelünk, így nem zavar be az időzóna
// és a nyári időszámítás (különben két dátum között néha 23 vagy 25 óra telne el).
// =====================================================

const NAPOK = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
export const HONAPOK = [
  'január', 'február', 'március', 'április', 'május', 'június',
  'július', 'augusztus', 'szeptember', 'október', 'november', 'december',
];
const EGY_NAP = 24 * 60 * 60 * 1000; // ezredmásodpercben

// KÉSZ: "2026-10-04" -> Date (UTC), érvénytelen dátumnál null (pl. "2026-02-30")
export function datumBeolvas(szoveg) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(szoveg ?? '')) return null;
  const [ev, honap, nap] = szoveg.split('-').map(Number);
  const d = new Date(Date.UTC(ev, honap - 1, nap));
  // Ha a Date "átfordult" (február 30. -> március 2.), akkor érvénytelen volt
  if (d.getUTCMonth() !== honap - 1 || d.getUTCDate() !== nap) return null;
  return d;
}

// KÉSZ: a mai nap (UTC éjfél)
export function ma() {
  const most = new Date();
  return new Date(Date.UTC(most.getFullYear(), most.getMonth(), most.getDate()));
}

// TODO: hetNapja(d)        -> "vasárnap"      (tipp: d.getUTCDay())

// TODO: szokoev(ev)        -> true / false
//   4-gyel osztható, DE a 100-zal oszthatók közül csak a 400-zal oszthatók

// TODO: honapNapjai(ev, honap) -> 28 / 29 / 30 / 31
//   tipp: new Date(Date.UTC(ev, honap, 0)) a hónap utolsó napja

// TODO: napokKozott(d1, d2) -> hány nap telt el d1-től d2-ig (lehet negatív is)
//   tipp: két Date különbsége ezredmásodpercben adódik
