// =====================================================
// 17. feladat - Órarend (csak GET, JSON válaszok)
// Indítás: npm run f17
// A feladat leírása: feladatok/FELADATOK-2.md
// =====================================================

import express from 'express';
import orarend from './data/orarend.json' with { type: 'json' };

const app = express();
const PORT = 3000;

const NAPOK = ['hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek'];
const CSENGETES = [
  '7:45-8:30', '8:40-9:25', '9:35-10:20', '10:35-11:20',
  '11:30-12:15', '12:25-13:10', '13:20-14:05', '14:10-14:55',
];

// TODO: GET /orarend

// TODO: GET /orarend/:nap            (kis- és nagybetű se számítson; ismeretlen nap: 404)

// TODO: GET /orarend/:nap/:ora       (+ "ido" mező a CSENGETES-ből; lyukasóra: 404)

// TODO: GET /tanarok

// TODO: GET /tanar/:nev              (részleges keresés)

// TODO: GET /terem/:terem

// TODO: GET /oraszamok               (tantárgyanként, csökkenő sorrendben)

// TODO: GET /napi-oraszam

// TODO: GET /csengetes/:ora

// TODO: 404-es kezelő (JSON)

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
