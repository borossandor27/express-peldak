# 35. feladat – Munkamenetek és kijelentkezés ★★★★

**Indítás:** `npm run f35` · **Adatbázis:** `data/munkamenetek.sql` (adatbázis: `munkamenetek`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `08-authentication`
**Feladat:** [FELADATOK-5.md](../FELADATOK-5.md), 35. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- A JWT **alternatíváját**: a szerver maga tárolja a munkameneteket (*stateful*), a token csak egy véletlen azonosító.
- Ami JWT-vel nem megy: **valódi kijelentkezés**, egy eszköz kiléptetése, „kijelentkezés mindenhol”.
- Miért kell a tokent is **hash-elve** tárolni, és miért elég ide a SHA-256 (a jelszóhoz viszont nem).
- Lejárat kezelése **az adatbázisban** (`DATE_ADD(NOW(), INTERVAL ? MINUTE)`, `lejar > NOW()`).

## JWT vagy szerveroldali munkamenet?

| | JWT (08-as példa, 34. feladat) | Munkamenet (ez a feladat) |
|---|---|---|
| A token | aláírt JSON, benne az `id` | 64 karakter véletlen, semmi jelentése |
| Ellenőrzés | `jwt.verify` – adatbázis nélkül | keresés a `munkamenetek` táblában |
| Kijelentkezés | csak a kliens „felejti el”, a token a lejáratig érvényes | törlöd a sort → **azonnal** érvénytelen |
| Egy eszköz kiléptetése | nem lehet | `DELETE ... WHERE id = ?` |
| Ára | – | minden kérésnél egy lekérdezés |

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `felhasznalok` | `id`, `nev`, `email`, `jelszo_hash` | Anna és Béla, nincs regisztráció |
| `munkamenetek` | `id`, `felhasznalo_id` → `felhasznalok.id`, `token_hash` (egyedi), `eszkoz`, `letrehozva`, `utoljara`, `lejar` | Annának 2 érvényes és 1 lejárt, Bélának 1 érvényes munkamenete van |

## Mire figyelj a megoldás során?

- **A token nyers alakja soha ne kerüljön az adatbázisba**, csak a `tokenHash(token)`. Ha az adatbázis kiszivárog, a hash-ekkel nem lehet bejelentkezni. A nyers tokent a kliens egyetlen egyszer kapja meg, a bejelentkezés válaszában.
- **Miért SHA-256 és nem bcrypt?** A bcrypt sót kever a hash-be, így ugyanabból a tokenből mindig más hash lenne – `WHERE token_hash = ?` keresés nem működne. A SHA-256 viszont gyors, és ez a jelszónál baj lenne, de egy 256 bites véletlen tokent próbálgatással úgysem lehet megtalálni.
- **`crypto.randomBytes`, nem `Math.random`.** A `Math.random` nem kriptográfiai célú, a kimenete kiszámítható lehet.
- **A lejáratot az SQL számolja** (`DATE_ADD(NOW(), INTERVAL ? MINUTE)`) és az SQL is ellenőrzi (`lejar > NOW()`). Így nem keveredik a JavaScript és a MySQL időzónája.
- **Az `authenticate` itt `async`**, mert lekérdez. Express 5-ben a dobott hiba így is a hibakezelőhöz jut.
- **A `req.munkamenetId`** kell a kijelentkezéshez és a `jelenlegi` mezőhöz: a middleware tegye el, melyik munkamenetből jött a kérés.
- **Más munkamenete: 404.** A törlésnél is legyen `AND felhasznalo_id = ?`.
- **A lista ne tartalmazza** a `token_hash`-t és a lejárt munkameneteket.
- **„Kijelentkezés mindenhol”**: a jelenlegi maradjon meg (`id <> ?`), különben a felhasználót is kiléptetnéd.
- **Jelszócsere után** a többi munkamenet törlődjön: ha a jelszót ellopták, a támadó munkamenete is megszűnik.
- Az `eszkoz` nem kötelező; ha hiányzik vagy üres, legyen `ismeretlen eszköz`, és legfeljebb 100 karakter.

## Ellenőrizd

- [ ] phpMyAdminban a `token_hash` oszlopban nincs ott a bejelentkezéskor kapott token (csak egy másik, 64 karakteres szöveg).
- [ ] Kijelentkezés után ugyanazzal a tokennel 401 jön.
- [ ] A lejárt (`Régi laptop`) munkamenet nem jelenik meg a listában, és a tokenje 401-et ad.
- [ ] `MUNKAMENET_PERC=1` beállítással egy perc után a friss token is 401-et ad.
- [ ] Jelszócsere után a tablet tokenje 401, a jelszót cserélő eszközé 200.
