# Express.js gyakorló feladatok – 2. rész

Az általános tudnivalók ugyanazok, mint az 1. részben (`FELADATOK.md`):

- Minden feladathoz van kiinduló mappa `TODO` megjegyzésekkel. Indítás: `npm run f13` … `npm run f22`.
- POST / PUT / PATCH / DELETE kéréshez használd a mappában lévő `requests.http` fájlt.
- A 19–22. feladat **fájlba menti** az adatokat. Mielőtt elkezded, készíts másolatot a `data` mappáról!
- Ahol a válasz véletlenszerű vagy a mai dátumtól függ, ott a táblázat csak a válasz **formáját** mutatja.

| # | Feladat | Téma | Nehézség | Indítás |
|---|---|---|---|---|
| 13 | Véletlengenerátor | query paraméterek, alapértelmezett értékek, `Set` | ★ | `npm run f13` |
| 14 | Dátumkalkulátor | saját modul, `Date`, másik mappa moduljának importja | ★★ | `npm run f14` |
| 15 | Titkosírások | named + default export együtt, útvonal-middleware | ★★ | `npm run f15` |
| 16 | Sorszámnevek | modul a modulra építve, magyar nyelvi szabályok | ★★★ | `npm run f16` |
| 17 | Órarend | JSON szűrés, csoportosítás | ★★ | `npm run f17` |
| 18 | Focibajnokság | tabella számítása, összetett rendezés | ★★★ | `npm run f18` |
| 19 | Receptkönyv | CRUD **beágyazott tömbbel** | ★★★ | `npm run f19` |
| 20 | Jegynapló | routerek, súlyozott átlag, kapcsolt törlés | ★★★ | `npm run f20` |
| 21 | Mozi jegyfoglalás | 3 router, összetett ellenőrzés, 409 | ★★★★ | `npm run f21` |
| 22 | Kvíz API | önálló projekt, védett végpontok (401) | ★★★★ | `npm run f22` |

---

## 13. feladat – Véletlengenerátor ★

**Mappa:** `feladatok/13-veletlen/app.js`. A `veletlen(min, max)` függvény kész.

Minden paraméter **elhagyható**, ilyenkor az alapértelmezett érték érvényes. Ha meg van adva, de rossz, a válasz **400**.

| Végpont | Paraméterek (alapérték) | Válasz formája |
|---|---|---|
| `GET /kocka` | `db` 1–100 (1), `oldal` 2–100 (6) | `Dobás: 4` |
| `GET /kocka?db=3` | | `Dobások: 5, 1, 1 (összeg: 7)` |
| `GET /erme?db=10` | `db` 1–1000 (1) | `{"fej":4,"iras":6,"dobasok":["írás","fej",...]}` |
| `GET /lotto` | `tipus`: `otos` (5 szám 1–90), `hatos` (6 / 45), `skandi` (7 / 35) | `Lottószámok (otos): 20, 62, 65, 71, 80` |
| `GET /jelszo` | `hossz` 4–64 (12), `szamok=false`, `jelek=false` | `wFCd-qzM+N2V` |
| `GET /valassz?lehetosegek=pizza, gyros ,hamburger` | legalább 2 lehetőség | `A választás: gyros` |

- A lottószámok **különbözőek** legyenek és **növekvő sorrendben**.
- A `/valassz` a lehetőségek körüli szóközöket hagyja figyelmen kívül.

**Tippek**
- Ismétlődés nélküli számok: `const szamok = new Set(); while (szamok.size < 5) szamok.add(...)`
- `n` darab véletlen érték: `Array.from({ length: n }, () => veletlen(1, 6))`
- Érdemes írni egy segédfüggvényt, ami a query paramétert számmá alakítja és ellenőrzi a tartományát.

---

## 14. feladat – Dátumkalkulátor ★★

**Mappa:** `feladatok/14-datumok/`. A `datumBeolvas()` és a `ma()` függvény kész, a többit neked kell megírnod a `utils/datumEszkozok.js`-ben. Importálás: `import * as datum from ...`.

