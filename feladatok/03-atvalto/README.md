# 3. feladat – Átváltó ★★

**Indítás:** `npm run f03` · **Mintapélda:** `01-hello-get` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md)

## Mit mutat be a feladat?

- A **query string** (`?kulcs=ertek&kulcs2=ertek2`) használata a `req.query` objektumon keresztül.
- **Elhagyható** paraméterek és **alapértelmezett** értékek.
- A különbség az útvonal-paraméter (kötelező, az útvonal része) és a query paraméter (elhagyható, szűrő vagy beállítás) között.
- Külső csomag használata: ez a mappa az **MNB aktuális árfolyamait** tölti le (`mnb-rates` csomag).

## Mire figyelj a megoldás során?

- **A mappának saját `package.json`-ja van.** Az első indítás előtt ebben a mappában is futtass `npm install`-t, különben hiányzik a `mnb-rates` csomag.
- Az árfolyamok **aszinkron** töltődnek be, induláskor az `ARFOLYAMOK` még `null`. Nézd meg a konzolon, milyen formában érkeznek: kis- vagy nagybetűsek a kulcsok? Egy egység hány forint, vagy fordítva? Ha a letöltés nem sikerül, a kód a fix értékekre áll vissza.
- A hiányzó paraméter értéke `undefined`, nem `0` és nem `""`. A `/homerseklet` végpontnál azt kell eldönteni, hogy a `c` vagy az `f` érkezett-e.
- A `valuta` legyen **kis- és nagybetű független**: `USD`, `usd`, `Usd` is működjön. A hibaüzenetben a választható valuták listáját az objektum kulcsaiból állítsd elő, ne írd be fixen.
- A `forint` negatív, hiányzó vagy nem szám értéke is 400.
- A `toFixed()` **szöveget** ad vissza, ezért csak a kiíráskor használd, ne számolj vele tovább.
- A BMI-nél a magasság **centiméterben** érkezik, a képlethez méter kell. A kategóriahatároknál figyelj: a 25,0 már *túlsúlyos* (`<`, és nem `<=`).

## Ellenőrizd

- [ ] A táblázat minden sorát kipróbáltad, a hibás kérések 400-at adnak.
- [ ] A pénzváltó a ténylegesen letöltött árfolyammal számol.
