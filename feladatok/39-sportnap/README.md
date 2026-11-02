# 39. feladat – Iskolai sportnap ★★★★

**Indítás:** `npm run f39` · **Adatbázis:** `data/sportnap.sql` (adatbázis: `sportnap`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** [FELADATOK-6.md](../FELADATOK-6.md), 39. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit ismétel a feladat?

- **Négy összekapcsolt tábla**: osztály → diák → eredmény ← versenyszám (32. feladat).
- **Rendezési irány engedélyezett listából**: oszlopnév és irány nem mehet `?`-lel (06–07. feladat, `?rendez=`).
- **Allekérdezés a `SELECT`-ben** (33. feladat) – itt a helyezés kiszámításához.
- **Belső lekérdezés a `FROM` / `JOIN` részben**, `LEFT JOIN` + `COALESCE`, **`UNIQUE` → 409** (31. feladat).

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `osztalyok` | `id`, `nev`, `ofo` | 4 osztály; a **12.A**-ból senki sem indult |
| `diakok` | `id`, `nev`, `osztaly_id`, `nem` (ENUM) | 12 diák |
| `versenyszamok` | `id`, `nev`, `mertekegyseg`, `jobb` | `jobb`: `kisebb` (futás) vagy `nagyobb` (ugrás, dobás) |
| `eredmenyek` | `id`, `diak_id`, `versenyszam_id`, `eredmeny` (DECIMAL(6,2)) | `UNIQUE (diak_id, versenyszam_id)`; a 100 m-en **holtverseny** van (13,10 mp) |

## Mire figyelj a megoldás során?

- **Az `eredmeny` DECIMAL** → szöveg (`"13.10"`) → `Number` (`13.1`).
- **Rangsor (`/versenyszamok/:id/eredmenyek`)**: előbb kérdezd le a versenyszámot (404), és a `jobb` oszlop alapján válaszd ki az irányt: `const irany = vsz.jobb === 'kisebb' ? 'ASC' : 'DESC';`. Ezt a két, általad megírt szöveg egyikét fűzöd az `ORDER BY` után – a kérésből semmi nem kerül az SQL szövegébe.
- **Helyezés holtversennyel JavaScriptben**: a rendezett listán végigmenve, ha az eredmény ugyanaz, mint az előzőé, a helyezés is ugyanaz; különben a helyezés a sorszám (`i + 1`). Így lesz 1., 2., 3., 3., **5.**
- **`?nem=`**: csak `fiú` vagy `lány` lehet (400). A szűrt listában a helyezés a szűrt mezőnyre vonatkozik.
- **Helyezés SQL-ben (`/diakok/:id`, `/pontverseny`)**: 1 + ahány versenyző **jobb** eredményt ért el ugyanabban a versenyszámban:
  ```sql
  1 + (SELECT COUNT(*) FROM eredmenyek e2
       WHERE e2.versenyszam_id = e.versenyszam_id
         AND IF(v.jobb = 'kisebb', e2.eredmeny < e.eredmeny, e2.eredmeny > e.eredmeny)) AS helyezes
  ```
  Ez a holtversenyt is jól kezeli. Itt a teljes mezőny számít (fiúk és lányok együtt).
- **`/osztalyok`**: `letszam` = `COUNT(DISTINCT d.id)`, `indulok` = `COUNT(DISTINCT e.diak_id)` (a `NULL`-t nem számolja), `eredmenyDb` = `COUNT(e.id)`.
- **`/pontverseny`**: a fenti helyezést egy **belső lekérdezés** számolja ki minden eredményre, a külső osztályonként összesít:
  `osztalyok LEFT JOIN diakok LEFT JOIN (SELECT e.diak_id, <helyezés> AS helyezes FROM ...) h`.
  Pont: `SUM(CASE h.helyezes WHEN 1 THEN 5 WHEN 2 THEN 3 WHEN 3 THEN 1 ELSE 0 END)`; az első helyek száma: `SUM(h.helyezes = 1)`. A 12.A-nál ezek `NULL`-ok → `COALESCE(..., 0)`.
- **`POST /eredmenyek`**: az `eredmeny` pozitív szám, legfeljebb két tizedesjeggyel. Vigyázz: `12.98 * 100` JavaScriptben `1297.9999999999998` – egész-e vizsgálatnál tűréssel hasonlíts. A dupla eredményt előbb te ellenőrizd (409), de az egyszerre érkező kéréseknél a `UNIQUE` kulcs `ER_DUP_ENTRY` hibáját is fordítsd 409-re. A válaszban szerepeljen az új eredmény **helyezése** is.

## Ellenőrizd

- [ ] `GET /versenyszamok/1/eredmenyek` → két 3. hely, utána az 5.
- [ ] `GET /versenyszamok/2/eredmenyek` → csökkenő sorrend (a távolugrásban a nagyobb a jobb).
- [ ] `GET /pontverseny` → 11.C 24, 9.A 9, 10.B 4, 12.A 0 pont.
- [ ] A kódban az `ORDER BY` után csak `'ASC'` vagy `'DESC'` kerülhet, a kérésből semmi.
