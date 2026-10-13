# 17. feladat – Órarend ★★

**Indítás:** `npm run f17` · **Mintapélda:** `03-json-get` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md)
**Adatbázisos változat:** [`17-orarend_mysql`](../17-orarend_mysql/README.md)

## Mit mutat be a feladat?

- JSON adatok **szűrése több feltétel** szerint (nap, óra, tanár, terem).
- **Csoportosítás** és összesítés objektumba (óraszám tantárgyanként, órák naponként).
- Csak bizonyos mezők megtartása (destrukturálás a `map`-ben).
- Objektum **rendezése érték szerint**, és több adatforrás összekapcsolása (órarend + csengetési rend).

## Mire figyelj a megoldás során?

- A nap **kis- és nagybetű független** (`Szerda` = `szerda`), de az ismeretlen napra 404, a választható napok listájával.
- **Különböztesd meg** a hibákat: ismeretlen nap (404, egyik üzenet) és lyukasóra (404, másik üzenet). Az óra sorszáma szöveg, alakítsd számmá.
- Rendezésnél készíts **másolatot**, hogy az eredeti tömb sorrendje ne változzon.
- Az `ido` mezőt a kész `CSENGETES` tömbből kell hozzátenni – figyelj, hogy az 1. óra a tömb 0. eleme-e.
- A `/tanarok` egyedi neveket ad, magyar ábécérendben (`localeCompare(..., 'hu')`).
- A tanár keresése **részleges** (`fekete` → Fekete László); ismeretlen tanárnál 404, nem üres tömb.
- A `/terem/labor 2` útvonalban szóköz van, a böngésző `%20`-ként küldi, az Express visszaalakítja.
- Az `/oraszamok` csökkenő sorrendben, a `/napi-oraszam` a hét napjainak **sorrendjében** legyen (nem ábécérendben).
- A `kezdes` az első óra **kezdete**, a `vege` az utolsó óra **vége** – tehát nem feltétlenül az 1. órától indul a nap.

## Ellenőrizd

- [ ] A `/orarend/kedd/3` válasza pontosan egyezik a leírással (az `ido` mezővel együtt).
- [ ] A `/orarend/vasárnap` és a `/orarend/szerda/1` két különböző hibaüzenetet ad.
