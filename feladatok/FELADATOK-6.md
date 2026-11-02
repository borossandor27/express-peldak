# Express.js gyakorló feladatok – 6. rész: ismétlés – lekérdezések több táblából

Ez a rész a [4. rész](FELADATOK-4.md) (29–33.) **ismétlése**. Új anyag nincs benne: ugyanazokat a fogásokat kell alkalmaznod, csak más adatokon. Mindhárom feladat MySQL-es, és mindegyikben van **lekérdezés több táblából**, **statisztika**, **beágyazott válasz** és egy **ellenőrzött `POST`** végpont.

| # | Feladat | Táblák | Mit ismétel? | Hol volt már? | Nehézség | Indítás |
|---|---|---|---|---|---|---|
| 37 | Állatorvosi rendelő | `gazdak`, `allatok`, `kezelesek` | három tábla láncban, `LEFT JOIN` + `COUNT` / `COALESCE`, beágyazott objektum és tömb, dátumszűrő, havi bontás, `IS NULL` | 29., 32. | ★★★ | `npm run f37` |
| 38 | Projektek és munkaórák | `dolgozok`, `projektek`, `munkaorak` | N:M kapcsolat saját adatokkal, számított költség (`SUM(ora * oradij)`), `HAVING`, DECIMAL → szám, napi korlát → 409 | 30., 31., 32. | ★★★ | `npm run f38` |
| 39 | Iskolai sportnap | `osztalyok`, `diakok`, `versenyszamok`, `eredmenyek` | négy tábla, rendezési irány engedélyezett listából (06–07.), helyezés allekérdezéssel, holtverseny, pontverseny, `UNIQUE` → 409 | 30., 31., 33. | ★★★★ | `npm run f39` |

## Általános tudnivalók

Ugyanazok, mint a 4. részben:

- **Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../README.md) „Adatbázisos (MySQL) változatok” része. Minden mappában van `.env.example` – másold le `.env` néven.
- Az SQL fájlok **újra importálhatók**: eldobják és újra létrehozzák a táblákat, így a `POST` próbálgatása után is visszaállítható az eredeti állapot.
- A kiinduló `app.js` csak a `TODO`-kat tartalmazza. A `utils/db.js`-t neked kell elkészítened. **A 37. és a 38. feladatban van `DATE` oszlop → `dateStrings: true`.**
- Teszteléshez minden mappában van `requests.http`, és minden mappában van egy `README.md` a buktatókkal.
- A válaszokban **camelCase** mezőnevek legyenek, és **minden szám szám** legyen (a `SUM`, `AVG` és a DECIMAL oszlop szövegként jön → `Number`).
- Hibás azonosítóra **400**, nem létezőre **404**, ismeretlen végpontra **404** JSON-nel, hibás JSON törzsre **400**; ha nem fut az adatbázis, **500**.
- **Létező, de üres** dolog nem hiba: `200` + `[]` (vagy 0).
- `POST`-nál az ellenőrzés sorrendje: **400** (az összes adathiba egyszerre, `{"hibak":[...]}`) → **404** (a hivatkozott sor nem létezik) → **409** (ütközés) → **201** + az új elem.

Az alábbi példaválaszok a **frissen importált** adatokkal készültek. A hosszabb listáknál csak az első elemeket mutatjuk.

---

## 37. feladat – Állatorvosi rendelő ★★★

**Mappa:** `feladatok/37-rendelo/`, adatbázis: `data/rendelo.sql` (`rendelo`)

| Tábla | Oszlopok |
|---|---|
| `gazdak` | `id`, `nev`, `telefon`, `varos` |
| `allatok` | `id`, `gazda_id` → `gazdak.id`, `nev`, `faj`, `szuletes` (DATE) |
| `kezelesek` | `id`, `allat_id` → `allatok.id`, `datum` (DATE), `leiras`, `dij` (Ft) |

