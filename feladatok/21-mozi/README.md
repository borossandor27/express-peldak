# 21. feladat – Mozi jegyfoglalás ★★★★

**Indítás:** `npm run f21` · **Mintapélda:** `05-routing` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md) · **Teszteléshez:** `requests.http`

## Mit mutat be a feladat?

- **Három összekapcsolt erőforrás** (filmek, vetítések, foglalások) három routerrel.
- **Származtatott adatok**: a szabad helyek számát és az ülésrendet a foglalásokból kell kiszámolni, nem tárolni.
- **Többlépcsős ellenőrzés** meghatározott sorrendben, különböző státuszkódokkal (400, 404, 409).
- `Set` használata gyors kereséshez és az ismétlődések kiszűréséhez.
- Szöveges (`text/plain`) válasz előállítása adatokból (ülésrend).

## Mire figyelj a megoldás során?

- **Az ellenőrzés sorrendje kötött** (lásd a táblázatot a leírásban). Az első hibánál térj vissza.
- A helyek tömbje 1–10 elemű legyen; minden helynél a `sor` és a `szek` **egész** szám, 1-től a terem méretéig.
- Ugyanaz a hely **egy kérésen belül** kétszer se szerepelhessen.
- **409** esetén az **összes** foglalt helyet sorold fel, ne csak az elsőt.
- Az árat **a szerver** számolja (helyek száma × 2500), a kliens által küldött árat ne fogadd el.
- A szabad helyek száma = sorok × székek − a vetítésre foglalt helyek. Lemondás után ez magától nő, ha mindig a foglalásokból számolod.
- A foglalt helyeket gyűjtsd egy `Set`-be a kész `helyKulcs()` függvénnyel – így a keresés egyszerű.
- A vetítések rendezésénél a dátum **és** az időpont is számít.
- Az ülésrendben a sorok 1-től számozódnak, a tömbök 0-tól.
- A `?nev=kiss` keresés részleges és kisbetű-nagybetű független.

## Ellenőrizd

- [ ] A `requests.http` hibás foglalásai a táblázat szerinti státuszt és üzenetet adják.
- [ ] Foglalás után az ülésrendben megjelennek az `X`-ek, lemondás után eltűnnek.
- [ ] Ugyanazokra a helyekre a második foglalás 409.
