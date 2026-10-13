# 6–7. feladat – Filmadatbázis és filmstatisztika ★★ / ★★★

**Indítás:** `npm run f06` · **Mintapélda:** `03-json-get` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md)
**Adatbázisos változat:** [`06-07-filmek_mysql`](../06-07-filmek_mysql/README.md)

## Mit mutat be a feladat?

- Adatok beolvasása **JSON fájlból**, és JSON válasz küldése (`res.json`).
- A tömbmetódusok: `find` (egy elem), `filter` (szűrés), `sort` (rendezés), `map` (átalakítás), `reduce` (összesítés), `slice` (első n elem).
- **Kombinálható szűrők** query paraméterekkel (`?mufaj=sci-fi&rendez=ev`).
- Az **útvonalak sorrendje** az Expressben: a fix útvonalnak (`/filmek/cimek`) a paraméteres (`/filmek/:id`) **előtt** kell lennie.
- A 7. feladat: **statisztika** számolása (átlag, összeg, maximum, csoportosítás, egyedi értékek `Set`-tel).

## Mire figyelj a megoldás során?

### 6. feladat

- **A szűrők kombinálhatók**: egymás alatti `if`-ek kellenek, nem `else if`, és ne térj vissza az első szűrő után.
- **A `sort()` helyben rendez**, vagyis az eredeti tömböt is átrendezi! Ha nem készítesz másolatot (`[...filmek]`), a következő kérés már a rendezett adatot kapja.
- A query paraméterek **szövegek**: a `min=8.5`-öt és az évszámokat `Number()`-rel alakítsd át, különben szövegeket hasonlítasz össze.
- A határok **benne vannak**: `min=8.5` esetén a 8,5-ös film is jöjjön (`>=`). A `tol` és az `ig` közül bármelyik elhagyható.
- Magyar ábécérend: `localeCompare(..., 'hu')`. A sima `<` vagy `sort()` az ékezetes betűket a végére teszi.
- A rendezőkeresés **részleges és kisbetű-nagybetű független**: mindkét oldalt kisbetűsíteni kell.
- A `req.params.id` szöveg, a JSON-ban az `id` szám: `"5" === 5` hamis.
- Nem létező id esetén **404** és JSON hibaüzenet; ne `null`-t vagy üres választ küldj.
- **Próbáld ki** mindkét útvonal-sorrendet a `/filmek/cimek`-nél, és figyeld meg, mi történik!

### 7. feladat

- A `reduce`-nak adj **kezdőértéket** (`0`), különben az első film objektumából indul az összeadás.
- Az átlagot két tizedesre kerekítsd (`8.26`), de **számként** add vissza, ne szövegként.
- A `leghosszabb` és a `legregebbi` mező a film **címe**, nem a teljes objektum.
- A `/mufajok` egyedi és ábécérendbe rendezett; a `/mufajok/darab` objektum, kulcsonként a darabszámmal.
- A `/top/:n` hibás `n`-re (nem szám, 0, negatív, tört) 400-at adjon. A válaszban csak a `cim` és az `ertekeles` szerepeljen.
- Az évtizedet a megadott évből számold ki (`1995` → `1990-1999`).

## Ellenőrizd

- [ ] A `/filmek?mufaj=sci-fi&rendez=ev` pontosan a leírásban szereplő három filmet adja.
- [ ] Rendezett lekérés után a sima `/filmek` még mindig az eredeti sorrendet adja.
- [ ] A statisztika számai egyeznek a leírásban szereplőkkel.
