# 5. feladat – Szövegeszközök ★★

**Indítás:** `npm run f05` · **Mintapélda:** `02-modulok` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md)

## Mit mutat be a feladat?

- Az **export lista** a fájl végén (`export { a, b, c }`) és az átnevezés **exportáláskor** (`as`).
- Átnevezés **importáláskor**, valamint az `import * as` forma.
- Default export egy másik modulban.
- Szövegkezelő metódusok (`split`, `join`, `trim`, `toLowerCase`, `replaceAll`) és reguláris kifejezések.
- Szöveges és JSON válasz ugyanabban a szerverben.

## Mire figyelj a megoldás során?

- A `szovegEszkozok.js`-ben a függvények előtt **ne** legyen `export` kulcsszó, csak a fájl végi listában.
- Ha a `szokezdoNagybetu`-t `cimFormatum` néven exportálod, akkor az `app.js`-ben **már csak ezen a néven** érhető el.
- Palindromnál a kis- és nagybetű, valamint a szóköz nem számít, az ékezet viszont igen.
- Szavak számolásánál a több szóköz, a szöveg eleji és végi szóköz, valamint az **üres szöveg** is legyen helyes (az üres szövegben 0 szó van, nem 1).
- A címformátumnál a szavak **többi** betűje kisbetűs legyen (`kőSZÍVŰ` → `Kőszívű`).
- A betűgyakoriságban a kis- és nagybetű ugyanaz a betű. Döntsd el, mi legyen a szóközzel és az írásjelekkel.
- A jelszónál gondold végig, mi számít betűnek: az `é`, `ő`, `ű` kisbetű vagy különleges karakter? Az `[a-z]` csak az angol ábécé betűit fedi le.
- A böngésző a szóközt `%20`-ként küldi, de az Express a `req.query`-ben már visszaalakítja. A hiányzó paraméter `undefined`, ilyenkor 400.

## Ellenőrizd

- [ ] Az export és az import pontosan a leírt formában szerepel.
- [ ] A `/gyakorisag` és a `/jelszo` JSON-t ad, a többi végpont szöveget.
