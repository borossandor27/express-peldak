import { Router } from "express";
import pool from "../utils/db.js";

const eloadoRouter = Router();

// TODO: GET /eloadok   ?orszag=
eloadoRouter.get('/', async (req, res) => {
    const { orszag } = req.query;
    let sql = 'SELECT * FROM eloadok ORDER BY eloadok.nev;';
    const params = [];
    if (orszag) {
        sql = 'SELECT * FROM eloadok WHERE orszag = ? ORDER BY eloadok.nev;';
        params.push(orszag);
    }
    try {
        const [rows] = await pool.execute(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezésekor.' });
    }
});
// TODO: GET /eloadok/:id   -> az előadó + "albumok" tömb (400 / 404)
eloadoRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    // Ellenőrizzük, hogy az id szám-e
    if (isNaN(id)) {
        return res.status(400).json({ hiba: 'Az id paraméternek számnak kell lennie.' });
    }   
    try {
        // Lekérdezzük az előadót
        const [eloadoRows] = await pool.execute('SELECT * FROM eloadok WHERE id = ?', [id]);
        if (eloadoRows.length === 0) {
            return res.status(404).json({ hiba: 'Az előadó nem található.' });
        }
        const eloado = eloadoRows[0];
        // Lekérdezzük az előadó albumait
        const [albumRows] = await pool.execute('SELECT * FROM albumok WHERE eloado_id = ?', [id]);
        eloado.albumok = albumRows; // Hozzáadjuk az albumokat az előadó objektumhoz
        res.json(eloado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezésekor.' });
    }
});


export default eloadoRouter;