// =====================================================
// 01 - Az első Express szerver: GET végpontok, plain text
// Indítás:  npm run 01
// Böngészőben: http://localhost:3000
// =====================================================

// "type": "module" miatt import-ot használunk (nem require-t)
import express from 'express';

const app = express();
const PORT = 3000;

// ---------- 1. A legegyszerűbb végpont ----------
// req = kérés (request), res = válasz (response)
app.get('/', (req, res) => {
  res.send('Helló világ! Ez az első Express szerverem.');
});

// ---------- 2. Több fix útvonal ----------
app.get('/rolunk', (req, res) => {
  res.send('Ez a Rólunk oldal.');
});

app.get('/kapcsolat', (req, res) => {
  res.send('E-mail: info@iskola.hu');
});

// ---------- 3. Explicit Content-Type és státuszkód ----------
app.get('/szoveg', (req, res) => {
  res.status(200).type('text/plain').send('Ez tiszta szöveg, <b>nem</b> HTML.');
});

// Ha HTML-t küldünk, a böngésző meg is jeleníti
app.get('/html', (req, res) => {
  res.send('<h1>Ez már HTML</h1><p>A böngésző formázza.</p>');
});

// ---------- 4. Dinamikus válasz ----------
app.get('/ido', (req, res) => {
  const most = new Date().toLocaleTimeString('hu-HU');
  res.send(`A szerver ideje: ${most}`);
});

app.get('/veletlen', (req, res) => {
  const szam = Math.floor(Math.random() * 100) + 1;
  res.send(`Véletlen szám 1 és 100 között: ${szam}`);
});

// ---------- 5. Útvonal paraméter (route parameter) ----------
// http://localhost:3000/udv/Anna
app.get('/udv/:nev', (req, res) => {
  const nev = req.params.nev;
  res.send(`Szia, ${nev}!`);
});

// Több paraméter: http://localhost:3000/osszeg/3/5
app.get('/osszeg/:a/:b', (req, res) => {
  // A paraméterek mindig STRING-ek! Számmá kell alakítani.
  const a = Number(req.params.a);
  const b = Number(req.params.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send('Hiba: mindkét paraméternek számnak kell lennie!');
  }
  res.send(`${a} + ${b} = ${a + b}`);
});

// ---------- 6. Query string (lekérdezési paraméter) ----------
// http://localhost:3000/szorzas?a=4&b=6
app.get('/szorzas', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send('Használat: /szorzas?a=4&b=6');
  }
  res.send(`${a} * ${b} = ${a * b}`);
});

// Opcionális query paraméter alapértelmezett értékkel
// http://localhost:3000/koszont   vagy   /koszont?nyelv=en
app.get('/koszont', (req, res) => {
  const nyelv = req.query.nyelv || 'hu';
  if (nyelv === 'en') res.send('Hello!');
  else if (nyelv === 'de') res.send('Hallo!');
  else res.send('Szia!');
});

// ---------- 7. 404 - minden más útvonal ----------
// Ennek MINDIG a végén kell lennie!
app.use((req, res) => {
  res.status(404).send(`Nincs ilyen oldal: ${req.url}`);
});

// ---------- Szerver indítása ----------
app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});
