# 19. feladat MySQL-lel – Receptkönyv ★★★★

**Indítás:** `npm run f19-mysql` · **Adatbázis:** `data/receptek.sql` (adatbázis: `receptek`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** ugyanaz, mint a [`19-receptek`](../19-receptek/README.md) mappában ([FELADATOK-2.md](../FELADATOK-2.md)), de az adatok **MySQL adatbázisban** vannak.
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Beágyazott tömb → külön tábla** (egy-a-többhöz kapcsolat): a recept hozzávalói a `hozzavalok` táblában vannak, a `recept_id` köti őket a recepthez.
- **Visszafelé is át kell alakítani**: az API továbbra is beágyazott tömböt ad és vár, a szerver bontja szét két táblára, és rakja össze újra.
- **Tranzakció**: a recept és a hozzávalói **együtt** kerülnek be (vagy egyik sem).
- **`ON DELETE CASCADE`** és **összetett egyedi kulcs** (`UNIQUE (recept_id, nev)`).
- **Csoportosítás két oszlop szerint** (`GROUP BY nev, egyseg`) a bevásárlólistához.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `receptek` | `id`, `nev`, `kategoria`, `adag`, `ido_perc` | a válaszban `idoPerc` legyen (`AS idoPerc`) |
| `hozzavalok` | `id`, `recept_id`, `nev`, `mennyiseg` (DECIMAL), `egyseg` | `UNIQUE (recept_id, nev)`, idegen kulcs `ON DELETE CASCADE` |

## Mire figyelj a megoldás során?

- **Egy recept összerakása**: két lekérdezés (a recept, aztán `WHERE recept_id = ? ORDER BY id` a hozzávalói), majd `{ ...recept, hozzavalok }`. Ezt írd meg egy függvényben (`teljesRecept(id)`), mert szinte minden végpont használja. (Egy `JOIN`-nal is megy, de akkor a sorokat neked kell receptekké csoportosítani.)
- **A `mennyiseg` DECIMAL, ezért szövegként jön** (`"200.00"`). Alakítsd számmá, különben a válasz más lesz, mint a JSON-os változatban.
- A `GET /receptek` rövid listája egy táblából jön; a `?hozzavalo=liszt` szűrés a **másik** táblában keres: `WHERE EXISTS (SELECT 1 FROM hozzavalok h WHERE h.recept_id = r.id AND h.nev = ?)`.
- **Adagszámítás SQL-ben**: `ROUND(h.mennyiseg * ? / r.adag, 2)`. Az adatbázis nem változik, ezért itt nem tudod véletlenül elrontani az eredeti receptet.
- **Bevásárlólista**: `WHERE recept_id IN (?)` – ha a paraméter egy **tömb** (`[1, 3]`), a `mysql2` vesszővel elválasztott listává alakítja. Utána `GROUP BY nev, egyseg` és `SUM(mennyiseg)`. Nem létező receptre 404 (hasonlítsd össze a talált receptek számát a kértekkel), nem szám azonosítóra 400.
- **POST / PUT tranzakcióval**: ha a recept bekerül, de a hozzávalók beszúrása hibát dob, félkész recept maradna. A tranzakcióhoz **egy kapcsolat** kell:
  ```js
  const kapcsolat = await pool.getConnection();
  try {
    await kapcsolat.beginTransaction();
    // ... kapcsolat.query(...) - NEM pool.query!
    await kapcsolat.commit();
  } catch (err) {
    await kapcsolat.rollback();
    throw err;
  } finally {
    kapcsolat.release();
  }
  ```
- **Több sor egy `INSERT`-tel**: `INSERT INTO hozzavalok (recept_id, nev, mennyiseg, egyseg) VALUES ?` és paraméterként egy **tömbök tömbje**: `[[[1, 'liszt', 200, 'g'], [1, 'tej', 5, 'dl']]]`.
- **PUT**: a hozzávalókat legegyszerűbb mind törölni és újra beszúrni (ugyanabban a tranzakcióban).
- **DELETE**: elég a receptet törölni, a hozzávalókat az `ON DELETE CASCADE` törli. Nézd meg phpMyAdminban!
- **Új hozzávaló, ha már van ilyen**: a `UNIQUE (recept_id, nev)` megszorítás `ER_DUP_ENTRY` hibát dob → **409**. Ugyanezért az új recept hozzávalói között sem lehet két azonos nevű – ezt a validációban jelezd (400), különben 500 lesz.
- Az `utf8mb4_hungarian_ci` miatt a `'Tojás'` és a `'tojás'` ugyanannak számít (a `?hozzavalo=TOJÁS` is talál), és a bevásárlólista `ORDER BY nev` a magyar ábécé szerint rendez.
- Az utolsó hozzávaló törlése továbbra is 400. Ehhez előbb meg kell számolni a recept hozzávalóit.

## Ellenőrizd

- [ ] A `requests.http` kérései ugyanazt adják, mint a JSON-os változatnál (a számok számok, nem `"200.00"`).
- [ ] Ha a hozzávalók beszúrása hibát dob (próbaképp írd el benne egy oszlop nevét), **nem** marad félkész recept az adatbázisban.
- [ ] Recept törlése után a hozzávalói sincsenek meg a `hozzavalok` táblában.
