import { idk, hiba404, hiba400, objektum } from './_segito.js';

export default {
  cim: '25. Állatkert',
  mappa: '25-allatkert',
  adatok: ['allatok.json'],
  esetek: [
    {
      vegpont: 'GET /allatok',
      leiras: '200 + mind a 10 állat',
      fn: async (k) => idk(await k.get('/allatok'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    },
    {
      vegpont: 'GET /allatok/nevek',
      leiras: '10 név, szövegtömbként',
      fn: async (k) => {
        const r = await k.get('/allatok/nevek');
        return (
          r.status === 200 &&
          Array.isArray(r.json) &&
          r.json.length === 10 &&
          r.json.every((n) => typeof n === 'string')
        );
      },
    },
    {
      vegpont: 'GET /allatok/nevek',
      leiras: 'magyar ábécérend (Ági az első, Szimba az utolsó)',
      fn: async (k) => {
        const r = await k.get('/allatok/nevek');
        return (
          JSON.stringify(r.json) ===
          JSON.stringify([
            'Ági',
            'Bundi',
            'Csíkos',
            'Dumbó',
            'Ernő',
            'Kenguru Karcsi',
            'Leó',
            'Panni',
            'Rani',
            'Szimba',
          ])
        );
      },
    },
    {
      vegpont: 'GET /allatok/statisztika',
      leiras: 'objektum: osszes 10, legidosebb Rani',
      fn: async (k) => {
        const r = await k.get('/allatok/statisztika');
        return objektum(r) && r.json.osszes === 10 && r.json.legidosebb?.id === 4;
      },
    },
    {
      vegpont: 'GET /allatok/statisztika',
      leiras: 'kontinensenkent: Afrika 4, Ázsia 2, Európa 2',
      fn: async (k) => {
        const s = (await k.get('/allatok/statisztika')).json?.kontinensenkent;
        return (
          s?.['Afrika'] === 4 &&
          s?.['Ázsia'] === 2 &&
          s?.['Európa'] === 2 &&
          s?.['Ausztrália'] === 1 &&
          s?.['Észak-Amerika'] === 1
        );
      },
    },
    {
      vegpont: 'GET /allatok/faj/:faj',
      leiras: 'elefánt → 3, 4 (részleges)',
      fn: async (k) => idk(await k.get('/allatok/faj/elef%C3%A1nt'), [3, 4]),
    },
    {
      vegpont: 'GET /allatok/faj/:faj',
      leiras: 'FARKAS → 8, 10 (nagybetűvel)',
      fn: async (k) => idk(await k.get('/allatok/faj/FARKAS'), [8, 10]),
    },
    {
      vegpont: 'GET /allatok/faj/:faj',
      leiras: 'zsiráf → 200 + üres tömb',
      fn: async (k) => idk(await k.get('/allatok/faj/zsir%C3%A1f'), []),
    },
    {
      vegpont: 'GET /allatok/gondozo/:nev',
      leiras: 'tóth → 8, 9, 10',
      fn: async (k) => idk(await k.get('/allatok/gondozo/t%C3%B3th'), [8, 9, 10]),
    },
    {
      vegpont: 'GET /allatok/gondozo/:nev',
      leiras: 'KOVÁCS → 1, 2, 5',
      fn: async (k) => idk(await k.get('/allatok/gondozo/KOV%C3%81CS'), [1, 2, 5]),
    },
    {
      vegpont: 'GET /allatok/gondozo/:nev',
      leiras: 'nemletezo → 404 + JSON',
      fn: async (k) => hiba404(await k.get('/allatok/gondozo/nemletezo')),
    },
    {
      vegpont: 'GET /allatok/:id',
      leiras: '/allatok/6 → objektum (nem tömb), Panni',
      fn: async (k) => {
        const r = await k.get('/allatok/6');
        return objektum(r) && r.json.nev === 'Panni';
      },
    },
    {
      vegpont: 'GET /allatok/:id',
      leiras: '/allatok/99 → 404 + {"hiba": ...}',
      fn: async (k) => hiba404(await k.get('/allatok/99')),
    },
    {
      vegpont: 'GET /allatok/:id',
      leiras: '/allatok/abc → 400 + JSON',
      fn: async (k) => hiba400(await k.get('/allatok/abc')),
    },
    {
      vegpont: 'GET /allatok/:id',
      leiras: '/allatok/2.5 → 400 + JSON',
      fn: async (k) => hiba400(await k.get('/allatok/2.5')),
    },
    { vegpont: '404-es kezelő', leiras: '/semmi → 404 + JSON', fn: async (k) => hiba404(await k.get('/semmi')) },
    {
      vegpont: '404-es kezelő',
      leiras: '/allatok/6/etetes → 404 + JSON',
      fn: async (k) => hiba404(await k.get('/allatok/6/etetes')),
    },
  ],
};
