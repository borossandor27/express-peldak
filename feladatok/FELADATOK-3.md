# Express.js gyakorló feladatok – 3. rész: hibapótló feladatok

Ezek a feladatok a Filmek és a Papírbolt dolgozat **leggyakoribb hibáit** gyakoroltatják. Mindegyik feladat egy-egy hibatípusra épül; a végén ott a „Gyakori hiba” rész, ami megmutatja, mire figyelj.

Az általános tudnivalók ugyanazok, mint az 1. és 2. részben:

- Minden feladathoz van kiinduló mappa `TODO` megjegyzésekkel. Indítás: `npm run f23` … `npm run f28`.
- POST / PUT / PATCH / DELETE kéréshez használd a mappában lévő `requests.http` fájlt.
- A 26–28. feladat **fájlba menti** az adatokat. Mielőtt elkezded, készíts másolatot a `data` mappáról!

**Újdonság: automatikus ellenőrzés.** Minden feladathoz van teszt, amit te is futtathatsz. A szervert **nem kell** elindítanod – a teszt maga indítja el egy másolaton, és az eredeti adatfájljaidat nem módosítja. Ha fut a szervered, előbb állítsd le (`Ctrl + C`).

```bash
npm run t23          # a 23. feladat ellenőrzése
```

```
 ✔  GET /diakok                200 + mind a 14 diák
 ✘  ?minAtlag=                 minAtlag=4 → a 4,0-s átlag is benne (≥)
 ...
Pont: 17 / 21  (jegy: 4)
```

| # | Feladat | Melyik hibát gyakoroltatja? | Nehézség | Indítás | Teszt |
|---|---|---|---|---|---|
| 23 | Diákszűrő | query paraméterek, kombinálható szűrők, határértékek | ★★ | `npm run f23` | `npm run t23` |
| 24 | Hőmérséklet-napló | határértékek, a 0 csapdája, előbb a várt eredmény | ★★ | `npm run f24` | `npm run t24` |
| 25 | Állatkert | útvonal-sorrend, objektum vagy tömb, 400 / 404 JSON-nel | ★★ | `npm run f25` | `npm run t25` |
| 26 | Regisztráció | validáló függvény, `typeof`, egész szám, `trim` | ★★★ | `npm run f26` | `npm run t26`, `npm run t26-fv` |
| 27 | Jegyzetek CRUD | pontos válaszok: 201 + objektum, 204 üresen, max + 1 | ★★★ | `npm run f27` | `npm run t27` |
| 28 | Javítsd ki! | hibakeresés: 15 valódi hiba korábbi beadandókból | ★★ | `npm run f28` | `npm run t28` |

---

## Leadási szabály – minden beadandóra érvényes

Csak az a munka értékelhető, amelyik **egy üres gépen is elindul** ezzel a két paranccsal:

```bash
npm install
npm start
```

Ehhez a projekt mappájában legyen `package.json`, és benne:

