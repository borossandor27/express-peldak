# 4. feladat – Geometria modulokkal ★★

**Indítás:** `npm run f04` · **Mintapélda:** `02-modulok` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md)

## Mit mutat be a feladat?

- A kód **modulokra bontása**: a számolás a `utils` mappában van, az `app.js` csak importál és válaszol.
- A **named export** és a **default export** közötti különbség, és hogy egy fájlban mindkettő lehet.
- Az importálás formái: `import * as nev`, default és named import egy sorban, átnevezés `as`-szal.
- A **rest paraméter** (`...ertekek`), ami tetszőleges számú argumentumot tömbként fogad.

## Mire figyelj a megoldás során?

- **Saját fájl importálásakor kötelező a `.js` kiterjesztés** és a `./` előtag: `'./utils/kocka.js'`. Nélküle `ERR_MODULE_NOT_FOUND` hibát kapsz.
- Egy fájlban **legfeljebb egy** default export lehet. A default exportot importáláskor bármilyen néven elnevezheted (kapcsos zárójel nélkül), a named exportot csak a pontos nevén (kapcsos zárójelben).
- Az importálási formák **kötelezőek**, ez a feladat lényege. Ha működik, de más formában importálsz, a feladat nincs kész.
- A `pozitivSzamok` ne csak a `> 0`-t nézze: az `abc`-ből `NaN` lesz – gondold végig, minden esetben elég-e az összehasonlítás.
- Ne legyen számolás az `app.js`-ben. Ha egy képletet ott írsz meg, nem a modult használod.
- A kör eredményét két tizedesre kell kerekíteni (`12.57`).
- Az `import * as sikidom` egy objektumot ad, aminek a kulcsai a függvénynevek. Ezért működik az `Object.keys(sikidom)`, és ezért jönnek ábécérendben.

## Ellenőrizd

- [ ] Az `app.js`-ben nincs képlet, csak függvényhívások.
- [ ] A három előírt importálási forma pontosan így szerepel.
- [ ] A negatív és a nem szám értékre 400 a válasz.
