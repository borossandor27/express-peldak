# Express.js gyakorló feladatok

**Általános tudnivalók**

- Minden feladathoz van egy kiinduló mappa, benne `TODO` megjegyzésekkel. Ezeket kell megvalósítanod.
- Indítás a projekt gyökeréből: `npm run f01`, `npm run f02`, … (a táblázatban látod, melyiket).
- A szerver a `http://localhost:3000` címen fut. Leállítás: `Ctrl + C`.
- GET kéréseket böngészőből is kipróbálhatsz. POST / PUT / PATCH / DELETE kéréshez használd a mappában lévő `requests.http` fájlt (VS Code **REST Client** bővítmény).
- Saját fájl importálásakor **mindig** írd ki a `.js` kiterjesztést!
- A 08–12. feladat **fájlba menti** az adatokat. Mielőtt elkezded, készíts másolatot a `data` mappáról, hogy vissza tudd állítani.

| # | Feladat | Téma | Nehézség | Indítás | Mintapélda |
|---|---|---|---|---|---|
| 1 | Névjegy szerver | GET, plain text, route paraméter | ★ | `npm run f01` | 01 |
| 2 | Számológép | route paraméterek, ellenőrzés, 400 | ★ | `npm run f02` | 01 |
| 3 | Átváltó | query string, alapértelmezett érték | ★★ | `npm run f03` | 01 |
| 4 | Geometria modulokkal | named / default export, `import * as` | ★★ | `npm run f04` | 02 |
| 5 | Szövegeszközök | export lista, `as` átnevezés, default export | ★★ | `npm run f05` | 02 |
| 6 | Filmadatbázis | JSON, `find`, `filter`, `sort`, 404 | ★★ | `npm run f06` | 03 |
| 7 | Filmstatisztika | `map`, `reduce`, `Set`, `slice` | ★★★ | `npm run f06` | 03 |
| 8 | Papírbolt CRUD | POST, PUT, PATCH, DELETE, ellenőrzés | ★★★ | `npm run f08` | 04 |
| 9 | Papírbolt bővítés | útvonal-sorrend, speciális végpontok | ★★★ | `npm run f08` | 04 |
| 10 | Könyvtár routerekkel | `express.Router`, több JSON, middleware | ★★★ | `npm run f10` | 05 |
| 11 | Kölcsönzések | kapcsolat JSON-ok között, 409 | ★★★★ | `npm run f10` | 05 |
| 12 | Teendőlista API | önálló projekt | ★★★★ | `npm run f12` | 04, 05 |

---

## 1. feladat – Névjegy szerver ★

**Mappa:** `feladatok/01-nevjegy/app.js`

Készíts egy szervert, amely rólad ad vissza információkat **sima szövegként**. A fájl elején lévő konstansokat írd át a saját adataidra.

| Végpont | Válasz |
|---|---|
| `GET /` | `Üdvözöllek a névjegy oldalamon!` |
| `GET /nev` | `A nevem: Minta Máté` |
| `GET /osztaly` | `Osztályom: 10.A` |
| `GET /eletkor` | `16 éves vagyok (vagy leszek idén).` – **számold ki** az aktuális évből! |
| `GET /hobbik` | Számozott lista, soronként egy hobbi (lásd lent) |
| `GET /hobbik/2` | `programozás` |
| `GET /hobbik/9` | **404** – `Nincs 9. hobbim.` |
| bármi más | **404** – `Hoppá! A(z) /xyz oldal nem létezik.` |

```
Hobbijaim:
1. foci
2. programozás
3. gitár
```

**Tippek**
- Az aktuális év: `new Date().getFullYear()`
- A sortörés csak akkor látszik a böngészőben, ha `res.type('text/plain')`-t használsz.
- A számozott listához: `HOBBIK.map((h, i) => ...).join('\n')`

---

## 2. feladat – Számológép ★

**Mappa:** `feladatok/02-szamologep/app.js`

Minden végpont a számokat **útvonal-paraméterként** kapja. Hibás bemenetnél **400**-as státuszkóddal és hibaüzenettel válaszolj.

