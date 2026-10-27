# Express.js gyakorló feladatok – 5. rész: hitelesítés

Ebben a részben a **hitelesítést** (authentication) gyakoroljuk: „Ki vagy?”. Mindhárom feladat MySQL-es, és a [`08-authentication`](../08-authentication/README.md) példára épül – kezdés előtt azt érdemes átnézni.

| # | Feladat | Táblák | Fő téma | Nehézség | Indítás |
|---|---|---|---|---|---|
| 34 | Jegyzetfüzet | `felhasznalok`, `jegyzetek` | regisztráció, bejelentkezés, JWT, saját adatok (`WHERE ... AND felhasznalo_id = ?`) | ★★★ | `npm run f34` |
| 35 | Munkamenetek | `felhasznalok`, `munkamenetek` | szerveroldali token, **kijelentkezés**, eszközök kiléptetése, lejárat SQL-ben | ★★★★ | `npm run f35` |
| 36 | Javítsd ki! | `felhasznalok` | **12 biztonsági hiba** egy működő programban: hamis token, SQL befecskendezés, kiszivárgó hash … | ★★★ | `npm run f36` |

## Általános tudnivalók

- **Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../README.md) „Adatbázisos (MySQL) változatok” része. Minden mappában van `.env.example` – másold le `.env` néven. A 34. és 36. feladatban a **`JWT_SECRET`**-et is töltsd ki (legalább 32 karakter):

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- A `bcryptjs` és a `jsonwebtoken` csomag a projekt gyökerében már telepítve van (`npm install`).
- Az SQL fájlok **újra importálhatók**, így bármikor visszaállítható az eredeti állapot. A mintafelhasználók jelszavai az SQL fájlok elején vannak.
- Teszteléshez minden mappában van `requests.http`. A bejelentkezés válaszából a token **automatikusan** bekerül egy változóba (`# @name annaLogin` → `{{annaLogin.response.body.token}}`), ezért **először a bejelentkezést** futtasd.
- **Minden mappában van egy `README.md`**: az adatbázis felépítése és a feladat buktatói. Kezdés előtt olvasd el!
- A védett végpontok a tokent az **`Authorization: Bearer <token>`** fejlécben kapják. Hiányzó, hibás vagy lejárt tokenre **401** + JSON.
- A **`jelszo_hash` soha** nem kerülhet egyetlen válaszba sem, és a jelszó csak hash-ként kerülhet az adatbázisba.
- Bejelentkezésnél **rossz e-mailre és rossz jelszóra ugyanaz** a válasz (401, ugyanaz az üzenet).
- Hibás azonosítóra **400**, nem létezőre **404**, ismeretlen végpontra **404** JSON-nel, hibás JSON törzsre **400**; ha nem fut az adatbázis, **500** (hibakezelő middleware).

| Státusz | Mikor? |
|---|---|
| **401** Unauthorized | nem tudjuk, ki vagy: nincs token, rossz token, rossz jelszó |
| **403** Forbidden | tudjuk, ki vagy, de ezt nem teheted (36. feladat) |
| **404** Not Found | nincs ilyen – vagy van, de nem a tiéd, és ezt nem áruljuk el (34., 35. feladat) |
| **409** Conflict | foglalt e-mail cím |

---

## 34. feladat – Jegyzetfüzet felhasználókkal ★★★

**Mappa:** `feladatok/34-jegyzetfuzet/`, adatbázis: `data/jegyzetfuzet.sql` (`jegyzetfuzet`)

| Tábla | Oszlopok |
|---|---|
| `felhasznalok` | `id`, `nev`, `email` (egyedi), `jelszo_hash`, `letrehozva` |
| `jegyzetek` | `id`, `felhasznalo_id` → `felhasznalok.id` (`ON DELETE CASCADE`), `cim`, `szoveg`, `letrehozva`, `modositva` (`NULL`, amíg nem módosították) |

