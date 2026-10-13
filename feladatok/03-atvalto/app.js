// =====================================================
//
// Emlékeztető: /penz?forint=10000&valuta=usd  ->  req.query.forint, req.query.valuta
// =====================================================

import express from 'express';
import * as mnbRates from 'mnb-rates';

const app = express();
const PORT = 3000;

// 1 egység hány forint
let ARFOLYAMOK = null;
//const ARFOLYAMOK = { eur: 400, usd: 360, gbp: 470 };
(async () => {
    try {
        ARFOLYAMOK = await mnbRates.getCurrentExchangeRates();
    } catch (error) {
        console.error('Hiba az árfolyamok lekérésekor:', error);
        ARFOLYAMOK = { eur: 400, usd: 360, gbp: 470 };
    }

    console.log(ARFOLYAMOK);
})();



// TODO: GET /homerseklet?c=25   vagy   /homerseklet?f=77

// TODO: GET /penz?forint=10000&valuta=eur   (a valuta elhagyható, ekkor eur)

// TODO: GET /bmi?suly=70&magassag=175

// TODO: 404-es kezelő

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
