# Express.js gyakorló feladatok – 4. rész: lekérdezések több táblából

Ebben a részben **minden feladat MySQL adatbázissal** készül, és mindegyik adatbázisban **legalább két, idegen kulccsal összekapcsolt tábla** van. A cél az adatelérés gyakorlása: `JOIN`, `LEFT JOIN`, `GROUP BY`, `HAVING`, összesítő függvények, allekérdezés – és az, hogy a lekérdezés eredményéből pontosan a kért JSON legyen.

| # | Feladat | Táblák | Kapcsolat | Fő téma | Nehézség | Indítás |
|---|---|---|---|---|---|---|
| 29 | Zenetár | `eloadok`, `albumok` | 1:N | `JOIN`, beágyazott tömb, `LEFT JOIN` + `COUNT` | ★★ | `npm run f29` |
| 30 | Szálláskereső | `varosok`, `szallasok` | 1:N | kombinálható szűrők, `HAVING`, `NULL`, számított oszlop, `LIMIT ?` | ★★★ | `npm run f30` |
| 31 | Szakkörök | `diakok`, `szakkorok`, `jelentkezesek` | N:M | kapcsolótábla, `IS NULL`, `GROUP_CONCAT`, POST / DELETE | ★★★ | `npm run f31` |
| 32 | Webshop rendelések | `vasarlok`, `termekek`, `rendelesek`, `tetelek` | 1:N:N | négy tábla, számított végösszeg, havi statisztika, `NOT EXISTS` | ★★★★ | `npm run f32` |
| 33 | Repülőjáratok | `repuloterek`, `legitarsasagok`, `jaratok` | egy táblára két idegen kulcs | álnevek, `TIME`, tábla összekapcsolása önmagával | ★★★★ | `npm run f33` |

## Általános tudnivalók

- **Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../README.md) „Adatbázisos (MySQL) változatok” része. Minden mappában van `.env.example` – másold le `.env` néven.
- Az SQL fájlok **újra importálhatók**: eldobják és újra létrehozzák a táblákat, így bármikor visszaállítható az eredeti állapot.
- A kiinduló `app.js` csak a `TODO`-kat tartalmazza. A `utils/db.js`-t neked kell elkészítened.
- Teszteléshez minden mappában van `requests.http` (VS Code REST Client).
- **Minden mappában van egy `README.md`**: az adatbázis felépítése és a feladat buktatói. Kezdés előtt olvasd el!
- A válaszokban **camelCase** mezőnevek legyenek (`szallasDb`, `maxLetszam`) – az adatbázis oszlopnevét `AS`-sel nevezd át.
- **Minden szám szám legyen** a JSON-ban, ne szöveg: a `SUM`, `AVG`, `ROUND` eredményét és a DECIMAL oszlopot a `mysql2` szövegként adja (`"8.4"`) → `Number(...)`.
- Hibás azonosítóra (`/eloadok/abc`) **400**, nem létezőre **404**, ismeretlen végpontra **404** JSON-nel; ha nem fut az adatbázis, **500** (hibakezelő middleware).
- **Létező, de üres** dolog (pl. egy előadó, akinek nincs albuma) nem hiba: `200` + `[]`. A 404 azt jelenti, hogy maga az előadó nincs meg.

Az alábbi példaválaszok a **frissen importált** adatokkal készültek. A hosszabb listáknál csak az első elemeket mutatjuk.

---

## 29. feladat – Zenetár ★★

**Mappa:** `feladatok/29-zenetar/`, adatbázis: `data/zenetar.sql` (`zenetar`)

| Tábla | Oszlopok |
|---|---|
| `eloadok` | `id`, `nev`, `orszag`, `alapitas` |
| `albumok` | `id`, `eloado_id` → `eloadok.id`, `cim`, `ev`, `mufaj`, `hossz` (perc) |

