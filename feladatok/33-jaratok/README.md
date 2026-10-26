# 33. feladat – Repülőjáratok ★★★★

**Indítás:** `npm run f33` · **Adatbázis:** `data/jaratok.sql` (adatbázis: `jaratok`) · **Teszteléshez:** `requests.http` · **Mintapélda:** `07-mysql`
**Feladat:** [FELADATOK-4.md](../FELADATOK-4.md), 33. feladat
**Előkészítés** (XAMPP, importálás, `.env`, `utils/db.js`): a fő [README.md](../../README.md) „Adatbázisos (MySQL) változatok” része.

## Mit mutat be a feladat?

- **Egy táblára két idegen kulcs**: a járat a `honnan_id`-val és a `hova_id`-val is a `repuloterek` táblára hivatkozik → ugyanazt a táblát kétszer kell `JOIN`-olni, **két különböző álnévvel**.
- **`TIME` típus** és időszámítás SQL-ben (`ADDTIME`, `SEC_TO_TIME`, `TIME_TO_SEC`, `TIME_FORMAT`).
- **Allekérdezés a `SELECT` részben** (induló és érkező járatok száma).
- **Tábla összekapcsolása önmagával** (self-join): átszállásos útvonal keresése.

## Az adatbázis felépítése

| Tábla | Oszlopok | Megjegyzés |
|---|---|---|
| `repuloterek` | `id`, `kod`, `nev`, `varos`, `orszag` | 8 repülőtér; a `kod` egyedi (pl. `BUD`); a DEB-ről nincs járat |
| `legitarsasagok` | `id`, `kod`, `nev` | 5 légitársaság |
| `jaratok` | `id`, `jaratszam`, `legitarsasag_id`, `honnan_id`, `hova_id`, `indulas` (TIME), `idotartam` (perc), `ar` | 16 járat; `CHECK (honnan_id <> hova_id)` |

## Mire figyelj a megoldás során?

- **Két `JOIN` ugyanarra a táblára**:
  ```sql
  FROM jaratok j
  JOIN legitarsasagok l ON l.id = j.legitarsasag_id
  JOIN repuloterek h ON h.id = j.honnan_id
  JOIN repuloterek c ON c.id = j.hova_id
  ```
  A `SELECT`-ben mindig az álnévvel együtt írd az oszlopot: `h.kod AS honnan`, `c.kod AS hova`. Álnév nélkül a `kod` kétértelmű (és a `legitarsasagok`-ban is van `kod`!).
- **Az érkezés számolása**: `ADDTIME(j.indulas, SEC_TO_TIME(j.idotartam * 60))`. Formázás: `TIME_FORMAT(..., '%H:%i')` → `"09:00"` (különben `"09:00:00"`).
- **Rendezés idő szerint**: `ORDER BY j.indulas` – a `TIME` típus jól rendez. (A formázott szöveg is jól rendezne, mert mindig két számjegyű az óra.)
- **A repülőtér-kód**: 3 betű, kisbetűvel is fogadd el (`toUpperCase()`). Más formátum → 400, nem létező kód → 404. A **létező repülőtér járat nélkül** (DEB) → `[]`, nem 404.
- **Induló és érkező járatok száma**: két allekérdezés a `SELECT`-ben:
  `(SELECT COUNT(*) FROM jaratok j WHERE j.honnan_id = r.id) AS indulo`.
  (Két `LEFT JOIN` + `COUNT` itt hibás eredményt adna: a két `JOIN` egymással is megsokszorozza a sorokat. Próbáld ki!)
- **`/legitarsasagok`**: `COUNT(DISTINCT j.hova_id)` a különböző célállomások száma. Az `AVG` eredménye szöveg → `Number`.
- **Átszállás (self-join)**:
  ```sql
  FROM jaratok j1
  JOIN jaratok j2 ON j2.honnan_id = j1.hova_id
  ```
  A várakozás percben: `(TIME_TO_SEC(j2.indulas) - TIME_TO_SEC(j1.indulas)) / 60 - j1.idotartam`. A 60–300 perces feltétel a számított oszlopra vonatkozik: `HAVING varakozas BETWEEN ? AND ?` (vagy írd ki a képletet a `WHERE`-be). Az osztás eredménye DECIMAL → szöveg → `Number`.
- **Ellenőrzés az `/utvonal`-nál**: hiányzó vagy hibás kód → 400; azonos indulási és célállomás → 400; nem létező repülőtér → 404. Ha nincs találat, az **nem hiba**: két üres tömb.

## Ellenőrizd

- [ ] `GET /jaratok/OS87` → `"erkezes":"19:30"`.
- [ ] `GET /repuloterek` → BUD: 7 induló, 5 érkező; DEB: 0 és 0.
- [ ] `GET /utvonal?honnan=BUD&hova=JFK` → 3 átszállásos útvonal, a legolcsóbb Bécsen át (234000 Ft). A londoni (55 perces) átszállás nincs benne.
- [ ] A lekérdezésekben egyetlen oszlop sincs álnév nélkül, ha több táblában is előfordul.
