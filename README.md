# Express.js példák – lépésről lépésre

| # | Mappa | Téma | Indítás |
|---|-------|------|---------|
| 01 | `01-hello-get` | GET végpontok, plain text válasz, route paraméter, query string, 404 | `npm run 01` |
| 02 | `02-modulok` | Függvények másik modulból: `export`, `export default`, `import * as` | `npm run 02` |
| 03 | `03-json-get` | Adatok JSON tömbből: `res.json`, `find`, `filter`, `map`, `reduce` | `npm run 03` |
| 04 | `04-crud` | Teljes CRUD (GET, POST, PUT, PATCH, DELETE), `express.json()`, státuszkódok | `npm run 04` |
| 05 | `05-routing` | Több JSON erőforrás, `express.Router`, middleware, hibakezelés | `npm run 05` |
| 06 | `06-szamiras` | Saját modul: számok betűvel (magyar helyesírás) és római számmal, `try...catch`, `node:test` | `npm run 06`, teszt: `npm run 06-teszt` |

Minden szerver a **http://localhost:3000** címen fut (egyszerre csak egy indítható). Leállítás: `Ctrl + C`.
A `--watch` kapcsoló miatt mentéskor a szerver magától újraindul.

## Első indítás

```bash
npm install
npm run 01
```

## Új projekt létrehozása a nulláról

```bash
mkdir sajat-projekt
cd sajat-projekt
npm init -y
npm install express
```

Ezután a `package.json`-ba írjuk be:

```json
"type": "module"
```

### Mit jelent a `"type": "module"`?

| CommonJS (alapértelmezett) | ES modul (`"type": "module"`) |
|---|---|
| `const express = require('express');` | `import express from 'express';` |
| `module.exports = fv;` | `export default fv;` |
| `module.exports = { a, b };` | `export { a, b };` |
| `__dirname` | `import.meta.dirname` |
| `require('./adat.json')` | `import adat from './adat.json' with { type: 'json' };` |

Saját fájl importálásakor **kötelező a `.js` kiterjesztés**: `import { osszead } from './utils/matek.js';`

## Export / import összefoglaló (02-es példa)

```js
// named export                        // importálás: kapcsos zárójel, pontos név
export function osszead(a, b) {}       import { osszead } from './matek.js';
export { kivon, szoroz };              import { kivon as minusz } from './matek.js';

// minden export egy objektumba
                                       import * as matek from './matek.js';
                                       matek.osszead(1, 2);

// default export (max. 1 fájlonként)  // importálás: nincs zárójel, szabad név
export default function koszon() {}    import barmilyenNev from './koszones.js';

// default + named együtt
                                       import maiDatum, { napNeve } from './datum.js';
```

## HTTP metódusok és státuszkódok (04-es példa)

| Művelet | Metódus | Útvonal | Siker | Hiba |
|---|---|---|---|---|
| Összes lekérése | GET | `/konyvek` | 200 | – |
| Egy lekérése | GET | `/konyvek/:id` | 200 | 404 |
| Létrehozás | POST | `/konyvek` | 201 | 400 |
| Teljes csere | PUT | `/konyvek/:id` | 200 | 400, 404 |
| Részleges módosítás | PATCH | `/konyvek/:id` | 200 | 404 |
| Törlés | DELETE | `/konyvek/:id` | 204 | 404 |

## Tesztelés

- GET kérések: böngészőből is.
- POST / PUT / PATCH / DELETE: a mappákban lévő `requests.http` fájl a VS Code **REST Client** bővítménnyel, vagy Postman / Thunder Client.

A 04-es és 05-ös példa **fájlba menti** a módosításokat (`data/*.json`). Ha vissza akarod állítani az eredeti adatokat, másold vissza a fájlokat.

## Gyakorló feladatok

28 feladat a `feladatok/` mappában, ebből 5 **MySQL adatbázissal** is elkészíthető:

