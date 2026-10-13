// =====================================================
// Ülőhelyekkel kapcsolatos segédfüggvények - NAMED EXPORTOK
// =====================================================

export const JEGYAR = 2500;

// KÉSZ: egy hely azonosítója szövegként: { sor: 2, szek: 3 } -> "2-3"
// (Set-ben így könnyű keresni: foglalt.has("2-3"))
export const helyKulcs = (h) => `${h.sor}-${h.szek}`;

// TODO: foglaltHelyek(vetitesId, foglalasok) -> Set a foglalt helyek kulcsaival

// TODO: ulesrend(vetites, foglalasok) -> soronként egy szöveg:
//   ["1. sor: OOOOOO", "2. sor: OOXXOO", ...]   O = szabad, X = foglalt
