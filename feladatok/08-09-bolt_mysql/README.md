# 8–9. feladat MySQL-lel – Papírbolt CRUD és bővítés ★★★★

**Indítás:** `npm run f08-mysql` · **Adatbázis:** `data/termekek.sql` (adatbázis: `termekek`, tábla: `termekek`) · **Teszteléshez:** `requests.http`
**Feladat:** ugyanaz, mint a [`08-09-bolt`](../08-09-bolt/README.md) mappában ([FELADATOK.md](../FELADATOK.md)), de az adatok **MySQL adatbázisban** vannak.
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.
**Beállítások:** másold le a `.env.example` fájlt `.env` néven. A kapcsolat adatai (felhasználó, jelszó, adatbázis) a `.env`-ben legyenek, a `utils/db.js` a `process.env`-ből vegye őket (`dotenv`) – a kódba ne írd bele.

## Mit mutat be a feladat?

- A CRUD műveletek SQL megfelelői: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- Az **`AUTO_INCREMENT`**: az új id-t az adatbázis adja, és a `result.insertId` mondja meg.
- A **`result.affectedRows`** használata a 404 eldöntéséhez módosításnál és törlésnél.
- A validáció **továbbra is a szerver feladata**: az adatbázis nem minden hibát fog meg, és a hibaüzenetei nem a kliensnek valók.
- A `mentes()` függvényre **nincs többé szükség** – minden SQL utasítás azonnal tartós.

## Mire figyelj a megoldás során?

- **Mindig `?` helyőrző**, soha ne fűzd a `req.body` vagy a `req.params` értékét az SQL szövegébe.
- **Ne számold ki az új id-t** (max + 1)! Az `INSERT` után a `result.insertId` adja meg. A POST válasza továbbra is **201 + a teljes új termék** – ehhez vagy összerakod az objektumot az `insertId`-vel, vagy újra lekérdezed.
- **UPDATE és DELETE után nézd meg az `affectedRows`-t**: ha 0, nem volt ilyen termék → 404. A DELETE válasza továbbra is 204, üres törzzsel.
- A **`kategoria` oszlop ENUM** (`papíráru`, `íróeszköz`, `táska`, `elektronika`). A JSON-os változatban bármilyen nem üres szöveg jó volt, itt nem. Az adatbázis a beállításától függően vagy hibát dob rá (→ 500), vagy **csendben üres értéket ment**. Ezért a szerveren ellenőrizd, és adj 400-at az engedélyezett értékek listájával.
- **PATCH**: a `SET` részt a ténylegesen megadott mezőkből kell összerakni. Csak az **engedélyezett** mezőneveket (`nev`, `kategoria`, `ar`, `keszlet`) fűzd az SQL-be, az értékeket `?`-lel add át.
- A PUT továbbra is minden mezőt kér, és az id nem változik.
- Az **útvonal-sorrend** ugyanúgy számít (`/termekek/raktaron`, `/kereses`, `/osszertek` a `/:id` előtt).
- A `/termekek/osszertek` `SUM(ar * keszlet)` eredménye a `mysql2`-ben **szöveg** lehet – alakítsd számmá.
- A `/kategoriak` egy `GROUP BY kategoria` lekérdezés; a sorokból objektumot kell készíteni.
- **Készletváltozás**: ha előbb lekérdezed a készletet, aztán külön `UPDATE`-tel írod vissza, két egyszerre érkező kérés felülírhatja egymást. Jobb megoldás egyetlen utasítás: `UPDATE ... SET keszlet = keszlet + ? WHERE id = ? AND keszlet + ? >= 0`, és az `affectedRows` alapján eldöntöd, mi történt (nincs termék → 404, nincs elég készlet → 400).

## Ellenőrizd

- [ ] A `requests.http` minden kérése ugyanazt a státuszt adja, mint a JSON-os változatnál.
- [ ] Ismeretlen kategóriára 400 jön, nem 500.
- [ ] A változások phpMyAdminban is látszanak, szerver-újraindítás után is megmaradnak.
