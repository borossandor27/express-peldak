# 21. feladat MySQL-lel – Mozi jegyfoglalás ★★★★★

**Indítás:** `npm run f21-mysql` · **Adatbázis:** `data/mozi.sql` (adatbázis: `mozi`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** ugyanaz, mint a [`21-mozi`](../21-mozi/README.md) mappában ([FELADATOK-2.md](../FELADATOK-2.md)), de az adatok **MySQL adatbázisban** vannak.
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Öt összekapcsolt tábla** és több `JOIN` egy lekérdezésben.
- **Allekérdezés** a `SELECT` részben (szabad helyek száma).
- **`DATE` és `TIME`** típus, és hogyan lesz belőlük ugyanaz a szöveg, mint a JSON-ban.
- **Az adatbázis védi az adatot**: az egyedi kulcs akkor is megakadályozza a dupla foglalást, ha két kérés **egyszerre** érkezik.
- **Tranzakció**: a foglalás és a helyei együtt kerülnek be, vagy egyik sem.

## Az adatbázis felépítése

| Tábla | Oszlopok | A JSON-ban |
|---|---|---|
| `filmek` | `id`, `cim`, `hossz`, `korhatar` | ugyanaz |
| `termek` | `id`, `nev`, `sorok`, `szekek` | ⚠️ tantermek, nem termékek! A JSON-ban a `terem`, `sorok`, `szekek` minden vetítésnél ismétlődött |
| `vetitesek` | `id`, `film_id`, `terem_id`, `datum` (DATE), `idopont` (TIME) | `filmId`, `terem` (név), `sorok`, `szekek` |
| `foglalasok` | `id`, `vetites_id`, `nev`, `ar` | a `helyek` tömb nélkül |
| `foglalt_helyek` | `id`, `foglalas_id`, `vetites_id`, `sor`, `szek` | a foglalás `helyek` tömbje, soronként egy hely |

- `foglalt_helyek`: **`UNIQUE (vetites_id, sor, szek)`** – egy vetítésen egy hely csak egyszer lehet foglalt.
- A `vetites_id` ezért a `foglalt_helyek` táblában is szerepel (a foglaláson keresztül is kiderülne, de az egyedi kulcshoz itt kell). Hogy ne lehessen ellentmondásos, az idegen kulcs **összetett**: `(foglalas_id, vetites_id)` → `foglalasok (id, vetites_id)`, `ON DELETE CASCADE`.

## Mire figyelj a megoldás során?

- **A válasz formája ugyanaz**, mint a JSON-os változatban: `filmId`, `vetitesId` (`AS`), a vetítésnél `terem` (név), `sorok`, `szekek`, `film` (cím), `szabadHelyek`; a foglalásnál `helyek: [{ sor, szek }]`.
- **Dátum**: a pool beállításai közé kell a `dateStrings: true` (különben a `2026-10-10` dátumból `"2026-10-09T22:00:00.000Z"` lesz).
- **Időpont**: a `TIME` oszlop `"15:00:00"` alakban jön. A JSON-ban `"15:00"` volt: `TIME_FORMAT(v.idopont, '%H:%i') AS idopont`.
- **Szabad helyek** egy lekérdezésben, allekérdezéssel:
  ```sql
  t.sorok * t.szekek - (SELECT COUNT(*) FROM foglalt_helyek h WHERE h.vetites_id = v.id) AS szabadHelyek
  ```
- **Rendezés**: `ORDER BY v.datum, v.idopont` – a valódi dátum és idő típus helyesen rendez, nem kell összefűzni őket.
- **A foglalások helyei**: a foglalásokat és a helyeiket két lekérdezéssel kérdezd le (`WHERE foglalas_id IN (?)`), és JavaScriptben ágyazd vissza a `helyek` tömböt.
- **A foglalás ellenőrzése** ugyanabban a sorrendben, mint a JSON-os változatban (400 → 404 → 400 → 409). A terem méretét a vetítés lekérdezése adja (`JOIN termek`).
- **Mentés tranzakcióban**: `INSERT INTO foglalasok`, majd a helyek egy utasítással (`INSERT INTO foglalt_helyek (...) VALUES ?` + tömbök tömbje). Ha a második hibát dob, a `rollback` az elsőt is visszavonja.
- **Egyszerre érkező foglalások**: két kérés ugyanarra a helyre egyszerre átjuthat a „foglalt-e már” ellenőrzésen. Ekkor a második `INSERT` a `UNIQUE` kulcs miatt `ER_DUP_ENTRY` hibát dob – ezt is **409**-re fordítsd. (A JSON-os változatban ilyenkor mindkét foglalás bekerülne!)
- **Lemondás**: elég a foglalást törölni, a helyeit az `ON DELETE CASCADE` törli, és a vetítés szabad helyeinek száma magától nő.
- Az `utf8mb4_hungarian_ci` miatt a `?nev=kiss` keresés (`LIKE ?`) nem különbözteti meg a kis- és nagybetűt.

## Ellenőrizd

- [ ] A `GET` végpontok ugyanazt adják, mint a JSON-os változat (dátum: `"2026-10-10"`, időpont: `"15:00"`).
- [ ] A foglalás után az ülésrenden `X` jelzi az új helyeket, lemondás után újra `O`.
- [ ] Ha a helyek beszúrása hibát dob, nem marad hely nélküli foglalás a `foglalasok` táblában.
- [ ] (Szorgalmi) Írj egy kis szkriptet, ami `Promise.all`-lal 10 foglalást küld egyszerre ugyanarra a helyre: pontosan egy legyen 201, a többi 409.
