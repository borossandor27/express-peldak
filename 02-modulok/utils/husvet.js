import datumMa, { napNeve, szokoev, husvetNapjai } from './utils/datum.js';

console.log("Ma:", datumMa()); // Pl.: 2026. 06. 07.
console.log("Szökőév-e 2026?", szokoev(2026)); // false
console.log("Szökőév-e 2024?", szokoev(2024)); // true

const husvet2025 = husvetNapjai(2025);
console.log(`Húsvét vasárnap a ${2025} évben:`, husvet2025.vasarnap); // 2025. 04. 05.
console.log(`Húsvét hétfő a ${2025} évben:`, husvet2025.hetfo);       // 2025. 04. 06.

const husvet2026 = husvetNapjai(new Date()); // 2026. év
console.log("Húsvét vasárnap az aktuális évben:", husvet2026.vasarnap); // 2026. 04. 05.
console.log("Húsvét hétfő az aktuális évben:", husvet2026.hetfo);       // 2026. 04. 06.

const husvet2027 = husvetNapjai(2027);
console.log(`Húsvét vasárnap a ${2027} évben:`, husvet2027.vasarnap);
console.log(`Húsvét hétfő a ${2027} évben:`, husvet2027.hetfo);