| Végpont | Helyes válasz | Hibás bemenet (400) |
|---|---|---|
| `GET /hatvany/2/10` | `2 a(z) 10. hatványon = 1024` | `/hatvany/a/2` |
| `GET /paros/7` | `A(z) 7 páratlan.` | `/paros/2.5` (nem egész) |
| `GET /nagyobb/3/8` | `A nagyobb szám: 8` | – |
| `GET /nagyobb/4/4` | `A két szám egyenlő.` | – |
| `GET /faktorialis/5` | `5! = 120` | `/faktorialis/25` (csak 0–20) |
| `GET /osztok/12` | `12 osztói: 1, 2, 3, 4, 6, 12` | `/osztok/0` |
| `GET /osztok/13` | `13 osztói: 1, 13 (prímszám)` | |

**Tippek**
- `req.params` értékei **mindig szövegek**, ezért használd a `Number(...)` függvényt.
- Egész szám ellenőrzése: `Number.isInteger(n)`. Nem szám ellenőrzése: `isNaN(n)`.
- A `return res.status(400).send(...)` után a függvény további része már nem fut le.

---

## 3. feladat – Átváltó ★★

**Mappa:** `feladatok/03-atvalto/app.js`

Most a bemenet **query stringben** érkezik (`?kulcs=ertek&kulcs2=ertek2`).

**a) Hőmérséklet:** `GET /homerseklet?c=...` vagy `GET /homerseklet?f=...`

| Kérés | Válasz |
|---|---|
| `/homerseklet?c=25` | `25 °C = 77.0 °F` |
| `/homerseklet?f=77` | `77 °F = 25.0 °C` |
| `/homerseklet` | **400** – `Használat: /homerseklet?c=25 vagy /homerseklet?f=77` |

Képletek: `F = C · 9/5 + 32`, `C = (F − 32) · 5/9`

**b) Pénzváltó:** `GET /penz?forint=...&valuta=...`. A `valuta` **elhagyható**, ilyenkor `eur`. Kis- és nagybetűvel is működjön.

| Kérés | Válasz |
|---|---|
| `/penz?forint=10000` | `10000 Ft = 25.00 EUR` |
| `/penz?forint=3600&valuta=USD` | `3600 Ft = 10.00 USD` |
| `/penz?forint=100&valuta=jpy` | **400** – `Ismeretlen valuta. Választható: eur, usd, gbp` |
| `/penz?forint=-5` | **400** |

**c) BMI:** `GET /bmi?suly=70&magassag=175` (kg, cm) → `BMI: 22.9 (normál)`

`BMI = súly / (magasság méterben)²`. Kategóriák: < 18,5 *sovány*, < 25 *normál*, < 30 *túlsúlyos*, egyébként *elhízott*. Ha valamelyik paraméter hiányzik: **400**.

**Tippek**
- Alapértelmezett érték: `const valuta = req.query.valuta || 'eur';`
- Két tizedesjegy: `szam.toFixed(2)`
- Létezik-e a kulcs az objektumban: `valuta in ARFOLYAMOK`

---

## 4. feladat – Geometria modulokkal ★★

**Mappa:** `feladatok/04-geometria/`

A számolás **külön modulokban** legyen, az `app.js` csak importál és válaszol.

**Modulok elkészítése:**

| Fájl | Mit exportál | Export módja |
|---|---|---|
| `utils/sikidomok.js` | `teglalapTerulet(a,b)`, `teglalapKerulet(a,b)`, `korTerulet(r)`, `korKerulet(r)`, `haromszogTerulet(a,m)` | named export (`export function ...`) |
| `utils/kocka.js` | `kockaTerfogat(a)` | **default** export |
| `utils/kocka.js` | `kockaFelszin(a)` | named export (ugyanabban a fájlban) |
| `utils/ellenorzes.js` | `pozitivSzamok(...ertekek)`: igaz, ha minden érték pozitív szám | named export |

**Importálás az `app.js`-ben (kötelező formák):**
1. A síkidomokat `import * as sikidom from ...` formában.
2. A kocka default exportját `terfogat` néven, a `kockaFelszin`-t **ugyanabban a sorban**.
3. A `pozitivSzamok` függvényt `ervenyes` néven (átnevezés `as`-szal).

**Végpontok:**

