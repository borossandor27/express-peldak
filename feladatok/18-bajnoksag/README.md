# 18. feladat – Iskolai focibajnokság ★★★

**Indítás:** `npm run f18` · **Mintapélda:** `03-json-get` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md)

## Mit mutat be a feladat?

- **Származtatott adat**: a tabella nincs eltárolva, a meccsekből kell **kiszámolni** minden kérésnél.
- **Több szempontú rendezés** (pont, gólkülönbség, lőtt gól).
- Egy számoló függvény **újrahasznosítása** több végpontban (`/tabella`, `/csapat/:nev`).
- Kiszámolt kulcsú objektumok (`{ [a]: 0 }`), `flatMap` és `Set`.

## Mire figyelj a megoldás során?

- **Minden meccs két csapatot érint**: a hazait és a vendéget is frissíteni kell, és a vendég szemszögéből a lőtt és a kapott gól felcserélődik.
- A tabellát egy **külön függvény** számolja, és a `/tabella` meg a `/csapat/:nev` is ezt hívja. Így a `helyezes` is biztosan ugyanaz.
- A helyezést a **rendezés után** add meg.
- A rendezés szempontjai sorrendben: pont, gólkülönbség, lőtt gól – mind **csökkenő**. A `||` csak akkor lép tovább, ha az előző különbség 0.
- Ellenőrizd az eredményt a leírásban lévő helyes tabellával: a 10.A és a 12.A pontszáma egyenlő.
- A `?fordulo=1` szöveg, a JSON-ban szám. A `?csapat=` szűrés a hazai **és** a vendég oldalon is keressen.
- Az `/egymas-ellen` mindkét irányú meccset vegye figyelembe (A–B és B–A). Hiányzó `a` vagy `b` paraméterre adj 400-at.
- Az ismeretlen csapatra 404 a válasz, ne egy csupa nulla statisztika.
- Az átlagot kerekítsd (`3.25`), de számként add vissza.

## Ellenőrizd

- [ ] A tabella pontosan egyezik a leírásban lévővel.
- [ ] A `/csapat/10.A` `helyezes` mezője 1.
- [ ] A meccsek adatai nem változnak meg a számolás közben.
