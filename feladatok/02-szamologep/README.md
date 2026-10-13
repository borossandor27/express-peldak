# 2. feladat – Számológép ★

**Indítás:** `npm run f02` · **Mintapélda:** `01-hello-get` · **Teljes leírás:** [FELADATOK.md](../FELADATOK.md)

## Mit mutat be a feladat?

- **Több útvonal-paraméter** egy végponton (`/hatvany/:alap/:kitevo`).
- A **bemenet ellenőrzése**: a szerver soha nem bízhat abban, amit a kliens küld.
- A **400 Bad Request** státuszkód: a kérés hibás, a kliensnek kell javítania.
- A korai visszatérés (`return res.status(400).send(...)`) mint vezérlési minta.

## Mire figyelj a megoldás során?

- A `req.params` értékei **szövegek**. `"2" + "3"` eredménye `"23"`, nem `5`! Mindig alakítsd át: `Number(...)`.
- Kétféle hibát kell kiszűrni: **nem szám** (`isNaN`) és **nem egész szám** (`Number.isInteger`). Gondold végig, melyik végpontnál melyik kell.
- **A `return` nélkül a kód tovább fut**, és megpróbál egy második választ is küldeni → „Cannot set headers after they are sent” hiba a terminálon.
- A faktoriálisnál a 0–20 tartomány nem véletlen: a 21! már nagyobb, mint amit a JavaScript `Number` pontosan tárolni tud. A 0! értéke 1.
- Az osztóknál gondolj a szélső esetekre: 0, 1, negatív számok. A „(prímszám)” megjegyzés csak akkor jelenjen meg, ha pontosan két osztó van.
- A `/nagyobb` végpontnál az egyenlőség külön eset.
- A válasz szövege **pontosan** egyezzen a táblázattal.

## Ellenőrizd

- [ ] Minden végpontot kipróbáltál helyes **és** hibás bemenettel is.
- [ ] Hibás bemenetnél a státuszkód 400, és a terminálon nincs hibaüzenet.
