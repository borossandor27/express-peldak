import { idk, hiba404, hiba400, objektum } from './_segito.js';

export default {
  cim: '27. Jegyzetek CRUD',
  mappa: '27-jegyzetek',
  adatok: ['jegyzetek.json'],
  esetek: [
    {
      vegpont: 'GET /jegyzetek',
      leiras: '200 + 5 jegyzet',
      fn: async (k) => idk(await k.get('/jegyzetek'), [1, 2, 3, 4, 6]),
    },
    {
      vegpont: '?fontos=',
      leiras: 'fontos=true → 2, 4',
      fn: async (k) => idk(await k.get('/jegyzetek?fontos=true'), [2, 4]),
    },
    {
      vegpont: '?fontos=',
      leiras: 'fontos=false → 1, 3, 6 (a query szöveg!)',
      fn: async (k) => idk(await k.get('/jegyzetek?fontos=false'), [1, 3, 6]),
    },
    {
      vegpont: '?fontos=',
      leiras: 'fontos=igen → 400',
      fn: async (k) => hiba400(await k.get('/jegyzetek?fontos=igen')),
    },
    {
      vegpont: 'GET /jegyzetek/:id',
      leiras: '/jegyzetek/2 → objektum',
      fn: async (k) => {
        const r = await k.get('/jegyzetek/2');
        return objektum(r) && r.json.cim === 'Matek dolgozat';
      },
    },
    {
      vegpont: 'GET /jegyzetek/:id',
      leiras: '/jegyzetek/5 → 404 + JSON (az 5-ös nincs!)',
      fn: async (k) => hiba404(await k.get('/jegyzetek/5')),
    },
    {
      vegpont: 'POST /jegyzetek',
      leiras: '201 + az új jegyzet objektumként',
      fn: async (k) => {
        const r = await k.post('/jegyzetek', { cim: 'Fogorvos', szoveg: 'kedd 14:00', fontos: true });
        return (
          objektum(r, 201) && r.json.cim === 'Fogorvos' && r.json.szoveg === 'kedd 14:00' && r.json.fontos === true
        );
      },
    },
    {
      vegpont: 'POST /jegyzetek',
      leiras: 'az új id 7 (max + 1, nem length + 1)',
      fn: async (k) => k.adat('jegyzetek.json').find((j) => j.cim === 'Fogorvos')?.id === 7,
    },
    {
      vegpont: 'POST /jegyzetek',
      leiras: 'a letrehozva mezőt a szerver tölti ki',
      fn: async (k) => {
        const j = k.adat('jegyzetek.json').find((x) => x.cim === 'Fogorvos');
        return typeof j?.letrehozva === 'string' && !Number.isNaN(Date.parse(j.letrehozva));
      },
    },
    {
      vegpont: 'POST /jegyzetek',
      leiras: 'fájlba mentve, nincs ismétlődő id',
      fn: async (k) => {
        const a = k.adat('jegyzetek.json');
        return a.length === 6 && new Set(a.map((j) => j.id)).size === 6;
      },
    },
    {
      vegpont: 'POST /jegyzetek',
      leiras: 'a kliens által küldött id-t figyelmen kívül hagyja',
      fn: async (k) => {
        const r = await k.post('/jegyzetek', { id: 100, cim: 'Csalás', szoveg: '', fontos: false });
        return r.status === 201 && r.json?.id === 8;
      },
    },
    {
      vegpont: 'POST /jegyzetek',
      leiras: 'üres szoveg ("") elfogadva',
      fn: async (k) => (await k.post('/jegyzetek', { cim: 'Üres', szoveg: '', fontos: false })).status === 201,
    },
    {
      vegpont: 'POST /jegyzetek',
      leiras: 'hiányzó cim → 400',
      fn: async (k) => hiba400(await k.post('/jegyzetek', { szoveg: 'x', fontos: false })),
    },
    {
      vegpont: 'POST /jegyzetek',
      leiras: 'fontos: "true" (szöveg) → 400',
      fn: async (k) => hiba400(await k.post('/jegyzetek', { cim: 'X', szoveg: 'x', fontos: 'true' })),
    },
    {
      vegpont: 'PUT /jegyzetek/:id',
      leiras: '200 + módosított, id és letrehozva megmarad',
      fn: async (k) => {
        const r = await k.put('/jegyzetek/1', { cim: 'Bevásárlás (hétvége)', szoveg: 'tej, sajt', fontos: true });
        return (
          objektum(r) &&
          r.json.id === 1 &&
          r.json.cim === 'Bevásárlás (hétvége)' &&
          r.json.letrehozva === '2026-09-28T16:20:00.000Z'
        );
      },
    },
    {
      vegpont: 'PUT /jegyzetek/:id',
      leiras: 'fájlba mentve',
      fn: async (k) => k.adat('jegyzetek.json').find((j) => j.id === 1)?.szoveg === 'tej, sajt',
    },
    {
      vegpont: 'PUT /jegyzetek/:id',
      leiras: 'hiányzó mező → 400',
      fn: async (k) => hiba400(await k.put('/jegyzetek/1', { cim: 'Csak cím' })),
    },
    {
      vegpont: 'PUT /jegyzetek/:id',
      leiras: 'nem létező id → 404',
      fn: async (k) => hiba404(await k.put('/jegyzetek/99', { cim: 'X', szoveg: '', fontos: false })),
    },
    {
      vegpont: 'PATCH /jegyzetek/:id',
      leiras: '{fontos: true} → 200, a többi mező megmarad',
      fn: async (k) => {
        const r = await k.patch('/jegyzetek/3', { fontos: true });
        return (
          objektum(r) &&
          r.json.fontos === true &&
          r.json.cim === 'Edzés' &&
          r.json.szoveg === '' &&
          r.json.letrehozva === '2026-09-30T18:00:00.000Z'
        );
      },
    },
    {
      vegpont: 'PATCH /jegyzetek/:id',
      leiras: 'ismeretlen mezőt (szin) és id-t nem ment',
      fn: async (k) => {
        const r = await k.patch('/jegyzetek/3', { cim: 'Edzés (kedd)', szin: 'piros', id: 50 });
        const j = k.adat('jegyzetek.json').find((x) => x.cim === 'Edzés (kedd)');
        return r.status === 200 && j?.id === 3 && j.szin === undefined && r.json?.szin === undefined;
      },
    },
    {
      vegpont: 'PATCH /jegyzetek/:id',
      leiras: 'csak ismeretlen mező → 400',
      fn: async (k) => hiba400(await k.patch('/jegyzetek/3', { szin: 'kék' })),
    },
    {
      vegpont: 'PATCH /jegyzetek/:id',
      leiras: 'nem létező id → 404',
      fn: async (k) => hiba404(await k.patch('/jegyzetek/99', { fontos: true })),
    },
    {
      vegpont: 'DELETE /jegyzetek/:id',
      leiras: '204 + ÜRES törzs',
      fn: async (k) => {
        const r = await k.del('/jegyzetek/6');
        return r.status === 204 && r.text === '';
      },
    },
    {
      vegpont: 'DELETE /jegyzetek/:id',
      leiras: 'törölve: fájlból is, GET → 404',
      fn: async (k) => !k.adat('jegyzetek.json').some((j) => j.id === 6) && hiba404(await k.get('/jegyzetek/6')),
    },
    {
      vegpont: 'DELETE /jegyzetek/:id',
      leiras: 'nem létező id → 404',
      fn: async (k) => hiba404(await k.del('/jegyzetek/99')),
    },
  ],
};
