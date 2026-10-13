# 23. feladat – Diákszűrő ★★

**Indítás:** `npm run f23` · **Ellenőrzés:** `npm run t23` · **Teljes leírás:** [FELADATOK-3.md](../FELADATOK-3.md)

## Mit mutat be a feladat?

- **Egyetlen** végpont, ami tetszőleges számú, **bármilyen kombinációban** megadott query paramétert kezel.
- A szűrők **egymás utáni** alkalmazása ugyanarra az eredménytömbre.
- **Határértékek** helyes kezelése (`>=`, `<=`), a 0 és az üres szöveg csapdája.
- Rendezés, irány és darabszám-korlát a **szűrés után**.
- Egy elem lekérése: objektum, nem tömb.

## Mire figyelj a megoldás során?

- **Ne készíts külön útvonalat minden szűrőnek** (`/diakok/osztaly/:osztaly`)! A feladat query paramétert kér: `/diakok?osztaly=13.B`.
- Az `app.get('/diakok?osztaly=')` **nem működik**: a `?` utáni rész nem az útvonal része, azt a `req.query` adja.
- Minden szűrő egy **külön `if`**, egymás alatt, ugyanazt az `eredmeny` tömböt szűkítve. Az `else if` vagy a korai `return` miatt nem lesznek kombinálhatók.
- „Legalább 4” → `>=`, tehát a 4,0 is benne van.
- **A 0 hamis!** Ha előbb számmá alakítasz, és utána `if (maxHianyzas)`-t írsz, a `?maxHianyzas=0` szűrés elmarad. Használd: `!== undefined`.
- **A `Number('')` értéke 0!** Az üres paraméter (`?minAtlag=`) nem nulla, hanem hiba (400).
- A névkeresésnél **mindkét** oldalt kisbetűsítsd.
- Nevek rendezése: `localeCompare(..., 'hu')`, különben az „Ábrahám” a végére kerül.
- A `limit` a rendezés **után** érvényes. Rendezéshez készíts másolatot.
- Ismeretlen `rendez` vagy `irany` érték: 400.

## Ellenőrizd

- [ ] A leírás példatáblázatának minden sora a megadott id-ket adja.
- [ ] `npm run t23` – a szervert előtte állítsd le (`Ctrl + C`).