| Végpont | Válasz |
|---|---|
| `GET /eloadok` | az összes előadó név szerint rendezve |
| `GET /eloadok?orszag=Magyarország` | szűrés országra (4 előadó) |
| `GET /eloadok/2` | `{"id":2,"nev":"Queen","orszag":"Egyesült Királyság","alapitas":1970,"albumok":[{"id":3,"cim":"A Night at the Opera","ev":1975,"mufaj":"rock","hossz":43},{"id":4,"cim":"The Game","ev":1980,"mufaj":"rock","hossz":35}]}` – az albumok év szerint |
| `GET /eloadok/7` | Carson Coma, `"albumok":[]` |
| `GET /eloadok/99` · `/eloadok/abc` | **404** · **400** |
| `GET /albumok` | `[{"id":1,"cim":"10000 lépés","eloado":"Omega","ev":1969,"mufaj":"rock","hossz":47}, ...]` – az előadó **neve** kell, nem az id-ja; rendezés: év, azon belül cím |
| `GET /albumok?mufaj=pop&tol=1980&ig=2010` | a szűrők kombinálhatók → Look Sharp!, Joyride, Viva la Vida |
| `GET /albumok?tol=x` | **400** |
| `GET /albumok/kereses?q=op` | a címben **vagy** az előadó nevében keres, kisbetű-nagybetű nem számít → A Night at the Opera |
| `GET /albumok/kereses?q=a` | **400** (legalább 2 karakter) |
| `GET /mufajok` | `[{"mufaj":"pop","albumDb":5,"osszHossz":221},{"mufaj":"rock","albumDb":5,"osszHossz":208},{"mufaj":"alternatív","albumDb":3,"osszHossz":151}]` |
| `GET /statisztika/eloadok` | `[{"eloado":"Coldplay","albumDb":3,"elso":2000,"utolso":2008}, ..., {"eloado":"Carson Coma","albumDb":0,"elso":null,"utolso":null}]` – album szerint csökkenő, azonos számnál név szerint; **minden** előadó benne van |
| `GET /orszagok` | `[{"orszag":"Egyesült Királyság","eloadoDb":2,"albumDb":5},{"orszag":"Magyarország","eloadoDb":4,"albumDb":4},{"orszag":"Svédország","eloadoDb":2,"albumDb":4}]` |

**Tippek**
- Az előadó albumaihoz **két lekérdezés** kell: előbb az előadó (404, ha nincs), aztán az albumai. Az eredményt `{ ...eloado, albumok }` formában add vissza.
- Album nélküli előadó csak `LEFT JOIN`-nal marad benne a statisztikában, és `COUNT(a.id)` kell, nem `COUNT(*)`.

---

## 30. feladat – Szálláskereső ★★★

**Mappa:** `feladatok/30-szallasok/`, adatbázis: `data/szallasok.sql` (`szallasok`)

| Tábla | Oszlopok |
|---|---|
| `varosok` | `id`, `nev` (egyedi), `orszag` |
| `szallasok` | `id`, `varos_id` → `varosok.id`, `nev`, `csillag` (1–5), `ar` (Ft / fő / éj), `medence` (0 / 1), `ertekeles` (DECIMAL, pl. 8.4) |

Egy szállás a válaszokban:
`{"id":2,"nev":"Lánchíd Hotel","varos":"Budapest","orszag":"Magyarország","csillag":5,"ar":52000,"medence":true,"ertekeles":9.3}` – a `medence` **logikai érték**, az `ertekeles` **szám**.

| Végpont | Válasz |
|---|---|
| `GET /szallasok` | az összes szállás ár szerint növekvő sorrendben |
| `GET /szallasok?varos=Budapest&minCsillag=3&maxAr=60000&medence=true` | négy kombinálható szűrő. `?minCsillag=4&medence=true` → 4 szállás |
| `GET /szallasok?medence=igen` · `?minCsillag=6` | **400** |
| `GET /szallasok/2` · `/szallasok/50` | egy szállás · **404** |
| `GET /varosok` | `[{"id":4,"nev":"Bécs","orszag":"Ausztria","szallasDb":2,"legolcsobb":13500,"atlagAr":25750}, ..., {"id":6,"nev":"Debrecen","orszag":"Magyarország","szallasDb":0,"legolcsobb":null,"atlagAr":null}, ...]` – név szerint, az átlag egészre kerekítve |
| `GET /varosok?minSzallas=2` | csak a legalább 2 szállásos városok (5 város) |
| `GET /varosok/6/szallasok` · `/varosok/60/szallasok` | `[]` (létező város, nincs szállás) · **404** |
| `GET /orszagok` | `[{"orszag":"Ausztria","varosDb":2,"szallasDb":3,"atlagErtekeles":8}, {"orszag":"Csehország",...,"atlagErtekeles":8.8}, {"orszag":"Magyarország","varosDb":4,"szallasDb":7,"atlagErtekeles":8.41}]` |
| `GET /ajanlat?varos=Eger&ej=3&fo=2` | `{"varos":"Eger","ej":3,"fo":2,"ajanlatok":[{"szallas":"Várkapu Vendégház","csillag":3,"arFoEj":14500,"osszesen":87000},{"szallas":"Termál Hotel Eger","csillag":4,"arFoEj":26000,"osszesen":156000}]}` |
| `GET /ajanlat?ej=0` | **400**, `{"hibak":[...]}` – mindhárom hibát egyszerre sorold fel |
| `GET /ajanlat?varos=Szeged&ej=1&fo=1` | **404** |
| `GET /legjobb/3` | a 3 legjobb értékelésű szállás (Lánchíd Hotel, Óváros Rezidencia, Várkapu Vendégház) |

