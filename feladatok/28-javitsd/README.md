# 28. feladat – Javítsd ki! ★★

**Indítás:** `npm run f28` · **Ellenőrzés:** `npm run t28` · **Teljes leírás:** [FELADATOK-3.md](../FELADATOK-3.md) · **Teszteléshez:** `requests.http`

## Mit mutat be a feladat?

- **Hibakeresés** egy elinduló, de hibás programban: a kódban **15 valódi hiba** van, mindegyik korábbi beadandókból.
- A terminál hibaüzeneteinek **olvasása** (fájl, sor, hibatípus).
- Szisztematikus tesztelés: kérésenként, a várt és a kapott válasz összevetésével.
- A hibák **dokumentálása** (`HIBALISTA.md`): hol, mit okozott, hogyan javítottad.
- Egy hiányzó végpont (`PUT /termekek/:id`) megírása a meglévő kód stílusában.

## Mire figyelj a megoldás során?

- **Ne írd újra az egészet!** A cél a hibák megtalálása és megértése, nem egy új program.
- Futtasd a `requests.http` kéréseit **egyenként**, és minden kérés után **nézd meg a terminált**.
- A hibák többféle módon jelentkeznek:
  - **összeomlás vagy hibaüzenet** a terminálon (`TypeError`, `ReferenceError`, „Cannot set headers…”),
  - **nem jön válasz** – valahol hiányzik a `res.json` / `res.send`,
  - **rossz válasz** – rossz státuszkód, tömb objektum helyett, hiányzó vagy felesleges elem.
- Ha nem érted, mi történik, írasd ki a köztes értéket és a **típusát**: `console.log(typeof req.params.id, req.params.id)`.
- A hibák a 23–27. feladat „Gyakori hiba” részeiben felsorolt típusokba esnek – érdemes ott is körülnézni.
- Egy sorban lehet több hiba is, és egy hiba javítása után előjöhet egy másik.
- A `HIBALISTA.md`-be **minden** hibát írj be, akkor is, ha magától értetődőnek tűnik.

## Ellenőrizd

- [ ] A `HIBALISTA.md` mind a 15 sora ki van töltve.
- [ ] `npm run t28` – a cél 20 / 20 pont. A szervert előtte állítsd le.
