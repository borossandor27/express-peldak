import pool from "../utils/db.js";
import { Router } from "express";

const statisztikaRouter = Router();

// GET /statisztika/eloadok   (az album nélküli előadó is!)
statisztikaRouter.get('/eloadok', async (req, res) => {
    try {
        const sql = `SELECT eloadok.nev AS eloado, 
                        COUNT(albumok.eloado_id) AS albumDb, IFNULL(MIN(albumok.ev),"") AS elso, IFNULL(MAX(albumok.ev),"") AS utolso 
                    FROM albumok RIGHT JOIN eloadok ON albumok.eloado_id = eloadok.id 
                    GROUP BY albumok.eloado_id 
                    ORDER BY albumDb DESC,eloado;`;
        const [rows] = await pool.execute(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezésekor.' });
    }
});

export default statisztikaRouter;                    