**Tippek**
- A `?minSzallas=` a csoportosítás **utáni** feltétel → `HAVING szallasDb >= ?`, nem `WHERE`.
- Az `osszesen` számított oszlop: `SELECT ..., ar * ? * ? AS osszesen` – a számok is mehetnek `?`-lel.
- `LIMIT ?` paramétere **szám** legyen (`Number(req.params.n)`), szövegre hibát kapsz.

---

## 31. feladat – Szakkörök ★★★

**Mappa:** `feladatok/31-szakkorok/`, adatbázis: `data/szakkorok.sql` (`szakkorok`)

| Tábla | Oszlopok |
|---|---|
| `diakok` | `id`, `nev`, `osztaly` |
| `szakkorok` | `id`, `nev`, `tanar`, `nap` (ENUM: hétfő … péntek), `max_letszam` |
| `jelentkezesek` | `diak_id` → `diakok.id`, `szakkor_id` → `szakkorok.id`, `datum` (DATE). Elsődleges kulcs: (`diak_id`, `szakkor_id`) |

Egy diák több szakkörre járhat, egy szakkörre több diák jár: **N:M kapcsolat**, a `jelentkezesek` a kapcsolótábla.

| Végpont | Válasz |
|---|---|
| `GET /szakkorok` | `[{"id":2,"nev":"Kosárlabda","tanar":"Nagy Éva","nap":"hétfő","maxLetszam":10,"jelentkezett":7,"szabadHely":3}, ...]` – a hét napjai szerint (hétfő, kedd, …), azon belül név szerint |
| `GET /szakkorok?nap=kedd` | Robotika (1 szabad hely), Sakk (0) |
| `GET /szakkorok?vanHely=true` | csak ahol van szabad hely (a Sakk kimarad) |
| `GET /szakkorok/4` | a Sakk adatai + `"diakok":[{"id":8,"nev":"Molnár Hunor","osztaly":"11.B","jelentkezett":"2026-09-08"}, ...]` név szerint |
| `GET /szakkorok/6` · `/szakkorok/9` | Webfejlesztés, `"diakok":[]` · **404** |
| `GET /diakok?osztaly=11.A` | `[{"id":5,"nev":"Horváth Eszter","osztaly":"11.A","szakkorDb":2},{"id":6,"nev":"Varga Ferenc","osztaly":"11.A","szakkorDb":3}]` |
| `GET /diakok/szakkor-nelkul` | Lakatos Levente, Simon Míra |
| `GET /diakok/1` | Kiss Anna + `"szakkorok":[{"id":2,"nev":"Kosárlabda","tanar":"Nagy Éva","nap":"hétfő"}, ...]` (Kosárlabda, Színjátszó, Fotó) |
| `GET /utkozesek` | `[{"diak":"Molnár Hunor","nap":"kedd","szakkorok":["Robotika","Sakk"]},{"diak":"Varga Ferenc","nap":"kedd","szakkorok":["Robotika","Sakk"]}]` – akiknek egy napon két szakkörük van |
| `POST /jelentkezesek` `{"diakId":12,"szakkorId":5}` | **201** `{"diakId":12,"szakkorId":5,"datum":"<mai dátum>","diak":"Lakatos Levente","szakkor":"Fotó","nap":"csütörtök"}` |
| ugyanez még egyszer | **409** (már jelentkezett) |
| `{"diakId":13,"szakkorId":4}` | **409** (a Sakk betelt) |
| `{"diakId":3,"szakkorId":6}` | **409** (Tóth Csillának szerdán már van szakköre: Színjátszó) |
| `{"diakId":99,"szakkorId":2}` · `{"diakId":"x"}` | **404** · **400** `{"hibak":[...]}` |
| `DELETE /jelentkezesek/12/5` | **204**, másodszorra **404** |

**Tippek**
- N:M lekérdezés: `FROM jelentkezesek j JOIN diakok d ON d.id = j.diak_id WHERE j.szakkor_id = ?`
- Akinek **nincs** párja a másik táblában: `LEFT JOIN ... WHERE j.diak_id IS NULL`.
- Az ellenőrzés sorrendje: 400 (adatok) → 404 (diák, szakkör) → 409 (már jelentkezett, betelt, napi ütközés).

