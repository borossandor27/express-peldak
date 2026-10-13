# 17. feladat MySQL-lel – Órarend ★★★

**Indítás:** `npm run f17-mysql` · **Adatbázis:** `data/orarend.sql` (adatbázis: `orarend`)
**Feladat:** ugyanaz, mint a [`17-orarend`](../17-orarend/README.md) mappában ([FELADATOK-2.md](../FELADATOK-2.md)), de az adatok **MySQL adatbázisban** vannak.
**Előkészítés** (XAMPP, importálás, `mysql2`, kapcsolat): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Normalizált adatbázis**: a tanárok, a tantárgyak és a termek külön táblában vannak, az `orarend` tábla csak az azonosítóikat tárolja.
- A **nézet (VIEW)**: az `orarend_adatokkal` nézet összekapcsolja (`JOIN`) a négy táblát, és **pontosan olyan sorokat** ad (`nap`, `ora`, `tantargy`, `tanar`, `terem`), mint a JSON fájl. Olvasáskor úgy kérdezheted le, mintha egy tábla lenne.
- **Csoportosítás SQL-ben**: `GROUP BY`, `COUNT`, `MIN`, `MAX`.
- **Egyedi megszorítás** (`UNIQUE (nap, ora)`): egy időpontban csak egy óra lehet.
- Mi maradjon a JavaScriptben: a **csengetési rend** (`CSENGETES`) nincs az adatbázisban.

## Az adatbázis felépítése

| Tábla / nézet | Tartalom |
|---|---|
| `orarend` | `id`, `nap` (ENUM), `ora`, `tanar_id`, `tantargy_id`, `terem_id` |
| `tanarok`, `tantargyak` | `id`, `nev` |
| `termek` | `id`, `nev` – ⚠️ ez a **termek** (tantermek) tábla, nem termékek! |
| `orarend_adatokkal` | nézet: `nap`, `ora`, `tantargy`, `tanar`, `terem` – napok és órák szerint rendezve |

## Mire figyelj a megoldás során?

- **Olvasáshoz a nézetet használd**, így nem kell minden végpontban négy táblát összekapcsolni. Nézd meg phpMyAdminban, milyen `SELECT` van mögötte.
- **Mindig `?` helyőrző** a kérésből jövő értékekhez (nap, óra, tanárnév, terem).
- **Ismeretlen nap**: ha nem létező napra szűrsz, az adatbázis egyszerűen **üres** eredményt ad, nem hibát. Az „Ismeretlen nap” (404) és a „lyukasóra” (404, más üzenet) megkülönböztetéséhez a napot **előbb a szerveren** ellenőrizd a napok listájával.
- Az adatbázis `utf8mb4_hungarian_ci` rendezést használ: a kis- és nagybetű az összehasonlításban nem számít (`'Szerda' = 'szerda'`), és az `ORDER BY` a **magyar ábécé** szerint rendez. A válaszban viszont a napnév kisbetűs alakja szerepeljen.
- A nézet **`ORDER BY FIELD(nap, 'hétfő', ...)`** rendezéssel a hét napjainak sorrendjében adja a sorokat; saját `GROUP BY nap` lekérdezésnél ezt neked kell megadnod, különben ábécérendet kapsz.
- A `/tanarok` válasza: csak azok a tanárok, akik **szerepelnek az órarendben** (`SELECT DISTINCT tanar FROM orarend_adatokkal`), vagy a teljes `tanarok` tábla? Nézd meg, van-e különbség, és döntsd el.
- A tanárkeresés részleges: `LIKE ?` és `'%' + nev + '%'`. Ismeretlen tanárnál (üres eredmény) 404.
- Az `/oraszamok`: `GROUP BY tantargy` + `COUNT(*)`, csökkenő sorrendben – a sorokat objektummá kell alakítani.
- A `/napi-oraszam`: `MIN(ora)`, `MAX(ora)`, `COUNT(*)` naponként, a kezdés és a vége időpontját pedig a `CSENGETES` tömbből teszed hozzá.
- Az `ora` oszlop `TINYINT UNSIGNED` – a `req.params.ora` szövegét előbb ellenőrizd (egész szám-e), és csak utána add át.

## Ellenőrizd

- [ ] Minden végpont **ugyanazt** adja, mint a JSON-os változat.
- [ ] A `/orarend/vasárnap` és a `/orarend/szerda/1` két különböző 404-es üzenetet ad.
- [ ] A `/napi-oraszam` kulcsai a hét napjainak sorrendjében jönnek.
