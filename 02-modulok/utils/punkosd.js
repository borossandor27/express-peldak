import { punkosdNapjai } from './utils/datum.js';

const punkosd2026 = punkosdNapjai(2026);
console.log("Pünkösd vasárnap:", punkosd2026.vasarnap); // 2026. 05. 24.
console.log("Pünkösd hétfő:", punkosd2026.hetfo);       // 2026. 05. 25.