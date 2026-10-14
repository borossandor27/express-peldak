# 07 – CRUD MySQL adatbázissal, beállítások `.env` fájlban

**Indítás:** `npm run 07` · **Adatbázis:** `data/express_pelda.sql` (adatbázis: `express_pelda`, tábla: `konyvek`) · **Teszteléshez:** `requests.http`

Ugyanazok a végpontok, mint a `04-crud` példában, de az adatok MySQL táblában vannak, a kapcsolódási adatok pedig egy `.env` fájlban.

## Mappaszerkezet

```
07-mysql/
├── .env              ← a SAJÁT beállításaid (nem kerül fel a Git-re!)
├── .env.example      ← minta: ezt másold le .env néven
├── app.js            ← szerver, 404, hibakezelő, kapcsolatpróba indításkor
├── routes/konyvek.js ← CRUD végpontok SQL-lel
├── utils/db.js       ← a közös kapcsolat (pool), a .env adataival
└── data/express_pelda.sql
```

## Előkészítés

1. XAMPP: indítsd el a **MySQL**-t.
2. phpMyAdmin → **Importálás** → `data/express_pelda.sql`. A fájl újra importálva visszaállítja az eredeti adatokat.
3. A projekt gyökerében (egyszer): `npm install mysql2 dotenv`
4. Másold le a `.env.example` fájlt **`.env`** néven ebbe a mappába, és ha kell, írd át (pl. jelszó).

## Miért kell a `.env`?

A jelszó, a felhasználónév és az adatbázis neve **gépenként más**: otthon, az iskolában és a szerveren is. Ha a kódban vannak, minden gépen át kell írni a kódot, és a **jelszó felkerül a Git-re**. A `.env` fájlban viszont gépenként külön vannak, a kód nem változik.

```ini
# .env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=express_pelda
```

```js
import 'dotenv/config';             // beolvassa a .env-et -> process.env
console.log(process.env.DB_NAME);   // "express_pelda"
```

| Szabály | Miért? |
|---|---|
| A `.env` a `.gitignore`-ban van, a `.env.example` nincs | a minta felkerül (mit kell beállítani), a jelszó nem |
| Az `import 'dotenv/config'` az **első** import | a többi modul már a beolvasott értékeket látja |
| A `process.env` minden értéke **szöveg** | a portot `Number(...)`-rel alakítsd számmá |
| A `.env` fájlt abból a mappából olvassa, ahonnan a szervert indítod | ezért van az `npm run 07` mögött `cd 07-mysql && ...` |
| A már beállított környezeti változót a dotenv **nem írja felül** | a szerveren így a valódi környezet az erősebb |

## Mit mutat be a példa?

| JSON-os változat (04) | MySQL-es változat (07) |
|---|---|
| `konyvek.find(k => k.id === id)` | `SELECT * FROM konyvek WHERE id = ?` → `sorok[0]` |
| `konyvek.push(uj)` + `kovetkezoId()` | `INSERT ...` → `eredmeny.insertId` |
| `findIndex` → `-1` → 404 | `UPDATE` / `DELETE` → `affectedRows === 0` → 404 |
| `mentes()` | nem kell, minden utasítás azonnal tartós |
| `kiolcsonozve: false` | `TINYINT(1)`: `0` / `1` → a válaszban `true` / `false` |

- **`?` helyőrző** minden kérésből jövő értékhez (SQL injection ellen).
- **Dinamikus `WHERE`** a szűrőkhöz és **dinamikus `SET`** a PATCH-hez: az oszlopnevek egy engedélyezett listából jönnek, az értékek `?`-lel.
- `router.param('id', ...)`: a MySQL a `'2abc'` szöveget **2-nek** veszi, ezért az id-t előbb ellenőrizzük.
- A hibakezelő middleware 500-at ad, ha az adatbázis hibát dob; indításkor egy `SELECT 1` kipróbálja a kapcsolatot.

## Próbáld ki

- Állítsd le a MySQL-t, és küldj egy kérést: 500-as választ kapsz, a szerver nem áll le.
- Írd át a `.env`-ben a `DB_NAME`-et egy nem létező adatbázisra, és indítsd újra a szervert.
- Töröld (nevezd át) a `.env` fájlt: a `utils/db.js` érthető hibaüzenettel leáll.
