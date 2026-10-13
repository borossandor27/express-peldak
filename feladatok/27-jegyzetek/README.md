# 27. feladat – Jegyzetek CRUD ★★★

**Indítás:** `npm run f27` · **Ellenőrzés:** `npm run t27` · **Teljes leírás:** [FELADATOK-3.md](../FELADATOK-3.md) · **Teszteléshez:** `requests.http`

## Mit mutat be a feladat?

- **Pontos HTTP válaszok**: nem elég, hogy „működik”, a státuszkódnak és a törzsnek is pontosan a megállapodás szerintinek kell lennie.
- A **201 + az új objektum** és a **204 üres törzzsel** jelentése.
- **Szerver által kezelt mezők** (`id`, `letrehozva`), amelyeket a kliens nem írhat felül.
- Az **új id** helyes előállítása: *legnagyobb id + 1*.

## Mire figyelj a megoldás során?

- **A POST válasza 201 + az új jegyzet objektuma**, nem „Sikeres mentés” szöveg – különben a kliens nem tudja meg az új id-t.
- **A DELETE válasza 204, törzs nélkül.** A `res.status(204).json({...})` ellentmondás: a 204 jelentése „nincs tartalom”.
- **`length + 1` helyett legnagyobb id + 1.** Nézd meg az adatokat: hiányzik egy id. A `length + 1` már létező id-t adna ki.
- PUT-nál ne a teljes `req.body` kerüljön a régi helyére, mert így elveszik az `id` és a `letrehozva`.
- A kliens által küldött `id`-t hagyd figyelmen kívül, az ismeretlen mezőt (`szin`) ne mentsd el.
- A `letrehozva` csak létrehozáskor kap értéket, PUT-nál és PATCH-nél nem változik.
- A `szoveg` **lehet üres** (`""`), a `cim` nem, és legfeljebb 50 karakter.
- A `?fontos=true` **szöveg**: `=== 'true'`, nem `=== true`. Más értékre 400.
- PATCH-nél legalább egy ismert mezőnek lennie kell.

## Ellenőrizd

- [ ] A `requests.http` minden kérésénél a válasz egyezik a fölé írt várt válasszal.
- [ ] `npm run t27` – a szervert előtte állítsd le.