- **1. rész (1–12.):** [feladatok/FELADATOK.md](feladatok/FELADATOK.md), indítás: `npm run f01` … `npm run f12`
- **2. rész (13–22.):** [feladatok/FELADATOK-2.md](feladatok/FELADATOK-2.md), indítás: `npm run f13` … `npm run f22`
- **3. rész (23–28.), hibapótló feladatok:** [feladatok/FELADATOK-3.md](feladatok/FELADATOK-3.md), indítás: `npm run f23` … `npm run f28`
- **MySQL-es változatok (6–7., 8–9., 10–11., 12., 17.):** ugyanazok a feladatok adatbázissal, indítás: `npm run f06-mysql`, `f08-mysql`, `f10-mysql`, `f12-mysql`, `f17-mysql` (lásd lent)

**Minden feladatmappában van egy `README.md`**: mit mutat be a feladat, és mire kell figyelni a megoldás során. Érdemes a feladat előtt elolvasni.

| # | Mappa | Téma | Mintapélda | Indítás | Teszt |
|---|---|---|---|---|---|
| 1 | [01-nevjegy](feladatok/01-nevjegy/README.md) | GET, plain text, route paraméter, 404 | 01 | `npm run f01` | |
| 2 | [02-szamologep](feladatok/02-szamologep/README.md) | route paraméterek, ellenőrzés, 400 | 01 | `npm run f02` | |
| 3 | [03-atvalto](feladatok/03-atvalto/README.md) | query string, alapértelmezett érték, külső csomag | 01 | `npm run f03` | |
| 4 | [04-geometria](feladatok/04-geometria/README.md) | named / default export, `import * as` | 02 | `npm run f04` | |
| 5 | [05-szovegek](feladatok/05-szovegek/README.md) | export lista, `as` átnevezés | 02 | `npm run f05` | |
| 6–7 | [06-07-filmek](feladatok/06-07-filmek/README.md) | JSON, `find`, `filter`, `sort`, `reduce`, `Set` | 03 | `npm run f06` | |
| 6–7 | [06-07-filmek_mysql](feladatok/06-07-filmek_mysql/README.md) | ugyanez MySQL-lel: `WHERE`, `ORDER BY`, `GROUP BY`, `AVG` | 03 | `npm run f06-mysql` | |
| 8–9 | [08-09-bolt](feladatok/08-09-bolt/README.md) | CRUD, validáció, útvonal-sorrend | 04 | `npm run f08` | |
| 8–9 | [08-09-bolt_mysql](feladatok/08-09-bolt_mysql/README.md) | ugyanez MySQL-lel: `INSERT`, `UPDATE`, `insertId`, `affectedRows` | 04 | `npm run f08-mysql` | |
| 10–11 | [10-11-konyvtar](feladatok/10-11-konyvtar/README.md) | `express.Router`, middleware, kapcsolat JSON-ok között, 409 | 05 | `npm run f10` | |
| 10–11 | [10-11-konyvtar_mysql](feladatok/10-11-konyvtar_mysql/README.md) | ugyanez MySQL-lel: `JOIN`, idegen kulcs, normalizált tábla | 05 | `npm run f10-mysql` | |
| 12 | [12-teendok](feladatok/12-teendok/README.md) | önálló projekt | 04, 05 | `npm run f12` | |
| 12 | [12-teendok_mysql](feladatok/12-teendok_mysql/README.md) | ugyanez MySQL-lel: `NULL`, ENUM, típusátalakítás | 04, 05 | `npm run f12-mysql` | |
| 13 | [13-veletlen](feladatok/13-veletlen/README.md) | query paraméterek, alapértékek, `Set` | | `npm run f13` | |
| 14 | [14-datumok](feladatok/14-datumok/README.md) | saját modul, `Date` | 02 | `npm run f14` | |
| 15 | [15-titkositas](feladatok/15-titkositas/README.md) | named + default export, útvonal-middleware | 02 | `npm run f15` | |
| 16 | [16-sorszamok](feladatok/16-sorszamok/README.md) | modul a modulra építve, `try...catch` | 06 | `npm run f16` | |
| 17 | [17-orarend](feladatok/17-orarend/README.md) | JSON szűrés, csoportosítás | 03 | `npm run f17` | |
| 17 | [17-orarend_mysql](feladatok/17-orarend_mysql/README.md) | ugyanez MySQL-lel: nézet (VIEW), `GROUP BY` | 03 | `npm run f17-mysql` | |
| 18 | [18-bajnoksag](feladatok/18-bajnoksag/README.md) | tabella számítása, összetett rendezés | 03 | `npm run f18` | |
| 19 | [19-receptek](feladatok/19-receptek/README.md) | CRUD beágyazott tömbbel | 04 | `npm run f19` | |
| 20 | [20-jegynaplo](feladatok/20-jegynaplo/README.md) | routerek, súlyozott átlag, kapcsolt törlés | 05 | `npm run f20` | |
| 21 | [21-mozi](feladatok/21-mozi/README.md) | 3 router, összetett ellenőrzés, 409 | 05 | `npm run f21` | |
| 22 | [22-kviz](feladatok/22-kviz/README.md) | önálló projekt, védett végpontok (401) | 05 | `npm run f22` | |
| 23 | [23-diakszuro](feladatok/23-diakszuro/README.md) | kombinálható szűrők, határértékek | 03 | `npm run f23` | `npm run t23` |
| 24 | [24-homerseklet](feladatok/24-homerseklet/README.md) | a 0 csapdája, előbb a várt eredmény | 03 | `npm run f24` | `npm run t24` |
| 25 | [25-allatkert](feladatok/25-allatkert/README.md) | útvonal-sorrend, objektum vagy tömb | 03 | `npm run f25` | `npm run t25` |
| 26 | [26-regisztracio](feladatok/26-regisztracio/README.md) | validáló függvény, `typeof`, `trim` | 04 | `npm run f26` | `npm run t26`, `t26-fv` |
| 27 | [27-jegyzetek](feladatok/27-jegyzetek/README.md) | pontos válaszok: 201, 204, max + 1 | 04 | `npm run f27` | `npm run t27` |
| 28 | [28-javitsd](feladatok/28-javitsd/README.md) | hibakeresés: 15 hiba | 04 | `npm run f28` | `npm run t28` |

