# 22. feladat – Kvíz API (önálló projekt) ★★★★

**Indítás:** `npm run f22` · **Mintapélda:** `05-routing` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md) · **Teszteléshez:** `requests.http`

## Mit mutat be a feladat?

- Önálló projekt: a mappaszerkezetet (`routes/`, `utils/`) is neked kell kialakítanod.
- **Érzékeny adat elrejtése** a válaszból: a kliens nem kaphatja meg a helyes választ.
- **Router szintű middleware** (`router.use`) és egyszerű **jogosultság-ellenőrzés** HTTP fejléccel (**401 Unauthorized**).
- Véletlen kiválasztás ismétlődés nélkül (keverés).
- A kliens válaszainak **kiértékelése** a szerveren, és az eredmény mentése.

## Mire figyelj a megoldás során?

- A `/kviz/uj` válaszából a `helyes` mezőt **ki kell hagyni** – ha benne marad, a kvíz értelmetlen.
- A keveréshez készíts **másolatot**, ne az eredeti tömböt keverd. A kért darabszám ne legyen több, mint az elérhető kérdések száma.
- Nem létező témára 404.
- A kiértékelést **a szerver** végzi: a kliens csak azt küldi, mit választott. Gondold végig, mi legyen a nem létező kérdés-id-vel.
- A `helyes` a válasz **indexe**, 0-tól számolva.
- A **védelem csak a módosító kérésekre** (POST, PUT, DELETE) vonatkozik, a GET maradjon szabad – a middleware-ben a `req.method` alapján dönts.
- A fejlécet a `req.get('X-Admin-Kulcs')` adja; hiányzó vagy rossz kulcsra 401.
- Kérdés-validáció: 2–6 **nem üres** szöveges válasz, és a `helyes` egész szám, érvényes index (`0` ≤ index < a válaszok száma). A `0` is érvényes!
- A toplista a százalék szerint csökkenő; döntsd el, mi legyen egyenlőség esetén.
- ⚠️ Ez csak gyakorló „védelem”: valódi rendszerben a kulcs nem kerül a kódba.

## Ellenőrizd

- [ ] A `/kviz/uj` válaszában sehol nincs `helyes` mező.
- [ ] Kulcs nélkül a POST 401-et ad, a GET működik.
- [ ] Az eredmény bekerül az `eredmenyek.json`-ba, és megjelenik a toplistán.
