# 37. feladat – Állatorvosi rendelő ★★★

**Indítás:** `npm run f37` · **Adatbázis:** `data/rendelo.sql` (adatbázis: `rendelo`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** [FELADATOK-6.md](../FELADATOK-6.md), 37. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit ismétel a feladat?

- **Három tábla láncban**: gazda → állat → kezelés. Egy kezeléshez az állat **és** a gazda neve is kell: két `JOIN` egy lekérdezésben.
- **`LEFT JOIN` + `COUNT` / `COALESCE`**: az állat nélküli gazda és a kezelés nélküli állat is megjelenik, 0-val (29., 32. feladat).
- **Beágyazott válasz**: az állat mellett egy `gazda` **objektum** és egy `kezelesek` **tömb** (32. feladat, `GET /rendelesek/:id`).
- **Dátumszűrő és havi bontás** (`DATE_FORMAT`), **`IS NULL`**, **`POST`** ellenőrzéssel.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `gazdak` | `id`, `nev`, `telefon`, `varos` | 5 gazda; **Molnár Petrának** nincs állata |
| `allatok` | `id`, `gazda_id`, `nev`, `faj`, `szuletes` (DATE) | 7 állat; **Rex** még nem volt kezelésen |
| `kezelesek` | `id`, `allat_id`, `datum` (DATE), `leiras`, `dij` | 12 kezelés 2026-ban; `ON DELETE CASCADE` az állatra |

## Mire figyelj a megoldás során?

- **`dateStrings: true`** a pool beállításai közé (a `szuletes` és a `datum` is DATE).
- **Útvonal-sorrend**: a `/allatok/kezeles-nelkul` a `/allatok/:id` előtt legyen.
- **`/gazdak`**: `COUNT(a.id)`, nem `COUNT(*)` – különben Molnár Petrának 1 állata lenne.
- **`/allatok/:id`**: a gazda adatait az első lekérdezés hozza (`JOIN gazdak`), de **átnevezve**, mert két `nev` oszlop van: `g.nev AS gazdaNev`. A válaszban ebből lesz a `gazda: { id, nev, telefon }` objektum. Az `osszesDij` a kezelések díjának összege (`reduce`), kezelés nélkül 0.
- **`/kezelesek`**: a három szűrő (`tol`, `ig`, `faj`) kombinálható – feltételek és paraméterek egy-egy tömbben. A dátum `ÉÉÉÉ-HH-NN` alakú **és létező** nap legyen.
- **`/statisztika/fajok`**: a `JOIN` miatt egy állat annyi sorban szerepel, ahány kezelése van → az állatok száma `COUNT(DISTINCT a.id)`, a kezeléseké `COUNT(k.id)`.
- **`/statisztika/gazdak`**: két `LEFT JOIN` egymás után (gazda → állat → kezelés). Ha a második `JOIN` sima `JOIN` lenne, Molnár Petra kiesne, Nagy Ádámnál pedig 1 állat jelenne meg 2 helyett (a kezelés nélküli Rex sora eltűnne). A `SUM` üres csoportban `NULL` → `COALESCE(SUM(k.dij), 0)`.
- **`POST /kezelesek`**: a `datum` elhagyható. Ilyenkor a mai nap kell: `COALESCE(?, CURDATE())` és paraméterként `datum ?? null`. A `leiras` szóközökből álló szövege is üresnek számít (`trim`). A válasz ugyanolyan formájú legyen, mint a `GET /kezelesek` egy eleme – kérdezd le újra az `insertId` alapján.

## Ellenőrizd

- [ ] `GET /allatok/7` → 200, `"kezelesek":[]`, `"osszesDij":0`.
- [ ] `GET /statisztika/gazdak` → 5 gazda, Molnár Petra 0 Ft-tal az utolsó.
- [ ] `GET /statisztika/fajok` → a kutyáknál 3 állat és 6 kezelés (nem 6 állat!).
- [ ] A dátumok `"2026-01-14"` alakúak, minden összeg szám.
