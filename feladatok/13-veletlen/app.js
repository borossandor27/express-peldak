// =====================================================
// 13. feladat - Véletlengenerátor
// Indítás: npm run f13
// A feladat leírása: feladatok/FELADATOK-2.md
// =====================================================

import express from 'express';

const app = express();
const PORT = 3000;

// Véletlen egész szám min és max között (mindkettőt beleértve) - KÉSZ, használd!
function veletlen(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// TODO: GET /kocka            ?db=1..100 (alap: 1)  ?oldal=2..100 (alap: 6)

// TODO: GET /erme             ?db=1..1000 (alap: 1)  -> JSON

// TODO: GET /lotto            ?tipus=otos|hatos|skandi (alap: otos)

// TODO: GET /jelszo           ?hossz=4..64 (alap: 12)  ?szamok=false  ?jelek=false

// TODO: GET /valassz          ?lehetosegek=pizza,gyros,hamburger

// TODO: 404-es kezelő

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
