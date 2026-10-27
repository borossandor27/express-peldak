import pool from '../utils/db.js';
import { Router } from 'express';

const router = Router();

// GET /albumok   ?mufaj=  ?tol=  ?ig=   (JOIN: az előadó neve kell)
router.get('/', async (req, res) => {
    // minden kérésnek saját tömbjei vannak
    let params = [];
    let szurok = [];

    const { mufaj } = req.query;
    let { tol, ig } = req.query;

    // évszámok ellenőrzése -> 400
    if ((tol !== undefined && isNaN(Number(tol))) || (ig !== undefined && isNaN(Number(ig)))) {
        res.status(400).json({ hiba: 'A tol és ig paraméter csak szám lehet' });
        return;
    }
    // a tól legyen kisebb vagy egyenlő az ig-vel, ha mindkettő meg van adva,
    // ha a tol nagyobb, mint az ig, akkor felcseréljük a szűrőket, hogy a WHERE-ben a kisebb legyen előbb
    if (tol !== undefined && ig !== undefined && Number(tol) > Number(ig)) {
        // felcseréljük a szűrőket
        [tol, ig] = [ig, tol];
    }
    if (mufaj) {
        params.push(mufaj);
        szurok.push(`albumok.mufaj = ?`);
    }
    if (tol) {
        params.push(Number(tol));
        szurok.push(`albumok.ev >= ?`); // a WHERE-ben az eredeti oszlopnév kell, nem az alias
    }
    if (ig) {
        params.push(Number(ig));
        szurok.push(`albumok.ev <= ?`);
    }

    let sql = `SELECT albumok.id, albumok.cim, albumok.mufaj, albumok.ev AS kiadas, eloadok.nev AS eloado_nev
               FROM albumok
               JOIN eloadok ON eloadok.id = albumok.eloado_id`;

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    try {
        const [results] = await pool.query(sql, params);
        res.json({ albumok: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatbázis lekérdezése során' });
    }
});

// GET /albumok/kereses?q=   (címben VAGY előadónévben, legalább 2 karakter)
router.get('/kereses', async (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 2) {
        res.status(400).json({ hiba: 'A keresési kifejezés legalább 2 karakter hosszú kell legyen' });
        return;
    }

    const sql = `SELECT albumok.id, albumok.cim, albumok.mufaj, albumok.ev AS kiadas, eloadok.nev AS eloado_nev
                 FROM albumok
                 JOIN eloadok ON eloadok.id = albumok.eloado_id
                 WHERE LOWER(albumok.cim) LIKE LOWER(?) OR LOWER(eloadok.nev) LIKE LOWER(?)`;

    try {
        const [results] = await pool.query(sql, [`%${q}%`, `%${q}%`]);
        res.json({ albumok: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatbázis lekérdezése során' });
    }
});

export default router;
