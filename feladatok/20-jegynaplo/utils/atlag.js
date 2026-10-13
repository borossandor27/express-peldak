// =====================================================
// Átlagszámító segédmodul - NAMED EXPORTOK
// =====================================================

const ERDEMJEGYEK = ['', 'elégtelen', 'elégséges', 'közepes', 'jó', 'jeles'];

// TODO: sulyozottAtlag(jegyek)
//   jegyek: [{ jegy: 5, suly: 1 }, { jegy: 4, suly: 2 }, ...]
//   eredmény: Σ(jegy × súly) / Σ súly, két tizedesre kerekítve -> 4.33
//   üres tömbnél: null

// TODO: zaroJegy(atlag)      -> egész jegy (x.5-től felfelé kerekítünk): 4.5 -> 5, 4.49 -> 4

// TODO: jegySzoveggel(jegy)  -> 5 -> "jeles"
