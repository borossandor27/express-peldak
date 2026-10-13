// Közös segédfüggvények a tesztesetekhez

// A válasz egy tömb, és pontosan ezek az id-k vannak benne (a sorrend nem számít)
export function idk(r, vart) {
  if (r.status !== 200 || !Array.isArray(r.json)) return false;
  const kapott = r.json.map((x) => x?.id).sort((a, b) => a - b);
  const elvart = [...vart].sort((a, b) => a - b);
  return kapott.length === elvart.length && kapott.every((id, i) => id === elvart[i]);
}

// A válasz egy tömb, és pontosan ebben a sorrendben vannak az id-k
export function sorrend(r, vart) {
  if (r.status !== 200 || !Array.isArray(r.json)) return false;
  return r.json.length === vart.length && r.json.every((x, i) => x?.id === vart[i]);
}

// 404 + { "hiba": "..." } JSON
export function hiba404(r) {
  return r.status === 404 && r.tipus.includes('json') && typeof r.json?.hiba === 'string';
}

// 400 + JSON (hiba vagy hibak)
export function hiba400(r) {
  return (
    r.status === 400 && r.tipus.includes('json') && (typeof r.json?.hiba === 'string' || Array.isArray(r.json?.hibak))
  );
}

// Egy objektum (nem tömb) a válasz
export function objektum(r, status = 200) {
  return r.status === status && r.json !== null && typeof r.json === 'object' && !Array.isArray(r.json);
}