| Végpont | Válasz |
|---|---|
| `GET /gazdak` | `[{"id":1,"nev":"Kovács Éva","varos":"Budapest","allatDb":2}, {"id":5,"nev":"Molnár Petra","varos":"Érd","allatDb":0}, ...]` név szerint |
| `GET /gazdak?varos=Érd` | Molnár Petra, Tóth Judit |
| `GET /gazdak/1` | `{"id":1,"nev":"Kovács Éva","telefon":"+36 30 111 2233","varos":"Budapest","allatok":[{"id":1,"nev":"Bodri","faj":"kutya","szuletes":"2018-04-12"}, ...]}` |
| `GET /gazdak/5` · `/gazdak/9` · `/gazdak/x` | `"allatok":[]` · **404** · **400** |
| `GET /allatok?faj=kutya` | `[{"id":1,"nev":"Bodri","faj":"kutya","szuletes":"2018-04-12","gazda":"Kovács Éva"}, ...]` (Bodri, Morzsa, Rex) |
| `GET /allatok/kezeles-nelkul` | `[{"id":7,"nev":"Rex","faj":"kutya","gazda":"Nagy Ádám"}]` |
| `GET /allatok/3` | `{"id":3,"nev":"Morzsa","faj":"kutya","szuletes":"2015-09-23","gazda":{"id":2,"nev":"Szabó Tamás","telefon":"+36 20 222 3344"},"kezelesek":[{"id":4,"datum":"2026-01-20","leiras":"Ízületi vizsgálat","dij":15000}, ...],"osszesDij":41000}` – a kezelések dátum szerint |
| `GET /allatok/7` · `/allatok/99` | `"kezelesek":[],"osszesDij":0` · **404** |
| `GET /kezelesek?tol=2026-03-01&ig=2026-06-30&faj=kutya` | `[{"id":2,"datum":"2026-03-02","allat":"Bodri","faj":"kutya","gazda":"Kovács Éva","leiras":"Fogkőeltávolítás","dij":25000}, ...]` – a szűrők kombinálhatók, dátum szerint rendezve |
| `GET /kezelesek?tol=2026-13-01` | **400** |
| `GET /statisztika/fajok` | `[{"faj":"kutya","allatDb":3,"kezelesDb":6,"bevetel":86000},{"faj":"macska","allatDb":2,"kezelesDb":4,"bevetel":68000},{"faj":"papagáj",...,"bevetel":6000},{"faj":"nyúl",...,"bevetel":3000}]` |
| `GET /statisztika/havi` | `[{"honap":"2026-01","kezelesDb":2,"bevetel":27000}, ..., {"honap":"2026-10","kezelesDb":2,"bevetel":20000}]` – csak azok a hónapok, amikor volt kezelés |
| `GET /statisztika/gazdak` | `[{"gazda":"Kovács Éva","allatDb":2,"osszKoltes":87000}, ..., {"gazda":"Molnár Petra","allatDb":0,"osszKoltes":0}]` – költés szerint csökkenő |
| `POST /kezelesek` `{"allatId":7,"leiras":"Éves oltás","dij":12000,"datum":"2026-11-02"}` | **201** `{"id":13,"datum":"2026-11-02","allat":"Rex","faj":"kutya","gazda":"Nagy Ádám","leiras":"Éves oltás","dij":12000}` – a `datum` elhagyható, akkor a mai nap |
| `{"allatId":70,"leiras":"x","dij":1}` | **404** |
| `{"leiras":" ","dij":-5,"datum":"2026-02-30"}` | **400**, négy hiba |

**Ismétlés:** a 29. feladat (előadó + albumok) és a 32. feladat (vásárló → rendelés → tétel) mintája.

---

## 38. feladat – Projektek és munkaórák ★★★

**Mappa:** `feladatok/38-projektek/`, adatbázis: `data/projektek.sql` (`projektek`)

| Tábla | Oszlopok |
|---|---|
| `dolgozok` | `id`, `nev`, `munkakor`, `oradij` (Ft / óra) |
| `projektek` | `id`, `nev`, `ugyfel`, `hatarido` (DATE), `keret` (Ft) |
| `munkaorak` | `id`, `dolgozo_id` → `dolgozok.id`, `projekt_id` → `projektek.id`, `datum` (DATE), `ora` (DECIMAL, pl. 7.5) |

Egy dolgozó több projekten dolgozik, egy projekten több dolgozó: **N:M kapcsolat**, és a kapcsolatnak saját adatai is vannak (mikor, hány órát). A projekt **költsége** nincs eltárolva: `SUM(m.ora * d.oradij)`.

