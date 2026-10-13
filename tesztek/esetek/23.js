import { idk, sorrend, hiba404, hiba400, objektum } from './_segito.js';

export default {
  cim: '23. Diákszűrő',
  mappa: '23-diakszuro',
  adatok: ['diakok.json'],
  esetek: [
    {
      vegpont: 'GET /diakok',
      leiras: '200 + mind a 14 diák',
      fn: async (k) => idk(await k.get('/diakok'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    },
    {
      vegpont: '?osztaly=',
      leiras: 'osztaly=13.B → 2, 5, 8, 11, 14',
      fn: async (k) => idk(await k.get('/diakok?osztaly=13.B'), [2, 5, 8, 11, 14]),
    },
    {
      vegpont: '?nem=&osztaly=',
      leiras: 'nem=lány&osztaly=13.A → 1, 7, 13',
      fn: async (k) => idk(await k.get('/diakok?nem=l%C3%A1ny&osztaly=13.A'), [1, 7, 13]),
    },
    {
      vegpont: '?nev=',
      leiras: 'nev=kis → 1, 8 (részleges)',
      fn: async (k) => idk(await k.get('/diakok?nev=kis'), [1, 8]),
    },
    {
      vegpont: '?nev=',
      leiras: 'nev=KIS → 1, 8 (kisbetű-nagybetű független)',
      fn: async (k) => idk(await k.get('/diakok?nev=KIS'), [1, 8]),
    },
    {
      vegpont: '?minAtlag=',
      leiras: 'minAtlag=4 → a 4,0-s átlag is benne (≥)',
      fn: async (k) => idk(await k.get('/diakok?minAtlag=4'), [1, 3, 5, 8, 10, 12, 14]),
    },
    {
      vegpont: '?maxAtlag=',
      leiras: 'maxAtlag=3.5 → a 3,5-ös átlag is benne (≤)',
      fn: async (k) => idk(await k.get('/diakok?maxAtlag=3.5'), [2, 4, 6, 9, 11, 13]),
    },
    {
      vegpont: '?minAtlag=&maxAtlag=',
      leiras: 'minAtlag=3.5&maxAtlag=4 → 3, 6, 7, 10, 11',
      fn: async (k) => idk(await k.get('/diakok?minAtlag=3.5&maxAtlag=4'), [3, 6, 7, 10, 11]),
    },
    {
      vegpont: '?maxHianyzas=',
      leiras: 'maxHianyzas=0 → 3, 5, 8, 14 (a 0 is érték!)',
      fn: async (k) => idk(await k.get('/diakok?maxHianyzas=0'), [3, 5, 8, 14]),
    },
    {
      vegpont: 'kombinált',
      leiras: 'osztaly=13.B&minAtlag=4 → 5, 8, 14',
      fn: async (k) => idk(await k.get('/diakok?osztaly=13.B&minAtlag=4'), [5, 8, 14]),
    },
    {
      vegpont: 'kombinált',
      leiras: 'nem=fiú&maxHianyzas=5&osztaly=13.C → 12',
      fn: async (k) => idk(await k.get('/diakok?nem=fi%C3%BA&maxHianyzas=5&osztaly=13.C'), [12]),
    },
    {
      vegpont: '?rendez=nev',
      leiras: 'magyar ábécé: Ábrahám Lili az első',
      fn: async (k) => sorrend(await k.get('/diakok?rendez=nev'), [11, 12, 6, 8, 1, 3, 14, 9, 2, 10, 13, 4, 5, 7]),
    },
    {
      vegpont: '?rendez=hianyzas',
      leiras: 'növekvő hiányzás szerint',
      fn: async (k) => {
        const r = await k.get('/diakok?rendez=hianyzas');
        return (
          r.status === 200 &&
          r.json.length === 14 &&
          r.json.every((d, i, t) => i === 0 || t[i - 1].hianyzas <= d.hianyzas)
        );
      },
    },
    {
      vegpont: '?rendez=&irany=&limit=',
      leiras: 'rendez=atlag&irany=csokkeno&limit=3 → 5, 12, 14',
      fn: async (k) => sorrend(await k.get('/diakok?rendez=atlag&irany=csokkeno&limit=3'), [5, 12, 14]),
    },
    {
      vegpont: 'kombinált + rendezés',
      leiras: 'osztaly=13.A&rendez=atlag → 4, 13, 7, 10, 1',
      fn: async (k) => sorrend(await k.get('/diakok?osztaly=13.A&rendez=atlag'), [4, 13, 7, 10, 1]),
    },
    {
      vegpont: 'hibás paraméter',
      leiras: 'minAtlag=abc → 400',
      fn: async (k) => hiba400(await k.get('/diakok?minAtlag=abc')),
    },
    {
      vegpont: 'hibás paraméter',
      leiras: 'minAtlag= (üres) → 400',
      fn: async (k) => hiba400(await k.get('/diakok?minAtlag=')),
    },
    { vegpont: 'hibás paraméter', leiras: 'limit=0 → 400', fn: async (k) => hiba400(await k.get('/diakok?limit=0')) },
    {
      vegpont: 'hibás paraméter',
      leiras: 'rendez=kor → 400',
      fn: async (k) => hiba400(await k.get('/diakok?rendez=kor')),
    },
    {
      vegpont: 'GET /diakok/:id',
      leiras: '/diakok/5 → objektum (nem tömb), Tóth Emese',
      fn: async (k) => {
        const r = await k.get('/diakok/5');
        return objektum(r) && r.json.nev === 'Tóth Emese';
      },
    },
    {
      vegpont: 'GET /diakok/:id',
      leiras: '/diakok/99 → 404 + {"hiba": ...}',
      fn: async (k) => hiba404(await k.get('/diakok/99')),
    },
  ],
};
