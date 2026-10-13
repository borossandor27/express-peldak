// =====================================================
// Jelszóerősség - DEFAULT EXPORT
// =====================================================

// TODO: export default function jelszoErosseg(jelszo) { ... }
//
// 5 szabály, mindegyik 1 pont:
//   - legalább 8 karakter
//   - van kisbetű        /[a-z]/.test(jelszo)
//   - van nagybetű       /[A-Z]/.test(jelszo)
//   - van számjegy       /[0-9]/.test(jelszo)
//   - van különleges karakter  /[^a-zA-Z0-9]/.test(jelszo)
//
// 0-2 pont: "gyenge", 3-4 pont: "közepes", 5 pont: "erős"
//
// Visszatérési érték: { pont, szint, szabalyok: { ... } }
