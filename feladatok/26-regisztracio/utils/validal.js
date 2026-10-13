// =====================================================
// 26. feladat - a validáló függvény
// Ezt a fájlt a szerver nélkül is tesztelheted: npm run t26-fv
// =====================================================

// validal(body, { reszleges })  ->  a hibaüzenetek tömbje (üres tömb = minden rendben)
//   reszleges = false (POST):  minden mező kötelező
//   reszleges = true  (PATCH): csak a megadott mezőket ellenőrizd, de legalább egy mező kell
//
// Szabályok:
//   felhasznalonev: szöveg, levágás (trim) után 3-20 karakter, csak betű, szám és _
//   email:          szöveg, formátum: valami@valami.valami
//   kor:            EGÉSZ szám, 14 és 99 között (a 14 és a 99 is jó)
//   pontszam:       EGÉSZ szám, legalább 0 (a 0 is jó!)
//   hirlevel:       true vagy false
//   ismeretlen mező (pl. "admin"): hiba
//
// FONTOS: ne állj meg az első hibánál - az összes hibát add vissza!

export const MEZOK = ['felhasznalonev', 'email', 'kor', 'pontszam', 'hirlevel'];

export function validal(body, { reszleges = false } = {}) {
  const hibak = [];

  // TODO

  return hibak;
}
