# 20. feladat MySQL-lel – Elektronikus jegynapló ★★★★

**Indítás:** `npm run f20-mysql` · **Adatbázis:** `data/jegynaplo.sql` (adatbázis: `jegynaplo`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** ugyanaz, mint a [`20-jegynaplo`](../20-jegynaplo/README.md) mappában ([FELADATOK-2.md](../FELADATOK-2.md)), de az adatok **MySQL adatbázisban** vannak.
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Kapcsolt törlés az adatbázisban**: az `ON DELETE CASCADE` miatt a diák törlésekor a jegyei maguktól törlődnek – a JSON-os változat két fájlmentése helyett egyetlen `DELETE`.
- **Valódi dátum típus** (`DATE`) és a vele járó **időzóna-csapda**.
- **Súlyozott átlag SQL-ben**: `SUM(jegy * suly) / SUM(suly)`, csoportosítva diákra és tantárgyra.
- **`GROUP_CONCAT`**: egy csoport értékei egy szövegben (`"5,4"`), amiből tömb lesz.
- **`CHECK` megszorítások** (`jegy BETWEEN 1 AND 5`, `suly IN (1, 2)`) – a validáció mégis a szerver dolga marad.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `diakok` | `id`, `nev`, `osztaly` | |
| `jegyek` | `id`, `diak_id`, `tantargy`, `jegy`, `suly`, `datum` (DATE) | idegen kulcs `ON DELETE CASCADE`, két `CHECK` |

A válaszban a mezőnév `diakId` legyen (`SELECT diak_id AS diakId ...`), ahogy a JSON-os változatban.

## Mire figyelj a megoldás során?

- **⚠️ A dátum csapdája**: a `mysql2` a `DATE` oszlopot JavaScript `Date` objektummá alakítja, ami JSON-ban **UTC idő**: a `2026-09-10`-ből `"2026-09-09T22:00:00.000Z"` lesz – **egy nappal korábbi** dátum! Megoldás: a pool beállításai közé írd be a `dateStrings: true`-t, így a dátum szövegként jön, pontosan úgy, ahogy az adatbázisban van. (Másik megoldás: `DATE_FORMAT(datum, '%Y-%m-%d') AS datum`.)
- **A bizonyítvány egy lekérdezéssel**:
  ```sql
  SELECT diak_id, tantargy,
         GROUP_CONCAT(jegy ORDER BY id) AS jegyek,
         ROUND(SUM(jegy * suly) / SUM(suly), 2) AS atlag
  FROM jegyek WHERE diak_id IN (?)
  GROUP BY diak_id, tantargy
  ORDER BY diak_id, tantargy
  ```
  A `jegyek` szöveg (`"5,4"`) → `split(',').map(Number)`; az `atlag` DECIMAL → `Number(...)`. A zárójegyet és a szöveges értékelést továbbra is a `utils/atlag.js` adja.
- A **rangsorhoz ne kérdezz le diákonként külön** (egy osztálynál ez sok lekérdezés lenne): a fenti lekérdezés az `IN (?)` miatt egyszerre több diákra is működik. A `bizonyitvany()` függvényt ezért érdemes több diákra megírni.
- Az `osszAtlag` továbbra is a **zárójegyek** átlaga. Jegy nélküli diáknál `null`, és a rangsorból kimarad.
- Az `utf8mb4_hungarian_ci` miatt az `ORDER BY tantargy` a magyar ábécé szerint rendez (Informatika, Matematika, Történelem).
- **`POST /jegyek`**: a nem létező diákra az idegen kulcs hibát dobna (`ER_NO_REFERENCED_ROW_2` → 500), ezért előbb te ellenőrizd → 404. Sorrend: előbb az adatok (400), aztán a diák (404).
- A **nem létező napot** (`2026-02-30`) a regex átengedi, de a `DATE` oszlop nem fogadja el (hiba → 500). Ellenőrizd, hogy valódi dátum-e (pl. `new Date(datum).toISOString().slice(0, 10) === datum`).
- A `CHECK` megszorítás a hibás jegyet (6) az adatbázisban is megfogja, de csak egy általános hibával. A kliensnek továbbra is a szerver adjon érthető, **összegyűjtött** hibalistát (400).
- **`PATCH /jegyek/:id`**: a `SET` részbe csak a `jegy` és a `suly` kerülhet.
- **`DELETE /diakok/:id`**: egy `DELETE FROM diakok`, az `affectedRows` dönt a 404-ről. Utána nézd meg phpMyAdminban, hogy a jegyei is eltűntek.
- A `?diakId=` szöveg: ellenőrizd, hogy egész szám-e, mielőtt az SQL-be kerül.

## Ellenőrizd

- [ ] Kiss Anna matematika átlaga 4,33, és a bizonyítvány egyezik a leírással.
- [ ] A jegyek `datum` mezője `"2026-09-10"` alakú, nem `"2026-09-09T22:00:00.000Z"`.
- [ ] Egy diák törlése után a `jegyek` táblában nem maradnak a jegyei – és a kódban nincs külön `DELETE FROM jegyek`.
