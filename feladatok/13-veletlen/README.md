# 13. feladat – Véletlengenerátor ★

**Indítás:** `npm run f13` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md)

## Mit mutat be a feladat?

- **Elhagyható** query paraméterek **alapértelmezett** értékkel, és ezek ellenőrzése.
- Egy **saját segédfüggvény**, ami a paramétert számmá alakítja és a tartományát vizsgálja – így nem kell ugyanazt hatszor megírni.
- Ismétlődés nélküli véletlen értékek előállítása `Set`-tel.
- Tömb létrehozása megadott hosszal (`Array.from`).

## Mire figyelj a megoldás során?

- **Három eset** van: a paraméter hiányzik (alapérték), helyes (használd), hibás (400). A hiányzó paraméter `undefined`, ezt **az átalakítás előtt** vizsgáld, mert a `Number(undefined)` értéke `NaN`.
- A tartományok határai **benne vannak** (`db` 1–100: az 1 és a 100 is jó).
- Egy dobásnál és több dobásnál **más** a válasz formája (`Dobás:` / `Dobások: ... (összeg: ...)`).
- **A `sort()` alapból szövegként rendez**: `[20, 5, 62].sort()` → `[20, 5, 62]`. Számoknál kell az összehasonlító függvény.
- A lottószámok **különbözők** legyenek – a `Set` mérete akkor nő, ha új szám kerül bele.
- Ismeretlen lottótípusra 400. A típusokat (darab, legnagyobb szám) érdemes egy objektumban tárolni, nem `if`-ekben.
- A `?szamok=true` **szöveg**, nem logikai érték.
- A `/valassz` a vessző körüli szóközöket hagyja figyelmen kívül, és szűrd ki az üres elemeket is (`pizza,,gyros`). Kevesebb mint 2 lehetőségnél 400.
- Mivel a válasz véletlenszerű, **többször** is próbáld ki, és a szélső értékekre (1, 100) is figyelj.

## Ellenőrizd

- [ ] Paraméter nélkül minden végpont működik az alapértékekkel.
- [ ] Tartományon kívüli és nem szám értékre 400 a válasz.
- [ ] A lottószámok növekvő sorrendben és ismétlődés nélkül jönnek.
