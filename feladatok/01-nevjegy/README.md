# 1. feladat – Névjegy szerver ★

**Indítás:** `npm run f01` · **Mintapélda:** `01-hello-get` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md)

## Mit mutat be a feladat?

- Hogyan épül fel a legegyszerűbb Express szerver: `express()`, `app.get(...)`, `app.listen(...)`.
- **Sima szöveges** válasz küldése (`res.send`) és a válasz típusának beállítása (`res.type('text/plain')`).
- **Útvonal-paraméter** (`/hobbik/:sorszam`) kiolvasása a `req.params` objektumból.
- Státuszkód beállítása (`res.status(404)`) és a **404-es kezelő**, ami minden más kérést elkap.

## Mire figyelj a megoldás során?

- **Ne írd be fixen az életkort!** A feladat az aktuális évből való *kiszámolást* kéri (`new Date().getFullYear()`), így jövőre is helyes lesz.
- **1-től vagy 0-tól számolsz?** A felhasználó `/hobbik/1`-et kér az első hobbira, a tömb indexe viszont 0. Ezt át kell váltanod.
- A `req.params` értéke **mindig szöveg**: `"2"`, nem `2`. Alakítsd számmá, mielőtt indexként használod.
- Gondold végig a rossz bemeneteket is: `/hobbik/0`, `/hobbik/-1`, `/hobbik/abc`, `/hobbik/1.5` – mindre értelmes 404-es válasz jöjjön, ne `undefined`.
- A sortörés (`\n`) a böngészőben csak `text/plain` típusnál látszik; HTML-ként egy sorba folyik össze.
- A **404-es kezelő a fájl végére** kerüljön, minden útvonal után – ha előrébb van, az utána lévő útvonalakat sosem éri el a kérés.
- A hibaüzenetben az útvonalat a kérésből vedd (`req.originalUrl`), ne írd be fixen.
- A válaszok szövege **pontosan** egyezzen a leírásban szereplővel (szóköz, pont, kettőspont is).

## Ellenőrizd

- [ ] Minden végpont böngészőből kipróbálva, a hobbilista soronként jelenik meg.
- [ ] A nem létező hobbi és a nem létező oldal 404-es státuszt ad (F12 → Hálózat fül).
