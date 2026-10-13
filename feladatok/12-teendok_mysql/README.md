# 12. feladat MySQL-lel – Teendőlista API (önálló projekt) ★★★★

**Indítás:** `npm run f12-mysql` · **Adatbázis:** `data/teendok.sql` (adatbázis: `teendok`, tábla: `teendok`) · **Teszteléshez:** `requests.http`
**Feladat:** ugyanaz, mint a [`12-teendok`](../12-teendok/README.md) mappában ([FELADATOK.md](../FELADATOK.md)), de az adatok **MySQL adatbázisban** vannak.
**Előkészítés** (XAMPP, importálás, `mysql2`, kapcsolat): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- Önálló REST API **adatbázissal**: a mappaszerkezetbe a `utils/jsonDb.js` helyett egy `utils/db.js` kerül.
- **Típusok átalakítása** az adatbázis és az API között (a `kesz` mező).
- A **`NULL`** kezelése SQL-ben (elhagyható határidő).
- **Számolás és módosítás az adatbázisban**: statisztika `COUNT`/`SUM`-mal, érték megfordítása, tömeges törlés egyetlen utasítással.

## Az adatbázis eltér a JSON fájltól

- **A `kesz` oszlop ENUM szöveg (`'true'` / `'false'`), nem logikai érték!** A JSON-ban `"kesz": false` szerepel, az adatbázisból viszont `"false"` szöveg jön – és a `"false"` szöveg JavaScriptben **igaz** értékű (`if ("false")` lefut!). A válaszban alakítsd logikai értékké, íráskor pedig szöveget ments.
- A `prioritas` ENUM (`magas`, `közepes`, `alacsony`): a szerveren ellenőrizd, ne az adatbázis hibájára hagyatkozz.
- A `hatarido` szöveg (`varchar`), lehet `NULL`. Az `ÉÉÉÉ-HH-NN` formátum miatt a szöveges összehasonlítás és rendezés helyes.

## Mire figyelj a megoldás során?

- **Mindig `?` helyőrző** a kérésből jövő értékekhez.
- A szűrők (`?kesz=`, `?prioritas=`) dinamikus `WHERE` feltételt adnak. A `?kesz=true` itt kényelmesen megfeleltethető: `WHERE kesz = ?` a `'true'` szöveggel – de ellenőrizd, hogy csak `true` vagy `false` lehessen.
- A `?rendez=hatarido` `ORDER BY hatarido`. A MySQL növekvő rendezésnél a `NULL`-okat **előre** teszi – döntsd el, ez jó-e (például `ORDER BY hatarido IS NULL, hatarido`).
- **`NULL`-ra nem működik az `=`**: `hatarido = NULL` sosem igaz, `IS NULL` / `IS NOT NULL` kell. A lejárt teendőknél ezért a `NULL` határidejű sorok maguktól kimaradnak – de nézd meg, hogy tényleg.
- A mai dátumot átadhatod paraméterként (`toISOString().slice(0, 10)`), vagy használhatod az SQL `CURDATE()` függvényét – de akkor figyelj az időzónára.
- **Megfordítás egy utasítással**: `UPDATE teendok SET kesz = IF(kesz = 'true', 'false', 'true') WHERE id = ?`, utána pedig kérdezd le és add vissza a teendőt. `affectedRows === 0` → 404.
- A `DELETE /teendok/keszek` válasza `{"torolve": n}`, ahol az `n` a `result.affectedRows`. Ez az útvonal a `DELETE /teendok/:id` **előtt** legyen!
- A statisztika egyetlen lekérdezéssel is megoldható (`COUNT(*)`, `SUM(kesz = 'true')`), de a `SUM` eredménye **szöveg** lehet – alakítsd számmá. Üres táblánál se ossz nullával.
- Új teendőnél a `kesz` mindig `'false'`, az id-t az `AUTO_INCREMENT` adja (`insertId`). A POST válasza 201 + a teljes teendő.
- A naplózó (státuszkóddal és idővel), a 404-es és a hibakezelő middleware ugyanúgy kell.

## Ellenőrizd

- [ ] A válaszokban a `kesz` mező `true` / `false`, nem `"true"` / `"false"`.
- [ ] A `PATCH /teendok/:id/kesz` kétszer meghívva visszaállítja az eredeti értéket.
- [ ] A `requests.http` kérései ugyanazt adják, mint a JSON-os változatnál.