| Végpont | Példa válasz |
|---|---|
| `GET /szokoev/2024` | `2024 szökőév.` |
| `GET /szokoev/1900` | `1900 nem szökőév.` |
| `GET /nap/2026-10-04` | `2026-10-04: vasárnap` |
| `GET /nap/1848-03-15` | `1848-03-15: szerda` |
| `GET /nap/2026-02-30` | **400** – `Érvénytelen dátum. Formátum: ÉÉÉÉ-HH-NN, pl. 2026-10-04` |
| `GET /honap/2024/2` | `2024. február: 29 nap` |
| `GET /kulonbseg?tol=2026-09-01&ig=2026-12-24` | `114 nap (16 teljes hét)` |
| `GET /karacsonyig` | `Karácsonyig még 81 nap van.` *(a mai naptól függ)* |
| `GET /eletkor?szuletes=2010-05-12` | `{"ev":16,"eletNapok":5989,"kovetkezoSzulinapig":220,"szuletesNapja":"szerda"}` *(a mai naptól függ)* |
| `GET /eletkor?szuletes=2099-01-01` | **400** (jövőbeli dátum) |

**Szorgalmi:** a `02-modulok/utils/datum.js` már tartalmazza a `husvetNapjai()` és `punkosdNapjai()` függvényeket. Importáld őket (figyelj a relatív útvonalra: `../../02-modulok/utils/datum.js`), és készíts egy végpontot:

`GET /unnepek/2027` → `{"husvetVasarnap":"2027. 03. 28.","husvetHetfo":"2027. 03. 29.","punkosdVasarnap":"2027. 05. 16.","punkosdHetfo":"2027. 05. 17."}`

**Tippek**
- Szökőév: 4-gyel osztható, **de** a 100-zal oszthatók közül csak azok, amelyek 400-zal is oszthatók.
- Két `Date` különbsége ezredmásodpercben adódik: `(d2 - d1) / (24 * 60 * 60 * 1000)`
- A hónap utolsó napja: `new Date(Date.UTC(ev, honap, 0)).getUTCDate()` (a következő hónap „0. napja”).
- Ha idén már elmúlt karácsony, a jövő évit kell nézni.

---

## 15. feladat – Titkosírások ★★

**Mappa:** `feladatok/15-titkositas/`

| Fájl | Mit exportál | Hogyan |
|---|---|---|
| `utils/caesar.js` | `kodol(szoveg, eltolas)`, `dekodol(szoveg, eltolas)`, `tores(szoveg)` | named export |
| `utils/morse.js` | `ABC` (kódtábla, **kész**) | named export |
| `utils/morse.js` | `{ kodol, dekodol }` objektum | **default** export |

**Importálás:** `import * as caesar from ...`, valamint **egy sorban** a morse default exportja és az `ABC` `morseAbc` néven.

**Middleware:** az `app.use('/caesar', ...)` middleware minden `/caesar` kezdetű kérésnél ellenőrizze, hogy van-e `?szoveg=` paraméter. Ha nincs, **400**, ha van, `next()`.

| Végpont | Válasz |
|---|---|
| `GET /caesar/kodol?szoveg=Hello Vilag!` | `Khoor Ylodj!` (alapértelmezett eltolás: 3) |
| `GET /caesar/kodol?szoveg=xyz&eltolas=5` | `cde` (körbeér!) |
| `GET /caesar/kodol?szoveg=Árvíztűrő&eltolas=-1` | `Áquíysűqő` (az ékezetes betűk maradnak) |
| `GET /caesar/dekodol?szoveg=Khoor&eltolas=3` | `Hello` |
| `GET /caesar/tores?szoveg=Wkh` | `[{"eltolas":1,"szoveg":"Vjg"},{"eltolas":2,"szoveg":"Uif"},{"eltolas":3,"szoveg":"The"},...]` (25 elem) |
| `GET /caesar/kodol` | **400** – `Hiányzik a ?szoveg= paraméter!` |
| `GET /morse/kodol?szoveg=SOS` | `... --- ...` |
| `GET /morse/kodol?szoveg=Szép idő 2026` | `... --.. . .--. / .. -.. --- / ..--- ----- ..--- -....` |
| `GET /morse/dekodol?kod=... --- ...` | `SOS` |
| `GET /morse/abc` | a kódtábla JSON-ban |

