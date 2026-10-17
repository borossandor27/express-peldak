# 08 – Hitelesítés (authentication)

**Indítás:** `npm run 08` · **Adatbázis:** `data/auth_pelda.sql` (adatbázis: `auth_pelda`, tábla: `felhasznalok`) · **Teszteléshez:** `requests.http`

A hitelesítés arról szól, hogy meghatározzuk a felhasználó személyazonosságát: **„Ki vagy?”** Ez a folyamat biztosítja, hogy a felhasználó az, akinek mondja magát. A példában regisztráció, bejelentkezés és védett végpontok vannak, **bcrypt** jelszó-hash-sel és **JWT** tokennel.

> Hogy a bejelentkezett felhasználó **mit tehet** (pl. törölhet-e), az már a *jogosultságkezelés* (authorization) – lásd a `09-authorization` példát.

## Mappaszerkezet

```
08-authentication/
├── .env                        ← a SAJÁT beállításaid, benne a JWT_SECRET (nem kerül fel a Git-re!)
├── .env.example                ← minta: ezt másold le .env néven
├── app.js                      ← szerver, nyilvános és védett végpont, hibakezelő
├── middleware/authenticate.js  ← a token ellenőrzése -> req.user
├── routes/auth.js              ← regisztráció, bejelentkezés, saját adatok, jelszócsere
├── utils/db.js                 ← a közös MySQL kapcsolat (ugyanaz, mint a 07-ben)
└── data/auth_pelda.sql
```

## Előkészítés

1. XAMPP: indítsd el a **MySQL**-t.
2. phpMyAdmin → **Importálás** → `data/auth_pelda.sql`. Újraimportálva visszaállítja az eredeti állapotot.
3. A projekt gyökerében (egyszer): `npm install jsonwebtoken bcryptjs`
4. Másold le a `.env.example` fájlt **`.env`** néven, és írj a `JWT_SECRET` mögé egy hosszú véletlen szöveget:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Ha a `JWT_SECRET` hiányzik vagy 32 karakternél rövidebb, a szerver el sem indul.

**Mintafelhasználó:** `teszt@pelda.hu` / `Jelszo123`

## Végpontok

| Metódus | Útvonal | Kell token? | Siker | Hiba |
|---|---|---|---|---|
| GET | `/` | nem | 200 | – |
| POST | `/auth/regisztracio` | nem | **201** + a felhasználó (hash nélkül!) | 400 hibás adat, **409** foglalt e-mail |
| POST | `/auth/bejelentkezes` | nem | 200 + `token` | 400 hiányzó adat, **401** hibás e-mail vagy jelszó |
| GET | `/auth/en` | **igen** | 200 + saját adatok | 401 |
| PATCH | `/auth/jelszo` | **igen** | 200 | 400, 401 rossz régi jelszó |
| GET | `/titkos` | **igen** | 200 | 401 |

Jelszószabály a regisztrációnál: legalább 8 karakter, betű és számjegy is legyen benne.

## Hogyan működik?

```
1. Regisztráció     POST /auth/regisztracio { nev, email, jelszo }
                    szerver: jelszo -> bcrypt.hash() -> az adatbázisba CSAK a hash kerül

2. Bejelentkezés    POST /auth/bejelentkezes { email, jelszo }
                    szerver: bcrypt.compare(jelszo, hash) -> jó? -> jwt.sign() -> token
                    kliens: elteszi a tokent

3. Védett kérés     GET /auth/en
                    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
                    szerver: authenticate middleware -> jwt.verify() -> req.user -> válasz
```

### 1. Jelszó tárolása: hash, nem titkosítás

| | Titkosítás (encryption) | Hash |
|---|---|---|
| Visszafejthető? | igen, a kulccsal | **nem** |
| Ha ellopják az adatbázist | a kulccsal minden jelszó olvasható | a jelszavak nem olvashatók ki |
| Ellenőrzés | visszafejtés és összehasonlítás | a beírt jelszót is hash-eljük, és a két hash-t vetjük össze |

```js
const hash = await bcrypt.hash('Jelszo123', 10);
// '$2b$10$cOqG2pSy8kSCgvq6bA3kAe...'  <- ez kerül az adatbázisba (60 karakter)

await bcrypt.compare('Jelszo123', hash);   // true
await bcrypt.compare('jelszo123', hash);   // false
```

- **Só (salt):** a bcrypt minden hash-hez véletlen sót kever, és azt a hash-ben tárolja. Ugyanabból a jelszóból ezért **mindig más** hash lesz: két azonos jelszavú felhasználó hash-e sem egyezik.
- **Költségtényező (a `10`):** a bcrypt szándékosan lassú (kb. 0,1 s). A felhasználónak ez nem tűnik fel, de egy támadó így nem tud másodpercenként milliárdnyi jelszót kipróbálni.
- **Soha** ne használj erre `md5`-öt vagy `sha256`-ot: ezek gyorsak, és nincs bennük só.

### 2. A JWT (JSON Web Token)