Mintafelhasználók: `anna@pelda.hu` / `Anna1234` (3 jegyzet), `bela@pelda.hu` / `Bela1234` (2 jegyzet), `csilla@pelda.hu` / `Csilla123` (0 jegyzet).

**Nyilvános végpontok**

| Végpont | Válasz |
|---|---|
| `POST /auth/regisztracio` `{"nev":"Szabó Dénes","email":"denes@pelda.hu","jelszo":"Denes2026"}` | **201** `{"id":4,"nev":"Szabó Dénes","email":"denes@pelda.hu"}` |
| ugyanez még egyszer, vagy `"email":"ANNA@pelda.hu"` | **409** |
| `{"nev":"  ","email":"nem-email","jelszo":"rovid"}` | **400** `{"hibak":[...]}` – mindhárom hiba egyszerre. Jelszó: legalább 8 karakter, betű **és** számjegy is |
| `POST /auth/bejelentkezes` `{"email":"anna@pelda.hu","jelszo":"Anna1234"}` | `{"token":"eyJ...","felhasznalo":{"id":1,"nev":"Kiss Anna","email":"anna@pelda.hu"}}` – az `Anna@Pelda.hu` is jó |
| rossz jelszó · nem létező e-mail · hiányzó mező | **401** · **401** (ugyanaz az üzenet) · **400** |

**Védett végpontok** (token kell; a példák Anna tokenjével)

| Végpont | Válasz |
|---|---|
| `GET /auth/en` | `{"id":1,"nev":"Kiss Anna","email":"anna@pelda.hu","letrehozva":"2026-09-01 08:00:00","jegyzetDb":3}` |
| `GET /jegyzetek` | `[{"id":4,"cim":"Születésnap","szoveg":"Béla szülinapja: október 30.","letrehozva":"2026-10-12 10:05:00","modositva":null}, {"id":2,...}, {"id":1,...}]` – **csak Anna** jegyzetei, a legújabb elöl |
| `GET /jegyzetek?q=egyenlet` | a címben **vagy** a szövegben keres → Matek dolgozat. `?q=edzés` → `[]` (az Béla jegyzete). `?q=a` → **400** (legalább 2 karakter) |
| `GET /jegyzetek/2` · `/jegyzetek/3` · `/jegyzetek/999` · `/jegyzetek/abc` | a jegyzet · **404** (Béláé!) · **404** · **400** |
| `POST /jegyzetek` `{"cim":"Könyvtár","szoveg":"Visszavinni: Egri csillagok","felhasznaloId":2}` | **201** + a teljes új jegyzet. A jegyzet **Annáé** lesz – a `felhasznaloId`-t figyelmen kívül kell hagyni |
| `{"cim":"   "}` | **400** – a `cim` 1–100 karakter (szóközök nélkül), a `szoveg` kötelező, de lehet üres szöveg |
| `PATCH /jegyzetek/1` `{"szoveg":"tej, kenyér, alma, sajt"}` | **200** + a módosított jegyzet, a `modositva` a mostani idő. `{}` → **400** |
| `PATCH /jegyzetek/5` · `DELETE /jegyzetek/5` | **404** (Béláé) |
| `DELETE /jegyzetek/4` | **204**, másodszorra **404** |

**Szorgalmi:** `DELETE /auth/fiok` `{"jelszo":"..."}` → **204**, a felhasználó jegyzetei is törlődnek. Rossz jelszó → **401**. Utána a (még le nem járt) régi tokenre a `GET /auth/en` **401**-et adjon.

**Tippek**
- A tulajdonos ellenőrzése a lekérdezésben legyen: `WHERE id = ? AND felhasznalo_id = ?`, paraméterek: `[id, req.user.id]`. Így más jegyzete egyszerűen „nincs meg” → 404.
- A hitelesítő middleware-t érdemes külön fájlba tenni (`middleware/authenticate.js`), ahogy a 08-as példában.
- A `utils/db.js`-ben `dateStrings: true`, hogy a dátumok `"2026-10-12 10:05:00"` alakban jöjjenek.