**Tippek**
- Betű kódja és vissza: `'a'.charCodeAt(0)` → 97, `String.fromCharCode(97)` → `'a'`
- Negatív eltolásnál is működő maradék: `((x % 26) + 26) % 26`
- A betűk között egy szóköz, a szavak között ` / ` van. Szétszedés: `split(/\s+/)` és `split(/\s*\/\s*/)`
- Fordított objektum: `Object.fromEntries(Object.entries(ABC).map(([b, k]) => [k, b]))`

---

## 16. feladat – Sorszámnevek ★★★

**Mappa:** `feladatok/16-sorszamok/`. A `06-szamiras` mintapélda `szamBetuvel()` függvényére építünk: ez adja a tőszámnevet, neked csak a **végét** kell átalakítanod.

**`utils/sorszam.js`** (named exportok):

| Függvény | Példák |
|---|---|
| `sorszamnev(n)` | 1 → `első`, 2 → `második`, 11 → `tizenegyedik`, 22 → `huszonkettedik`, 100 → `századik`, 2001 → `kétezer-egyedik`, 1000000 → `egymilliomodik` |
| `napNeve(nap)` | 1 → `elseje`, 2 → `másodika`, 4 → `negyedike`, 20 → `huszadika`, 31 → `harmincegyedike` |
| `datumBetuvel(ev, honap, nap)` | (2026, 10, 4) → `kétezer-huszonhat október negyedike` |

**Nyelvi szabályok**
- Csak **önállóan** rendhagyó az *első* és a *második*; összetételben *-egyedik*, *-kettedik* (tizenegyedik, huszonkettedik).
- Néhány alak: harmadik, negyedik, ötödik, hatodik, hetedik, nyolcadik, kilencedik, tizedik, huszadik, harmincadik, negyvenedik, hatvanadik, századik, ezredik, milliomodik.
- A hónap napja: ha a sorszámnév *-adik/-odik* végű, akkor **+a** (másodika, hatodika), egyébként **+e** (negyedike, ötödike). Kivétel: elseje.

| Végpont | Válasz |
|---|---|
| `GET /sorszam/22` | `huszonkettedik` |
| `GET /sorszam/0` | **400** – `Sorszámnév csak pozitív egész számból képezhető.` |
| `GET /lista?db=5` | `első, második, harmadik, negyedik, ötödik` |
| `GET /helyezes?nevek=Anna,Béla,Cili` | `1. Anna - első helyezett` (soronként) |
| `GET /datum/1848-03-15` | `ezernyolcszáznegyvennyolc március tizenötödike` |
| `GET /datum/2026-08-02` | `kétezer-huszonhat augusztus másodika` |
| `GET /datum/2026-02-30` | **400** – `Nem létező dátum.` |
| `GET /ma` | `Ma kétezer-huszonhat október negyedike van.` *(a mai naptól függ)* |
| `GET /osszeg?a=1500&b=700` | `ezerötszáz meg hétszáz az kétezer-kétszáz` |

**Tippek**
- Az import útvonala a `utils` mappából: `'../../../06-szamiras/utils/szamiras.js'`
- `szoveg.endsWith('egy')`, `szoveg.slice(0, -3)`
- ⚠️ A *négy* is *egy*-re végződik! A végződések sorrendje számít.
- A modul hibát dob (`throw new RangeError(...)`), a végpont `try...catch`-csel kapja el.

---

## 17. feladat – Órarend ★★

**Mappa:** `feladatok/17-orarend/`, adatok: `data/orarend.json` (egy osztály heti órarendje)

Egy óra: `{ "nap": "kedd", "ora": 3, "tantargy": "Fizika", "tanar": "Kovács Judit", "terem": "15" }`

