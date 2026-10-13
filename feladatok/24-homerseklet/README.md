# 24. feladat – Hőmérséklet-napló ★★

**Indítás:** `npm run f24` · **Ellenőrzés:** `npm run t24` · **Teljes leírás:** [FELADATOK-3.md](../FELADATOK-3.md)

## Mit mutat be a feladat?

- **Előbb a várt eredmény, aztán a kód**: a `VARAKOZAS.md` kitöltésével kézzel kell kiszámolnod, mit kell kapnod. Így derül ki, ha a kód „működik”, de rosszat ad.
- **A 0 csapdája**: 0 fok, 0 mm csapadék, negatív hőmérséklet az adatokban.
- Dátumok szűrése szövegként, **a határnap is benne**.
- **Közös szűrőfüggvény** két végponthoz (lista és statisztika) – ugyanazt a kódot nem írjuk meg kétszer.

## Mire figyelj a megoldás során?

- **Kezdd a `VARAKOZAS.md` kitöltésével!** Kódolás előtt, a JSON fájl alapján.
- **`if (minHo)` vagy `if (!min)` hibás**: a 0 hamis. A `?minHo=0` szűrésnek működnie kell, és a statisztikában a 0 is lehet minimum.
- A dátumhatároknál `<=` és `>=` kell: az `ig=2026-03-01` napon mért adat is benne van.
- A `tol` és az `ig` **külön-külön** is működjön.
- Az **üres** érték (`?minHo=`) nem szám, hanem hiba (400). A `Number('')` 0-t ad!
- A rossz formátumú dátum (`2026-1-31`) 400.
- A város keresése kisbetű-nagybetű független.
- Írj egy `szur(lista, query)` függvényt, és **mindkét** végpont ezt hívja.
- A `/meresek/statisztika` útvonal a `/meresek/:id` **előtt** legyen.
- Az átlag egy tizedesre kerekítve, **számként**. A `Math.min(...tomb)` a 0-t és a negatív számot is jól kezeli. Ha egyetlen mérés sincs, 404.

## Ellenőrizd

- [ ] A `VARAKOZAS.md` „Várt” és „Kapott” oszlopa egyezik, és a három kérdésre is válaszoltál.
- [ ] `npm run t24` – a szervert előtte állítsd le.