---

## 35. feladat – Munkamenetek és kijelentkezés ★★★★

**Mappa:** `feladatok/35-munkamenetek/`, adatbázis: `data/munkamenetek.sql` (`munkamenetek`)

A JWT-t nem lehet visszavonni: kijelentkezés után is érvényes a lejáratáig. Ebben a feladatban ezért a szerver **maga tárolja a munkameneteket**: a token egy 64 karakteres véletlen szöveg (`crypto.randomBytes(32).toString('hex')`), az adatbázisba pedig csak a **SHA-256 hash-e** kerül. Egy token akkor érvényes, ha a hash-e megvan a táblában, és még nem járt le. **JWT ebben a feladatban nincs.**

| Tábla | Oszlopok |
|---|---|
| `felhasznalok` | `id`, `nev`, `email`, `jelszo_hash` |
| `munkamenetek` | `id`, `felhasznalo_id` → `felhasznalok.id`, `token_hash` (egyedi, 64 karakter), `eszkoz`, `letrehozva`, `utoljara`, `lejar` |

Mintafelhasználók: `anna@pelda.hu` / `Anna1234`, `bela@pelda.hu` / `Bela1234`. Annának két érvényes (telefon, iskolai gép) és egy lejárt (régi laptop) munkamenete van, Bélának egy. Három munkamenet nyers tokenje a `requests.http`-ben van. Regisztráció nincs.

| Végpont | Válasz |
|---|---|
| `POST /auth/bejelentkezes` `{"email":"anna@pelda.hu","jelszo":"Anna1234","eszkoz":"Anna laptopja"}` | `{"token":"<64 hexa karakter>","lejar":"2026-10-26 12:34:56","felhasznalo":{"id":1,"nev":"Kiss Anna","email":"anna@pelda.hu"}}` – a lejárat most + `MUNKAMENET_PERC` (alapból 120) perc. Ha nincs `eszkoz`, legyen `ismeretlen eszköz` |
| rossz jelszó · nem létező e-mail · hiányzó mező | **401** · **401** · **400** |
| `GET /auth/en` | `{"id":1,"nev":"Kiss Anna","email":"anna@pelda.hu"}`. Lejárt, kitalált vagy hiányzó token → **401** |
| `GET /auth/munkamenetek` | `[{"id":5,"eszkoz":"Anna laptopja","letrehozva":"...","utoljara":"...","lejar":"...","jelenlegi":true}, {"id":1,"eszkoz":"Anna telefonja",...,"jelenlegi":false}, {"id":2,"eszkoz":"Iskolai gép (B12)",...,"jelenlegi":false}]` – csak a **saját, érvényes** munkamenetek, `utoljara` szerint csökkenő sorrendben, `token_hash` nélkül |
| `DELETE /auth/munkamenetek/2` · `/4` · `/abc` | **204** (az iskolai gép kilép) · **404** (Béláé) · **400** |
| `POST /auth/kijelentkezes` | **204** – a **jelenlegi** munkamenet törlődik, ugyanez a token utána **401** |
| `POST /auth/kijelentkezes-mindenhol` | `{"kileptetve":2}` – minden **más** saját munkamenet törlődik, a jelenlegi megmarad |
| `PATCH /auth/jelszo` `{"regiJelszo":"Anna1234","ujJelszo":"UjJelszo2026"}` | `{"uzenet":"A jelszó megváltozott.","kileptetve":1}` – jelszócsere után a többi munkamenet is törlődik |
| rossz régi jelszó · gyenge új jelszó | **401** · **400** |

