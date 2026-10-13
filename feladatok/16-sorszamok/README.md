# 16. feladat – Sorszámnevek ★★★

**Indítás:** `npm run f16` · **Mintapélda:** `06-szamiras` · **Teljes leírás:** [FELADATOK-2.md](../FELADATOK-2.md)

## Mit mutat be a feladat?

- **Modul a modulra építve**: a `06-szamiras` kész `szamBetuvel()` függvényét használod, és csak a szó **végét** alakítod át.
- Nyelvi szabályok megfogalmazása kódként (végződések, kivételek).
- **Hibakezelés** `throw` és `try...catch` segítségével: a modul hibát dob, a végpont elkapja és 400-at ad.

## Mire figyelj a megoldás során?

- Az import útvonala a `utils` mappából: `'../../../06-szamiras/utils/szamiras.js'`. Számold meg, hány szintet kell feljebb lépni.
- **A végződések vizsgálatának sorrendje számít!** A *négy* is *egy*-re végződik, ezért a *négy*-et előbb kell vizsgálni. Ugyanígy: *kettő* / *kettedik*, *három* / *harmadik*, *hét* / *hetedik*.
- Az *első* és a *második* **csak önállóan** rendhagyó; összetételben *tizenegyedik*, *huszonkettedik*.
- A kerek számoknál (*húsz* → *huszadik*, *száz* → *századik*, *millió* → *milliomodik*) a tő is megváltozik.
- A kötőjeles alakoknál (*kétezer-egy*) csak az utolsó tagot kell átalakítani.
- A hónap napjánál: *-adik/-odik* végű sorszámnév után *-a*, egyébként *-e*; kivétel az *elseje*.
- **Ne kezeld le kivételként minden számot egyenként!** Egy jó szabályrendszer a 31 napra és a nagy számokra is működik.
- A `/helyezes` soronként ír, ezért `text/plain` típusú legyen. A nem létező dátumra (`2026-02-30`) 400.
- Teszteld sok számmal (1–40, 100, 1000, 2001, 1000000), mert a hibák a ritkább alakoknál jönnek elő.

## Ellenőrizd

- [ ] A táblázat összes példája pontosan egyezik.
- [ ] A 0 és a negatív szám 400-at ad, és a szerver nem áll le.
- [ ] A `sorszam.js` nem másolja le a `szamBetuvel()` kódját, hanem importálja.
