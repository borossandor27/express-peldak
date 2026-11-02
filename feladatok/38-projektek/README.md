# 38. feladat – Projektek és munkaórák ★★★

**Indítás:** `npm run f38` · **Adatbázis:** `data/projektek.sql` (adatbázis: `projektek`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** [FELADATOK-6.md](../FELADATOK-6.md), 38. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit ismétel a feladat?

- **N:M kapcsolat kapcsolótáblával** (31. feladat) – de itt a kapcsolatnak **saját adatai** is vannak: dátum és óraszám.
- **Számított érték több táblából**: a költség a munkaórák és a dolgozó óradíjának szorzata (32. feladat: `SUM(db * egysegar)`).
- **`HAVING`** a csoportosítás utáni feltételhez (30. feladat).
- **DECIMAL → szám**, **`LEFT JOIN` + `COALESCE`**, **409** egy üzleti szabály megsértésekor.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `dolgozok` | `id`, `nev`, `munkakor`, `oradij` | 6 dolgozó; **Gulyás Ferenc** még nem dolgozott semmin |
| `projektek` | `id`, `nev`, `ugyfel`, `hatarido` (DATE), `keret` | 4 projekt; a **Mobilalkalmazáson** még senki sem dolgozott, az **Iskolai honlap** túllépte a keretét |
| `munkaorak` | `id`, `dolgozo_id`, `projekt_id`, `datum` (DATE), `ora` (DECIMAL(3,1)) | 17 bejegyzés |

## Mire figyelj a megoldás során?

- **`dateStrings: true`** a pool beállításai közé.
- **Az `ora` DECIMAL**, ezért a `mysql2` szövegként adja (`"7.5"`) – és minden, amit belőle számolsz (`SUM(ora)`, `SUM(ora * oradij)`) is szöveg lesz → `Number`. Ez a leggyakoribb hiba ebben a feladatban: `"osszOra":"25.0"` helyett `"osszOra":25` kell.
- **A projekt költsége** egy lekérdezésben: `projektek LEFT JOIN munkaorak LEFT JOIN dolgozok`, és `COALESCE(SUM(m.ora * d.oradij), 0)`. A `maradek` = `keret` − költség (lehet negatív is). Ezt a lekérdezést három végpont is használja: tedd egy konstansba.
- **`/projektek/tullepett`**: `HAVING koltseg > p.keret` – a `WHERE` még nem ismeri a költséget. Útvonal-sorrend: a `/projektek/:id` **előtt**!
- **`/dolgozok/:id` és `/projektek/:id`**: a beágyazott listához csoportosíts projektre, illetve dolgozóra (`GROUP BY`), mert egy dolgozónak egy projekten több napja is lehet.
- **`/statisztika/munkakorok`**: a munkakörben dolgozók száma `COUNT(DISTINCT d.id)` (a `JOIN` miatt egy dolgozó több sorban is szerepel).
- **`POST /munkaorak`**:
  1. **400**: `dolgozoId`, `projektId` pozitív egész; `datum` létező nap; `ora` szám, 0 < ora ≤ 8, fél órára kerek (`Number.isInteger(ora * 2)`). Az összes hibát egyszerre.
  2. **404**: létezik-e a dolgozó, illetve a projekt.
  3. **409**: az adott dolgozó adott napi óráinak összege (`SELECT COALESCE(SUM(ora), 0) ... WHERE dolgozo_id = ? AND datum = ?`) az újjal együtt sem lehet több 8-nál. Az üzenetben szerepeljen, mennyi fér még bele.
  4. **201** + az új bejegyzés a dolgozó és a projekt **nevével**.

## Ellenőrizd

- [ ] `GET /projektek` → az Iskolai honlap költsége 215250, maradéka −65250; a Mobilalkalmazásé 0 és 900000.
- [ ] `GET /dolgozok` → Gulyás Ferenc is benne van, `"osszOra":0`.
- [ ] Minden óraszám és költség **szám**, nem szöveg.
- [ ] Bíró Annának 2026-10-06-ra már semmit nem lehet felvenni (409).
