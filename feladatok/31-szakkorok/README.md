# 31. feladat – Szakkörök ★★★

**Indítás:** `npm run f31` · **Adatbázis:** `data/szakkorok.sql` (adatbázis: `szakkorok`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** [FELADATOK-4.md](../FELADATOK-4.md), 31. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **N:M kapcsolat kapcsolótáblával**: egy diák több szakkörre jár, egy szakkörre több diák. A `jelentkezesek` tábla köti össze őket.
- **Lekérdezés a kapcsolótáblán keresztül** mindkét irányban (szakkör → diákok, diák → szakkörök).
- **`LEFT JOIN ... IS NULL`**: akinek nincs párja.
- **`GROUP BY` + `HAVING COUNT(*) > 1`** és **`GROUP_CONCAT`**: ütközések keresése.
- **Összetett elsődleges kulcs**: egy diák egy szakkörre csak egyszer jelentkezhet.
- **ENUM rendezése**: a felsorolás sorrendjében, nem ábécé szerint.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `diakok` | `id`, `nev`, `osztaly` | 13 diák; Lakatos Levente és Simon Míra sehova sem jár |
| `szakkorok` | `id`, `nev`, `tanar`, `nap`, `max_letszam` | `nap`: ENUM('hétfő', …, 'péntek'); a Sakk betelt, a Webfejlesztésre senki sem jár |
| `jelentkezesek` | `diak_id`, `szakkor_id`, `datum` | PRIMARY KEY (`diak_id`, `szakkor_id`); mindkét idegen kulcs `ON DELETE CASCADE` |

## Mire figyelj a megoldás során?

- **A pool beállításai közé kell a `dateStrings: true`**, különben a `datum` (DATE) egy nappal korábbi UTC időként jelenik meg.
- **Létszám**: `COUNT(j.diak_id) AS jelentkezett`, `sz.max_letszam - COUNT(j.diak_id) AS szabadHely`, `LEFT JOIN` + `GROUP BY` – így a 0 jelentkezős Webfejlesztés is megjelenik. Ezt a lekérdezést több végpont is használja: tedd egy konstansba.
- **`?vanHely=true`**: a `szabadHely` számított érték → `HAVING szabadHely > 0`.
- **Rendezés napok szerint**: `ORDER BY sz.nap` – az ENUM a felsorolás sorrendjében rendez (hétfő, kedd, szerda…). Szövegként rendezve a csütörtök lenne az első!
- **Útvonal-sorrend**: a `/diakok/szakkor-nelkul` a `/diakok/:id` **előtt** legyen.
- **`/utkozesek`**: csoportosíts diákra **és** napra, és tartsd meg azokat a csoportokat, ahol egynél több sor van. A szakkörök neve: `GROUP_CONCAT(sz.nev ORDER BY sz.nev SEPARATOR ',')` → `"Robotika,Sakk"` → `split(',')`.
- **`POST /jelentkezesek`** – a sorrend: 
  1. **400**: a `diakId` és a `szakkorId` pozitív egész szám (`Number.isInteger`). Az összes hibát egyszerre add vissza.
  2. **404**: létezik-e a diák, létezik-e a szakkör.
  3. **409**: már jelentkezett erre · a szakkör betelt · a diáknak aznap már van másik szakköre.
  4. `INSERT ... VALUES (?, ?, CURDATE())`, majd **201** a válasszal.
- **Két egyszerre érkező, egyforma kérés** mindkettő átjuthat a „jelentkezett-e már” ellenőrzésen. A másodikat az összetett elsődleges kulcs megfogja (`ER_DUP_ENTRY`) – ezt is fordítsd **409**-re, ne legyen belőle 500.
- **`DELETE`**: a két azonosító az útvonalban van (`/jelentkezesek/:diakId/:szakkorId`); az `affectedRows` dönt a 404-ről. Sikeres törlés: **204**, üres válasz.

## Ellenőrizd

- [ ] `GET /szakkorok` → az első a Kosárlabda (hétfő), az utolsó a Fotó (csütörtök).
- [ ] `GET /szakkorok/6` → 200 és `"diakok":[]`.
- [ ] A `jelentkezett` dátum `"2026-09-08"` alakú.
- [ ] A három különböző 409-es eset mindegyike érthető hibaüzenetet ad.
- [ ] (Szorgalmi) Mi történik, ha két diák **egyszerre** jelentkezik az utolsó szabad helyre? Hogyan lehetne ezt kizárni? (Kulcsszavak: tranzakció, `SELECT ... FOR UPDATE`.)
