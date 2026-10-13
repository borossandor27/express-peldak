# 15. feladat – Titkosírások ★★

**Indítás:** `npm run f15` · **Mintapélda:** `02-modulok` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md)

## Mit mutat be a feladat?

- **Named és default export együtt** ugyanabban a modulban, és ezek importálása egy sorban.
- Default exportként egy **objektum** (`{ kodol, dekodol }`), nem egy függvény.
- **Útvonal-middleware**: `app.use('/caesar', ...)` minden `/caesar`-ral kezdődő kérés előtt lefut.
- Karakterkódok kezelése (`charCodeAt`, `fromCharCode`), maradékos osztás, objektum megfordítása.

## Mire figyelj a megoldás során?

- A middleware-ben két kimenet van: hiányzó paraméter → `return res.status(400)...`, különben `next()`. Ha egyik sem történik, a kérés „beragad”.
- A middleware csak a `/caesar` útvonalakra fut le. A `/morse/dekodol` a `kod` paramétert kapja, nem a `szoveg`-et.
- **Körbeérés:** az `xyz` 5-tel eltolva `cde`. A negatív eltolásnál a JavaScript `%` operátora negatív eredményt ad, ezért kell a `((x % 26) + 26) % 26` forma.
- A kis- és a nagybetűket **külön** kell kezelni (más a kezdő karakterkódjuk), és meg kell őrizni a betű méretét.
- Az ékezetes betűk, a számok és az írásjelek **változatlanok** maradnak.
- Az eltolás query paraméter, tehát szöveg: `"3" + 1` → `"31"`.
- A `/caesar/tores` mind a 25 lehetséges eltolást adja vissza.
- A morse-nál nézd meg, mit tartalmaz az `ABC` tábla és mit csinál a kész ékezetmentesítő függvény. A betűk között **egy szóköz**, a szavak között ` / ` van.
- A dekódoláshoz a kódtábla **fordítottja** kell – ezt egyszer állítsd elő, ne minden kérésnél keresgélj a táblában.

## Ellenőrizd

- [ ] A `kodol` és a `dekodol` egymás után alkalmazva visszaadja az eredeti szöveget.
- [ ] A `/caesar/kodol` paraméter nélkül 400-at ad.
- [ ] A két import pontosan a leírt formában szerepel.
