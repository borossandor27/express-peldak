# 32. feladat – Webshop rendelések ★★★★

**Indítás:** `npm run f32` · **Adatbázis:** `data/webshop.sql` (adatbázis: `webshop`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** [FELADATOK-4.md](../FELADATOK-4.md), 32. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Négy összekapcsolt tábla**: vásárló → rendelés → tétel ← termék.
- **Számított érték**: a végösszeg nincs eltárolva, a tételekből jön (`SUM(db * egysegar)`).
- **Miért van ár a tételben is?** A termék ára változhat, a régi rendelés végösszege nem. (Nézd meg a 4. rendelés egerét: 6490 Ft, a mai ár 6990 Ft.)
- **Feltétel a `LEFT JOIN` `ON` részében** vagy a `WHERE`-ben – nem ugyanaz!
- **Havi bontás** (`DATE_FORMAT`), **TOP n** (`LIMIT ?`), **`NOT EXISTS`**.
- (Szorgalmi) **Tranzakció**: rendelés és tételei együtt.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `vasarlok` | `id`, `nev`, `email`, `varos` | Varga Bence még nem rendelt |
| `termekek` | `id`, `nev`, `kategoria`, `ar` | az Egérpad XL-t még senki sem rendelte |
| `rendelesek` | `id`, `vasarlo_id`, `datum` (DATE), `statusz` (ENUM) | a 3. rendelés **törölve** |
| `tetelek` | `id`, `rendeles_id`, `termek_id`, `db`, `egysegar` | `ON DELETE CASCADE` a rendelésre |

## Mire figyelj a megoldás során?

- **`dateStrings: true`** a pool beállításai közé – különben a `2026-08-03`-ból `"2026-08-02T22:00:00.000Z"` lesz.
- **A rendelések listája** egy lekérdezés: `rendelesek` + `vasarlok` + `tetelek`, `GROUP BY r.id, ...`. A `SUM` eredménye szöveg → `Number`.
- **A dátumszűrő** (`?tol=`, `?ig=`) `ÉÉÉÉ-HH-NN` alakú, **létező** nap legyen. A `2026-02-30`-at a reguláris kifejezés átengedi; ellenőrizd pl. így: `new Date(s).toISOString().slice(0, 10) === s`.
- **Egy rendelés részletei**: két lekérdezés (fejléc a vásárlóval + tételek a termékek nevével). A `vasarlo` beágyazott objektum legyen, a `vegosszeg` a tételek `osszeg`-einek összege.
- **⚠️ `/vasarlok` – a törölt rendelés csapdája**: a törölt rendelést ki kell hagyni, de a rendelés nélküli Varga Bencének benne kell maradnia.
  - `LEFT JOIN rendelesek r ON r.vasarlo_id = v.id WHERE r.statusz <> 'törölve'` → **rossz**: Varga Bencénél `r.statusz` `NULL`, és a `NULL <> 'törölve'` nem igaz → kiesik.
  - `LEFT JOIN rendelesek r ON r.vasarlo_id = v.id AND r.statusz <> 'törölve'` → **jó**: a feltétel csak azt dönti el, melyik rendelés kapcsolódik.
  - A rendelés nélküli vásárlónál a `SUM` `NULL` → `COALESCE(SUM(...), 0)`. A rendelések száma `COUNT(DISTINCT r.id)` (a tételek miatt egy rendelés több sorban is szerepel).
- **`/vasarlok/:id/rendelesek`**: nem létező vásárló → 404, rendelés nélküli → `[]`.
- **`/statisztika/havi`**: `DATE_FORMAT(r.datum, '%Y-%m') AS honap`, `GROUP BY honap`, `COUNT(DISTINCT r.id)`.
- **`/statisztika/top-termekek`**: ha nincs `?n=`, az alapérték 3. `LIMIT ?` – a paraméter szám legyen.
- **`/termekek/sosem-rendelt`**: `WHERE NOT EXISTS (SELECT 1 FROM tetelek t WHERE t.termek_id = tk.id)`. (A `LEFT JOIN ... IS NULL` is jó megoldás.)
- **Szorgalmi `POST`**: a tételek egységára a termék **mai** ára (`SELECT id, ar FROM termekek WHERE id IN (?)`). Ha valamelyik termék nincs meg → 404, és sorold fel, melyik. A beszúrás: `INSERT INTO rendelesek`, majd `INSERT INTO tetelek (...) VALUES ?` tömbök tömbjével – **egy tranzakcióban** (lásd a 19. és a 21. MySQL-es feladatot).

## Ellenőrizd

- [ ] `GET /rendelesek/4` → `vegosszeg` 28970, az egér egységára 6490.
- [ ] `GET /vasarlok` → 6 vásárló; Tóth Eszter költése 91980 (a törölt 99980 nem számít); Varga Bence 0.
- [ ] `GET /statisztika/havi` → augusztusban 2 rendelés (a törölt nem).
- [ ] Minden szám szám, a dátumok `"2026-08-03"` alakúak.