| Végpont | Válasz |
|---|---|
| `GET /dolgozok` | `[{"id":1,"nev":"Bíró Anna","munkakor":"fejlesztő","oradij":9000,"osszOra":25}, ..., {"id":6,"nev":"Gulyás Ferenc",...,"osszOra":0}]` név szerint |
| `GET /dolgozok/1` | `{"id":1,"nev":"Bíró Anna","munkakor":"fejlesztő","oradij":9000,"projektek":[{"id":2,"nev":"Foglalási rendszer","ora":11},{"id":1,"nev":"Webáruház","ora":14}],"osszOra":25}` |
| `GET /dolgozok/6` · `/dolgozok/60` | `"projektek":[],"osszOra":0` · **404** |
| `GET /projektek` | `[{"id":3,"nev":"Iskolai honlap","ugyfel":"Petőfi Gimnázium","hatarido":"2026-10-31","keret":150000,"osszOra":28,"koltseg":215250,"maradek":-65250}, ...]` határidő szerint; a Mobilalkalmazás 0 órával, 0 költséggel |
| `GET /projektek?ugyfel=Kerekes Kft.` | Webáruház, Mobilalkalmazás |
| `GET /projektek/tullepett` | csak az Iskolai honlap (a költség nagyobb a keretnél) |
| `GET /projektek/3` | a projekt adatai + `"dolgozok":[{"id":2,"nev":"Csizmadia Bálint","munkakor":"fejlesztő","ora":12,"koltseg":96000}, ...]` költség szerint csökkenő |
| `GET /projektek/4` · `/projektek/40` | `"dolgozok":[]` · **404** |
| `GET /munkaorak?dolgozoId=4` | `[{"id":10,"datum":"2026-10-08","dolgozo":"Erdei Dániel","projekt":"Webáruház","ora":5}, ...]` – szűrők: `dolgozoId`, `projektId`, `tol`, `ig` (kombinálhatók) |
| `GET /munkaorak?dolgozoId=x` | **400** |
| `GET /statisztika/munkakorok` | `[{"munkakor":"fejlesztő","dolgozoDb":3,"osszOra":50.5,"koltseg":429000},{"munkakor":"tervező","dolgozoDb":1,"osszOra":15.5,"koltseg":116250}, ...]` |
| `POST /munkaorak` `{"dolgozoId":6,"projektId":4,"datum":"2026-10-12","ora":7.5}` | **201** `{"id":18,"datum":"2026-10-12","dolgozo":"Gulyás Ferenc","projekt":"Mobilalkalmazás","ora":7.5}` |
| ugyanaz a dolgozó, ugyanaz a nap, `"ora":1` | **409** – egy dolgozó egy napon összesen legfeljebb **8 órát** dolgozhat (az összes projektjén együtt) |
| `{"dolgozoId":1,"projektId":2,"datum":"2026-10-06","ora":0.5}` | **409** (Bíró Annának aznap már 8 órája van) |
| `{"dolgozoId":9,...}` · `{"projektId":9,...}` | **404** |
| `{"dolgozoId":"1","datum":"2026-02-30","ora":2.3}` | **400**, négy hiba – az `ora` 0,5 és 8 közötti, fél órára kerek szám |

**Ismétlés:** a 31. feladat (kapcsolótábla, 409), a 30. feladat (`HAVING`) és a 32. feladat (számított végösszeg).

---

## 39. feladat – Iskolai sportnap ★★★★

**Mappa:** `feladatok/39-sportnap/`, adatbázis: `data/sportnap.sql` (`sportnap`)

| Tábla | Oszlopok |
|---|---|
| `osztalyok` | `id`, `nev` (egyedi), `ofo` (osztályfőnök) |
| `diakok` | `id`, `nev`, `osztaly_id` → `osztalyok.id`, `nem` (ENUM: fiú, lány) |
| `versenyszamok` | `id`, `nev`, `mertekegyseg` (mp / m), `jobb` (kisebb / nagyobb) |
| `eredmenyek` | `id`, `diak_id` → `diakok.id`, `versenyszam_id` → `versenyszamok.id`, `eredmeny` (DECIMAL). `UNIQUE (diak_id, versenyszam_id)` |

**A jobb eredmény** futásban a **kisebb** (másodperc), ugrásban és dobásban a **nagyobb** (méter) – ezt a `jobb` oszlop mondja meg.
**Holtverseny:** az azonos eredmény azonos helyezést kap, és a következő helyezés kimarad (1., 2., 3., 3., 5.).