**Tippek**
- A lejáratot az **SQL** számolja és ellenőrzi: `INSERT ... VALUES (..., DATE_ADD(NOW(), INTERVAL ? MINUTE))` és `WHERE token_hash = ? AND lejar > NOW()`. Így nem keveredik a JavaScript és a MySQL időzónája.
- Az `authenticate` middleware tegye el a munkamenet azonosítóját is (`req.munkamenetId`) – ez kell a kijelentkezéshez, a `jelenlegi` mezőhöz és a „mindenhol máshol” törléshez (`AND id <> ?`).
- Minden kérésnél frissítsd az `utoljara` mezőt (`UPDATE munkamenetek SET utoljara = NOW() WHERE id = ?`).
- Bejelentkezéskor töröld a lejárt munkameneteket, hogy ne teljen meg a tábla.

---

## 36. feladat – Javítsd ki! Biztonsági hibák ★★★

**Mappa:** `feladatok/36-javitsd-biztonsag/`, adatbázis: `data/biztonsag.sql` (`biztonsag`)

| Tábla | Oszlopok |
|---|---|
| `felhasznalok` | `id`, `nev`, `email`, `jelszo_hash`, `szerep` (ENUM: `user`, `admin`), `letrehozva` |

Mintafelhasználók: `anna@pelda.hu` / `Anna1234` (admin), `bela@pelda.hu` / `Bela1234`, `csilla@pelda.hu` / `Csilla123`.

A kiinduló `app.js` **elindul és működik**: regisztráció, bejelentkezés, saját adatok, jelszócsere, névmódosítás, névsor, keresés, saját fiók törlése. Mégis **12 biztonsági hiba** van benne. A `requests.http` második része támadásokat tartalmaz – a hibás programban ezek sikerülnek.

**Feladat**
1. Futtasd a támadásokat, és figyeld meg, mit tud meg vagy tesz meg a „támadó” (Béla).
2. Keresd meg mind a 12 hibát, és javítsd ki őket. **Ne írd újra** a programot!
3. Töltsd ki a `HIBALISTA.md` táblázatát: sor, hibás kód, mit tehetett ki vele a támadó, javítás.

**A javított program elvárt viselkedése**

| Végpont | Elvárás |
|---|---|
| minden védett végpont | **hamisított** (kitalált aláírású) tokenre **401**; a token **lejár** (`JWT_LEJARAT`), és csak `id`, `email` van benne |
| a szerver indítása | a titkos kulcs a `.env`-ből jön (`JWT_SECRET`); ha hiányzik vagy rövid, a szerver **el sem indul** |
| `POST /auth/regisztracio` | **201** `{"id":...,"nev":"...","email":"..."}` – semmi más |
| `POST /auth/bejelentkezes` | rossz e-mailre és rossz jelszóra **ugyanaz**: 401, ugyanazzal az üzenettel |
| `GET /felhasznalok` | `[{"id":1,"nev":"Kiss Anna"},{"id":2,"nev":"Nagy Béla"},{"id":3,"nev":"Tóth Csilla"}]` |
| `GET /felhasznalok/kereses?nev=anna` | `[{"id":1,"nev":"Kiss Anna"}]`; a `requests.http` SQL befecskendezéses kérésére `[]` |
| `PATCH /auth/jelszo` | rossz régi jelszóra **401** |
| `PATCH /auth/profil` | csak a `nev` módosítható; `{"szerep":"admin"}` vagy bármilyen más mező → **400** |
| `DELETE /felhasznalok/:id` | más fiókjára **403**, a sajátra **204** |
| szerverhiba | **500** `{"hiba":"Szerverhiba"}` – az SQL és a hibaüzenet csak a terminálon jelenik meg |

**Tippek**
- A hibák területenként: a token készítése és ellenőrzése (4), kiszivárgó adat (3), bejelentkezés és jelszó (2), a kliens adatainak kezelése (2), kié a fiók (1).
- A token tartalmát a [jwt.io](https://jwt.io) oldalon nézd meg. Ott azt is kipróbálhatod, mit tud egy támadó, aki ismeri a titkos kulcsot.
- Egy sikeres támadás után (Béla admin lett, Csilla fiókja eltűnt) importáld újra az SQL fájlt.