| Végpont | Leírás / válasz |
|---|---|
| `GET /orarend` | az egész órarend |
| `GET /orarend/Szerda` | a nap órái óraszám szerint rendezve (kis- és nagybetű nem számít) |
| `GET /orarend/vasárnap` | **404** – `{"hiba":"Ismeretlen nap. Választható: hétfő, kedd, szerda, csütörtök, péntek"}` |
| `GET /orarend/kedd/3` | `{"nap":"kedd","ora":3,"tantargy":"Fizika","tanar":"Kovács Judit","terem":"15","ido":"9:35-10:20"}` |
| `GET /orarend/szerda/1` | **404** – `{"hiba":"Ebben az időpontban nincs óra (lyukasóra)."}` |
| `GET /tanarok` | `["Fekete László","Kovács Judit","Nagy Tamás","Szabó Éva","Tóth Gábor","Varga Ilona"]` |
| `GET /tanar/fekete` | a tanár órái (nap, óra, tantárgy, terem); ismeretlen tanárnál **404** |
| `GET /terem/labor 2` | a teremben tartott órák |
| `GET /oraszamok` | `{"Matematika":5,"Angol nyelv":4,"Webprogramozás":4,"Informatika":3,...}` (csökkenő) |
| `GET /napi-oraszam` | `{"hétfő":{"orak":6,"kezdes":"7:45","vege":"13:10"},"szerda":{"orak":5,"kezdes":"8:40",...},...}` |
| `GET /csengetes/3` | `{"ora":3,"ido":"9:35-10:20"}` |

**Tippek**
- Csak bizonyos mezők megtartása: `orak.map(({ nap, ora, tantargy }) => ({ nap, ora, tantargy }))`
- Objektum rendezése érték szerint: `Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]))`
- Az első és az utolsó óra: `Math.min(...orak.map(o => o.ora))`

---

## 18. feladat – Iskolai focibajnokság ★★★

**Mappa:** `feladatok/18-bajnoksag/`, adatok: `data/meccsek.json` (4 csapat, 6 forduló)

Egy meccs: `{ "id": 1, "fordulo": 1, "hazai": "9.A", "vendeg": "10.A", "hazaiGol": 1, "vendegGol": 3 }`

**Pontozás:** győzelem 3, döntetlen 1, vereség 0 pont.
**Sorrend a tabellán:** 1. pontszám, 2. gólkülönbség, 3. több lőtt gól.

| Végpont | Válasz |
|---|---|
| `GET /meccsek?fordulo=1` / `?csapat=12.A` | szűrt meccslista |
| `GET /eredmenyek` | soronként: `1. forduló: 9.A - 10.A 1:3` |
| `GET /tabella` | lásd lent |
| `GET /csapat/10.A` | `{"csapat":"10.A","meccs":6,"gyozelem":3,"dontetlen":2,"vereseg":1,"lott":11,"kapott":5,"golkulonbseg":6,"pont":11,"helyezes":1}` |
| `GET /csapat/13.A` | **404** |
| `GET /statisztika` | `{"meccsek":12,"osszesGol":39,"atlagGol":3.25,"hazaiGyozelem":3,"vendegGyozelem":5,"dontetlen":4,"legtobbGolosMeccs":"10.A - 11.A 4:1"}` |
| `GET /egymas-ellen?a=9.A&b=10.A` | `{"meccsek":[...],"osszesites":{"9.A":0,"10.A":2,"dontetlen":0}}` |

A helyes tabella (a 10.A és a 12.A pontszáma egyenlő, a gólkülönbség dönt):

| Hely | Csapat | M | Gy | D | V | Lőtt | Kapott | GK | Pont |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 10.A | 6 | 3 | 2 | 1 | 11 | 5 | +6 | 11 |
| 2 | 12.A | 6 | 3 | 2 | 1 | 11 | 8 | +3 | 11 |
| 3 | 9.A | 6 | 2 | 1 | 3 | 10 | 11 | −1 | 7 |
| 4 | 11.A | 6 | 0 | 3 | 3 | 7 | 15 | −8 | 3 |

**Tippek**
- Minden csapatnév egyszer: `[...new Set(meccsek.flatMap(m => [m.hazai, m.vendeg]))]`
- Több szempontú rendezés: `.sort((a, b) => b.pont - a.pont || b.golkulonbseg - a.golkulonbseg || b.lott - a.lott)`
- Kiszámolt kulcsú objektum: `{ [a]: 0, [b]: 0, dontetlen: 0 }`

---

## 19. feladat – Receptkönyv ★★★

