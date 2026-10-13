# 10–11. feladat – Iskolai könyvtár routerekkel, kölcsönzések ★★★ / ★★★★

**Indítás:** `npm run f10` · **Mintapélda:** `05-routing` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md) · **Teszteléshez:** `requests.http`
**Adatbázisos változat:** [`10-11-konyvtar_mysql`](../10-11-konyvtar_mysql/README.md)

## Mit mutat be a feladat?

- Nagyobb alkalmazás **szétbontása routerekre** (`express.Router`), erőforrásonként külön fájlba.
- **Middleware-ek**: saját naplózó middleware, 404-es kezelő, **hibakezelő** (4 paraméteres) middleware.
- **Aszinkron** fájlkezelés (`async` / `await`) a kész `jsonDb.js` modullal.
- A 11. feladat: **kapcsolat több adathalmaz között** (kölcsönzés → könyv, olvasó), az adatok összekapcsolása, és a **409 Conflict** státuszkód.

## Mire figyelj a megoldás során?

### 10. feladat

- A routerben az útvonalak **relatívak**: a `router.get('/:id', ...)` a csatolás után a `/konyvek/:id` lesz. Ne írd bele még egyszer a `/konyvek`-et!
- A router fájl végén ne felejtsd el az `export default router;` sort, az `app.js`-ben az importot pedig `.js` kiterjesztéssel írd.
- A naplózó middleware végén **`next()`** kell, különben minden kérés „beragad”.
- A middleware-ek **sorrendje** számít: `express.json()` és a naplózó elöl, a routerek középen, a 404-es és a hibakezelő a végén.
- A hibakezelőnek **pontosan 4 paramétere** legyen (`err, req, res, next`), csak így ismeri fel az Express.
- A `jsonDb.js` függvényei `async`-ok: `await` nélkül egy `Promise`-t kapsz tömb helyett. A route handler is legyen `async`.
- Az év **nem lehet jövőbeli** – az aktuális évhez hasonlítsd, ne egy beírt számhoz.
- Ha egy e-mail cím már létezik, **409**. Gondold végig, hogy a `Kiss@...` és a `kiss@...` ugyanaz-e, és hogy PATCH-nél a saját címét megtarthatja-e az olvasó.

### 11. feladat

- A kölcsönzési lista kiegészítésénél **ne módosítsd** az eredeti objektumokat: spread operátorral (`{ ...k, konyvCim }`) készíts újat.
- A `?aktiv=true` szöveg, nem logikai érték.
- A POST ellenőrzési sorrendje: **400** (hiányzó vagy hibás adat) → **404** (nincs ilyen könyv vagy olvasó) → **409** (a könyv már ki van kölcsönözve).
- A mai dátum `ÉÉÉÉ-HH-NN` formában kell (`toISOString().slice(0, 10)`).
- A már visszahozott kölcsönzést nem lehet újra visszahozni (409).
- A `/konyvek/elerheto` útvonal a `/konyvek/:id` **előtt** legyen a routerben.
- Egy kéréshez gyakran **több fájlt** is be kell olvasnod (kölcsönzések, könyvek, olvasók).

## Ellenőrizd

- [ ] Minden kérésnél megjelenik a naplósor a terminálon.
- [ ] Egy szándékos hiba (`throw new Error()`) 500-as JSON választ ad, és nem áll le a szerver.
- [ ] Ugyanazt a könyvet kétszer kölcsönözve a második kérés 409-et ad.