| Végpont | Válasz |
|---|---|
| `GET /teglalap/3/4` | `Téglalap (3 x 4): T = 12, K = 14` |
| `GET /kor/2` | `Kör (r = 2): T = 12.57, K = 12.57` |
| `GET /haromszog/6/4` | `Háromszög (a = 6, m = 4): T = 12` |
| `GET /kocka/3` | `Kocka (a = 3): V = 27, A = 54` |
| `GET /kocka/-1` | **400** – `Hiba: csak pozitív számokat adhatsz meg!` |
| `GET /fuggvenyek` | `A sikidomok modul függvényei: haromszogTerulet, korKerulet, ...` |

**Tippek**
- A rest paraméter (`...ertekek`) tömbként kapja meg az összes argumentumot, így ellenőrizhető: `ertekek.every(e => ...)`
- A `/fuggvenyek` végponthoz: `Object.keys(sikidom)`

---

## 5. feladat – Szövegeszközök ★★

**Mappa:** `feladatok/05-szovegek/`

**`utils/szovegEszkozok.js`**: írd meg a négy függvényt `export` kulcsszó **nélkül**, majd a fájl végén **egyetlen export listában** exportáld őket. A `szokezdoNagybetu` függvényt `cimFormatum` néven exportáld!

| Függvény | Példa |
|---|---|
| `palindrom(s)` | `"Géza kék az ég"` → `true` (a kis- és nagybetű, valamint a szóköz nem számít) |
| `szavakSzama(s)` | `"  Ma   szép idő van "` → `4` (a több szóköz se zavarja!) |
| `szokezdoNagybetu(s)` | `"a kőSZÍVŰ ember fiai"` → `"A Kőszívű Ember Fiai"` |
| `betuGyakorisag(s)` | `"Anna"` → `{ "a": 2, "n": 2 }` |

**`utils/jelszo.js`**: **default exportként** egy `jelszoErosseg(jelszo)` függvény. Öt szabály, mindegyik 1 pont: legalább 8 karakter; van kisbetű; van nagybetű; van számjegy; van különleges karakter. 0–2 pont: *gyenge*, 3–4: *közepes*, 5: *erős*.

**Importálás az `app.js`-ben:** a `szavakSzama`-t `szamol` néven, a `betuGyakorisag`-ot pedig `import * as eszkozok` formában használd.

| Végpont | Válasz |
|---|---|
| `GET /palindrom?szoveg=Géza kék az ég` | `"Géza kék az ég" palindrom.` |
| `GET /palindrom?szoveg=alma` | `"alma" nem palindrom.` |
| `GET /palindrom` | **400** – `Hiányzik a ?szoveg= paraméter!` |
| `GET /szavak?szoveg=Ma szép idő van` | `A szövegben 4 szó van.` |
| `GET /cim?szoveg=a kőszívű ember fiai` | `A Kőszívű Ember Fiai` |
| `GET /gyakorisag?szoveg=Anna` | `{"a":2,"n":2}` (JSON) |
| `GET /jelszo/Alma1234` | JSON, lásd lent |

```json
{
  "pont": 4,
  "szint": "közepes",
  "szabalyok": {
    "legalabb8Karakter": true,
    "vanKisbetu": true,
    "vanNagybetu": true,
    "vanSzamjegy": true,
    "vanKulonlegesKarakter": false
  }
}
```

**Tippek**
- Megfordítás: `s.split('').reverse().join('')`
- Minden szóköz törlése: `s.replaceAll(' ', '')`
- Üres elemek kiszűrése: `.filter(sz => sz !== '')`
- Hány `true` érték van egy objektumban: `Object.values(obj).filter(v => v).length`

---

## 6. feladat – Filmadatbázis ★★

**Mappa:** `feladatok/06-07-filmek/`, adatok: `data/filmek.json` (12 film)

Egy film így néz ki:
```json
{ "id": 5, "cim": "Macskafogó", "rendezo": "Ternovszky Béla", "ev": 1986, "mufaj": "animáció", "ertekeles": 8.4, "hossz": 96 }
```

Minden válasz **JSON** legyen (`res.json`).