**Mappa:** `feladatok/19-receptek/`, adatok: `data/receptek.json`. Teszteléshez: `requests.http`.

Egy recept **beágyazott tömbbel**:
```json
{
  "id": 3, "nev": "Rántotta", "kategoria": "reggeli", "adag": 2, "idoPerc": 10,
  "hozzavalok": [
    { "nev": "tojás", "mennyiseg": 4, "egyseg": "db" },
    { "nev": "vaj", "mennyiseg": 20, "egyseg": "g" }
  ]
}
```

| Metódus | Útvonal | Leírás |
|---|---|---|
| GET | `/receptek` | **rövid lista** (`id`, `nev`, `kategoria`, `idoPerc`); szűrők: `?kategoria=`, `?maxIdo=`, `?hozzavalo=liszt` |
| GET | `/receptek/:id` | a teljes recept / 404 |
| GET | `/receptek/1/adag/6` | a hozzávalók átszámítva 6 főre: a liszt 200 g helyett 300 g, a tej 5 dl helyett 7,5 dl |
| GET | `/bevasarlolista?receptek=1,3` | az azonos nevű **és** egységű hozzávalók összeadva, ábécérendben (tojás: 2 + 4 = 6 db) |
| POST | `/receptek` | új recept → 201 / 400 |
| PUT | `/receptek/:id` | teljes csere |
| DELETE | `/receptek/:id` | 204 / 404 |
| POST | `/receptek/:id/hozzavalok` | új hozzávaló → 201; ha már van ilyen nevű: **409** |
| DELETE | `/receptek/:id/hozzavalok/:nev` | hozzávaló törlése; az **utolsó** nem törölhető (400) |

**Ellenőrzés:** `nev`, `kategoria` nem üres szöveg; `adag`, `idoPerc` pozitív egész; a `hozzavalok` **nem üres tömb**, és minden elemében `nev` (szöveg), `mennyiseg` (pozitív szám), `egyseg` (szöveg). A hibaüzenet mondja meg, hányadik hozzávaló hibás:
```json
{ "hibak": ["A nev kötelező.", "...", "1. hozzávaló: a mennyiseg pozitív szám legyen.", "1. hozzávaló: az egyseg kötelező."] }
```

**Tippek**
- Tömb-e: `Array.isArray(x)`
- Van-e ilyen elem: `recept.hozzavalok.some(h => h.nev === hozzavalo)`
- Kerekítés két tizedesre: `Math.round(x * 100) / 100`
- Csoportosítás összetett kulccsal: `const kulcs = \`${h.nev}|${h.egyseg}\`;`

---

## 20. feladat – Elektronikus jegynapló ★★★

**Mappa:** `feladatok/20-jegynaplo/`, két JSON: `diakok.json`, `jegyek.json`. A `utils/jsonDb.js` kész.

Egy jegy: `{ "id": 2, "diakId": 1, "tantargy": "Matematika", "jegy": 4, "suly": 2, "datum": "2026-09-24" }` (a `suly` 1 = normál, 2 = témazáró)

**`utils/atlag.js`:** `sulyozottAtlag(jegyek)`, `zaroJegy(atlag)`, `jegySzoveggel(jegy)` (1 = elégtelen … 5 = jeles)

**`routes/diakok.js`**

| Végpont | Leírás |
|---|---|
| `GET /diakok?osztaly=10.A` | lista, szűrhető |
| `GET /diakok/:id` | egy diák / 404 |
| `GET /diakok/1/bizonyitvany` | lásd lent |
| `GET /diakok/rangsor?osztaly=10.A` | az `osszAtlag` szerint csökkenő sorrend, `helyezes` mezővel |
| `POST /diakok` | `nev` + `osztaly` (formátum: `10.A`) → 201 / 400 |
| `DELETE /diakok/:id` | a diák **jegyeit is törölni kell** → 204 |

