// =====================================================
// Morse-kód
//   named export:  ABC (a kódtábla) - KÉSZ
//   default export: objektum a kodol és dekodol függvényekkel
// =====================================================

export const ABC = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
};

// KÉSZ: ékezetek eltávolítása: "Árvíztűrő" -> "Arvizturo"
function ekezetNelkul(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// TODO: fordított tábla: '.-' -> 'A'
//   tipp: Object.fromEntries(Object.entries(ABC).map(...))

// TODO: kodol(szoveg)
//   "SOS"       -> "... --- ..."   (betűk között szóköz)
//   "Szép idő"  -> "... --.. . .--. / .. -.. ---"   (szavak között " / ")
//   ismeretlen karakter -> "?"

// TODO: dekodol(kod)   -> a kodol fordítottja (nagybetűs szöveget ad vissza)

// TODO: export default { kodol, dekodol };