| Végpont | Leírás |
|---|---|
| `GET /filmek` | az összes film |
| `GET /filmek?mufaj=sci-fi` | szűrés műfajra |
| `GET /filmek?min=8.5` | legalább ilyen értékelésű filmek |
| `GET /filmek?tol=1990&ig=1999` | megjelenési év szerinti szűrés (bármelyik elhagyható) |
| `GET /filmek?rendez=ev` | rendezés: `cim` (ábécé), `ev` (növekvő), `ertekeles` (csökkenő) |
| `GET /filmek/cimek` | csak a címek tömbje |
| `GET /filmek/rendezo/nolan` | rendezőre keresés, **részleges és kisbetű-nagybetű független** |
| `GET /filmek/5` | egy film |
| `GET /filmek/99` | **404** – `{"hiba":"Nincs ilyen film"}` |

A szűrők **kombinálhatók**: `/filmek?mufaj=sci-fi&rendez=ev` → Mátrix (1999), Eredet (2010), Csillagok között (2014).

**Tippek**
- Rendezés előtt készíts másolatot: `let eredmeny = [...filmek];`
- Magyar ábécérend: `a.cim.localeCompare(b.cim, 'hu')`
- ⚠️ **Útvonal-sorrend:** ha a `/filmek/:id` a `/filmek/cimek` **előtt** van, akkor a `cimek` szót id-nak veszi! Próbáld ki mindkét sorrendet!

---

## 7. feladat – Filmstatisztika ★★★

**Mappa:** ugyanaz, mint a 6. feladaté, abban folytasd.

| Végpont | Válasz |
|---|---|
| `GET /statisztika` | `{"darab":12,"atlagErtekeles":8.26,"osszesPerc":1322,"leghosszabb":"A Keresztapa","legregebbi":"Hyppolit, a lakáj"}` |
| `GET /mufajok` | `["animáció","dráma","sci-fi","thriller","vígjáték"]` (egyedi, ábécérendben) |
| `GET /mufajok/darab` | `{"vígjáték":3,"thriller":1,"dráma":3,"animáció":2,"sci-fi":3}` |
| `GET /top/3` | `[{"cim":"A Keresztapa","ertekeles":9.2},{"cim":"Eredet","ertekeles":8.8},{"cim":"Mátrix","ertekeles":8.7}]` |
| `GET /top/x` | **400** |
| `GET /evtized/1995` | `{"evtized":"1990-1999","darab":3,"filmek":[...]}` |

**Tippek**
- Összeg: `filmek.reduce((s, f) => s + f.ertekeles, 0)`
- Legnagyobb elem: `filmek.reduce((max, f) => f.hossz > max.hossz ? f : max)`
- Egyedi értékek: `[...new Set(tomb)]`
- Az első n elem: `.slice(0, n)`
- Évtized kezdete: `Math.floor(ev / 10) * 10`

---

## 8. feladat – Papírbolt CRUD ★★★

**Mappa:** `feladatok/08-09-bolt/`, adatok: `data/termekek.json`. Teszteléshez: `requests.http`.

Egy termék:
```json
{ "id": 1, "nev": "Füzet A4 vonalas", "kategoria": "papíráru", "ar": 390, "keszlet": 120 }
```

Készítsd el a teljes CRUD-ot. Minden változás után **mentsd** a fájlt (a `mentes()` függvény kész).

| Metódus | Útvonal | Siker | Hiba |
|---|---|---|---|
| GET | `/termekek` | 200 | – |
| GET | `/termekek/:id` | 200 | 404 |
| POST | `/termekek` | **201** + az új termék | 400 |
| PUT | `/termekek/:id` | 200 + a módosított termék | 400, 404 |
| PATCH | `/termekek/:id` | 200 + a módosított termék | 400, 404 |
| DELETE | `/termekek/:id` | **204** (üres válasz) | 404 |

**Ellenőrzési szabályok** (POST és PUT: minden mező kötelező; PATCH: csak a megadott mezőket ellenőrizd):
- `nev`, `kategoria`: nem üres szöveg
- `ar`: pozitív szám
- `keszlet`: nemnegatív **egész** szám

Hibás adatnál az **összes** hibát add vissza egyszerre:
```json
{ "hibak": ["A nev kötelező, nem üres szöveg.", "A kategoria kötelező, nem üres szöveg.", "Az ar pozitív szám legyen.", "A keszlet nemnegatív egész szám legyen."] }
```

**Tippek**
- `app.use(express.json())` nélkül a `req.body` értéke `undefined`!
- Az `id`-t mindig a szerver adja: legnagyobb id + 1.
- Típus ellenőrzése: `typeof adat.ar !== 'number'`

---

