/**
 * actualizar-mundial.js — Club Atletico Maristas
 * Descarga el fixture y resultados del Mundial FIFA 2026 (fixturedownload.com)
 * y genera mundial.js (window.MUNDIAL), que script.js usa para el banner de
 * "partidos del dia" (en hora de Chile).
 *
 * Uso: node actualizar-mundial.js
 * Tambien lo llama actualizar.js al final de cada actualizacion.
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const FEED = 'https://fixturedownload.com/feed/json/fifa-world-cup-2026';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }, res => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    }).on('error', reject).setTimeout(18000, function () { this.destroy(); reject(new Error('Timeout')); });
  });
}

// Limpia nombres tipo "IR Iran" -> "Iran" (prefijo codigo FIFA) y recorta.
function limpiaEquipo(n) {
  if (!n) return '';
  return n.replace(/^([A-Z]{2,3})\s+(?=[A-Z][a-z])/, '').trim();
}

async function actualizarMundial() {
  const data = await fetchJson(FEED);
  if (!Array.isArray(data) || !data.length) throw new Error('Feed vacio');

  const partidos = data
    .filter(m => m.DateUtc && m.HomeTeam && m.AwayTeam)
    .map(m => ({
      n:   m.MatchNumber,
      ts:  m.DateUtc.replace(' ', 'T'),               // "2026-06-11T19:00:00Z" (UTC)
      g:   m.Group || '',
      loc: m.Location || '',
      h:   limpiaEquipo(m.HomeTeam),
      a:   limpiaEquipo(m.AwayTeam),
      hs:  (m.HomeTeamScore == null ? null : m.HomeTeamScore),
      as:  (m.AwayTeamScore == null ? null : m.AwayTeamScore)
    }));

  const esc = s => String(s).replace(/'/g, "\\'");
  const items = partidos.map(p =>
    `  { n:${p.n}, ts:'${p.ts}', g:'${esc(p.g)}', loc:'${esc(p.loc)}', ` +
    `h:'${esc(p.h)}', a:'${esc(p.a)}', hs:${p.hs == null ? 'null' : p.hs}, as:${p.as == null ? 'null' : p.as} }`
  ).join(',\n');

  const out =
    '// Generado por actualizar-mundial.js — NO editar a mano.\n' +
    '// Fixture y resultados del Mundial FIFA 2026 (fuente: fixturedownload.com).\n' +
    '// "ts" esta en UTC; script.js lo convierte a hora de Chile.\n' +
    'window.MUNDIAL = {\n' +
    `  actualizado: '${new Date().toISOString()}',\n` +
    '  partidos: [\n' + items + (items ? '\n' : '') + '  ]\n' +
    '};\n';

  fs.writeFileSync(path.join(__dirname, 'mundial.js'), out, 'utf8');
  return partidos.length;
}

module.exports = { actualizarMundial };

// Permite ejecutarlo directo: node actualizar-mundial.js
if (require.main === module) {
  actualizarMundial()
    .then(n => console.log(`  ✓  mundial.js actualizado (${n} partidos)`))
    .catch(e => { console.error('  ✗  Error Mundial:', e.message); process.exit(1); });
}
