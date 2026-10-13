# 25. feladat – Állatkert ★★

**Indítás:** `npm run f25` · **Ellenőrzés:** `npm run t25` · **Teljes leírás:** [FELADATOK-3.md](../FELADATOK-3.md)

## Mit mutat be a feladat?

- Az **útvonalak sorrendje** az Expressben, és hogy miért kell a fix útvonalaknak a paraméteres elé kerülniük.
- **Objektum vagy tömb?** Mikor `find`, mikor `filter`, és mit ad vissza a kettő, ha nincs találat.
- A **400** (hibás kérés) és a **404** (nincs ilyen) különbsége, mindkettő JSON-nal.
- Meglévő, hibás kód **javítása**: a kiinduló `GET /allatok/:id` hibás, és rossz helyen is áll.

## Mire figyelj a megoldás során?

- A kiinduló kódban lévő végpontot ne csak „továbbírd”, hanem **keresd meg a hibáit**, és tedd a megfelelő helyre.
- Egy elemhez `find` → objektum vagy `undefined`. A `filter` **mindig tömböt** ad, egy elemre is: `[{...}]`, nem létező id-re pedig `200 + []` a 404 helyett.
- A hibaválasz után **`return`**, különben „Cannot set headers after they are sent to the client” hiba jön.
- A nem egész id (`abc`, `2.5`) **400**, a nem létező egész id **404**.
- Az útvonal `/`-rel kezdődik: `'/allatok/nevek'`, nem `'allatok/nevek'`.
- Az ismeretlen fajra **200 + `[]`**, az ismeretlen gondozóra **404** – gondold végig, miért (ez az egyik gondolkodtató kérdés).
- A nevek magyar ábécérendben: `localeCompare(..., 'hu')`.
- A 404-es kezelő a fájl végére kerül, minden útvonal után.
- **Válaszold meg a négy gondolkodtató kérdést** kommentként az `app.js` végén, és mindegyiket próbáld is ki.

## Ellenőrizd

- [ ] A `/allatok/nevek` és a `/allatok/statisztika` nem 404-et vagy 400-at ad.
- [ ] `npm run t25` – a szervert előtte állítsd le.
