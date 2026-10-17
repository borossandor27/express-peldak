// =====================================================
// Hitelesítő middleware: "Ki vagy?"
//
// A kliens a bejelentkezéskor kapott tokent minden kérésnél elküldi
// az Authorization fejlécben:
//
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
//
// Ha a token hiányzik, hibás vagy lejárt -> 401 Unauthorized.
// Ha jó -> a token tartalma a req.user-be kerül, és mehet tovább a kérés.
// =====================================================

import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  // "Bearer <token>" -> a szóköz utáni rész
  const [tipus, token] = (req.headers.authorization ?? '').split(' ');

  if (tipus !== 'Bearer' || !token) {
    return res.status(401).json({ hiba: 'Hiányzó token! (Authorization: Bearer <token>)' });
  }

  try {
    // A verify ellenőrzi az aláírást ÉS a lejárati időt is.
    // Ha valaki átírja a token tartalmát, az aláírás már nem stimmel -> hiba.
    const adatok = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: adatok.id, email: adatok.email };
    next();
  } catch {
    return res.status(401).json({ hiba: 'Érvénytelen vagy lejárt token!' });
  }
}