A 23–28. feladathoz **automatikus ellenőrzés** is tartozik: `npm run t23` … `npm run t28` (a szervert nem kell elindítani hozzá). A 26. feladat validáló függvénye külön is tesztelhető: `npm run t26-fv`.

A kidolgozott megoldások a `megoldasok/` mappában vannak (tanári használatra), indítás: `npm run m01` … `npm run m28`.

## Adatbázisos (MySQL) változatok

A `_mysql` végű mappákban **ugyanaz** a feladat van, mint a párjukban, de az adatokat MySQL (MariaDB) adatbázisból kell olvasni és oda kell írni. A cél: **az API kívülről ne változzon** – ugyanazok a végpontok, ugyanazok a válaszok és státuszkódok, csak a szerver belseje más. A `data/*.json` fájlok összehasonlításnak maradtak meg, a kiinduló `app.js` még a JSON-t olvassa.

| Mappa | SQL fájl | Adatbázis | Eltérés a JSON-hoz képest |
|---|---|---|---|
| `06-07-filmek_mysql` | `data/filmek.sql` | `filmek` | nincs |
| `08-09-bolt_mysql` | `data/termekek.sql` | `termekek` | a `kategoria` ENUM (4 érték) |
| `10-11-konyvtar_mysql` | `data/konyvtar.sql` | `konyvtar` | külön `szerzok` tábla; az olvasóknak nincs `email` oszlopa; a `visszahozva` szöveg |
| `12-teendok_mysql` | `data/teendok.sql` | `teendok` | a `kesz` szöveg (`'true'` / `'false'`) |
| `17-orarend_mysql` | `data/orarend.sql` | `orarend` | normalizált táblák + `orarend_adatokkal` nézet |

### Előkészítés

