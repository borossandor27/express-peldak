import pool from '../utils/db.js';
import Router from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let sql = 'SELECT eloadok.orszag AS orszag, COUNT(DISTINCT eloado_id) AS eloadoDb, COUNT(albumok.id) AS albumDb FROM eloadok JOIN albumok ON eloadok.id=eloado_id GROUP BY orszag;';
    try {
        const [results] = await pool.query(sql);
        res.json(results );
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatbázis lekérdezése során' });
    }
});

export default router;