---

## 32. feladat – Webshop rendelések ★★★★

**Mappa:** `feladatok/32-webshop/`, adatbázis: `data/webshop.sql` (`webshop`)

| Tábla | Oszlopok |
|---|---|
| `vasarlok` | `id`, `nev`, `email`, `varos` |
| `termekek` | `id`, `nev`, `kategoria`, `ar` (a **mai** ár) |
| `rendelesek` | `id`, `vasarlo_id` → `vasarlok.id`, `datum` (DATE), `statusz` (ENUM: új, szállítás alatt, teljesítve, törölve) |
| `tetelek` | `id`, `rendeles_id` → `rendelesek.id`, `termek_id` → `termekek.id`, `db`, `egysegar` (a rendelés napján érvényes ár) |

**A végösszeg nincs eltárolva**, mindig a tételekből számold: `SUM(db * egysegar)`. A statisztikákban és a vásárlók költésében a **törölt rendelések nem számítanak**.

| Végpont | Válasz |
|---|---|
| `GET /rendelesek` | `[{"id":1,"datum":"2026-08-03","statusz":"teljesítve","vasarlo":"Kiss Anna","darab":2,"vegosszeg":15480}, ...]` dátum szerint – a `darab` a tételek darabszámainak összege |
| `GET /rendelesek?statusz=új` | a 9. és a 10. rendelés |
| `GET /rendelesek?tol=2026-09-01&ig=2026-09-30` | a 4–7. rendelés |
| `GET /rendelesek?tol=2026-02-30` | **400** (nem létező nap) |
| `GET /rendelesek/4` | `{"id":4,"datum":"2026-09-02","statusz":"teljesítve","vasarlo":{"id":1,"nev":"Kiss Anna","email":"anna.kiss@pelda.hu","varos":"Budapest"},"tetelek":[{"termek":"Webkamera","db":1,"egysegar":15990,"osszeg":15990},{"termek":"Vezeték nélküli egér","db":2,"egysegar":6490,"osszeg":12980}],"vegosszeg":28970}` |
| `GET /rendelesek/99` | **404** |
| `GET /vasarlok` | `[{"id":2,"nev":"Nagy Péter","varos":"Debrecen","rendelesDb":2,"osszKoltes":141940}, ..., {"id":6,"nev":"Varga Bence","varos":"Győr","rendelesDb":0,"osszKoltes":0}]` – költés szerint csökkenő |
| `GET /vasarlok/1/rendelesek` · `/vasarlok/6/rendelesek` · `/vasarlok/9/rendelesek` | 3 rendelés · `[]` · **404** |
| `GET /termekek/sosem-rendelt` | `[{"id":8,"nev":"Egérpad XL","kategoria":"kiegészítő","ar":4990}]` |
| `GET /statisztika/havi` | `[{"honap":"2026-08","rendelesDb":2,"bevetel":120460},{"honap":"2026-09","rendelesDb":4,"bevetel":167880},{"honap":"2026-10","rendelesDb":3,"bevetel":182440}]` |
| `GET /statisztika/top-termekek?n=3` | `[{"termek":"Vezeték nélküli egér","eladottDb":7,"bevetel":47930},{"termek":"USB-C hub","eladottDb":4,"bevetel":33960},{"termek":"Mechanikus billentyűzet","eladottDb":3,"bevetel":74970}]` – az `n` alapértéke 3 |
| `GET /statisztika/kategoriak` | `[{"kategoria":"monitor","eladottDb":4,"bevetel":257960},{"kategoria":"periféria","eladottDb":12,"bevetel":154880},{"kategoria":"kiegészítő","eladottDb":6,"bevetel":57940}]` |

**Szorgalmi:** `POST /rendelesek` `{"vasarloId":6,"tetelek":[{"termekId":8,"db":2},{"termekId":1,"db":1}]}` → **201** + a teljes rendelés (mint a `GET /rendelesek/:id`), mai dátummal, `új` státusszal, a termékek **mai** árával. Hibás adat **400**, nem létező vásárló vagy termék **404**. A rendelés és a tételei **tranzakcióban** kerüljenek be.

**Tippek**
- Hónap a dátumból: `DATE_FORMAT(r.datum, '%Y-%m')`.
- `NOT EXISTS (SELECT 1 FROM tetelek t WHERE t.termek_id = tk.id)` – nincs hozzá tartozó sor.
- A pool beállításai közé kell a `dateStrings: true` (különben a dátum egy nappal korábbi lesz).

---

