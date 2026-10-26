# 30. feladat – Szálláskereső ★★★

**Indítás:** `npm run f30` · **Adatbázis:** `data/szallasok.sql` (adatbázis: `szallasok`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** [FELADATOK-4.md](../FELADATOK-4.md), 30. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Négy kombinálható szűrő** egy `JOIN`-os lekérdezésen.
- **`MIN`, `AVG`, `COUNT` csoportonként**, és mi lesz belőlük, ha a csoport üres (`NULL`).
- **`WHERE` vagy `HAVING`?** – szűrés a csoportosítás előtt vagy után.
- **Számított oszlop** a `SELECT`-ben, paraméterrel (`ar * ? * ?`).
- **`LIMIT ?`** paraméterrel.
- **Típusok átalakítása**: TINYINT(1) → `true` / `false`, DECIMAL → szám.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `varosok` | `id`, `nev`, `orszag` | 7 város; **Debrecenben** nincs szállás |
| `szallasok` | `id`, `varos_id`, `nev`, `csillag`, `ar`, `medence`, `ertekeles` | 12 szállás; `ar`: Ft / fő / éj; `medence`: 0 vagy 1; `ertekeles`: DECIMAL(3,1) |

## Mire figyelj a megoldás során?

- **`medence`**: az adatbázisban `0` / `1`, a válaszban `false` / `true` legyen (`s.medence === 1`). A `?medence=` query paraméter **szöveg** (`"true"`), ebből kell 1 vagy 0 az SQL-hez. Más érték → 400.
- **`ertekeles`**: DECIMAL, ezért a `mysql2` **szövegként** adja (`"8.4"`) → `Number(...)`. Írj egy kis függvényt, ami egy szállás sorát a válasz formájára alakítja, és használd minden végpontnál.
- **Szűrők ellenőrzése**: a `minCsillag` 1–5 közötti egész, a `maxAr` pozitív egész. A `Number('abc')` → `NaN` nem mehet az SQL-be.
- **`/varosok`**: a szállás nélküli Debrecen csak `LEFT JOIN`-nal marad benne. Nála a `MIN(sz.ar)` és az `AVG(sz.ar)` **`NULL`** – a válaszban `null` legyen, **ne 0** (a `Number(null)` 0-t adna!).
- **`?minSzallas=`**: a `szallasDb` a `GROUP BY` után keletkezik, a `WHERE` még nem ismeri → **`HAVING szallasDb >= ?`**. A `HAVING` a `GROUP BY` után, az `ORDER BY` előtt áll.
- **`/varosok/:id/szallasok`**: nem létező város → 404, létező város szállás nélkül → `[]`. Ehhez előbb a várost kell lekérdezni.
- **`/ajanlat`**: a három paramétert **egyszerre** ellenőrizd, és az összes hibát add vissza egy `hibak` tömbben. Utána a város (404). Az összeget az SQL számolja: `ar * ? * ? AS osszesen`, és rendezhetsz is rá (`ORDER BY osszesen`).
- **`LIMIT ?`**: a paraméter `Number` legyen. A `req.params.n` szöveg, a `LIMIT '3'` szintaktikai hiba.
- **Az átlag kerekítése**: `ROUND(AVG(sz.ar))` vagy `ROUND(AVG(sz.ertekeles), 2)` – az eredmény itt is szöveg.

## Ellenőrizd

- [ ] A `medence` mindenhol `true` / `false`, az `ertekeles` szám.
- [ ] `GET /varosok` → Debrecen: `"szallasDb":0,"legolcsobb":null,"atlagAr":null`.
- [ ] `GET /varosok?minSzallas=2` → 5 város (Debrecen és Graz kimarad).
- [ ] `GET /ajanlat?ej=0` → 400 és három hibaüzenet.