## 9. feladat – Papírbolt bővítés ★★★

**Mappa:** ugyanaz, mint a 8. feladaté, abban folytasd.

| Végpont | Leírás |
|---|---|
| `GET /termekek?kategoria=íróeszköz&maxAr=200` | szűrés kategóriára és maximális árra |
| `GET /termekek/raktaron` | csak azok, amelyekből van készleten (`keszlet > 0`) |
| `GET /termekek/kereses?q=füzet` | névben keresés (részleges, kisbetű-nagybetű független); `q` nélkül **400** |
| `GET /termekek/osszertek` | `{"osszertek": ...}`, azaz Σ ár × készlet |
| `GET /kategoriak` | `{"papíráru":2,"íróeszköz":3,"táska":2,"elektronika":1}` |
| `PATCH /termekek/:id/keszlet` | törzs: `{"valtozas": -5}` → a készlet ennyivel változik |

A `PATCH /termekek/:id/keszlet` szabályai:
- `valtozas` nem egész szám → **400**
- a készlet negatív lenne → **400** – `{"hiba":"Nincs elég készlet (jelenleg 10 db)"}`
- nincs ilyen termék → **404**

⚠️ **Gondold végig:** mi történik, ha a `/termekek/:id` útvonal a `/termekek/raktaron` előtt van? Hová kell tenni az új végpontokat?

---

## 10. feladat – Iskolai könyvtár routerekkel ★★★

**Mappa:** `feladatok/10-11-konyvtar/`

```
10-11-konyvtar/
├── app.js
├── routes/
│   ├── konyvek.js
│   ├── olvasok.js
│   └── kolcsonzesek.js   (11. feladat)
├── utils/
│   └── jsonDb.js         (KÉSZ: olvas, ment, kovetkezoId)
└── data/
    ├── konyvek.json
    ├── olvasok.json
    └── kolcsonzesek.json
```

**`app.js`**
- `express.json()` middleware
- **saját naplózó middleware**, ami minden kérésnél kiírja a konzolra az időt, a metódust és az útvonalat (pl. `10:15:32 GET /konyvek`)
- `GET /` → `{"uzenet":"Könyvtár API","vegpontok":["/konyvek","/olvasok","/kolcsonzesek"]}`
- routerek csatolása: `app.use('/konyvek', konyvekRouter)` stb.
- 404-es kezelő és **hibakezelő** middleware (4 paraméter!) → 500

**`routes/konyvek.js`**: GET (lista, `?szerzo=` részleges kereséssel), GET `/:id`, POST, PUT, DELETE
- `cim`, `szerzo`: nem üres szöveg; `ev`: egész szám, **nem lehet jövőbeli**

**`routes/olvasok.js`**: GET (lista), GET `/:id`, POST, PATCH, DELETE
- `nev`: nem üres; `email`: tartalmaz `@`-ot és pontot
- már létező e-mail cím esetén **409 Conflict**

**Tippek**
- A routerben az útvonalak **relatívak**: `router.get('/:id', ...)` valójában `/konyvek/:id`.
- A `jsonDb.js` függvényei `async`-ok, ezért használd az `await`-et: `const konyvek = await olvas('konyvek');`
- A route handler is legyen `async`: `router.get('/', async (req, res) => { ... })`

---

## 11. feladat – Kölcsönzések ★★★★

**Mappa:** ugyanaz, mint a 10. feladaté, abban folytasd.

Egy kölcsönzés: `{ "id": 2, "konyvId": 3, "olvasoId": 1, "datum": "2026-09-15", "visszahozva": false }`

**`routes/kolcsonzesek.js`** (csatold `/kolcsonzesek` útvonalra):

| Végpont | Leírás |
|---|---|
| `GET /kolcsonzesek` | minden kölcsönzés, **kiegészítve** a `konyvCim` és `olvasoNev` mezőkkel |
| `GET /kolcsonzesek?aktiv=true` | csak a vissza nem hozottak |
| `POST /kolcsonzesek` | törzs: `{"konyvId":1,"olvasoId":2}` → **201** |
| `PATCH /kolcsonzesek/:id/visszahoz` | `visszahozva: true` és `visszahozasDatum` beállítása |

