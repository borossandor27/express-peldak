import { idk, hiba404, hiba400, objektum } from './_segito.js';

const stat = (r, vart) => objektum(r) && Object.entries(vart).every(([kulcs, ertek]) => r.json[kulcs] === ertek);

export default {
  cim: '24. Hőmérséklet-napló',
  mappa: '24-homerseklet',
  adatok: ['meresek.json'],
  esetek: [
    {
      vegpont: 'GET /meresek',
      leiras: '200 + mind a 12 mérés',
      fn: async (k) => idk(await k.get('/meresek'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    },
    {
      vegpont: '?varos=',
      leiras: 'varos=budapest (kisbetűvel) → 7 mérés',
      fn: async (k) => idk(await k.get('/meresek?varos=budapest'), [1, 2, 3, 6, 8, 10, 12]),
    },
    {
      vegpont: '?tol=&ig=',
      leiras: 'tol=2026-02-01&ig=2026-03-01 → mindkét határnap benne',
      fn: async (k) => idk(await k.get('/meresek?tol=2026-02-01&ig=2026-03-01'), [3, 4, 5, 6, 7, 8, 9]),
    },
    {
      vegpont: '?tol=',
      leiras: 'csak tol=2026-03-15 → 10, 11, 12',
      fn: async (k) => idk(await k.get('/meresek?tol=2026-03-15'), [10, 11, 12]),
    },
    {
      vegpont: '?ig=',
      leiras: 'csak ig=2026-01-31 → 1, 2',
      fn: async (k) => idk(await k.get('/meresek?ig=2026-01-31'), [1, 2]),
    },
    {
      vegpont: '?minHo=',
      leiras: 'minHo=0 → a fagypont alattiak kimaradnak',
      fn: async (k) => idk(await k.get('/meresek?minHo=0'), [2, 3, 5, 6, 7, 8, 9, 10, 11, 12]),
    },
    {
      vegpont: '?maxHo=',
      leiras: 'maxHo=0 → 1, 2, 4, 5',
      fn: async (k) => idk(await k.get('/meresek?maxHo=0'), [1, 2, 4, 5]),
    },
    {
      vegpont: '?minHo=&maxHo=',
      leiras: 'minHo=-3&maxHo=1 → 1, 2, 5, 7',
      fn: async (k) => idk(await k.get('/meresek?minHo=-3&maxHo=1'), [1, 2, 5, 7]),
    },
    {
      vegpont: '?maxCsapadek=',
      leiras: 'maxCsapadek=0 → csak a száraz napok',
      fn: async (k) => idk(await k.get('/meresek?maxCsapadek=0'), [1, 3, 5, 6, 8, 9, 11]),
    },
    {
      vegpont: 'kombinált',
      leiras: 'varos=Debrecen&minHo=0&maxCsapadek=0 → 5, 9, 11',
      fn: async (k) => idk(await k.get('/meresek?varos=Debrecen&minHo=0&maxCsapadek=0'), [5, 9, 11]),
    },
    {
      vegpont: 'hibás paraméter',
      leiras: 'minHo=abc → 400',
      fn: async (k) => hiba400(await k.get('/meresek?minHo=abc')),
    },
    {
      vegpont: 'hibás paraméter',
      leiras: 'minHo= (üres) → 400',
      fn: async (k) => hiba400(await k.get('/meresek?minHo=')),
    },
    {
      vegpont: 'hibás paraméter',
      leiras: 'tol=2026.02.01 → 400',
      fn: async (k) => hiba400(await k.get('/meresek?tol=2026.02.01')),
    },
    {
      vegpont: 'GET /meresek/statisztika',
      leiras: 'varos=budapest → db 7, átlag 5.5',
      fn: async (k) => stat(await k.get('/meresek/statisztika?varos=budapest'), { db: 7, atlag: 5.5 }),
    },
    {
      vegpont: 'GET /meresek/statisztika',
      leiras: 'varos=budapest → min -3, max 15, szarazNapok 4',
      fn: async (k) => stat(await k.get('/meresek/statisztika?varos=budapest'), { min: -3, max: 15, szarazNapok: 4 }),
    },
    {
      vegpont: 'GET /meresek/statisztika',
      leiras: 'varos=debrecen&tol=2026-02-02 → min 0 (!), átlag 4.4',
      fn: async (k) =>
        stat(await k.get('/meresek/statisztika?varos=debrecen&tol=2026-02-02'), {
          db: 4,
          min: 0,
          max: 10,
          atlag: 4.4,
          szarazNapok: 3,
        }),
    },
    {
      vegpont: 'GET /meresek/statisztika',
      leiras: 'varos=szeged → 404',
      fn: async (k) => hiba404(await k.get('/meresek/statisztika?varos=szeged')),
    },
    {
      vegpont: 'GET /meresek/:id',
      leiras: '/meresek/5 → objektum, homerseklet 0',
      fn: async (k) => {
        const r = await k.get('/meresek/5');
        return objektum(r) && r.json.homerseklet === 0;
      },
    },
    {
      vegpont: 'GET /meresek/:id',
      leiras: '/meresek/99 → 404 + {"hiba": ...}',
      fn: async (k) => hiba404(await k.get('/meresek/99')),
    },
  ],
};