```json
{
  "diak": "Kiss Anna", "osztaly": "10.A",
  "tantargyak": [
    { "tantargy": "Informatika", "jegyek": [5], "atlag": 5, "zaroJegy": 5, "szoveggel": "jeles" },
    { "tantargy": "Matematika", "jegyek": [5, 4], "atlag": 4.33, "zaroJegy": 4, "szoveggel": "jó" },
    { "tantargy": "Történelem", "jegyek": [4], "atlag": 4, "zaroJegy": 4, "szoveggel": "jó" }
  ],
  "osszAtlag": 4.33
}
```
A matematika átlaga súlyozva: (5·1 + 4·2) / (1 + 2) = 4,33. Az `osszAtlag` a **zárójegyek** átlaga.

**`routes/jegyek.js`**

| Végpont | Leírás |
|---|---|
| `GET /jegyek?diakId=2&tantargy=Matematika` | szűrhető lista |
| `POST /jegyek` | `jegy` 1–5 egész; `suly` 1 vagy 2 (alap: 1); `datum` ÉÉÉÉ-HH-NN (alap: mai nap). Hibás adat: **400** (összes hiba); nincs ilyen diák: **404** |
| `PATCH /jegyek/:id` | csak a `jegy` és a `suly` módosítható |
| `DELETE /jegyek/:id` | 204 / 404 |

**Tippek**
- Alapértelmezett érték destrukturálással: `const { suly = 1, datum = maiDatum } = req.body;`
- Osztály formátuma: `/^\d{1,2}\.[A-Z]$/.test(osztaly)`
- A `bizonyitvany()` legyen külön függvény, mert a `/rangsor` is használja!

---

## 21. feladat – Mozi jegyfoglalás ★★★★

**Mappa:** `feladatok/21-mozi/`, három JSON: `filmek`, `vetitesek`, `foglalasok`. A `utils/jsonDb.js` és a `helyKulcs()` kész.

Egy vetítés: `{ "id": 1, "filmId": 1, "datum": "2026-10-10", "idopont": "15:00", "terem": "Kis terem", "sorok": 4, "szekek": 6 }`
Egy foglalás: `{ "id": 1, "vetitesId": 1, "nev": "Kiss Anna", "helyek": [{ "sor": 2, "szek": 3 }, { "sor": 2, "szek": 4 }], "ar": 5000 }`

| Végpont | Leírás |
|---|---|
| `GET /filmek`, `GET /filmek/:id` | a film a vetítéseivel együtt |
| `GET /vetitesek?datum=&filmId=` | dátum + időpont szerint rendezve, kiegészítve: `film` (cím), `szabadHelyek` |
| `GET /vetitesek/:id` | ugyanígy kiegészítve |
| `GET /vetitesek/1/ulesrend` | text/plain, lásd lent |
| `GET /foglalasok?nev=kiss` | részleges keresés |
| `POST /foglalasok` | foglalás, lásd lent |
| `DELETE /foglalasok/:id` | lemondás → 204 |

```
1. sor: OOOOOO
2. sor: OOXXOO
3. sor: OOOOOO
4. sor: XOOOOO
```

**A foglalás ellenőrzése, ebben a sorrendben:**

| # | Hiba | Státusz | Példa válasz |
|---|---|---|---|
| 1 | hiányzó `vetitesId` / `nev`, a `helyek` nem 1–10 elemű tömb | 400 | `{"hiba":"A helyek 1-10 elemű tömb legyen"}` |
| 2 | nem létező vetítés | 404 | `{"hiba":"Nincs ilyen vetítés"}` |
| 3 | a hely nincs a teremben | 400 | `{"hiba":"Érvénytelen hely: {\"sor\":5,\"szek\":1} (terem: 4 sor × 6 szék)"}` |
| 3 | ugyanaz a hely kétszer szerepel | 400 | `{"hiba":"A 3. sor 1. széke kétszer szerepel"}` |
| 4 | valamelyik hely már foglalt | **409** | `{"hiba":"Néhány hely már foglalt","foglaltHelyek":["2. sor 3. szék"]}` |

Siker: **201**, az `ar` = helyek száma × 2500 Ft.

**Tippek**
- A foglalt helyeket gyűjtsd egy `Set`-be `"sor-szek"` kulcsokkal, így a keresés egyszerű: `foglalt.has("2-3")`
- Rendezés két mező szerint: `(a.datum + a.idopont).localeCompare(b.datum + b.idopont)`

---

