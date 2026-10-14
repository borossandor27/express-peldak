// =====================================================
// Könyvek router - CRUD MySQL adatbázisban
//
//   pool.query(sql, [parameterek]) eredménye:
//     SELECT              -> [sorok, mezok]   a sorok MINDIG tömb
//     INSERT              -> [eredmeny]       eredmeny.insertId = az új id
//     UPDATE / DELETE     -> [eredmeny]       eredmeny.affectedRows = hány sor változott
// =====================================================

import { Router } from 'express';
import pool from '../utils/db.js';

const router = Router();

// Az adatbázisban a kiolcsonozve 0 vagy 1 -> a kliens true / false értéket kapjon
function konyvbol(sor) {
  return { ...sor, kiolcsonozve: sor.kiolcsonozve === 1 };
}

function ellenoriz(adat) {
  const hibak = [];
  if (typeof adat.cim !== 'string' || adat.cim.trim() === '') hibak.push('A cím kötelező (szöveg).');
  if (typeof adat.szerzo !== 'string' || adat.szerzo.trim() === '') hibak.push('A szerző kötelező (szöveg).');
  if (!Number.isInteger(adat.ev)) hibak.push('Az év kötelező (egész szám).');
  if (adat.kiolcsonozve !== undefined && typeof adat.kiolcsonozve !== 'boolean')
    hibak.push('A kiolcsonozve true vagy false legyen.');
  return hibak;
}

// Egy könyv lekérdezése id alapján (null, ha nincs ilyen)
async function egyKonyv(id) {
  const [sorok] = await pool.query('SELECT * FROM konyvek WHERE id = ?', [id]);
  return sorok.length === 0 ? null : konyvbol(sorok[0]);
}

// Minden :id-s útvonal előtt lefut. A MySQL a '2abc' szöveget 2-nek venné
// (WHERE id = '2abc' -> a 2-es könyv!), ezért előbb mi ellenőrizzük.
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  next();
});

// =====================================================
// READ - összes, szűrhető:  ?szerzo=moln  ?kiolcsonozve=true
// =====================================================
router.get('/', async (req, res) => {
  // A feltételeket és a paramétereket egy-egy tömbbe gyűjtjük
  const feltetelek = [];
  const parameterek = [];

  if (req.query.szerzo) {
    feltetelek.push('szerzo LIKE ?');
    parameterek.push(`%${req.query.szerzo}%`);
  }
  if (req.query.kiolcsonozve === 'true' || req.query.kiolcsonozve === 'false') {
    feltetelek.push('kiolcsonozve = ?');
    parameterek.push(req.query.kiolcsonozve === 'true' ? 1 : 0);
  }

  let sql = 'SELECT * FROM konyvek';
  if (feltetelek.length > 0) sql += ' WHERE ' + feltetelek.join(' AND ');
  sql += ' ORDER BY id';

  // SOHA ne fűzd a kérés adatait az SQL szövegébe! Mindig ? és paramétertömb.
  const [sorok] = await pool.query(sql, parameterek);
  res.json(sorok.map(konyvbol));
});

// =====================================================
// READ - egy elem
// =====================================================
router.get('/:id', async (req, res) => {
  const konyv = await egyKonyv(req.params.id);
  if (!konyv) return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  res.json(konyv);
});

// =====================================================
// CREATE - az id-t az AUTO_INCREMENT adja, nem kell max + 1
// =====================================================
router.post('/', async (req, res) => {
  const hibak = ellenoriz(req.body);
  if (hibak.length > 0) return res.status(400).json({ hibak });

  const { cim, szerzo, ev, kiolcsonozve = false } = req.body;
  const [eredmeny] = await pool.query(
    'INSERT INTO konyvek (cim, szerzo, ev, kiolcsonozve) VALUES (?, ?, ?, ?)',
    [cim, szerzo, ev, kiolcsonozve ? 1 : 0]
  );

  res.status(201).json(await egyKonyv(eredmeny.insertId));
});

// =====================================================
// UPDATE - teljes csere (PUT)
// =====================================================
router.put('/:id', async (req, res) => {
  const hibak = ellenoriz(req.body);
  if (hibak.length > 0) return res.status(400).json({ hibak });

  const { cim, szerzo, ev, kiolcsonozve = false } = req.body;
  const [eredmeny] = await pool.query(
    'UPDATE konyvek SET cim = ?, szerzo = ?, ev = ?, kiolcsonozve = ? WHERE id = ?',
    [cim, szerzo, ev, kiolcsonozve ? 1 : 0, req.params.id]
  );

  // Ha egyetlen sor sem felelt meg a WHERE feltételnek, nincs ilyen könyv
  if (eredmeny.affectedRows === 0) return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  res.json(await egyKonyv(req.params.id));
});

// =====================================================
// UPDATE - részleges módosítás (PATCH)
// A SET részt a megadott mezőkből rakjuk össze. Oszlopnevet nem lehet ?-lel
// átadni, ezért csak a MI listánkban szereplő neveket fűzzük az SQL-be.
// =====================================================
const MODOSITHATO = ['cim', 'szerzo', 'ev', 'kiolcsonozve'];

router.patch('/:id', async (req, res) => {
  const mezok = MODOSITHATO.filter((m) => req.body[m] !== undefined);
  if (mezok.length === 0) {
    return res.status(400).json({ hiba: `Legalább egy mező kell: ${MODOSITHATO.join(', ')}` });
  }

  // A hiányzó mezőket a jelenlegi értékkel pótolva ugyanaz az ellenőrzés használható
  const regi = await egyKonyv(req.params.id);
  if (!regi) return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  const hibak = ellenoriz({ ...regi, ...req.body });
  if (hibak.length > 0) return res.status(400).json({ hibak });

  const set = mezok.map((m) => `${m} = ?`).join(', '); // pl. "cim = ?, ev = ?"
  const ertekek = mezok.map((m) => (m === 'kiolcsonozve' ? (req.body[m] ? 1 : 0) : req.body[m]));

  await pool.query(`UPDATE konyvek SET ${set} WHERE id = ?`, [...ertekek, req.params.id]);
  res.json(await egyKonyv(req.params.id));
});

// =====================================================
// DELETE - törlés
// =====================================================
router.delete('/:id', async (req, res) => {
  const [eredmeny] = await pool.query('DELETE FROM konyvek WHERE id = ?', [req.params.id]);
  if (eredmeny.affectedRows === 0) return res.status(404).json({ hiba: 'Nincs ilyen könyv' });
  res.sendStatus(204);
});

export default router;
