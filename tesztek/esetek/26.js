import { hiba404, hiba400, objektum } from './_segito.js';

const JO = { felhasznalonev: 'nagy_peti', email: 'peti@pelda.hu', kor: 16, pontszam: 50, hirlevel: true };
const valtozat = (modositas) => ({
  ...JO,
  felhasznalonev: 'teszt_' + Math.random().toString(36).slice(2, 8),
  ...modositas,
});
const hibak400 = (r) => r.status === 400 && Array.isArray(r.json?.hibak) && r.json.hibak.length > 0;

export default {
  cim: '26. Regisztráció',
  mappa: '26-regisztracio',
  adatok: ['felhasznalok.json'],
  esetek: [
    {
      vegpont: 'GET /felhasznalok',
      leiras: '200 + 3 felhasználó',
      fn: async (k) => {
        const r = await k.get('/felhasznalok');
        return r.status === 200 && r.json?.length === 3;
      },
    },
    {
      vegpont: 'POST /felhasznalok',
      leiras: 'érvényes adat → 201 + az új felhasználó (id 4)',
      fn: async (k) => {
        const r = await k.post('/felhasznalok', JO);
        return (
          objektum(r, 201) &&
          r.json.id === 4 &&
          r.json.felhasznalonev === 'nagy_peti' &&
          r.json.kor === 16 &&
          r.json.hirlevel === true
        );
      },
    },
    {
      vegpont: 'POST /felhasznalok',
      leiras: 'fájlba mentve (4 felhasználó)',
      fn: async (k) => {
        const a = k.adat('felhasznalok.json');
        return a.length === 4 && a.some((f) => f.felhasznalonev === 'nagy_peti');
      },
    },
    {
      vegpont: 'POST – határérték',
      leiras: 'kor: 14 → 201',
      fn: async (k) => (await k.post('/felhasznalok', valtozat({ kor: 14 }))).status === 201,
    },
    {
      vegpont: 'POST – határérték',
      leiras: 'pontszam: 0 → 201',
      fn: async (k) => (await k.post('/felhasznalok', valtozat({ pontszam: 0 }))).status === 201,
    },
    {
      vegpont: 'POST – trim',
      leiras: '" anna_01 " → 201, levágva tárolja',
      fn: async (k) => {
        const r = await k.post('/felhasznalok', valtozat({ felhasznalonev: '  anna_01 ' }));
        return r.status === 201 && r.json?.felhasznalonev === 'anna_01';
      },
    },
    {
      vegpont: 'POST – felhasznalonev',
      leiras: 'csupa szóköz → 400 + hibak tömb',
      fn: async (k) => hibak400(await k.post('/felhasznalok', valtozat({ felhasznalonev: '    ' }))),
    },
    {
      vegpont: 'POST – felhasznalonev',
      leiras: '"ab" (túl rövid) → 400',
      fn: async (k) => hibak400(await k.post('/felhasznalok', valtozat({ felhasznalonev: 'ab' }))),
    },
    {
      vegpont: 'POST – email',
      leiras: '"anna.gmail.com" → 400',
      fn: async (k) => hibak400(await k.post('/felhasznalok', valtozat({ email: 'anna.gmail.com' }))),
    },
    {
      vegpont: 'POST – kor',
      leiras: '"16" (szöveg) → 400',
      fn: async (k) => hibak400(await k.post('/felhasznalok', valtozat({ kor: '16' }))),
    },
    {
      vegpont: 'POST – kor',
      leiras: '15.5 (nem egész) → 400',
      fn: async (k) => hibak400(await k.post('/felhasznalok', valtozat({ kor: 15.5 }))),
    },
    {
      vegpont: 'POST – kor',
      leiras: '13 és 100 (tartományon kívül) → 400',
      fn: async (k) =>
        hibak400(await k.post('/felhasznalok', valtozat({ kor: 13 }))) &&
        hibak400(await k.post('/felhasznalok', valtozat({ kor: 100 }))),
    },
    {
      vegpont: 'POST – pontszam',
      leiras: '-1 → 400',
      fn: async (k) => hibak400(await k.post('/felhasznalok', valtozat({ pontszam: -1 }))),
    },
    {
      vegpont: 'POST – hirlevel',
      leiras: '"igen" → 400',
      fn: async (k) => hibak400(await k.post('/felhasznalok', valtozat({ hirlevel: 'igen' }))),
    },
    {
      vegpont: 'POST – hiányzó mező',
      leiras: 'email nélkül → 400',
      fn: async (k) => {
        const { email, ...nincsEmail } = valtozat({});
        return hibak400(await k.post('/felhasznalok', nincsEmail));
      },
    },
    {
      vegpont: 'POST – ismeretlen mező',
      leiras: '"admin": true → 400',
      fn: async (k) => hibak400(await k.post('/felhasznalok', valtozat({ admin: true }))),
    },
    {
      vegpont: 'POST – minden hiba',
      leiras: 'csupa rossz mező → legalább 5 hibaüzenet',
      fn: async (k) => {
        const r = await k.post('/felhasznalok', {
          felhasznalonev: '',
          email: 'x',
          kor: 'sok',
          pontszam: -5,
          hirlevel: 1,
        });
        return hibak400(r) && r.json.hibak.length >= 5;
      },
    },
    {
      vegpont: 'POST – foglalt név',
      leiras: '"KISS_ANNA" → 409',
      fn: async (k) => {
        const r = await k.post('/felhasznalok', valtozat({ felhasznalonev: 'KISS_ANNA' }));
        return r.status === 409 && r.tipus.includes('json');
      },
    },
    {
      vegpont: 'PATCH /felhasznalok/:id',
      leiras: '{kor: 30} → 200, a többi mező megmarad',
      fn: async (k) => {
        const r = await k.patch('/felhasznalok/2', { kor: 30 });
        return (
          objektum(r) &&
          r.json.kor === 30 &&
          r.json.felhasznalonev === 'Bence01' &&
          r.json.pontszam === 0 &&
          r.json.hirlevel === false
        );
      },
    },
    {
      vegpont: 'PATCH /felhasznalok/:id',
      leiras: 'fájlba mentve',
      fn: async (k) => k.adat('felhasznalok.json').find((f) => f.id === 2)?.kor === 30,
    },
    {
      vegpont: 'PATCH /felhasznalok/:id',
      leiras: 'üres törzs {} → 400',
      fn: async (k) => hiba400(await k.patch('/felhasznalok/2', {})),
    },
    {
      vegpont: 'PATCH /felhasznalok/:id',
      leiras: '{email: ""} → 400',
      fn: async (k) => hiba400(await k.patch('/felhasznalok/2', { email: '' })),
    },
    {
      vegpont: 'PATCH /felhasznalok/:id',
      leiras: '{pontszam: 0} → 200 (a 0 érvényes)',
      fn: async (k) => {
        const r = await k.patch('/felhasznalok/1', { pontszam: 0 });
        return objektum(r) && r.json.pontszam === 0;
      },
    },
    {
      vegpont: 'PATCH /felhasznalok/:id',
      leiras: 'foglalt név ("DORI") → 409',
      fn: async (k) => (await k.patch('/felhasznalok/2', { felhasznalonev: 'DORI' })).status === 409,
    },
    {
      vegpont: 'PATCH /felhasznalok/:id',
      leiras: 'nem létező id → 404',
      fn: async (k) => hiba404(await k.patch('/felhasznalok/99', { kor: 20 })),
    },
  ],
};