## 22. feladat – Kvíz API (önálló projekt) ★★★★

**Mappa:** `feladatok/22-kviz/`. Csak az adatfájlok és egy üres `app.js` van meg, a **mappaszerkezetet neked kell kialakítanod**.

Egy kérdés: `{ "id": 2, "tema": "informatika", "kerdes": "Mit jelent a 404-es státuszkód?", "valaszok": ["Szerverhiba", "Sikeres létrehozás", "Nem található", "Tiltott"], "helyes": 2 }`
(a `helyes` a jó válasz **indexe**, 0-tól számolva)

**`routes/kviz.js`** (csatolás: `/kviz`)

| Végpont | Leírás |
|---|---|
| `GET /kviz/temak` | `{"informatika":4,"földrajz":3,"történelem":3}` |
| `GET /kviz/uj?db=3&tema=informatika` | véletlen kérdések, **a `helyes` mező nélkül!** Nem létező téma: 404 |
| `POST /kviz/ellenoriz` | kiértékelés + mentés az `eredmenyek.json`-ba, lásd lent |
| `GET /kviz/toplista?db=3` | `[{"helyezes":1,"nev":"Kiss Anna","szazalek":80,"pont":"4/5"},...]` |

Kérés:
```json
{ "nev": "Szabó Lili", "valaszok": [{ "id": 1, "valasz": 3 }, { "id": 2, "valasz": 2 }, { "id": 3, "valasz": 1 }] }
```
Válasz:
```json
{
  "nev": "Szabó Lili", "pont": 2, "osszes": 3, "szazalek": 67, "datum": "2026-10-04",
  "reszletek": [
    { "id": 1, "kerdes": "Melyik HTTP metódussal hozunk létre új erőforrást?", "jo": false, "helyesValasz": "POST" },
    { "id": 2, "kerdes": "Mit jelent a 404-es státuszkód?", "jo": true, "helyesValasz": "Nem található" },
    { "id": 3, "kerdes": "Melyik middleware dolgozza fel a JSON törzset Expressben?", "jo": true, "helyesValasz": "express.json()" }
  ]
}
```

**`routes/kerdesek.js`** (csatolás: `/kerdesek`): teljes CRUD a kérdésekre (GET lista `?tema=` szűréssel, GET `/:id`, POST, PUT, DELETE).
- Ellenőrzés: `tema`, `kerdes` nem üres; `valaszok` 2–6 nem üres szöveg; `helyes` érvényes index.
- **Védelem:** a módosító kérések (POST, PUT, DELETE) csak akkor engedélyezettek, ha a kérés `X-Admin-Kulcs` fejléce `tanar123`. Ha nem, **401** – `{"hiba":"Hiányzó vagy hibás X-Admin-Kulcs fejléc"}`. Ezt **router szintű middleware**-rel oldd meg (`router.use(...)`)!

**Egyéb elvárások:** naplózó middleware státuszkóddal, 404-es kezelő, hibakezelő.

**Tippek**
- Egy mező kihagyása: `kerdesek.map(({ helyes, ...tobbi }) => tobbi)`
- Keverés (Fisher–Yates): `for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; }`
- Fejléc olvasása: `req.get('X-Admin-Kulcs')`
- ⚠️ Ez csak gyakorló „védelem”. Valódi rendszerben a jelszavakat nem írjuk a kódba, és bejelentkezést használunk.

---

## Szorgalmi feladatok

- **D.** A 16. feladatban készíts `GET /szambol?szoveg=kétezer-huszonhat` végpontot, ami a betűvel írt számot visszaalakítja (→ 2026).
- **E.** A 18. feladatban: `POST /meccsek` új eredmény rögzítésére (ellenőrizd, hogy a két csapat különböző, a gólok nemnegatív egészek), és a tabella magától frissüljön.
- **F.** A 21. feladatban: ha egy foglalás után egy sorban egyetlen szabad szék marad két foglalt között, a foglalást utasítsd el (**409**) – a mozik nem szeretik a „magányos” helyeket.
- **G.** A 22. feladatban: a `/kviz/uj` a válaszlehetőségeket is keverje össze! Gondold végig, hogyan tudod ezután ellenőrizni a választ.
