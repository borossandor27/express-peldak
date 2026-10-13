# 24. feladat – Mit várok? (kódolás ELŐTT töltsd ki!)

Nyisd meg a `data/meresek.json` fájlt, és **kézzel** döntsd el, hogy az alábbi kérésekre milyen választ kell adnia a szervernek. Listánál az id-ket írd be, statisztikánál az értékeket, hibánál a státuszkódot.

Ha kész a szerver, futtasd le ugyanezeket a kéréseket (`requests.http`), és írd be a kapott választ is. Ahol a kettő eltér, ott vagy a kódod, vagy a várakozásod hibás – derítsd ki, melyik!

| # | Kérés | Várt válasz (kódolás előtt) | Kapott válasz | Egyezik? |
|---|---|---|---|---|
| 1 | `/meresek?varos=Budapest&tol=2026-02-01` | | | |
| 2 | `/meresek?tol=2026-02-01&ig=2026-02-01` | | | |
| 3 | `/meresek?minHo=0` | | | |
| 4 | `/meresek?maxHo=0` | | | |
| 5 | `/meresek?minHo=-5&maxHo=-3` | | | |
| 6 | `/meresek?maxCsapadek=0` | | | |
| 7 | `/meresek?maxCsapadek=0.5` | | | |
| 8 | `/meresek?varos=debrecen&minHo=1` | | | |
| 9 | `/meresek/statisztika?varos=Debrecen` | db: … átlag: … min: … max: … szarazNapok: … | | |
| 10 | `/meresek/statisztika?tol=2026-03-01` | db: … átlag: … min: … max: … szarazNapok: … | | |
| 11 | `/meresek?minHo=` | | | |
| 12 | `/meresek?ig=2026-1-31` | | | |

**Gondolkodj el:**

1. A 3. sorban hány mérés jönne vissza, ha a kód először számmá alakítaná a paramétert (`const min = Number(req.query.minHo)`), és utána `if (min)` vizsgálná, hogy meg van-e adva? Miért?
2. A 11. sorban mit adna vissza a `Number('')`? Mi lenne a válasz, ha nem ellenőriznéd?
3. Miért lehet a dátumokat (`'2026-02-01' <= '2026-02-15'`) egyszerű szövegként összehasonlítani? Mikor nem működne ez?
