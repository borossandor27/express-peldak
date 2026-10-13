// =====================================================
// 02 - Függvények hívása másik modulból
// Indítás:  npm run 02
//
// FONTOS "type": "module" esetén:
//   - a saját fájloknál KÖTELEZŐ a kiterjesztés: './utils/matek.js'
//   - a csomagoknál (npm) nem kell: 'express'
// =====================================================

import express from 'express';

// 1) NAMED import - kapcsos zárójel, a névnek EGYEZNIE kell az exporttal
import { osszead, kivon, szoroz, oszt, PI } from './utils/matek.js';

// 2) NAMED import átnevezéssel (as)
import { negyzet as negyzetreEmel } from './utils/matek.js';

// 3) Minden export egy objektumba: import * as ...
import * as szoveg from './utils/szoveg.js';

// 4) DEFAULT import - nincs kapcsos zárójel, a név szabadon választható
import koszon from './utils/koszones.js';

// 5) DEFAULT + NAMED egyszerre
import maiDatum, { napNeve, evNapja } from './utils/datum.js';

// 6) Osztály default importja
import Kor from './utils/Kor.js';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.type('text/plain').send(
    [
      '02 - Modulok példa. Kipróbálható végpontok:',
      '',
      '/matek/osszead/3/4',
      '/matek/kivon/10/3',
      '/matek/szoroz/6/7',
      '/matek/oszt/10/4',
      '/matek/negyzet/9',
      '/matek/pi',
      '/szoveg/Almafa',
      '/koszon/Béla',
      '/datum',
      '/kor/5',
    ].join('\n')
  );
});

// ---------- Named importok használata ----------
app.get('/matek/osszead/:a/:b', (req, res) => {
  const { a, b } = req.params; // destrukturálás
  res.send(`${a} + ${b} = ${osszead(Number(a), Number(b))}`);
});

app.get('/matek/kivon/:a/:b', (req, res) => {
  const { a, b } = req.params;
  res.send(`${a} - ${b} = ${kivon(Number(a), Number(b))}`);
});

app.get('/matek/szoroz/:a/:b', (req, res) => {
  const { a, b } = req.params;
  res.send(`${a} * ${b} = ${szoroz(Number(a), Number(b))}`);
});

app.get('/matek/oszt/:a/:b', (req, res) => {
  const { a, b } = req.params;
  res.send(`${a} / ${b} = ${oszt(Number(a), Number(b))}`);
});

// Átnevezett import használata
app.get('/matek/negyzet/:x', (req, res) => {
  const x = Number(req.params.x);
  res.send(`${x} négyzete: ${negyzetreEmel(x)}`);
});

// Exportált konstans
app.get('/matek/pi', (req, res) => {
  res.send(`PI értéke a matek modulból: ${PI}`);
});

// ---------- import * as szoveg ----------
// Minden függvény a "szoveg" objektum tulajdonsága lett: szoveg.nagybetus(...)
app.get('/szoveg/:s', (req, res) => {
  const s = req.params.s;
  res.type('text/plain').send(
    [
      `Eredeti:       ${s}`,
      `Nagybetűs:     ${szoveg.nagybetus(s)}`,
      `Kisbetűs:      ${szoveg.kisbetus(s)}`,
      `Megfordítva:   ${szoveg.megfordit(s)}`,
      `Hossz:         ${szoveg.hossz(s)}`,
      `Magánhangzók:  ${szoveg.mghSzam(s)}`, // az exportnál átnevezett név!
      '',
      `A modul összes exportja: ${Object.keys(szoveg).join(', ')}`,
    ].join('\n')
  );
});

// ---------- Default import ----------
app.get('/koszon/:nev', (req, res) => {
  res.send(koszon(req.params.nev));
});

// ---------- Default + named ----------
app.get('/datum', (req, res) => {
  res.send(`Ma ${maiDatum()} van, ${napNeve()}, az év ${evNapja()}. napja.`);
});

// ---------- Osztály ----------
app.get('/kor/:r', (req, res) => {
  const k = new Kor(Number(req.params.r));
  res.send(
    `r = ${k.sugar} sugarú kör: terület = ${k.terulet().toFixed(2)}, kerület = ${k.kerulet().toFixed(2)}`
  );
});

app.use((req, res) => {
  res.status(404).send('Nincs ilyen végpont. Nézd meg a / oldalt!');
});

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});