1. Indítsd el a **XAMPP**-ban a **MySQL**-t.
2. phpMyAdmin (`http://localhost/phpmyadmin`) → **Importálás** → válaszd ki a mappa `data/*.sql` fájlját. Adatbázist nem kell előre létrehozni, az SQL fájl megcsinálja (`CREATE DATABASE IF NOT EXISTS`).
3. A projekt gyökerében telepítsd a MySQL klienst:

```bash
npm install mysql2
```

4. Készíts egy közös kapcsolatot a feladat mappájában, pl. `utils/db.js`:

```js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // XAMPP alapértelmezés
  password: '',        // XAMPP alapértelmezés: üres
  database: 'filmek',  // a feladat adatbázisa
});

export default pool;
```

### Használat

```js
import pool from './utils/db.js';

app.get('/filmek/:id', async (req, res) => {
  const [sorok] = await pool.query('SELECT * FROM filmek WHERE id = ?', [req.params.id]);
  if (sorok.length === 0) return res.status(404).json({ hiba: 'Nincs ilyen film' });
  res.json(sorok[0]);
});
```

| Művelet | Mit ad vissza a `pool.query`? | Mire használjuk? |
|---|---|---|
| `SELECT` | `[sorok, mezok]` – a `sorok` **mindig tömb** | lista; egy elemnél `sorok[0]`, üres tömb → 404 |
| `INSERT` | `[eredmeny]` | `eredmeny.insertId` – az új id, **nem** kell max + 1 |
| `UPDATE`, `DELETE` | `[eredmeny]` | `eredmeny.affectedRows === 0` → 404 |

### Amire minden MySQL-es feladatnál figyelj

- **Soha ne fűzd a kérés adatait az SQL szövegébe** (`"... WHERE id = " + req.params.id`) – ez **SQL injection**. Mindig `?` helyőrző és paramétertömb.
- **Oszlopnevet és rendezési irányt nem lehet `?`-lel átadni.** Ezeket engedélyezett listából válaszd ki (pl. `?rendez=` csak `cim`, `ev`, `ertekeles` lehet).
- **Kombinálható szűrőknél** a feltételeket és a paramétereket egy-egy tömbbe gyűjtsd, a végén `WHERE ` + `feltetelek.join(' AND ')`.
- **A `SUM()` és az `AVG()` eredménye szöveg** a `mysql2`-ben (pl. `"8.2583"`), mert DECIMAL típusú. Alakítsd számmá (`Number(...)`).
- **A validáció továbbra is a szerver feladata.** Az adatbázis hibaüzenete nem a kliensnek való, és nem minden hibát fog meg.
- A route handlerek `async`-ok. Az Express 5 az `async` handlerben keletkező hibát továbbítja a hibakezelő middleware-nek – legyen ilyen, és adjon 500-at (pl. ha nem fut a MySQL).
- A **`mentes()` / `jsonDb.js` nem kell**: minden `INSERT`, `UPDATE`, `DELETE` azonnal tartós. Az eredeti adatokhoz úgy lehet visszatérni, hogy phpMyAdminban **eldobod** (törlöd) az adatbázist, majd újra importálod az SQL fájlt – a fájl `CREATE TABLE` utasításai a már létező táblákra hibát adnának.

## Rövid feladat ötletek

1. **01:** Készíts `/kor/:ev` végpontot, ami kiírja, hány éves az, aki abban az évben született.
2. **02:** Írj egy `utils/homerseklet.js` modult (`celsiusbolFahrenheit`, `fahrenheitbolCelsius` named export), és használd egy végpontban.
3. **03:** Készíts `/diakok/varos/:varos` végpontot, és egy `/legjobbak/:n` végpontot, ami az n legjobb átlagú diákot adja vissza.
4. **04:** Készíts `GET /konyvek/elerheto` végpontot a nem kikölcsönzött könyvekre. (Vigyázz: a `/:id` útvonal ELÉ kell tenni!)
5. **05:** Egészítsd ki a `routes/tantargyak.js` routert POST, PUT, PATCH, DELETE végpontokkal.
