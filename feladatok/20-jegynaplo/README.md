# 20. feladat – Elektronikus jegynapló ★★★

**Indítás:** `npm run f20` · **Mintapélda:** `05-routing` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md) · **Teszteléshez:** `requests.http`

## Mit mutat be a feladat?

- Két összekapcsolt erőforrás (**diákok** és **jegyek**) két routerrel.
- Számoló logika **külön modulban** (`utils/atlag.js`): súlyozott átlag, zárójegy.
- **Kapcsolt törlés**: a diák törlésekor a jegyeit is törölni kell, különben „árva” jegyek maradnak.
- Összetett válasz előállítása (bizonyítvány) és **újrahasznosítása** (rangsor).
- **Alapértelmezett értékek** destrukturálással.

## Mire figyelj a megoldás során?

- **Súlyozott átlag**: a jegy × súly összegét a **súlyok összegével** kell osztani, nem a jegyek darabszámával.
- Döntsd el és írd le, hogyan kerekít a `zaroJegy` (pl. a 3,5 négyes-e).
- Az `osszAtlag` a **zárójegyek** átlaga, nem az összes jegyé.
- A `bizonyitvany()` legyen **külön függvény**, mert a `/rangsor` is ezt használja minden diákra.
- A `/diakok/rangsor` a `/diakok/:id` **előtt** legyen a routerben.
- A diák törlésekor **mindkét** fájlt menteni kell.
- A destrukturálás alapértéke (`suly = 1`) csak `undefined`-ra érvényes, a `null`-ra nem.
- A jegy 1–5 közötti **egész** szám, a súly csak 1 vagy 2. Az összes hibát gyűjtsd össze.
- Ellenőrzési sorrend a `POST /jegyek`-nél: előbb az adatok (400), aztán a diák létezése (404).
- A `PATCH /jegyek/:id` csak a `jegy` és a `suly` mezőt módosíthatja: a `diakId`-t és a `tantargy`-at ne lehessen átírni.
- A `diakId` a query-ben szöveg, a JSON-ban szám.

## Ellenőrizd

- [ ] Kiss Anna matematika átlaga 4,33, és a bizonyítvány egyezik a leírással.
- [ ] Egy diák törlése után a `jegyek.json`-ban nem maradnak a jegyei.
