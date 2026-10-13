# 6–7. feladat MySQL-lel – Filmadatbázis és filmstatisztika ★★★

**Indítás:** `npm run f06-mysql` · **Adatbázis:** `data/filmek.sql` (adatbázis: `filmek`, tábla: `filmek`)
**Feladat:** ugyanaz, mint a [`06-07-filmek`](../06-07-filmek/README.md) mappában ([FELADATOK.md](../FELADATOK.md)), de az adatok **MySQL adatbázisból** jönnek.
**Előkészítés** (XAMPP, importálás, `mysql2`, kapcsolat): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Ugyanaz az API, más adattárolás**: a kliens számára a végpontok és a válaszok **pontosan ugyanazok**, mint a JSON-os változatnál. Csak a szerver belseje változik.
- A JavaScript tömbmetódusok **SQL megfelelői**:

  | JavaScript | SQL |
  |---|---|
  | `filter` | `WHERE` |
  | `find` | `WHERE id = ?` + az első sor |
  | `sort` | `ORDER BY` |
  | `slice(0, n)` | `LIMIT n` |
  | `map(f => f.cim)` | `SELECT cim` |
  | `[...new Set(...)]` | `SELECT DISTINCT` |
  | `reduce` (összeg, átlag, max) | `SUM`, `AVG`, `MAX` |
  | csoportosítás objektumba | `GROUP BY` + `COUNT(*)` |

- **Paraméteres lekérdezés** (`?` helyőrző) és a **dinamikusan összerakott `WHERE`** feltétel.

## Mire figyelj a megoldás során?

- **Soha ne fűzd bele a kérés adatait az SQL szövegébe!** `"... WHERE mufaj = '" + req.query.mufaj + "'"` → SQL injection. Mindig `?` helyőrző és paramétertömb.
- A **kombinálható szűrőknél** gyűjtsd a feltételeket és a paramétereket egy-egy tömbbe, a végén pedig `WHERE` + `join(' AND ')` – ha nincs feltétel, `WHERE` se legyen.
- **Oszlopnevet és rendezési irányt nem lehet `?`-lel átadni.** A `?rendez=` értékét egy engedélyezett listából (`cim`, `ev`, `ertekeles`) válaszd ki, és a hozzá tartozó, általad megírt `ORDER BY` részt fűzd hozzá. Ismeretlen érték → 400 vagy alapértelmezett rendezés.
- A `pool.query()` eredménye egy **pár**: `const [sorok] = await pool.query(...)`. A `sorok` mindig **tömb**, egy filmnél is – a `/filmek/:id`-nél az első elemét kell visszaadni, üres tömbnél 404.
- A részleges, kisbetű-nagybetű független rendezőkeresés: `WHERE rendezo LIKE ?` és paraméterként `'%' + nev + '%'`. A tábla `utf8mb4_general_ci` rendezése miatt a `LIKE` alapból **nem** különbözteti meg a kis- és nagybetűt.
- A `/filmek/cimek` válasza **szövegtömb** (`["Mátrix", ...]`), nem objektumtömb (`[{"cim": "Mátrix"}, ...]`) – a sorokat `map`-pel alakítsd át.
- **Az `AVG()` és a `SUM()` eredményét a `mysql2` szövegként adja vissza** (`"8.2583"`), mert DECIMAL típusú. Alakítsd számmá és kerekítsd (vagy `ROUND(AVG(...), 2)` + `Number()`).
- A `/mufajok/darab` `GROUP BY` eredménye sorok tömbje; a válaszhoz objektummá kell alakítani (`{"vígjáték": 3, ...}`).
- A rendezés eredménye eltérhet a JavaScript `localeCompare('hu')`-tól, mert az adatbázis a saját rendezési szabályát (collation) használja.
- A route handlerek `async`-ok. Ha az adatbázis nem fut, a kérés ne fagyjon le: a hiba jusson el a hibakezelőig (500).
- Az útvonal-sorrend itt is számít (`/filmek/cimek` a `/filmek/:id` előtt).

## Ellenőrizd

- [ ] Minden végpont **ugyanazt** adja, mint a JSON-os változat (hasonlítsd össze a két szervert).
- [ ] A kódban sehol nincs a kérésből származó érték az SQL szövegébe fűzve.
- [ ] A statisztika számai **számok**, nem szövegek.
