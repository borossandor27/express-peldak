// =====================================================
// Sorszámnevek - NAMED EXPORTOK
//
// Ötlet: a tőszámnevet a szamBetuvel() adja meg, nekünk csak a VÉGÉT kell átalakítani:
//   "huszonkettő"  -> "huszonkettedik"
//   "kétezer-egy"  -> "kétezer-egyedik"
//   "száz"         -> "századik"
// =====================================================

// TODO: import { szamBetuvel } from '../../../06-szamiras/utils/szamiras.js';
//       (három szint fel: utils -> 16-sorszamok -> feladatok -> express-peldak)

const HONAPOK = [
  'január', 'február', 'március', 'április', 'május', 'június',
  'július', 'augusztus', 'szeptember', 'október', 'november', 'december',
];

// TODO: VEGZODESEK tömb: [tőszámnév vége, sorszámnév vége] párok
//   pl. ['egy', 'egyedik'], ['kettő', 'kettedik'], ['három', 'harmadik'], ...
//   ['tíz', 'tizedik'], ['húsz', 'huszadik'], ['száz', 'századik'], ['ezer', 'ezredik'],
//   ['millió', 'milliomodik'], ['milliárd', 'milliárdodik']
//   VIGYÁZZ: a "négy" is "egy"-re végződik! Melyiknek kell előbb lennie?

// TODO: export function sorszamnev(n)
//   1 -> "első", 2 -> "második" (csak önállóan rendhagyók!)
//   nem pozitív egész számnál: throw new RangeError('...')

// TODO: export function napNeve(nap)
//   1 -> "elseje", 2 -> "másodika", 4 -> "negyedike", 20 -> "huszadika"
//   szabály: ha a sorszámnév "-adik"/"-odik" végű -> + "a", különben + "e"

// TODO: export function datumBetuvel(ev, honap, nap)
//   (2026, 10, 4) -> "kétezer-huszonhat október negyedike"
