# 29. feladat – Zenetár ★★

**Indítás:** `npm run f29` · **Adatbázis:** `data/zenetar.sql` (adatbázis: `zenetar`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** [FELADATOK-4.md](../FELADATOK-4.md), 29. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Két tábla, 1:N kapcsolat**: egy előadónak több albuma van, az album az `eloado_id` idegen kulccsal hivatkozik az előadóra.
- **`JOIN`**: az album mellé az előadó **neve** kerül, nem az azonosítója.
- **Beágyazott tömb**: az előadó adatai + az albumai egy JSON objektumban.
- **`LEFT JOIN` + `COUNT`**: az album nélküli előadó is megjelenik a statisztikában, 0-val.
- **`COUNT(DISTINCT ...)`**: ha a `JOIN` megsokszorozza a sorokat.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `eloadok` | `id`, `nev`, `orszag`, `alapitas` | 8 előadó; a **Carson Coma**-nak nincs albuma |
| `albumok` | `id`, `eloado_id`, `cim`, `ev`, `mufaj`, `hossz` | 13 album, a `hossz` percben |

## Mire figyelj a megoldás során?

- **Útvonal-sorrend**: a `/albumok/kereses` legyen az esetleges `/albumok/:id` előtt (különben a „kereses” szót id-nak venné).
- **Az előadó albumai**: előbb kérdezd le az előadót. Ha nincs → 404. Ha van, a második lekérdezés üres tömbje (`[]`) **nem hiba**.
- **A két lekérdezés eredményét** a spread operátorral fűzd össze: `res.json({ ...eloadok[0], albumok })`.
- **Oszlopok átnevezése**: `SELECT a.id, a.cim, e.nev AS eloado ...` – két táblában is van `id`, ezért írd ki, melyiket kéred (`a.id`). A `SELECT *` itt rossz ötlet: a `JOIN` után a két `id` közül csak az egyik maradna meg.
- **Kombinálható szűrők**: a feltételeket és a paramétereket gyűjtsd egy-egy tömbbe, a végén `' WHERE ' + feltetelek.join(' AND ')`.
- **Keresés két oszlopban**: `WHERE a.cim LIKE ? OR e.nev LIKE ?` – a paramétertömbbe a mintát (`'%' + q + '%'`) **kétszer** kell beírni.
- **`COUNT(*)` vagy `COUNT(a.id)`?** `LEFT JOIN` után az album nélküli előadónak is van egy sora (csupa `NULL` album-oszloppal). A `COUNT(*)` ezt 1-nek számolja, a `COUNT(a.id)` 0-nak – a `NULL`-t nem számolja.
- **`/orszagok`**: a `JOIN` után az Omega 2 sorban szerepel (2 albuma van). A `COUNT(e.id)` ezért 2-t számolna, a `COUNT(DISTINCT e.id)` 1-et.
- A `SUM()` eredménye a `mysql2`-ben **szöveg** (`"221"`) → `Number(...)`.

## Ellenőrizd

- [ ] `GET /eloadok/7` → 200 és `"albumok":[]`, `GET /eloadok/99` → 404.
- [ ] A `/statisztika/eloadok` válaszában mind a 8 előadó benne van.
- [ ] Az `/orszagok` válaszában Magyarország: 4 előadó, 4 album.
- [ ] A kódban sehol nincs a kérésből származó érték az SQL szövegébe fűzve.
