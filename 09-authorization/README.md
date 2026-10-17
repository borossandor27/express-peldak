# 09 – Szerepkörök és jogosultságok (roles and permissions)

**Indítás:** `npm run 09` · **Adatbázis:** `data/konyvtar.sql` + `data/felhasznalok.sql` (adatbázis: `konyvtar`) · **Teszteléshez:** `requests.http`

A `08-authentication` példa arra válaszolt, hogy **„Ki vagy?”** (hitelesítés). Ez a példa arra, hogy **„Mit tehetsz?”** (jogosultságkezelés, *authorization*).

## Javasolt felépítés

1. **Kliens kérése**
   Például: `DELETE /api/konyvek/12`
2. **Hitelesítő middleware** (`middleware/authenticate.js`)
   JWT ellenőrzése, felhasználó azonosítása → `req.user = { id, role }`
3. **Jogosultsági middleware** (`middleware/authorize.js`)
   Megvan-e a könyvtörléshez szükséges jog?
4. **Végpont és adatbázis-művelet**
   Csak engedélyezett kérés esetén hajtódik végre.

Ha a felhasználó nincs bejelentkezve, általában **401 Unauthorized** választ adunk. Ha be van jelentkezve, de nincs megfelelő jogosultsága, akkor **403 Forbidden** a szokásos válasz.

| Státusz | Jelentése | Mikor? | Mit tegyen a kliens? |
|---|---|---|---|
| **401** Unauthorized | „Nem tudom, ki vagy.” | nincs token, hibás vagy lejárt a token | jelentkezzen be (újra) |
| **403** Forbidden | „Tudom, ki vagy, de ezt nem teheted.” | érvényes token, de rossz szerepkör | ne próbálja újra – a bejelentkezés sem segít |

## Egyszerű szerepkör-alapú jogosultságkezelés

A könyvkölcsönző alkalmazásban három szerepkör van:

| Szerepkör | Könyvek listázása | Könyv felvétele | Könyv törlése | Felhasználók kezelése |
|-----------|-------------------|-----------------|---------------|-----------------------|
| user      | Igen              | Nem             | Nem           | Nem                   |
| librarian | Igen              | Igen            | Nem           | Nem                   |
| admin     | Igen              | Igen            | Igen          | Igen                  |

## Mappaszerkezet

```
09-authorization/
├── .env / .env.example
├── app.js                       ← szerver, routerek csatolása /api alá
├── middleware/
│   ├── authenticate.js          ← "Ki vagy?"    token -> req.user, különben 401
│   └── authorize.js             ← "Mit tehetsz?" szerepkör ellenőrzése, különben 403
├── routes/
│   ├── auth.js                  ← regisztráció (mindig user), bejelentkezés, saját adatok
│   ├── konyvek.js               ← könyvek, végpontonként más jogosultsággal
│   └── felhasznalok.js          ← csak admin: lista, szerepkör módosítása
├── utils/db.js
└── data/
    ├── konyvtar.sql             ← könyvek, szerzők, olvasók, kölcsönzések
    └── felhasznalok.sql         ← a felhasználók táblája szerepkörökkel
```

## Előkészítés

1. XAMPP: indítsd el a **MySQL**-t.
2. phpMyAdmin → **Importálás**: előbb a `data/konyvtar.sql`, **utána** a `data/felhasznalok.sql`.
3. A projekt gyökerében (egyszer): `npm install jsonwebtoken bcryptjs`
4. Másold le a `.env.example` fájlt **`.env`** néven, és töltsd ki a `JWT_SECRET`-et (lásd a 08-as README-t).

**Mintafelhasználók** (mindegyik jelszava `Jelszo123`):

| E-mail | Szerepkör |
|---|---|
| `olvaso@konyvtar.hu` | user |
| `konyvtaros@konyvtar.hu` | librarian |
| `admin@konyvtar.hu` | admin |

## Végpontok

| Metódus | Útvonal | Ki használhatja? | Siker | Hiba |
|---|---|---|---|---|
| POST | `/api/auth/bejelentkezes` | bárki | 200 + token | 400, 401 |
| POST | `/api/auth/regisztracio` | bárki | 201 (mindig **user**) | 400, 409 |
| GET | `/api/auth/en` | bejelentkezve | 200 | 401 |
| GET | `/api/konyvek` | user, librarian, admin | 200 | 401 |
| GET | `/api/konyvek/:id` | user, librarian, admin | 200 | 401, 404 |
| POST | `/api/konyvek` | librarian, admin | 201 | 400, 401, **403** |
| DELETE | `/api/konyvek/:id` | admin | 204 | 401, **403**, 404, 409 kikölcsönzött könyv |
| GET | `/api/felhasznalok` | admin | 200 | 401, **403** |
| PATCH | `/api/felhasznalok/:id/szerepkor` | admin | 200 | 400, 401, **403**, 404 |

