# **Authentication** (Hitelesítés – Ki vagy te?) és **Authorization** (Jogosultságkezelés – Mit tehetsz?)

A példában egy normál felhasználó megtekintheti a profilját, de csak admin törölhet felhasználókat.

## A folyamat

1. **Bejelentkezés** Felhasználónév + jelszó

2. **Authentication** Jelszó ellenőrzése, JWT token létrehozása

3. **Kérés a szerverhez** Authorization: Bearer TOKEN

4. **Authorization** Jogosultság ellenőrzése

5. **Kért művelet végrehajtása** Engedélyezés vagy 403 Forbidden

## A projekt felépítése

auth-demo/
│
├── middleware/
│   ├── authenticate.js
│   └── authorize.js
│
├── routes/
│   └── api.js
│
├── .env
├── package.json
└── server.js

## Szükséges csomagok

```bash
npm init -y
npm install express jsonwebtoken bcryptjs dotenv
```

## A működés kipróbálása Thunder Clienttel vagy Postmannel

### bejelentkezés

```http
POST http://localhost:3000/api/login
Content-Type: application/json

{
    "username": "tanulo",
    "password": "123456"
}
```

Válaszként kapunk egy JWT tokent:

```json
{
    "message": "Sikeres bejelentkezés!",
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### saját profil lekérése

```http
GET
 http://localhost:3000/api/profil

Headers:
Authorization: Bearer IDE_MASOLD_A_TOKEN_T
```

Eredmény: 200 OK.

### admin végpont meghívása

```http
GET
 http://localhost:3000/api/admin
```

A tanulo felhasználó tokenjével:
403 Forbidden
A tanulo be van jelentkezve, tehát a hitelesítés sikeres, de nem admin. Ezért a jogosultságkezelés megtagadja a hozzáférést.

Ha az admin felhasználóval jelentkezünk be, ugyanez a végpont 200 OK választ ad.

## Összefoglaló: mi történik az egyes kéréseknél?

| **Végpont**   | **Hitelesítés**    | **Jogosultság** | **Eredmény** |
| ------------- | ------------------ | --------------- | ------------ |
| POST /login   | Jelszó ellenőrzése | –               | Token        |
| GET /profil   | Kötelező           | Bármelyik       | 200          |
| GET /admin    | Kötelező           | admin           | 200 vagy 403 |
| GET /tananyag | Kötelező           | user vagy admin | 200          |

| **Helyzet**               | **HTTP státuszkód** |
| ------------------------- | ------------------- |
| Nincs token               | 401                 |
| Hibás token               | 401                 |
| Lejárt token              | 401                 |
| Nincs megfelelő szerepkör | 403                 |
| Minden rendben            | 200                 |

## tanulói feladat

Bővítsék az alkalmazást az alábbi végpontokkal:

| **Végpont**             | **Jogosultság** |
| ----------------------- | --------------- |
| GET /api/konyvek        | user, admin     |
| POST /api/konyvek       | admin           |
| PUT /api/konyvek/:id    | admin           |
| DELETE /api/konyvek/:id | admin           |
| GET /api/felhasznalok   | admin           |
| GET /api/profil         | user, admin     |

## Néhány fontos biztonsági megjegyzés

Éles alkalmazásban még szükséges:

- A felhasználók adatbázisban történő tárolása.
- A JWT titkos kulcsának megfelelő, véletlenszerű generálása és biztonságos kezelése.
- A jogosultságok szükség szerinti újbóli ellenőrzése az adatbázisból.
- A bemeneti adatok szerveroldali validálása.
- A token biztonságos tárolása. Böngészős alkalmazásban az HttpOnly, Secure és megfelelő SameSite beállítású cookie is megfontolandó.
- A JWT payload nem titkosított, ezért abba jelszót vagy bizalmas adatot nem szabad tenni.
