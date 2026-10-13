# 19. feladat – Receptkönyv ★★★

**Indítás:** `npm run f19` · **Mintapélda:** `04-crud` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md) · **Teszteléshez:** `requests.http`

## Mit mutat be a feladat?

- CRUD **beágyazott tömbbel**: egy receptnek hozzávaló-listája van.
- **Al-erőforrás** kezelése saját útvonalakkal (`/receptek/:id/hozzavalok`).
- Egy tömb **minden elemének** ellenőrzése, a hiba helyének megjelölésével.
- **Rövid lista** és teljes nézet ugyanarról az adatról.
- Csoportosítás **összetett kulccsal** (név + egység).

## Mire figyelj a megoldás során?

- **Készíts másolatot a `data` mappáról**, mert a szerver a fájlba ment.
- A `GET /receptek` csak a rövid adatokat adja (`id`, `nev`, `kategoria`, `idoPerc`), a hozzávalókat nem.
- A `?hozzavalo=liszt` szűrésnél a beágyazott tömbben kell keresni (`some`).
- **Adagszámításnál ne módosítsd az eredeti receptet!** A spread operátor csak **sekély** másolatot készít: ha a hozzávaló objektumát közvetlenül átírod, az eredeti adat is megváltozik, és a következő kérés már rossz számokkal indul. Készíts új hozzávaló-objektumokat (`map`).
- Az átszámított mennyiséget kerekítsd két tizedesre.
- A bevásárlólistában csak az **azonos nevű és egységű** hozzávalók adódnak össze (a `2 db tojás` és a `100 g tojás` nem). Nem létező receptazonosítóra adj hibát.
- A validációnál a hibaüzenet mondja meg, **hányadik** hozzávaló hibás (1-től számolva). Üres tömb és nem tömb (`Array.isArray`) is hiba.
- Új hozzávaló felvételekor a már létező név **409**.
- Az utolsó hozzávaló nem törölhető (400). Az ékezetes név az URL-ben kódolva érkezik, az Express a `req.params`-ban visszaalakítja.

## Ellenőrizd

- [ ] A `/receptek/1/adag/6` után a `/receptek/1` még az eredeti mennyiségeket adja.
- [ ] A bevásárlólistában a tojás 6 db.
- [ ] A hibás hozzávalóra a hibaüzenet a sorszámát is tartalmazza.