A token három, ponttal elválasztott részből áll: `fejléc.tartalom.aláírás`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 . eyJpZCI6MSwiZW1haWwiOiJ0ZXN6dEBwZWxkYS5odSIs... . oppBkvcWh4B90GSVMN2CH_6o...
{"alg":"HS256","typ":"JWT"}            {"id":1,"email":"teszt@pelda.hu","iat":...,"exp":...}   HMAC-SHA256(fejléc.tartalom, JWT_SECRET)
```

- A **tartalom nincs titkosítva**, csak base64-gyel kódolva: bárki elolvashatja (próbáld ki a [jwt.io](https://jwt.io) oldalon). Ezért **soha ne tegyél bele jelszót** vagy más titkos adatot!
- Az **aláírást** csak az tudja elkészíteni, aki ismeri a `JWT_SECRET`-et. Ha valaki átírja a tartalmat (pl. `"id":1` → `"id":2`), az aláírás már nem egyezik, és a `jwt.verify()` hibát dob → **401**.
- Az `exp` mező a lejárat ideje (`JWT_LEJARAT=1h`). Lejárt tokennel újra be kell jelentkezni.
- A szerver **nem tárol** semmit a bejelentkezésről (*stateless*): minden adat a tokenben van, csak az aláírást kell ellenőrizni.

### 3. A hitelesítő middleware

```js
router.get('/en', authenticate, async (req, res) => { ... });
//                ^ előbb ez fut: ha nincs jó token -> 401, és a handler le sem fut
```

Az `authenticate` a token tartalmát a `req.user` objektumba teszi, így a handler tudja, ki küldte a kérést: `req.user.id`.

## Biztonsági alapszabályok a példában

| Szabály | Hol? |
|---|---|
| A jelszó csak hash-ként kerül az adatbázisba | `routes/auth.js` – regisztráció, jelszócsere |
| A `jelszo_hash` soha nem kerül a válaszba | `NYILVANOS_MEZOK` |
| Rossz e-mailre és rossz jelszóra **ugyanaz** a hibaüzenet | bejelentkezés – így nem derül ki, ki regisztrált |
| A titkos kulcs a `.env`-ben van, nem a kódban | `JWT_SECRET` |
| A tokenben nincs titkos adat | `tokenKeszites()` |
| Az e-mail címet kisbetűsítve tároljuk, és `UNIQUE` kulcs védi | regisztráció, `auth_pelda.sql` |
| Jelszócseréhez a régi jelszó is kell | `PATCH /auth/jelszo` – egy ellopott token önmagában nem elég |

Éles rendszerben ezen felül: **HTTPS** (különben a token és a jelszó olvashatóan utazik a hálózaton), a bejelentkezési próbálkozások korlátozása (*rate limiting*), és rövid élettartamú token mellé frissítő token (*refresh token*).

## Próbáld ki (`requests.http`)

1. Kérd le a `/titkos` oldalt token nélkül, majd hamis tokennel: **401**.
2. Jelentkezz be a `bejelentkezes` kéréssel. A REST Client a választ eltárolja, és a `{{token}}` változó automatikusan a tokent tartalmazza.
3. Kérd le a `/auth/en` és a `/titkos` oldalt: most már **200**.
4. Másold be a tokent a [jwt.io](https://jwt.io) oldalra: látod a tartalmát, de a `JWT_SECRET` nélkül nem tudsz érvényes aláírást készíteni.
5. Regisztrálj kétszer ugyanazzal az e-mail címmel: a második **409**.
6. phpMyAdmin-ban nézd meg a `felhasznalok` táblát: két azonos jelszavú felhasználónak is különböző a hash-e.
7. Írd át a `.env`-ben a `JWT_LEJARAT` értékét `20s`-ra, indítsd újra a szervert, jelentkezz be, és várj fél percet.

---

## Elméleti háttér

### Hitelesítési módszerek

1. **Jelszó alapú hitelesítés**: a felhasználó egy jelszót ad meg, amelyet a rendszer ellenőriz. Ez a leggyakoribb módszer, de sebezhető lehet, ha a jelszavak gyengék vagy könnyen kitalálhatók. *(Ezt mutatja be a példa.)*
2. **Kétfaktoros hitelesítés (2FA)**: a felhasználónak két különböző azonosító információt kell megadnia, például egy jelszót és egy mobiltelefonra küldött kódot. Ez növeli a biztonságot, mivel a támadónak mindkét tényezőt meg kell szereznie.
3. **Biometrikus hitelesítés**: a felhasználó fizikai jellemzőit, például ujjlenyomatát, arcát vagy íriszét használja az azonosításhoz. Kényelmes és nehezen hamisítható.
4. **Token alapú hitelesítés**: a felhasználó egy tokent kap, amelyet a rendszer ellenőriz. Ez lehet fizikai eszköz (például egy kulcstartó) vagy szoftveres token (például egy mobilalkalmazás vagy – mint a példában – egy JWT).

### Gyakori hitelesítési protokollok és szabványok

| Név | Mire való? | Hol találkozhatsz vele? |
|---|---|---|
| **JWT** (JSON Web Token) | aláírt token formátum, amely a felhasználó adatait hordozza | REST API-k, mobilalkalmazások – *ez a példa* |
| **OAuth 2.0** | egy alkalmazás a jelszavad nélkül férhet hozzá az adataidhoz egy másik szolgáltatásnál | „Engedélyezed, hogy az alkalmazás hozzáférjen a Google Drive-odhoz?” |
| **OpenID Connect** | identitásréteg az OAuth 2.0 felett: bejelentkezés egy külső fiókkal | „Bejelentkezés Google-lel / Microsofttal” |
| **SAML 2.0** | XML-alapú egyszeri bejelentkezés (SSO) szervezetek között | céges és egyetemi rendszerek közös bejelentkezése |
| **Kerberos** | titkosított „jegyekkel” működő hálózati hitelesítés | Windows tartomány (Active Directory) |
| **LDAP** | felhasználói címtár lekérdezése, ellenőrzése | iskolai és céges hálózati bejelentkezés |
| **RADIUS** | hálózati hozzáférés hitelesítése | Wi-Fi (pl. eduroam), VPN |
| **FIDO2 / WebAuthn** | jelszó nélküli bejelentkezés biztonsági kulccsal vagy ujjlenyomattal | passkey-k a böngészőben és a telefonon |