## 33. feladat – Repülőjáratok ★★★★

**Mappa:** `feladatok/33-jaratok/`, adatbázis: `data/jaratok.sql` (`jaratok`)

| Tábla | Oszlopok |
|---|---|
| `repuloterek` | `id`, `kod` (pl. `BUD`, egyedi), `nev`, `varos`, `orszag` |
| `legitarsasagok` | `id`, `kod` (pl. `W6`), `nev` |
| `jaratok` | `id`, `jaratszam` (egyedi), `legitarsasag_id`, **`honnan_id`** és **`hova_id`** → mindkettő `repuloterek.id`, `indulas` (TIME), `idotartam` (perc), `ar` |

Egy járat a válaszokban (az **érkezés nincs eltárolva**, számolni kell):
`{"jaratszam":"OS87","legitarsasag":"Austrian Airlines","honnan":"VIE","honnanVaros":"Bécs","hova":"JFK","hovaVaros":"New York","indulas":"09:50","erkezes":"19:30","idotartam":580,"ar":205000}`

| Végpont | Válasz |
|---|---|
| `GET /jaratok` | az összes járat indulási idő szerint |
| `GET /jaratok?honnan=bud&hova=LHR` | 3 járat (W62201, BA865, W62203) – a kód kisbetűvel is jó |
| `GET /jaratok?legitarsasag=LH` | a Lufthansa 3 járata |
| `GET /jaratok?honnan=BUDA` | **400** |
| `GET /jaratok/OS87` · `/jaratok/XX1` | egy járat · **404** |
| `GET /repuloterek` | `[{"kod":"BUD","nev":"Liszt Ferenc nemzetközi repülőtér","varos":"Budapest","orszag":"Magyarország","indulo":7,"erkezo":5}, ...]` kód szerint; a DEB-nél `0` és `0` |
| `GET /repuloterek/DEB` · `/repuloterek/XYZ` | egy repülőtér · **404** |
| `GET /repuloterek/BUD/indulasok` | indulási tábla: `[{"indulas":"06:10","jaratszam":"W62201","legitarsasag":"Wizz Air","celallomas":"London (LHR)","erkezes":"09:00"}, ...]` (7 járat) |
| `GET /repuloterek/DEB/indulasok` | `[]` |
| `GET /legitarsasagok` | `[{"kod":"W6","nev":"Wizz Air","jaratDb":5,"celallomasDb":3,"legolcsobb":27000,"atlagAr":32800}, ...]` járatszám szerint csökkenő, azon belül név szerint |
| `GET /utvonal?honnan=BUD&hova=JFK` | lásd lent |
| `GET /utvonal?honnan=BUD&hova=BUD` · `?honnan=BUD&hova=XYZ` | **400** · **404** |

**Útvonal egy átszállással.** Átszállni akkor lehet, ha az első járat érkezése és a második indulása között **legalább 60, legfeljebb 300 perc** van. Közvetlen és átszállásos járat is lehet; mindkét lista ár szerint növekvő.

```json
{
  "honnan": "BUD", "hova": "JFK",
  "kozvetlen": [],
  "atszallassal": [
    { "elso": "OS712",  "masodik": "OS87",  "atszallas": "VIE",
      "indulas": "07:30", "erkezes": "19:30", "varakozas": 95,  "osszAr": 234000 },
    { "elso": "LH1341", "masodik": "LH400", "atszallas": "FRA",
      "indulas": "07:00", "erkezes": "18:55", "varakozas": 85,  "osszAr": 268000 },
    { "elso": "AF1495", "masodik": "AF6",   "atszallas": "CDG",
      "indulas": "09:05", "erkezes": "21:50", "varakozas": 120, "osszAr": 291000 }
  ]
}
```

A BA865 + BA117 (London) azért nincs benne, mert csak 55 perc lenne az átszállásra. A `LHR → FCO` útvonalon ugyanezért nincs találat (50 perc Budapesten).

**Tippek**
- Ugyanaz a tábla kétszer, két álnévvel: `JOIN repuloterek h ON h.id = j.honnan_id JOIN repuloterek c ON c.id = j.hova_id`.
- Érkezés: `ADDTIME(j.indulas, SEC_TO_TIME(j.idotartam * 60))`, formázás: `TIME_FORMAT(..., '%H:%i')`.
- Átszállás: a `jaratok` tábla **önmagával** összekapcsolva: `FROM jaratok j1 JOIN jaratok j2 ON j2.honnan_id = j1.hova_id`.
- Egyszerűsítés: minden idő budapesti idő, és egyik járat sem lépi át az éjfélt.
