# Automatikus ellenőrző (23–28. feladat)

Az `ellenoriz.js` elindítja a megoldást egy **friss másolaton** (az eredeti adatfájlokkal), lefuttatja rá a `esetek/<szám>.js` ellenőrzéseit, majd leállítja. A beadott mappák és a `feladatok/*/data` fájlok **nem változnak**.

## Diáknak

```bash
npm run t23            # a saját feladatok/23-diakszuro mappáját teszteli
npm run t26-fv         # a 26. feladat validal() függvényét teszteli, szerver nélkül
```

Ha a szerver éppen fut, előbb le kell állítani (`Ctrl + C`), mert a teszt a 3000-es portot használja.

## Tanárnak

**Egy beadott megoldás:**

```bash
npm run ellenoriz -- 27 "D:/beadott/Jegyzetek/Kiss Anna"
```

**Egy egész osztály** (a mappában diákonként egy almappa, ahogy a `mappak_nevekkel.bat` létrehozza):

```bash
npm run ellenoriz -- 27 "D:/beadott/Jegyzetek" --osztaly
npm run ellenoriz -- 27 "D:/beadott/Jegyzetek" --osztaly --csv jegyzetek.csv
```

```
Bálint András ... 9 / 25
Börzsönyi Gergő ... nincs beadott kód
...
=== 27. Jegyzetek CRUD - összesítés ===
Bálint András                   9 / 25   jegy: 1
```

A `--csv` pontosvesszővel tagolt, UTF-8 (BOM-os) fájlt ír, ami magyar Excelben dupla kattintással jól nyílik: sorokban az ellenőrzések, oszlopokban a diákok (1 / 0), alul az összpontszám és a jegy – ugyanaz a szerkezet, mint a `nevsor_13_C.xlsx` „Tesztek” lapja.

**Megoldások ellenőrzése:** `npm run ellenoriz -- 23 megoldasok/23-diakszuro` (mindegyik teljes pontot ad).

## Mit csinál a beadott mappával?

- Megkeresi a belépési pontot: `app.js`, `index.js`, `server.js`, `szerver.js` vagy `main.js`, akár almappában is (pl. `Kiss Anna/filmek/app.js`). A `node_modules` és `.git` mappákat kihagyja.
- Az `express` csomagot az `express-peldak/node_modules`-ból használja, tehát a diák mappájában nem kell `npm install`.
- Ha nincs `package.json`, pótolja (`"type": "module"`) – ahogy a Filmek / Papírbolt javításánál is.
- Az adatfájlt (pl. `jegyzetek.json`) **név szerint** megkeresi a másolatban, és lecseréli az eredetire; ha nem találja, a `data/` mappába teszi.
- Kérésenként 2 mp-et vár: ami addig nem válaszol (pl. üres `try`), az hibás.
- Ha a szerver 8 mp alatt sem indul el, minden ellenőrzés 0 pont, és kiírja a hibaüzenet végét.

## Jegyhatárok

Ugyanazok, mint a dolgozatoknál: 85%-tól 5, 70%-tól 4, 55%-tól 3, 40%-tól 2.

## Amire figyelj

Mint a Filmek / Papírbolt kiértékelésénél: néha egy ellenőrzés „véletlenül” megy át – pl. a nem létező id-re adott 404 akkor is átmegy, ha a végpont meg sincs írva, de a diák saját JSON-os 404-es kezelője válaszol. A pontszámot ezért érdemes egy gyors kódátnézéssel összevetni.

## Új feladat tesztjének megírása

Másold le az `esetek/27.js` fájlt. Egy ellenőrzés:

```js
{ vegpont: 'GET /jegyzetek/:id', leiras: '/jegyzetek/5 → 404', fn: async (k) => hiba404(await k.get('/jegyzetek/5')) }
```

A `k` objektum: `k.get(ut)`, `k.post(ut, body)`, `k.put`, `k.patch`, `k.del`, és `k.adat('fajl.json')` (a másolat aktuális adatfájlja). A válasz: `{ status, json, text, tipus }`. Az ellenőrzések **sorrendben** futnak, egymásra épülhetnek (pl. előbb POST, aztán fájlellenőrzés).
