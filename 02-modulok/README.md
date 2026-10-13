# importálás másik modulból

Alapértelmezetten a **js fájlok tartalma zárt**. Másik fájlban/modulban definiált változókat, függvényeket, osztályokat stb. importálhatunk a `import` kulcsszóval, ha a forrás modulban `export`-álták őket. `export`-álni lehet változókat, függvényeket, osztályokat stb.

## named export

`modul.js`:

```js
export const nev = "John";
export const szam = 42;
export const koszontes = () => {
  console.log("Hello, World!");
};
```

usages:

```js
import { nev, szam, koszontes } from './modul.js';
console.log(nev);
console.log(szam);
koszontes();
```

## default export

```js
import koszontes from './modul.js';
koszontes();
```