| Végpont | Válasz |
|---|---|
| `GET /versenyszamok` | `[{"id":1,"nev":"100 m futás","mertekegyseg":"mp","jobb":"kisebb","indulok":8}, ...]` |
| `GET /versenyszamok/1/eredmenyek` | `{"versenyszam":"100 m futás","mertekegyseg":"mp","eredmenyek":[{"helyezes":1,"diak":"Hegedűs Gergő","osztaly":"11.C","nem":"fiú","eredmeny":12.75},{"helyezes":2,...,"eredmeny":12.98},{"helyezes":3,"diak":"Fazekas Ede",...,"eredmeny":13.1},{"helyezes":3,"diak":"Juhász István",...,"eredmeny":13.1},{"helyezes":5,...}, ...]}` |
| `GET /versenyszamok/2/eredmenyek?nem=lány` | csak a lányok, a helyezés is köztük: Gál Fanni 4.3, Csonka Bella 4.05, Katona Júlia 3.95 |
| `GET /versenyszamok/1/eredmenyek?nem=x` · `/versenyszamok/9/eredmenyek` | **400** · **404** |
| `GET /diakok?osztaly=12.A` | `[{"id":11,"nev":"Lengyel Kristóf","osztaly":"12.A","nem":"fiú","versenyszamDb":0}, ...]` |
| `GET /diakok/9` | `{"id":9,"nev":"Juhász István","osztaly":"11.C","nem":"fiú","eredmenyek":[{"versenyszam":"100 m futás","eredmeny":13.1,"mertekegyseg":"mp","helyezes":3},{"versenyszam":"Kislabdahajítás","eredmeny":61.2,"mertekegyseg":"m","helyezes":1},{"versenyszam":"800 m futás","eredmeny":151.2,"mertekegyseg":"mp","helyezes":2}]}` – a helyezés a versenyszám teljes mezőnyében |
| `GET /diakok/11` · `/diakok/99` | `"eredmenyek":[]` · **404** |
| `GET /osztalyok` | `[{"nev":"9.A","ofo":"Kiss Ágnes","letszam":3,"indulok":3,"eredmenyDb":9}, ..., {"nev":"12.A","ofo":"Fekete László","letszam":2,"indulok":0,"eredmenyDb":0}]` |
| `GET /pontverseny` | `[{"helyezes":1,"osztaly":"11.C","pont":24,"elso":4,"masodik":1,"harmadik":1},{"helyezes":2,"osztaly":"9.A","pont":9,"elso":0,"masodik":2,"harmadik":3},{"helyezes":3,"osztaly":"10.B","pont":4,...},{"helyezes":4,"osztaly":"12.A","pont":0,...}]` |
| `POST /eredmenyek` `{"diakId":11,"versenyszamId":1,"eredmeny":12.6}` | **201** `{"id":27,"diak":"Lengyel Kristóf","versenyszam":"100 m futás","eredmeny":12.6,"mertekegyseg":"mp","helyezes":1}` |
| ugyanez még egyszer | **409** (már van eredménye ebben a versenyszámban) |
| `{"diakId":99,...}` · `{"eredmeny":-2,...}` · `{"eredmeny":40.123,...}` | **404** · **400** · **400** (legfeljebb két tizedesjegy) |

**Pontverseny:** versenyszámonként az 1. hely 5, a 2. hely 3, a 3. hely 1 pontot ér az osztálynak (holtversenynél mindkét 3. helyezett 1-1 pontot hoz). Sorrend: pont, azonos pontnál a több első hely, majd az osztály neve. A 12.A is szerepeljen, 0 ponttal.

**Tippek**
- A rendezés iránya nem mehet `?`-lel: `const irany = vsz.jobb === 'kisebb' ? 'ASC' : 'DESC';` – két, általad megírt szöveg közül választasz (lásd a 06–07. feladat MySQL-es változatának `?rendez=` paraméterét).
- Helyezés SQL-ben: 1 + ahány versenyző **jobb** eredményt ért el ugyanabban a versenyszámban – allekérdezés a `SELECT`-ben (lásd 33. feladat).
- A pontversenyhez a helyezéseket egy **belső lekérdezés** számolja, a külső osztályonként összesít (`LEFT JOIN (SELECT ...) h`).

**Ismétlés:** a 30. feladat (DECIMAL, csoportosítás), a 31. feladat (409) és a 33. feladat (allekérdezés a `SELECT`-ben, álnevek).
