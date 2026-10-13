# 14. feladat – Dátumkalkulátor ★★

**Indítás:** `npm run f14` · **Mintapélda:** `02-modulok` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md)

## Mit mutat be a feladat?

- **Saját modul** írása és importálása (`import * as datum`).
- A JavaScript **`Date`** objektum használata: dátum létrehozása, a hét napja, két dátum különbsége.
- A dátumok **érvényességének** ellenőrzése.
- Szorgalmi: **másik mappában** lévő modul importálása relatív útvonallal.

## Mire figyelj a megoldás során?

- **A hónapok 0-tól számozódnak** a `Date`-ben: a január 0, a december 11. Ez a leggyakoribb hibaforrás.
- **A `Date` nem jelez hibát** a nem létező dátumra, hanem „továbbgörgeti”: a 2026-02-30-ból március 2. lesz. Az ellenőrzéshez nézd meg, hogy a létrehozott dátum éve, hónapja és napja egyezik-e a megadottal.
- **Időzóna:** a helyi idő és az UTC keveredése miatt egy nappal elcsúszhat az eredmény, és a nyári időszámítás miatt két dátum különbsége nem mindig egész nap. Használd végig az UTC-s függvényeket (`Date.UTC`, `getUTCDay`, `getUTCDate`).
- Szökőév: 4-gyel osztható, **de** a 100-zal osztható évek közül csak a 400-zal oszthatók (1900 nem, 2000 igen).
- A karácsonyig hátralévő napoknál: ha idén már elmúlt, a jövő évit kell nézni. Mi legyen pontosan december 24-én?
- Az életkornál a jövőbeli születési dátum 400. Gondold végig a február 29-i születésnapot is.
- A szorgalmi feladatnál az import útvonalát a **saját fájlodhoz képest** kell megadni (`../../02-modulok/utils/datum.js`).
- Mivel több válasz a mai naptól függ, a leírás csak a **formát** mutatja.

## Ellenőrizd

- [ ] A `/nap/1848-03-15` szerdát ad, a `/nap/2026-02-30` 400-at.
- [ ] A `/honap/2024/2` 29 napot, a `/honap/2026/2` 28 napot ad.
- [ ] A dátumszámítás a modulban van, az `app.js` csak meghívja.
