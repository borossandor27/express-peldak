import pool from '../utils/db.js';
import { Router } from 'express';

const mufajRouter = Router();

// TODO: GET /mufajok
mufajRouter.get('/', async (req, res) => {
    let sql = `SELECT albumok.mufaj AS mufaj, 
                    COUNT(albumok.eloado_id) AS albumDb, SUM(albumok.hossz) AS osszHossz 
                FROM albumok 
                GROUP BY albumok.mufaj
                ORDER BY albumDb DESC, mufaj ASC;`;
    try {
        const [rows] = await pool.execute(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezésekor.' });
    }
});

export default mufajRouter;