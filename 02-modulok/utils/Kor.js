// =====================================================
// OSZTÁLY (class) DEFAULT EXPORTJA
// Gyakori minta: egy fájl = egy osztály, default exporttal.
// =====================================================

export default class Kor {
  constructor(sugar) {
    this.sugar = sugar;
  }

  terulet() {
    return Math.PI * this.sugar ** 2;
  }

  kerulet() {
    return 2 * Math.PI * this.sugar;
  }
}
