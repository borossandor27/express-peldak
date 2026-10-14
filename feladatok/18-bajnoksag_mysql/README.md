# 18. feladat MySQL-lel – Iskolai focibajnokság ★★★★

**Indítás:** `npm run f18-mysql` · **Adatbázis:** `data/bajnoksag.sql` (adatbázis: `bajnoksag`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** ugyanaz, mint a [`18-bajnoksag`](../18-bajnoksag/README.md) mappában ([FELADATOK-2.md](../FELADATOK-2.md)), de az adatok **MySQL adatbázisban** vannak, és van egy **bővítés** (új meccs, törlés).
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Számolás az adatbázisban**: a tabellát egyetlen lekérdezés állítja elő (`UNION ALL`, `GROUP BY`, `SUM`, `ORDER BY` több szempont szerint).
- **Ugyanaz a tábla kétszer egy lekérdezésben**: a meccsnél a hazai és a vendég csapat neve is a `csapatok` táblából jön (két `JOIN`, két álnév).
- **Normalizált adatbázis**: a meccs csak a csapatok azonosítóját tárolja; a kliens viszont neveket küld és kap.
- **Megszorítások**: idegen kulcs, egyedi csapatnév, `CHECK (hazai_id <> vendeg_id)`.

## Az adatbázis felépítése

| Tábla | Oszlopok | A JSON-ban |
|---|---|---|
| `csapatok` | `id`, `nev` (egyedi) | nincs külön, csak nevek |
| `meccsek` | `id`, `fordulo`, `hazai_id`, `vendeg_id`, `hazai_gol`, `vendeg_gol` | `hazai`, `vendeg` (név), `hazaiGol`, `vendegGol` |

A válaszban **ugyanazok a mezőnevek** legyenek, mint a JSON-os változatban: `SELECT m.hazai_gol AS hazaiGol, h.nev AS hazai ...`

## Mire figyelj a megoldás során?

- **Két `JOIN` ugyanarra a táblára** álnévvel: `JOIN csapatok h ON h.id = m.hazai_id JOIN csapatok v ON v.id = m.vendeg_id`. Ezt a `SELECT`-et érdemes egy konstansba tenni, mert sok végpont használja.
- **A tabella trükkje**: minden meccs két csapatot érint. Ha a meccseket a két csapat szemszögéből is felírod, már egyszerű a csoportosítás:
  ```sql
  SELECT hazai_id AS csapat_id, hazai_gol AS sajat, vendeg_gol AS ellen FROM meccsek
  UNION ALL
  SELECT vendeg_id, vendeg_gol, hazai_gol FROM meccsek
  ```
  Ezt allekérdezésként (`FROM (...) m`) vagy **nézetként** (`CREATE VIEW`) is használhatod.
- **Igaz/hamis összegzése**: a MySQL-ben az összehasonlítás eredménye 1 vagy 0, ezért a győzelmek száma `SUM(sajat > ellen)`.
- A `SELECT` részben adott álnevet (`AS pont`) az `ORDER BY` már használhatja, de **ugyanabban a `SELECT`-ben** nem: a pontot a győzelmekből és a döntetlenekből újra ki kell írni.
- **A `SUM` eredménye szöveg** (`"11"`) a `mysql2`-ben. Minden számot alakíts át (`Number`), különben a tabella JSON-ja más lesz, mint a JSON-os változatban.
- **`UNSIGNED` csapda**: a gólok `TINYINT UNSIGNED` típusúak. A `hazai_gol - vendeg_gol` negatív eredménynél **hibát dob** (*BIGINT UNSIGNED value is out of range*). A gólkülönbséget az összegekből számold (`SUM(sajat) - SUM(ellen)`), mert a `SUM` már DECIMAL.
- A helyezést a rendezés után, JavaScriptben is megadhatod (`map((s, i) => ...)`).
- A `?fordulo=` szövegként érkezik: ellenőrizd, hogy egész szám-e, mert a `Number('elso')` = `NaN`, és a `mysql2` a `NaN`-t szó szerint beírja az SQL-be (→ 500).
- A `?csapat=` szűrésnél tegyél zárójelet az `OR` köré: `WHERE m.fordulo = ? AND (h.nev = ? OR v.nev = ?)`.
- A `/statisztika` számai (`AVG`, `SUM`) egy lekérdezéssel megkaphatók; a „leggólgazdagabb” meccshez egy `ORDER BY ... DESC LIMIT 1` kell.

## Bővítés: új meccs és törlés

| Metódus | Útvonal | Leírás |
|---|---|---|
| POST | `/meccsek` | `{ "fordulo": 7, "hazai": "9.A", "vendeg": "12.A", "hazaiGol": 2, "vendegGol": 0 }` → **201** + a meccs a JSON-os formában |
| DELETE | `/meccsek/:id` | 204 / 404 |

A POST ellenőrzése:

| Hiba | Státusz |
|---|---|
| a `fordulo` nem pozitív egész, a gólok nem nemnegatív egészek, hiányzó csapatnév, `hazai === vendeg` | **400** (az összes hiba egy tömbben) |
| nem létező csapat | **404** |
| valamelyik csapat abban a fordulóban már játszott (akár hazai, akár vendég) | **409** |

- A kliens **csapatnevet** küld, a táblába **id** kell: előbb kérdezd le az id-kat (`WHERE nev IN (?, ?)`).
- A `CHECK` megszorítás a saját maga elleni meccset az adatbázisban is megfogja, de akkor 500 lenne – ezért előbb te ellenőrizd (400).
- Új meccs után a `/tabella` **magától** megváltozik, mert minden kérésnél újra számolódik.

## Ellenőrizd

- [ ] A tabella pontosan egyezik a [FELADATOK-2.md](../FELADATOK-2.md)-ben lévővel, és a számok **számok**, nem szövegek.
- [ ] A `GET` végpontok ugyanazt adják, mint a JSON-os változat (indítsd el mindkettőt, és hasonlítsd össze).
- [ ] A `requests.http` bővítés-kérései a megadott státuszokat adják, és a törlés után a tabella visszaáll.
