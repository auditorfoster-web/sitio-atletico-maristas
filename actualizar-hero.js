#!/usr/bin/env node
'use strict';
/**
 * actualizar-hero.js
 * --------------------------------------------------------------------------
 * Escanea las carpetas de fotos de cada serie y reescribe `hero-fotos.js`
 * con la lista completa de imagenes candidatas para el carrusel del hero.
 *
 * El hero SIEMPRE abre con las slides de campeones + los 3 videos del drone
 * (estan fijas en index.html; `fotos/campeones` queda fuera de CARPETAS a
 * proposito para no repetirlas aca).
 * Las fotos restantes se eligen solas en el navegador (script.js) segun la
 * fecha: el set cambia cada 2 semanas. Aqui solo generamos el inventario.
 *
 * Corre esto cada vez que subas o borres fotos:
 *     node actualizar-hero.js
 */
const fs = require('fs');
const path = require('path');

// Carpetas (relativas a la raiz del sitio) de donde salen las fotos del hero.
// Son las series: contienen fotos de accion en horizontal, ideales para fondo.
const CARPETAS = ['fotos/dorada', 'fotos/junior', 'fotos/super senior',
                  'fotos/diamante', 'fotos/senior'];

const EXT = /\.(jpe?g|png|webp)$/i;
const ROOT = __dirname;

function listar(dir) {
  const abs = path.join(ROOT, dir);
  let files;
  try { files = fs.readdirSync(abs); } catch { return []; }
  return files
    .filter((f) => EXT.test(f))
    .sort()
    .map((f) => dir + '/' + f); // siempre con barra normal para la web
}

const fotos = [];
for (const c of CARPETAS) fotos.push(...listar(c));

const banner =
  '// Generado por actualizar-hero.js — NO editar a mano.\n' +
  '// Inventario de fotos del hero. script.js elige un subconjunto que rota\n' +
  '// cada 2 semanas. Corre `node actualizar-hero.js` al subir/borrar fotos.\n';

const out = banner + 'window.HERO_FOTOS = [\n' +
  fotos.map((f) => "  '" + f.replace(/'/g, "\\'") + "'").join(',\n') +
  '\n];\n';

fs.writeFileSync(path.join(ROOT, 'hero-fotos.js'), out, 'utf8');
console.log('  ✓  hero-fotos.js actualizado (' + fotos.length + ' fotos)');
for (const c of CARPETAS) {
  const n = fotos.filter((f) => f.startsWith(c + '/')).length;
  console.log('       ' + c.replace('fotos/', '').padEnd(14) + n);
}
