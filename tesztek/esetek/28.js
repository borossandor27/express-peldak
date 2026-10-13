import { idk, hiba404, hiba400, objektum } from './_segito.js';

export default {
  cim: '28. Javítsd ki! (Sportszerbolt)',
  mappa: '28-javitsd',
  adatok: ['termekek.json'],
  esetek: [
    {
      vegpont: 'GET /termekek',
      leiras: '200 + mind a 8 termék',
      fn: async (k) => idk(await k.get('/termekek'), [1, 2, 3, 4, 5, 6, 7, 8]),
    },
    {
      vegpont: '?kategoria=',
      leiras: 'kategoria=labda → 1, 2, 3',
      fn: async (k) => idk(await k.get('/termekek?kategoria=labda'), [1, 2, 3]),
    },
    {
      vegpont: '?maxAr=',
      leiras: 'maxAr=4990 → a 4990-es is benne',
      fn: async (k) => idk(await k.get('/termekek?maxAr=4990'), [4, 6, 7, 8]),
    },
    {
      vegpont: 'kombinált',
      leiras: 'kategoria=fitnesz&maxAr=5000 → 4, 6',
      fn: async (k) => idk(await k.get('/termekek?kategoria=fitnesz&maxAr=5000'), [4, 6]),
    },
    {
      vegpont: 'GET /termekek/raktaron',
      leiras: 'a készleten lévők (6 db)',
      fn: async (k) => idk(await k.get('/termekek/raktaron'), [1, 3, 4, 5, 7, 8]),
    },
    {
      vegpont: 'GET /termekek/kereses/:nev',
      leiras: 'LABDA → 1, 2, 3',
      fn: async (k) => idk(await k.get('/termekek/kereses/LABDA'), [1, 2, 3]),
    },
    {
      vegpont: 'GET /termekek/kereses/:nev',
      leiras: 'úszó → 7, 8',
      fn: async (k) => idk(await k.get('/termekek/kereses/%C3%BAsz%C3%B3'), [7, 8]),
    },
    {
      vegpont: 'GET /termekek/:id',
      leiras: '/termekek/3 → objektum, Röplabda',
      fn: async (k) => {
        const r = await k.get('/termekek/3');
        return objektum(r) && r.json.nev === 'Röplabda';
      },
    },
    {
      vegpont: 'GET /termekek/:id',
      leiras: '/termekek/99 → 404 + JSON',
      fn: async (k) => hiba404(await k.get('/termekek/99')),
    },
    {
      vegpont: 'POST /termekek',
      leiras: 'keszlet: 0 → 201 + az új termék (id 9)',
      fn: async (k) => {
        const r = await k.post('/termekek', { nev: 'Teniszlabda', kategoria: 'labda', ar: 1490, keszlet: 0 });
        return objektum(r, 201) && r.json.id === 9 && r.json.keszlet === 0;
      },
    },
    {
      vegpont: 'POST /termekek',
      leiras: 'fájlba mentve',
      fn: async (k) => k.adat('termekek.json').some((t) => t.id === 9 && t.nev === 'Teniszlabda'),
    },
    {
      vegpont: 'POST /termekek',
      leiras: 'negatív ar → 400',
      fn: async (k) => hiba400(await k.post('/termekek', { nev: 'X', kategoria: 'labda', ar: -5, keszlet: 1 })),
    },
    {
      vegpont: 'POST /termekek',
      leiras: 'keszlet: 2.5 → 400',
      fn: async (k) => hiba400(await k.post('/termekek', { nev: 'X', kategoria: 'labda', ar: 5, keszlet: 2.5 })),
    },
    {
      vegpont: 'PUT /termekek/:id',
      leiras: '200 + a módosított termék',
      fn: async (k) => {
        const r = await k.put('/termekek/2', { nev: 'Kosárlabda Pro', kategoria: 'labda', ar: 12990, keszlet: 4 });
        return objektum(r) && r.json.id === 2 && r.json.nev === 'Kosárlabda Pro' && r.json.keszlet === 4;
      },
    },
    {
      vegpont: 'PUT /termekek/:id',
      leiras: 'hiányzó mező → 400',
      fn: async (k) => hiba400(await k.put('/termekek/2', { nev: 'Csak név' })),
    },
    {
      vegpont: 'PUT /termekek/:id',
      leiras: 'nem létező id → 404',
      fn: async (k) => hiba404(await k.put('/termekek/99', { nev: 'X', kategoria: 'x', ar: 1, keszlet: 1 })),
    },
    {
      vegpont: 'DELETE /termekek/:id',
      leiras: '204 + üres törzs',
      fn: async (k) => {
        const r = await k.del('/termekek/1');
        return r.status === 204 && r.text === '';
      },
    },
    {
      vegpont: 'DELETE /termekek/:id',
      leiras: 'törlés után GET → 404',
      fn: async (k) => hiba404(await k.get('/termekek/1')),
    },
    {
      vegpont: 'DELETE /termekek/:id',
      leiras: 'nem létező id → 404',
      fn: async (k) => hiba404(await k.del('/termekek/99')),
    },
    { vegpont: '404-es kezelő', leiras: '/semmi → 404 + JSON', fn: async (k) => hiba404(await k.get('/semmi')) },
  ],
};
