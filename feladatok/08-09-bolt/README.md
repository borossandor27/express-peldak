# 8–9. feladat – Papírbolt CRUD és bővítés ★★★

**Indítás:** `npm run f08` · **Mintapélda:** `04-crud` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md) · **Teszteléshez:** `requests.http`
**Adatbázisos változat:** [`08-09-bolt_mysql`](../08-09-bolt_mysql/README.md)

## Mit mutat be a feladat?

- A teljes **CRUD**: GET, POST, PUT, PATCH, DELETE egy erőforráson.
- A kérés **törzsének** feldolgozása (`express.json()` → `req.body`).
- A helyes **státuszkódok**: 200, **201 Created**, **204 No Content**, 400, 404.
- **Adatellenőrzés (validáció)**, az összes hiba összegyűjtése egyszerre.
- A PUT (teljes csere) és a PATCH (részleges módosítás) különbsége.
- A 9. feladat: speciális végpontok és az **útvonal-sorrend** a gyakorlatban.

## Mire figyelj a megoldás során?

### 8. feladat

- **Készíts másolatot a `data` mappáról**, mert a szerver a fájlba ment.
- Az `app.use(express.json())` nélkül a `req.body` értéke `undefined`.
- **Minden változás után** hívd meg a `mentes()` függvényt, különben újraindításkor elveszik a módosítás.
- **Az `id`-t mindig a szerver adja**, és az a *legnagyobb id + 1*, nem a `length + 1` (törlés után ütközne).
- A POST válasza **201 + az új termék** (id-vel együtt), nem egy „Sikeres mentés” szöveg.
- A DELETE válasza **204, üres törzzsel** (`res.sendStatus(204)`).
- Validáció: a `typeof` ellenőrzés miatt a `"390"` szöveg **nem** érvényes ár. A `keszlet` egész szám, és **a 0 is érvényes** – ezért ne `if (!keszlet)`-tel vizsgáld.
- **Az összes hibát** gyűjtsd egy tömbbe, ne állj meg az elsőnél.
- A PUT minden mezőt kér, és az `id` a régi marad; a PATCH csak a megadott mezőket ellenőrzi és cseréli.
- Hibánál `return`, különben a kód tovább fut és ment.

### 9. feladat

- A `/termekek/raktaron`, `/termekek/kereses` és `/termekek/osszertek` útvonalaknak a `/termekek/:id` **előtt** kell lenniük.
- A szűrők (`kategoria`, `maxAr`) kombinálhatók, a `maxAr` határa benne van.
- A `/kereses` `q` nélkül 400.
- A készletmódosításnál ésszerű sorrend: előbb a törzs ellenőrzése (400), aztán a termék keresése (404), végül a készlet vizsgálata (400). A hibaüzenet a **jelenlegi** készletet mutassa.

## Ellenőrizd

- [ ] A `requests.http` minden kérése a várt státuszkódot adja.
- [ ] Törlés, majd új termék felvétele után sincs két azonos id.
- [ ] Szerver-újraindítás után is megmaradnak a módosítások.