Új könyv: `{ "cim": "Az ember tragédiája", "szerzo_id": 5, "ev": 1861 }`. A `szerzo_id`-nek létező szerzőre kell mutatnia.

## Hogyan működik?

### 1. A szerepkör a tokenbe kerül

Bejelentkezéskor az adatbázisból kiolvasott szerepkört a tokenbe írjuk:

```js
jwt.sign({ id: f.id, role: f.szerepkor }, process.env.JWT_SECRET, { expiresIn: '1h' });
```

Mivel a token alá van írva, a kliens nem tudja átírni a `"role": "user"` értéket `"admin"`-ra: az aláírás elromlana, és az `authenticate` **401**-et adna.

### 2. Middleware-ek láncban

```js
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => { ... });
//                    ^ 1. ki vagy?  ^ 2. admin vagy?    ^ 3. csak ha mindkettő rendben
```

Az `authorize` egy **függvényt visszaadó függvény** (*factory*): a paraméterként kapott szerepkörökhöz készít egy middleware-t.

```js
authorize('librarian', 'admin')   // -> (req, res, next) => { ... }
```

### 3. Egy egész router védelme

Ha egy router **minden** végpontja ugyanazt a jogosultságot kéri, elég egyszer megadni:

```js
// routes/felhasznalok.js
router.use(authenticate, authorize('admin'));
```

### 4. A szerepkört soha nem a kliens választja

A regisztrációnál hiába küldi el valaki a `"szerepkor": "admin"` mezőt, a szerver figyelmen kívül hagyja: mindenki **user**-ként kezd. Szerepkört csak egy admin adhat (`PATCH /api/felhasznalok/:id/szerepkor`). A saját szerepkörét az admin nem módosíthatja, nehogy az utolsó admin véletlenül elvegye a saját jogát.

## Mire figyelj?

- **A frontend elrejtése nem védelem.** Ha a weboldalon nem jelenik meg a „Törlés” gomb, a kérést attól még bárki elküldheti (pl. a `requests.http`-ből). A jogosultságot **mindig a szerveren** kell ellenőrizni.
- **A token „régi” szerepkört tartalmazhat.** Ha az admin előlépteti az olvasót, az olvasó régi tokenjében még `"role": "user"` szerepel, amíg újra be nem jelentkezik (vagy a token le nem jár). Próbáld ki a `requests.http` végén! A `GET /api/auth/en` mindkettőt megmutatja: `szerepkor` (adatbázis) és `szerepkorATokenben`. Ha ez nem elfogadható, az `authenticate` middleware minden kérésnél kiolvashatja a szerepkört az adatbázisból – ez biztosabb, de lassabb.
- **Rövid lejárat:** minél rövidebb ideig érvényes a token, annál hamarabb érvényesül egy szerepkörváltozás vagy egy letiltás.

## Továbblépés: jogosultság-alapú ellenőrzés

Sok szerepkörnél a szerepkörök felsorolása helyett **jogosultságokat** (*permission*) érdemes ellenőrizni. A szerepkörök és jogaik egy helyen vannak megadva, a végpont pedig csak azt kérdezi, megvan-e a szükséges jog:

```js
// middleware/engedely.js
const JOGOK = {
  user:      ['konyv:olvas'],
  librarian: ['konyv:olvas', 'konyv:letrehoz'],
  admin:     ['konyv:olvas', 'konyv:letrehoz', 'konyv:torol', 'felhasznalo:kezel'],
};

export const engedely = (jog) => (req, res, next) =>
  JOGOK[req.user?.role]?.includes(jog) ? next() : res.status(403).json({ hiba: 'Nincs jogosultságod a művelethez!' });

// routes/konyvek.js
router.delete('/:id', authenticate, engedely('konyv:torol'), async (req, res) => { ... });
```

Ha később új szerepkör kell (pl. `moderator`), csak a `JOGOK` objektumot kell bővíteni, a végpontokhoz nem kell nyúlni.

## Próbáld ki (`requests.http`)

1. Futtasd a három bejelentkezést: a tokenek a `{{user}}`, `{{librarian}}` és `{{admin}}` változókba kerülnek.
2. Kérd le a könyveket token nélkül (**401**), majd a `{{user}}` tokennel (**200**).
3. Vegyél fel könyvet `{{user}}`-ként (**403**), majd `{{librarian}}`-ként (**201**).
4. Töröld a felvett könyvet `{{librarian}}`-ként (**403**), majd `{{admin}}`-ként (**204**).
5. Próbálj törölni egy kikölcsönzött könyvet (pl. a 3-ast): **409**, mert az idegen kulcs nem engedi.
6. Regisztrálj `"szerepkor": "admin"` mezővel: a válaszban is látszik, hogy **user** lettél.
7. Léptesd elő az olvasót, és nézd meg, mit ad a régi tokenje, és mit ad egy új bejelentkezés után.
