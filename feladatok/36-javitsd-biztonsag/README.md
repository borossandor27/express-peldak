# 36. feladat – Javítsd ki! Biztonsági hibák ★★★

**Indítás:** `npm run f36` · **Adatbázis:** `data/biztonsag.sql` (adatbázis: `biztonsag`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `08-authentication`
**Feladat:** [FELADATOK-5.md](../FELADATOK-5.md), 36. feladat
**Előkészítés:** importáld az SQL fájlt, és másold le a `.env.example` fájlt `.env` néven. A `utils/db.js` kész, abban nincs hiba.

## Mit mutat be a feladat?

- Egy **működő, de nem biztonságos** hitelesítés: minden rendes kérésre jó válasz jön, a hibák csak támadáskor derülnek ki.
- **Gondolkodás a támadó fejével**: mit tud meg vagy tesz meg valaki, aki nem rendesen használja az API-t?
- A 08-as példa **biztonsági alapszabályai** a gyakorlatban – mindegyik szabály mögött ott egy valódi támadás.
- A hibák **dokumentálása** (`HIBALISTA.md`).

## Mire figyelj a megoldás során?

- **Ne írd újra az egészet!** A cél a hibák megtalálása és megértése. A 12 hiba közül néhány egyetlen szó, néhány pár sor.
- A hibák területenként:

  | Terület | Hány hiba? | Kérdés, amit fel kell tenned |
  |---|---|---|
  | **A token** (készítés, ellenőrzés) | 4 | Ki tud érvényes tokent készíteni? Mi van benne? Meddig érvényes? Mit ellenőriz a middleware? |
  | **Kiszivárgó adat** | 3 | Melyik válaszban van olyan mező, aminek nem kellene ott lennie? Mit tud meg a kliens egy hibából? |
  | **Bejelentkezés, jelszó** | 2 | Kiderül-e, ki regisztrált? Tényleg ellenőrzi-e a program a régi jelszót? |
  | **A kliens adatai** | 2 | Mit tehet a kliens a kérés törzsével vagy a query stringgel, amire a fejlesztő nem gondolt? |
  | **Kié a fiók?** | 1 | Kinek a fiókját törölheti egy bejelentkezett felhasználó? |

- **A token tartalmát** a [jwt.io](https://jwt.io) oldalon nézheted meg. Ugyanitt kipróbálhatod, mit tud egy támadó, ha kitalálja a titkos kulcsot.
- **Egy javítás nem ronthatja el a rendes működést**: a `requests.http` első részének minden kérése a javítás után is ugyanazt adja.
- A **régi tokenek** a javítás után nem lesznek jók (más lett a kulcs) – jelentkezz be újra.
- **Egy sikeres támadás után** (Béla admin lett, Csilla fiókja eltűnt) importáld újra az SQL fájlt.
- A **403 Forbidden** a „tudjuk, ki vagy, de ezt nem teheted” – a 401 a „nem tudjuk, ki vagy”.
- Ami **nem** hiba ebben a feladatban: a regisztráció 409-e elárulja, hogy egy e-mail cím foglalt. Ezt teljesen elkerülni csak e-mailes megerősítéssel lehetne.

## Ellenőrizd

- [ ] A `HIBALISTA.md` mind a 12 sora ki van töltve.
- [ ] A `requests.http` minden támadása 400-at, 401-et vagy 403-at ad, vagy nem árul el semmit.
- [ ] A rendes kérések ugyanúgy működnek, mint javítás előtt.
- [ ] A kódban sehol nincs titkos kulcs, és a `.env` nélkül (vagy rövid `JWT_SECRET`-tel) a szerver el sem indul.
