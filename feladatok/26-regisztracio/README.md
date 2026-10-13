# 26. feladat – Regisztráció ★★★

**Indítás:** `npm run f26` · **Ellenőrzés:** `npm run t26` (szerver) és `npm run t26-fv` (csak a függvény) · **Teljes leírás:** [FELADATOK-3.md](../FELADATOK-3.md)

## Mit mutat be a feladat?

- A **validáció kiszervezése** egy önálló, a szerver nélkül is tesztelhető függvénybe (`utils/validal.js`).
- **Ugyanaz** a validáló függvény a POST (minden mező kötelező) és a PATCH (csak a megadottak) számára.
- A **típusok pontos ellenőrzése** (`typeof`, `Number.isInteger`), nem csak a mező létezése.
- A `trim` szerepe, az **ismeretlen mezők** kiszűrése és a **409 Conflict** foglalt névre.

## Mire figyelj a megoldás során?

- **Ne állj meg az első hibánál!** Az összes hibát gyűjtsd egy tömbbe.
- **`if (!pontszam)` hibás**: a 0 pontszám érvényes, mégis hibának venné.
- A **létezés nem elég** (`if (kor)`): a `"16"` szöveg és a `-5` is átmenne. A `Number.isInteger("16")` és a `Number.isInteger(15.5)` is hamis – pont ez kell.
- A csupa szóközből álló név **`trim` után üres**. A felhasználónevet és az emailt levágva is mentsd.
- A határok benne vannak: a 14 és a 99 év is jó.
- A `hirlevel` csak `true` vagy `false` lehet, az `"igen"` nem.
- **Ismeretlen mezőt ne ments el!** A `{ ...req.body }` mindent átvesz, az `admin: true`-t is.
- PATCH-nél üres törzsre (`{}`) is hiba jár, és a megadott mezőkre ugyanazok a szabályok érvényesek.
- A foglaltság vizsgálata kisbetű-nagybetű független (`KISS_ANNA` = `kiss_anna`). PATCH-nél a saját nevét megtarthatja a felhasználó.
- A POST válasza **201 + az új felhasználó**.

## Ellenőrizd

- [ ] A leírás 23 kérése a `requests.http`-ben sorban a várt választ adja.
- [ ] `npm run t26-fv`, majd `npm run t26` – a szervert előtte állítsd le.