```json
{
  "name": "filmek",
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "node --watch app.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

Új projekt a nulláról:

```bash
mkdir filmek
cd filmek
npm init -y
npm install express
```

…majd a `package.json`-ba beírod a `"type": "module"` sort és a `start` scriptet. A `node_modules` mappát **ne** add le (az `npm install` újra létrehozza).

**Leadás előtt ellenőrizd:** töröld a `node_modules` mappát, futtasd az `npm install` és `npm start` parancsot, és próbáld ki a végpontokat. Ha így nem indul el, nálam sem fog.

---

## 23. feladat – Diákszűrő ★★

**Mappa:** `feladatok/23-diakszuro/`, adatok: `data/diakok.json` (14 diák).

Egy diák: `{ "id": 3, "nev": "Kovács Dóra", "osztaly": "13.C", "nem": "lány", "atlag": 4.0, "hianyzas": 0 }`

**Egyetlen** `GET /diakok` útvonalat kell írnod, ami az alábbi query paraméterek **bármilyen kombinációját** kezeli. Minden paraméter elhagyható.

| Paraméter | Jelentés | Példa |
|---|---|---|
| `osztaly` | pontos egyezés | `?osztaly=13.B` |
| `nem` | pontos egyezés | `?nem=lány` |
| `nev` | **részleges**, kis- és nagybetű független | `?nev=kis` → Kiss Anna, Kis Gergely |
| `minAtlag` | legalább ennyi (**a határ is benne**) | `?minAtlag=4` → a 4,0 is |
| `maxAtlag` | legfeljebb ennyi (**a határ is benne**) | `?maxAtlag=3.5` → a 3,5 is |
| `maxHianyzas` | legfeljebb ennyi hiányzás | `?maxHianyzas=0` → akinek nincs hiányzása |
| `rendez` | `nev` (magyar ábécé), `atlag`, `hianyzas` | `?rendez=nev` |
| `irany` | `novekvo` (alapértelmezett) vagy `csokkeno` | `?rendez=atlag&irany=csokkeno` |
| `limit` | legfeljebb ennyi elem (a rendezés **után**) | `?rendez=atlag&irany=csokkeno&limit=3` |

**Hibás paraméter → 400** `{ "hiba": "..." }`:
- `minAtlag` / `maxAtlag`: nem szám, üres, vagy nem 1 és 5 közötti
- `maxHianyzas`: nem egész szám
- `limit`: nem pozitív egész
- `rendez` / `irany`: ismeretlen érték

**Még egy végpont:** `GET /diakok/:id` → **egy objektum** (nem tömb!), vagy 404 `{ "hiba": "Nincs ilyen diák" }`.

**Példák**

| Kérés | Válasz (id-k) |
|---|---|
| `/diakok?osztaly=13.B&minAtlag=4` | 5, 8, 14 |
| `/diakok?minAtlag=3.5&maxAtlag=4` | 3, 6, 7, 10, 11 |
| `/diakok?maxHianyzas=0` | 3, 5, 8, 14 |
| `/diakok?rendez=atlag&irany=csokkeno&limit=3` | 5, 12, 14 |
| `/diakok?rendez=nev` | 11 (Ábrahám Lili), 12, 6, 8, 1, … |

**A megoldás váza** – ezt a mintát kövesd:

```js
let eredmeny = [...diakok];
if (osztaly !== undefined) eredmeny = eredmeny.filter((d) => d.osztaly === osztaly);
if (nem !== undefined) eredmeny = eredmeny.filter((d) => d.nem === nem);
// ... a többi szűrő ugyanígy, egymás alatt
```

**⚠️ Gyakori hiba**
- **Külön útvonal minden szűrőnek** (`/diakok/osztaly/:osztaly`, `/diakok/min`) – a feladat query paramétert kér: `/diakok?osztaly=13.B`.
- **`app.get('/diakok?osztaly=')`** – a `?` utáni rész nem az útvonal része, ezt a `req.query` adja.
- **`else if` vagy `return` az első szűrő után** – így a szűrők nem kombinálhatók.
- **`>` a `>=` helyett** – a „legalább 4” a 4,0-t is jelenti.
- **`if (maxHianyzas)`** – ha előbb számmá alakítod, a 0 hamis, és a szűrés elmarad. Használd: `!== undefined`.
- **`Number('')` értéke 0!** – az üres paraméter nem nulla, hanem hiba.
- **Csak az egyik oldalt kisbetűsíted** – `d.nev.toLowerCase().includes(nev.toLowerCase())`, mindkettő kell.
- **`sort()` vagy `<` a nevekre** – így az „Ábrahám” a „Varga” után kerül. Használd: `a.nev.localeCompare(b.nev, 'hu')`.

---

## 24. feladat – Hőmérséklet-napló ★★

**Mappa:** `feladatok/24-homerseklet/`, adatok: `data/meresek.json` (12 mérés, két város).

Egy mérés: `{ "id": 5, "datum": "2026-02-02", "varos": "Debrecen", "homerseklet": 0, "csapadek": 0 }`

Az adatokban **szándékosan** van 0 fok, 0 mm csapadék, negatív hőmérséklet és több azonos dátum.

> **1. lépés – kódolás ELŐTT:** nyisd meg a `VARAKOZAS.md` fájlt, és a JSON alapján **kézzel** töltsd ki, milyen választ vársz a 12 kérésre. Csak ezután kezdj kódolni!
>
> **2. lépés:** írd meg a szervert, futtasd a kéréseket, és töltsd ki a „Kapott válasz” oszlopot. Ahol eltér, derítsd ki, ki tévedett: te vagy a kód?

| Metódus | Útvonal | Leírás |
|---|---|---|
| GET | `/meresek` | szűrők: `?varos=` (kisbetű-nagybetű független), `?tol=`, `?ig=` (dátum, **a határnap is benne**), `?minHo=`, `?maxHo=`, `?maxCsapadek=` (**a határ is benne**) |
| GET | `/meresek/statisztika` | **ugyanazokkal a szűrőkkel**: `{ "db", "atlag", "min", "max", "szarazNapok" }`; ha nincs egy mérés sem: 404 |
| GET | `/meresek/:id` | egy mérés / 404 |

- Az `atlag` egy tizedesre kerekítve: `Math.round(x * 10) / 10`.
- `szarazNapok`: ahány mérésnél a csapadék 0.
- **400**, ha a `tol` / `ig` nem `ÉÉÉÉ-HH-NN` formátumú, vagy a `minHo` / `maxHo` / `maxCsapadek` nem szám (az **üres** érték sem szám!).

**Példa:** `GET /meresek/statisztika?varos=debrecen&tol=2026-02-02`
```json
{ "db": 4, "atlag": 4.4, "min": 0, "max": 10, "szarazNapok": 3 }
```

**Tippek**
- Írj egy `szur(lista, query)` függvényt, és **mindkét** végpont azt használja – így nem kell kétszer megírni.
- Dátum formátum: `/^\d{4}-\d{2}-\d{2}$/.test(tol)`
- `ÉÉÉÉ-HH-NN` dátumokat szövegként is össze lehet hasonlítani: `m.datum >= tol`.
- Legkisebb elem: `Math.min(...tomb)` – ez a 0-t és a negatív számot is jól kezeli.

**⚠️ Gyakori hiba**
- **`if (minHo)`** vagy **`if (!min)`** – a 0 hamis! A `?minHo=0` szűrésnek működnie kell, és a statisztikában a 0 is lehet minimum.
- **`<` a `<=` helyett** a dátumoknál – az `ig=2026-03-01` napon mért adatnak is benne kell lennie.
- **Mindkét paramétert kötelezővé teszed** – a `?tol=` önmagában is működjön.

---

## 25. feladat – Állatkert ★★

**Mappa:** `feladatok/25-allatkert/`, adatok: `data/allatok.json` (10 állat).

Egy állat: `{ "id": 6, "nev": "Panni", "faj": "óriáspanda", "kontinens": "Ázsia", "szuletesiEv": 2012, "gondozo": "Szabó Ilona" }`

A kiinduló kódban a `GET /allatok/:id` már meg van írva – de **3 hiba** van benne, és rossz helyen is áll. Javítsd ki, és írd meg a többi végpontot!

| Metódus | Útvonal | Válasz típusa | Leírás |
|---|---|---|---|
| GET | `/allatok` | tömb | az összes állat |
| GET | `/allatok/nevek` | **szövegtömb** | a nevek magyar ábécérendben: `["Ági", "Bundi", …]` |
| GET | `/allatok/statisztika` | **objektum** | `{ "osszes": 10, "kontinensenkent": { "Afrika": 4, … }, "legidosebb": { …az állat… } }` |
| GET | `/allatok/faj/:faj` | tömb | részleges, kis- és nagybetű független keresés; nincs találat: **200 + `[]`** |
| GET | `/allatok/gondozo/:nev` | tömb | részleges, kis- és nagybetű független; nincs ilyen gondozó: **404** |
| GET | `/allatok/:id` | **objektum** | egy állat; nem létező: **404**; nem egész szám (`abc`, `2.5`): **400** |
| *bármi más* | | | **404** `{ "hiba": "Nincs ilyen végpont" }` |

Minden hibaválasz JSON: `{ "hiba": "..." }`.

**Gondolkodtató kérdések** (írd a válaszokat kommentként az `app.js` végére):

1. Mi történik, ha a `/allatok/:id` a `/allatok/nevek` **előtt** van? Próbáld ki!
2. Miért **nem** zavarja a `/allatok/:id` a `/allatok/faj/elefánt` kérést, akárhol is áll?
3. Miért ad az ismeretlen fajra 200 + `[]`-t, az ismeretlen gondozóra viszont 404-et?
4. Hová kell kerülnie a 404-es kezelőnek, és miért?

**Tippek**
- Egy elem: `find` → objektum vagy `undefined`. Több elem: `filter` → tömb (lehet üres).
- Egész szám-e: `Number.isInteger(Number(req.params.id))`
- Csoportosítás: `kontinensenkent[a.kontinens] = (kontinensenkent[a.kontinens] || 0) + 1;`
- 404-es kezelő a fájl végén, minden útvonal után: `app.use((req, res) => res.status(404).json({ ... }));`

**⚠️ Gyakori hiba**
- **`filter` egy elemre** → `[{...}]` jön vissza objektum helyett, és nem létező id-re `200 + []` a 404 helyett.
- **A `404` után hiányzó `return`** → „Cannot set headers after they are sent to the client” hiba a terminálon.
- **A `/:id` a fix útvonalak előtt** → elkapja a `/nevek` és `/statisztika` kéréseket.
- **Hiányzó `/` az útvonal elején** (`'allatok/nevek'`) → sosem illeszkedik.

---

## 26. feladat – Regisztráció ★★★

**Mappa:** `feladatok/26-regisztracio/`, adatok: `data/felhasznalok.json`.

Egy felhasználó: `{ "id": 2, "felhasznalonev": "Bence01", "email": "bence@pelda.hu", "kor": 18, "pontszam": 0, "hirlevel": false }`

**1. rész – a validáló függvény:** `utils/validal.js`

```js
validal(body, { reszleges })   // -> hibaüzenetek tömbje; üres tömb = minden rendben
```

| Mező | Szabály |
|---|---|
| `felhasznalonev` | szöveg; levágás (`trim`) után 3–20 karakter; csak betű, szám és `_` |
| `email` | szöveg, `valami@valami.valami` formátum |
| `kor` | **egész szám**, 14 és 99 között (mindkettő jó) |
| `pontszam` | **egész szám**, legalább 0 (**a 0 is jó!**) |
| `hirlevel` | `true` vagy `false` |
| *más mező* | hiba: „Ismeretlen mező: admin” |

- `reszleges: false` (POST): minden mező kötelező.
- `reszleges: true` (PATCH): csak a megadott mezőket ellenőrizd, de legalább egy mező legyen.
- **Ne állj meg az első hibánál!** Az összes hibát gyűjtsd össze.

A függvényt a szerver nélkül is tesztelheted: `npm run t26-fv`.

**2. rész – a szerver**

| Metódus | Útvonal | Siker | Hiba |
|---|---|---|---|
| GET | `/felhasznalok` | 200 | – |
| GET | `/felhasznalok/:id` | 200 | 404 |
| POST | `/felhasznalok` | **201 + az új felhasználó** | 400 `{ "hibak": [...] }`, **409** ha foglalt a név |
| PATCH | `/felhasznalok/:id` | 200 + a módosított felhasználó | 400, 404, 409 |

- A felhasználónév foglaltságánál a kis- és nagybetű nem számít (`KISS_ANNA` = `kiss_anna`).
- A felhasználónevet és az emailt **levágva** (`trim`) mentsd.
- A POST és a PATCH **ugyanazt** a `validal` függvényt használja.

**Ennek a 23 kérésnek kell átmennie** (`requests.http`, ugyanebben a sorrendben):

| # | Kérés | Várt |
|---|---|---|
| 1 | POST érvényes adattal | 201 + új felhasználó, id: 4 |
| 2 | POST `kor: 14` | 201 |
| 3 | POST `pontszam: 0` | 201 |
| 4 | POST `felhasznalonev: "  anna_01 "` | 201, `"anna_01"` néven mentve |
| 5 | POST `felhasznalonev: "    "` | 400 |
| 6 | POST `felhasznalonev: "ab"` | 400 |
| 7 | POST `email: "anna.gmail.com"` | 400 |
| 8 | POST `kor: "16"` (szöveg!) | 400 |
| 9 | POST `kor: 15.5` | 400 |
| 10 | POST `kor: 13` | 400 |
| 11 | POST `kor: 100` | 400 |
| 12 | POST `pontszam: -1` | 400 |
| 13 | POST `hirlevel: "igen"` | 400 |
| 14 | POST email nélkül | 400 |
| 15 | POST `admin: true` mezővel | 400 |
| 16 | POST minden mező rossz | 400, legalább 5 hibaüzenet |
| 17 | POST `felhasznalonev: "KISS_ANNA"` | 409 |
| 18 | PATCH `/2` `{ "kor": 30 }` | 200, a többi mező változatlan |
| 19 | PATCH `/2` `{}` | 400 |
| 20 | PATCH `/2` `{ "email": "" }` | 400 |
| 21 | PATCH `/1` `{ "pontszam": 0 }` | 200 |
| 22 | PATCH `/2` `{ "felhasznalonev": "DORI" }` | 409 |
| 23 | PATCH `/99` | 404 |

**Tippek**
- Egész szám-e: `Number.isInteger(x)` – a `"16"` szövegre és a `15.5`-re is hamis.
- Szöveg-e és nem üres: `typeof s === 'string' && s.trim() !== ''`
- Minta (reguláris kifejezés): `/^[a-zA-Z0-9_]{3,20}$/.test(nev.trim())`
- Ismeretlen mezők: `Object.keys(body).filter((k) => !MEZOK.includes(k))`

**⚠️ Gyakori hiba**
- **`if (!pontszam)`** – a 0 pontszám érvényes, mégis hibának veszi.
- **Csak létezést ellenőrzöl** (`if (kor)`) – így a `"16"` szöveg és a `-5` is átmegy.
- **`trim` nélkül** – a csupa szóközből álló név nem üres szöveg.
- **A PATCH-ben nincs ellenőrzés** – a részleges módosításnál is ugyanazok a szabályok érvényesek.
- **Ismeretlen mezőket is elmentesz** – a `{ ...req.body }` mindent átvesz, az `admin: true`-t is!

---

## 27. feladat – Jegyzetek CRUD ★★★

**Mappa:** `feladatok/27-jegyzetek/`, adatok: `data/jegyzetek.json`.

Egy jegyzet: `{ "id": 2, "cim": "Matek dolgozat", "szoveg": "…", "fontos": true, "letrehozva": "2026-09-29T07:45:00.000Z" }`

Ebben a feladatban a hangsúly azon van, hogy **pontosan** mit és milyen státuszkóddal ad vissza a szerver. A `requests.http` minden kérés fölé odaírja a várt választ.

| Metódus | Útvonal | Siker | Mit ad vissza? | Hiba |
|---|---|---|---|---|
| GET | `/jegyzetek` | 200 | tömb; szűrő: `?fontos=true` / `?fontos=false` | 400, ha a `fontos` más |
| GET | `/jegyzetek/:id` | 200 | **objektum** | 404 |
| POST | `/jegyzetek` | **201** | **az új jegyzet objektuma** (id-vel, letrehozva-val) | 400 |
| PUT | `/jegyzetek/:id` | 200 | a módosított jegyzet | 400, 404 |
| PATCH | `/jegyzetek/:id` | 200 | a módosított jegyzet | 400, 404 |
| DELETE | `/jegyzetek/:id` | **204** | **semmit** (üres törzs) | 404 |

**Szabályok**
- `cim`: nem üres szöveg, legfeljebb 50 karakter; `szoveg`: szöveg (**lehet üres**); `fontos`: `true` / `false`.
- POST és PUT: minden mező kötelező. PATCH: csak a megadottak, de legalább egy ismert mező kell.
- Az **`id`-t és a `letrehozva`-t mindig a szerver adja**. Ha a kliens küld `id`-t, azt figyelmen kívül hagyod.
- A `letrehozva` értéke: `new Date().toISOString()`. PUT-nál és PATCH-nél **nem változik**.
- Ismeretlen mezőt (pl. `"szin": "piros"`) **nem mentesz el**.
- Az új id: **a legnagyobb id + 1**. Nézd meg az adatokat: melyik id hiányzik? Mi lenne, ha `length + 1`-et használnál?

**Tippek**
- `res.status(201).json(uj)` – nem `res.send('Sikeres mentés')`!
- `res.sendStatus(204)` vagy `res.status(204).end()` – a 204-hez **nem** tartozik törzs.
- A query paraméter mindig **szöveg**: `req.query.fontos === 'true'`, és nem `=== true`.
- Csak az ismert mezők átvétele: `for (const m of ['cim', 'szoveg', 'fontos']) if (body[m] !== undefined) adat[m] = body[m];`

**⚠️ Gyakori hiba**
- **Szöveges válasz a POST-ra** („Sikeres mentés”) – a kliens így nem tudja meg az új jegyzet id-jét.
- **`length + 1`** – törlés után már létező id-t ad ki, és két jegyzet kap ugyanolyan id-t.
- **PUT-nál elveszik az `id` vagy a `letrehozva`** – mert a teljes `req.body` kerül a régi helyére.
- **`res.status(204).json({ uzenet: 'Törölve' })`** – a 204 jelentése „nincs tartalom”.

---

## 28. feladat – Javítsd ki! ★★

**Mappa:** `feladatok/28-javitsd/`, adatok: `data/termekek.json` (8 sportszer).

A kapott `app.js` elindul, de **15 hibát** tartalmaz. Mindegyiket korábbi dolgozatokban követték el. Keresd meg és javítsd ki mindet, és töltsd ki a `HIBALISTA.md` táblázatát: hol volt a hiba, mit okozott, hogyan javítottad.

A kijavított szerver tudja ezeket:

| Metódus | Útvonal | Leírás |
|---|---|---|
| GET | `/termekek` | összes termék; szűrők: `?kategoria=` és `?maxAr=` (**legfeljebb**, a határ is benne), kombinálhatók |
| GET | `/termekek/raktaron` | a készleten lévők (`keszlet > 0`) |
| GET | `/termekek/kereses/:nev` | részleges, kis- és nagybetű független keresés |
| GET | `/termekek/:id` | egy termék / 404 |
| POST | `/termekek` | **201 + az új termék** / 400 |
| PUT | `/termekek/:id` | 200 + a módosított termék / 400 / 404 (**ezt neked kell megírnod**) |
| DELETE | `/termekek/:id` | 204 / 404 |
| *bármi más* | | 404 + JSON |

**Ellenőrzés** (POST, PUT): `nev`, `kategoria` nem üres szöveg; `ar` pozitív szám; `keszlet` nemnegatív **egész** (a 0 is jó!).

**Hogyan keress hibát?**
1. Indítsd el a szervert (`npm run f28`), és futtasd a `requests.http` kéréseit **egyenként**.
2. **Figyeld a terminált!** A `TypeError`, `ReferenceError`, „Cannot set headers…” üzenet megmondja a hiba helyét (fájl és sor).
3. Ha egy kérés „nem jön vissza”, valahol hiányzik a válasz (`res.json`, `res.send`…).
4. Ha nem azt kapod, amit vársz, írj ki a konzolra köztes értékeket: `console.log(typeof req.params.id, req.params.id);`
5. A végén: `npm run t28` – 20 / 20 pont a cél.

---

## Szorgalmi feladatok

- **H.** A 23. feladatban: `?mezok=nev,atlag` paraméter, ami csak a felsorolt mezőket adja vissza (`[{ "nev": …, "atlag": … }, …]`). Ismeretlen mezőnévre 400.
- **I.** A 24. feladatban: `GET /meresek/havi?varos=budapest` – havonkénti csoportosítás: `{ "2026-01": { "db": 2, "atlag": -1.5 }, … }`.
- **J.** A 26. feladatban: a hibaüzenetek legyenek mezőnként csoportosítva: `{ "hibak": { "kor": ["..."], "email": ["..."] } }`.
- **K.** A 27. feladatban: `?kereses=` szűrő, ami a címben **és** a szövegben is keres (kisbetű-nagybetű függetlenül), és `?rendez=letrehozva` (legújabb elöl).
- **L.** Írj saját tesztesetet a `tesztek/esetek/27.js` mintájára a 12. feladat (Teendőlista) végpontjaihoz!
