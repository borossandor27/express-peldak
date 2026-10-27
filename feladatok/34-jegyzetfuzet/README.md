# 34. feladat – Jegyzetfüzet felhasználókkal ★★★

**Indítás:** `npm run f34` · **Adatbázis:** `data/jegyzetfuzet.sql` (adatbázis: `jegyzetfuzet`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `08-authentication`
**Feladat:** [FELADATOK-5.md](../FELADATOK-5.md), 34. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része. A `.env`-ben a `JWT_SECRET`-et is töltsd ki!

## Mit mutat be a feladat?

- A teljes hitelesítési folyamat **önállóan**: regisztráció, bejelentkezés, `bcrypt` hash, JWT token, hitelesítő middleware.
- **Saját adatok**: minden felhasználó csak a saját jegyzeteit látja és módosíthatja. A tulajdonost **a token** azonosítja, nem a kérés.
- A **401** (nem tudjuk, ki vagy) és a **404** (nincs ilyen – neked) különbsége.
- `ON DELETE CASCADE`: a fiók törlésével a jegyzetek is eltűnnek.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `felhasznalok` | `id`, `nev`, `email` (egyedi), `jelszo_hash`, `letrehozva` | 3 felhasználó, jelszavak az SQL fájl elején |
| `jegyzetek` | `id`, `felhasznalo_id` → `felhasznalok.id`, `cim`, `szoveg`, `letrehozva`, `modositva` (`NULL`, ha még nem módosították) | Annának 3, Bélának 2, Csillának 0 jegyzete van |

## Mire figyelj a megoldás során?

- **A `felhasznalo_id` mindig a `req.user.id`**. Ha a kliens a törzsben küld `felhasznaloId`-t, azt hagyd figyelmen kívül – különben bárki írhatna más nevében.
- **Minden jegyzet-lekérdezésben** ott legyen a tulajdonos: `WHERE id = ? AND felhasznalo_id = ?`. Nem elég csak a listánál – a `GET`, `PATCH`, `DELETE /jegyzetek/:id` ugyanúgy kell.
- **Más jegyzetére 404, nem 403.** A 403 elárulná, hogy a jegyzet létezik. A `WHERE ... AND felhasznalo_id = ?` miatt ez magától így lesz: a lekérdezés üres, az `affectedRows` 0.
- **A `jelszo_hash` soha ne kerüljön a válaszba.** Ne `SELECT *`-ot küldj vissza, sorold fel a mezőket.
- **Bejelentkezésnél ugyanaz a hibaüzenet**, ha nincs ilyen e-mail, és ha rossz a jelszó – így nem lehet kipróbálni, ki regisztrált.
- **Az e-mail kisbetűsítve** kerüljön az adatbázisba, és bejelentkezéskor is kisbetűsítve keress (`Anna@Pelda.hu` = `anna@pelda.hu`).
- **`await bcrypt.compare(...)`** – az `await` nélkül egy `Promise`-t kapsz, ami mindig igaznak számít, vagyis **bármilyen jelszó jó lenne**!
- **`jwt.verify`, nem `jwt.decode`.** A `decode` nem ellenőrzi az aláírást: bárki gyárthatna magának tokent.
- **Dátumok**: a `utils/db.js`-ben legyen `dateStrings: true`, különben a `DATETIME` oszlop `Date` objektum lesz, és a JSON-ban időzóna-eltolással jelenik meg (`"2026-10-01T06:15:00.000Z"`).
- A **`modositva`** a módosításkor az SQL-ben kapjon értéket: `SET modositva = NOW(), ...`.
- **Fiók törlése (szorgalmi)**: a régi token utána még érvényes (a JWT-t nem lehet „visszavonni”), ezért a `/auth/en`-nek ellenőriznie kell, hogy a felhasználó még létezik-e → 401.

## Ellenőrizd

- [ ] Token nélkül, hamis tokennel és `Token ...` fejléccel is 401 jön.
- [ ] Anna tokenjével Béla jegyzete se nem olvasható, se nem módosítható, se nem törölhető (404).
- [ ] A `felhasznaloId: 2`-vel küldött új jegyzet Annáé lett.
- [ ] phpMyAdminban a `jelszo_hash` oszlopban 60 karakteres `$2b$10$...` kezdetű szöveg van, nem a jelszó.
- [ ] A tokent a [jwt.io](https://jwt.io) oldalra másolva csak az `id`, az `email`, az `iat` és az `exp` látszik.
