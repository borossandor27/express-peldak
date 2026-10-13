# 12. feladat – Teendőlista API (önálló projekt) ★★★★

**Indítás:** `npm run f12` · **Mintapélda:** `04-crud`, `05-routing` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md) · **Teszteléshez:** `requests.http`
**Adatbázisos változat:** [`12-teendok_mysql`](../12-teendok_mysql/README.md)

## Mit mutat be a feladat?

- Egy teljes REST API felépítése **önállóan**: a mappaszerkezetet is neked kell kialakítanod (`routes/`, `utils/`).
- Mindaz együtt, amit az 1–11. feladatban gyakoroltál: router, CRUD, szűrés, rendezés, validáció, middleware-ek.
- **Alapértelmezett értékek** elhagyható mezőkre, és egy mező értékének **megfordítása** (true ↔ false).
- **Dátumkezelés** szövegként (`ÉÉÉÉ-HH-NN`), összehasonlítás a mai nappal.
- Naplózás a **válasz** státuszkódjával és a feldolgozás idejével.

## Mire figyelj a megoldás során?

- **Útvonal-sorrend:** a `/teendok/lejart`, a `/teendok/statisztika` és a `DELETE /teendok/keszek` a `/:id`-s útvonalak **előtt** legyen. Különösen veszélyes a `DELETE /keszek`: rossz sorrendben a `keszek` szót id-nak veszi, és 404-et kapsz.
- A `?kesz=true` **szöveg**, a JSON-ban viszont logikai érték van.
- A `prioritas` elhagyható (ilyenkor `"közepes"`), de ha megadják, csak a három érték egyike lehet.
- A `hatarido` elhagyható (ilyenkor `null`). A reguláris kifejezés csak a formátumot ellenőrzi, a `2026-02-30`-at nem szűri ki – ha szeretnéd, ezt is vizsgáld meg.
- A lejárt teendőknél a `null` határidejű teendő nem lehet lejárt, és a kész teendő sem.
- A határidő szerinti rendezésnél döntsd el, hova kerüljenek a `null` határidejű teendők.
- A statisztikában a százalék egész szám legyen, és **üres lista** esetén se ossz nullával.
- Új teendőnél a `kesz` **mindig** `false`, akkor is, ha a kliens `true`-t küld. Az `id`-t a szerver adja.
- A naplózó middleware-ben a státuszkód csak a válasz elküldése után ismert: `res.on('finish', ...)`. Az időt a kérés elején jegyezd fel (`Date.now()`).
- A `DELETE /keszek` válasza nem 204, hanem a törölt elemek száma: `{"torolve": 2}`.

## Ellenőrizd

- [ ] A mappaszerkezet a leírás szerinti, a `jsonDb.js` a saját `data` mappát használja.
- [ ] A `requests.http` minden kérése a várt választ adja.
- [ ] A naplóban látszik a státuszkód és az idő.
