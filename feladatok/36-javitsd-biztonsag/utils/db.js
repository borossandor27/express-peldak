// Közös adatbázis-kapcsolat - ebben a fájlban NINCS hiba
import 'dotenv/config';
import mysql from 'mysql2/promise';

for (const nev of ['DB_HOST', 'DB_USER', 'DB_NAME']) {
  if (!process.env[nev]) {
    throw new Error(`Hiányzik a(z) ${nev} beállítás. Másold le a .env.example fájlt .env néven!`);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME,
  dateStrings: true,
});

export default pool;
