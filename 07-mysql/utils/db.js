// =====================================================
// Közös adatbázis-kapcsolat (connection pool)
//
// A kapcsolódási adatok NEM a kódban vannak, hanem a .env fájlban.
// A 'dotenv/config' import beolvassa a .env fájlt, és a benne lévő
// változókat a process.env objektumba teszi: process.env.DB_NAME stb.
//
// A .env fájl a szerver indítási mappájában (a projekt mappájában) legyen.
// =====================================================

import 'dotenv/config';
import mysql from 'mysql2/promise';

// Ha nincs .env fájl (vagy hiányzik belőle valami), érthető hibaüzenettel álljunk le
for (const nev of ['DB_HOST', 'DB_USER', 'DB_NAME']) {
  if (!process.env[nev]) {
    throw new Error(`Hiányzik a(z) ${nev} beállítás. Másold le a .env.example fájlt .env néven, és töltsd ki!`);
  }
}

// A pool több kapcsolatot tart nyitva, és a kérések között osztja ki őket.
// A process.env MINDEN értéke szöveg -> a portot számmá alakítjuk.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME,
});

export default pool;
