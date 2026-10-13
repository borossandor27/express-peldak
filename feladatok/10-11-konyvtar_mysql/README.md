# 10–11. feladat MySQL-lel – Iskolai könyvtár, kölcsönzések ★★★★

**Indítás:** `npm run f10-mysql` · **Adatbázis:** `data/konyvtar.sql` (adatbázis: `konyvtar`) · **Teszteléshez:** `requests.http`
**Feladat:** ugyanaz, mint a [`10-11-konyvtar`](../10-11-konyvtar/README.md) mappában ([FELADATOK.md](../FELADATOK.md)), de az adatok **MySQL adatbázisban** vannak.
**Előkészítés** (XAMPP, importálás, `mysql2`, kapcsolat): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Több, idegen kulccsal összekapcsolt tábla** és a **`JOIN`**: a 11. feladatban kézzel összefésült adatokat (`konyvCim`, `olvasoNev`) itt az adatbázis kapcsolja össze.
- **Normalizált adatbázis**: a szerzők külön táblában vannak (`szerzok`), a könyv csak a szerző azonosítóját tárolja.
- A különbség az **adatbázis szerkezete** és az **API válasza** között: a kliens továbbra is `szerzo` nevet kap, nem `szerzo_id`-t.
- Az adatbázis **megszorításai** (idegen kulcs, egyedi kulcs) és a hibakódjaik lefordítása HTTP státuszra (404, 409).

## Az adatbázis eltér a JSON fájloktól – nézd meg alaposan!

| Tábla | JSON-ban | Az adatbázisban |
|---|---|---|
| `konyvek` | `szerzo` (név) | `szerzo_id` → `szerzok.id`, a név a `szerzok.szerzo` oszlopban |
| `olvasok` | `nev`, `email` | csak `nev` – **nincs `email` oszlop** |
| `kolcsonzesek` | `visszahozva: false` (logikai) | `visszahozva` szöveg: `'true'` / `'false'` |
| `kolcsonzesek` | `visszahozasDatum` | **nincs ilyen oszlop** |

- Az e-mailes feladatrészhez (validáció, 409 foglalt címre) és a visszahozás dátumához **bővítened kell a táblákat** (`ALTER TABLE ... ADD ...`). Az e-mailre érdemes **`UNIQUE`** megszorítást tenni. Írd le a módosító SQL utasításokat egy külön `.sql` fájlba, hogy más is meg tudja ismételni.
- A `visszahozva` szöveget a válaszban alakítsd **logikai értékké** (`=== 'true'`), mert az API-nak ugyanazt kell adnia, mint a JSON-os változatnak. Íráskor pedig `'true'` / `'false'` szöveget ments.

## Mire figyelj a megoldás során?

- **A könyvek listája `JOIN`-nal** készüljön, és a válaszban `szerzo` mező legyen (`SELECT k.id, k.cim, s.szerzo, k.ev FROM konyvek k JOIN szerzok s ON ...`).
- A `?szerzo=` keresés a `szerzok.szerzo` oszlopban keressen (`LIKE ?`).
- **Új könyvnél** a kliens szerzőnevet küld. Keresd meg a szerzőt; ha nincs, vedd fel a `szerzok` táblába, és az új `insertId`-t használd. Gondold végig, mi történik, ha két szerző neve csak kisbetű-nagybetűben tér el.
- A routerek ne a `jsonDb.js`-t használják, hanem egy közös `utils/db.js` kapcsolatot (pool).
- **Idegen kulcs**: nem létező könyvre vagy olvasóra a `INSERT` hibát dob, de a kliensnek **404**-et kell kapnia érthető üzenettel – ezért előbb te ellenőrizd a létezést.
- **Kikölcsönzött könyv törlése** (szorgalmi): az idegen kulcs miatt az adatbázis nem engedi törölni azt a könyvet, amire kölcsönzés hivatkozik (`ER_ROW_IS_REFERENCED_2`). Ezt fordítsd **409**-re – de vigyázz, ez a már *visszahozott* kölcsönzésekre is igaz!
- **Foglalt e-mail**: a `UNIQUE` megszorítás `ER_DUP_ENTRY` hibát dob – ezt is 409-re fordíthatod, vagy előbb lekérdezéssel ellenőrzöd.
- A `/konyvek/elerheto` egy lekérdezés legyen: azok a könyvek, amelyekhez **nincs** `visszahozva = 'false'` kölcsönzés (`NOT EXISTS` vagy `LEFT JOIN ... IS NULL`).
- A `?aktiv=true` itt egy `WHERE visszahozva = 'false'` feltétel.
- Az `/olvasok/:id/kolcsonzesek` a kölcsönzéseket a könyv címével együtt adja (`JOIN`), nem létező olvasóra 404.
- Ugyanazt a könyvet két egyszerre érkező kérés is kikölcsönözheti, ha a „ki van-e kölcsönözve” ellenőrzés és az `INSERT` külön utasítás. Iskolai feladatnál ez elfogadható, de gondold végig, miért gond ez egy valódi rendszerben.
- A naplózó, a 404-es és a hibakezelő middleware ugyanúgy kell; az adatbázis-hibák a hibakezelőben 500-at adjanak.

## Ellenőrizd

- [ ] A `GET /konyvek` válaszában `szerzo` név van, nem `szerzo_id`.
- [ ] A `visszahozva` mező a válaszban `true` / `false`, nem `"true"` / `"false"`.
- [ ] A táblamódosító SQL utasításaid külön fájlban vannak.
- [ ] Ugyanazt a könyvet kétszer kölcsönözve a második kérés 409.
