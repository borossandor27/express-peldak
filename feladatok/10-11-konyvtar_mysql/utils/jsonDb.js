// =====================================================
// Segédmodul: JSON fájlok olvasása és írása (aszinkron módon)
// Minden router ezt használja, így nem kell mindenhol megírni.
// =====================================================

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// A "data" mappa helye ehhez a fájlhoz képest: ../data
const DATA_MAPPA = join(import.meta.dirname, '..', 'data');

// Beolvassa pl. a data/diakok.json fájlt és tömbként visszaadja
export async function olvas(nev) {
  const tartalom = await readFile(join(DATA_MAPPA, `${nev}.json`), 'utf-8');
  return JSON.parse(tartalom);
}

// Elmenti a tömböt pl. a data/diakok.json fájlba
export async function ment(nev, adatok) {
  await writeFile(join(DATA_MAPPA, `${nev}.json`), JSON.stringify(adatok, null, 2));
}

// Következő szabad azonosító
export function kovetkezoId(tomb) {
  return tomb.length === 0 ? 1 : Math.max(...tomb.map((e) => e.id)) + 1;
}