A `POST` szabályai:
- hiányzó vagy nem egész `konyvId` / `olvasoId` → **400**
- nem létező könyv vagy olvasó → **404**
- a könyv már ki van kölcsönözve (van rá `visszahozva: false` kölcsönzés) → **409**
- az új kölcsönzés `datum` mezője a mai nap, `visszahozva` értéke `false`

Már visszahozott kölcsönzés újbóli visszahozása → **409**.

**Bővítsd a többi routert is:**
- `GET /konyvek/elerheto` → a jelenleg **nem** kikölcsönzött könyvek
- `GET /olvasok/1/kolcsonzesek` → `{"olvaso":"Kiss Anna","kolcsonzesek":[ ... a könyv címével ... ]}`
- **Szorgalmi:** kikölcsönzött könyv nem törölhető → `DELETE /konyvek/5` → **409**

**Tippek**
- Kiegészítés spread operátorral: `kolcsonzesek.map(k => ({ ...k, konyvCim: ... }))`
- Keresés másik tömbben: `konyvek.find(kv => kv.id === k.konyvId)?.cim`
- Van-e ilyen elem: `tomb.some(e => ...)`

---

## 12. feladat – Teendőlista API (önálló projekt) ★★★★

**Mappa:** `feladatok/12-teendok/`. Csak az adatfájl és egy üres `app.js` van meg. A **mappaszerkezetet is neked kell kialakítanod** (`routes/teendok.js`, `utils/jsonDb.js`).

Egy teendő:
```json
{ "id": 1, "cim": "Matek házi: 45. oldal", "prioritas": "magas", "hatarido": "2026-09-25", "kesz": false }
```

| Metódus | Útvonal | Leírás |
|---|---|---|
| GET | `/teendok` | lista; szűrők: `?kesz=true/false`, `?prioritas=magas`; rendezés: `?rendez=hatarido` |
| GET | `/teendok/lejart` | nem kész és a határidő már elmúlt (a mai naphoz képest) |
| GET | `/teendok/statisztika` | `{"osszes":5,"kesz":2,"hatralevo":3,"szazalek":40}` |
| GET | `/teendok/:id` | egy teendő / 404 |
| POST | `/teendok` | új teendő → 201 |
| PUT | `/teendok/:id` | teljes módosítás |
| PATCH | `/teendok/:id/kesz` | a `kesz` érték **megfordítása** (true ↔ false) |
| DELETE | `/teendok/:id` | törlés → 204 / 404 |
| DELETE | `/teendok/keszek` | az összes kész teendő törlése → `{"torolve": 2}` |

**Ellenőrzés (POST, PUT):**
- `cim`: kötelező, nem üres szöveg
- `prioritas`: elhagyható (ekkor `"közepes"`), de ha megadják, csak `alacsony`, `közepes` vagy `magas` lehet
- `hatarido`: elhagyható (ekkor `null`), de ha megadják, `ÉÉÉÉ-HH-NN` formátumú legyen
- új teendőnél a `kesz` mindig `false`

**Egyéb elvárások:**
- router használata (`/teendok` előtaggal)
- naplózó middleware, ami a **válasz státuszkódját** is kiírja (pl. `POST /teendok -> 201 (4 ms)`)
- 404-es kezelő és hibakezelő middleware

**Tippek**
- Mai dátum `ÉÉÉÉ-HH-NN` formában: `new Date().toISOString().slice(0, 10)`
- Az ilyen formátumú dátumok **szövegként** is összehasonlíthatók és rendezhetők: `'2026-09-25' < '2026-10-01'`
- Formátum ellenőrzése reguláris kifejezéssel: `/^\d{4}-\d{2}-\d{2}$/.test(hatarido)`
- A státuszkód a válasz elküldése után ismert: `res.on('finish', () => console.log(res.statusCode))`

---

## Szorgalmi feladatok

- **A.** A mintapéldák közül az `05-routing/routes/tantargyak.js` routert egészítsd ki POST, PUT, PATCH és DELETE végpontokkal. POST-nál ellenőrizd, hogy a `tanarId` létező tanárra mutat-e!
- **B.** A 10–11. feladatban készíts `GET /statisztika` végpontot: melyik a legtöbbször kikölcsönzött könyv, és melyik olvasó kölcsönzött a legtöbbet?
- **C.** A 12. feladatban adj lehetőséget lapozásra: `GET /teendok?oldal=2&db=2`.
