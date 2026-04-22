/**
 * actualizar.js — Club Atletico Maristas
 * Descubre las series automaticamente desde futbol.aira.cl/lig/defaultTorneo.aspx
 * y sincroniza tablas de posiciones + proxima fecha en index.html
 *
 * Uso: node actualizar.js
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const HTML_FILE     = path.join(__dirname, 'index.html');
const SIDE_URL      = 'https://futbol.aira.cl/lig/side.aspx';
const BASE_AIRA     = 'https://futbol.aira.cl';
const NUESTRO_EQUIPO = 'ATLETICO MARISTA';

// Mapa: texto en AIRA (normalizado sin tildes) → serie interna del sitio
const SERIE_MAP = {
  'JUNIOR':       { id: 'junior',      label: 'Junior' },
  'SENIOR':       { id: 'senior',      label: 'Senior' },
  'SUPER SENIOR': { id: 'supersenior', label: 'Super Senior' },
  'DORADA':       { id: 'dorada',      label: 'Dorada' },
  'DIAMANTE':     { id: 'diamante',    label: 'Diamante' },
};

// Normaliza texto: quita tildes y convierte a mayusculas
// Ej: "AP. 2026 JÚNIOR" → "AP. 2026 JUNIOR"
function normalizar(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

// ---- HTTP helper ----

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
        'Accept':          'text/html,application/xhtml+xml',
        'Accept-Language': 'es-CL,es;q=0.9'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : BASE_AIRA + res.headers.location;
        return fetchPage(next).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(18000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ---- Parser de side.aspx — descubre URLs de todas las series ----

/**
 * Extrae los links de posicion y programacion desde side.aspx.
 * Retorna:
 *   [ { id, label, url, progUrl }, ... ]  — solo las series de SERIE_MAP
 */
function parseSideLinks(html) {
  const series = {};

  // Extraer todos los <a class="LinkDetalle" href='...' ...>TEXTO</a>
  const re = /<a\s+class="LinkDetalle"\s+href='([^']+)'[^>]*>([^<]+)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href      = m[1].trim();
    const textoNorm = normalizar(m[2].trim());

    // Determinar a que serie pertenece (comparando sin tildes)
    // Se ordenan las claves de mayor a menor para que "SUPER SENIOR" se chequee antes que "SENIOR"
    let serieKey = null;
    for (const clave of Object.keys(SERIE_MAP).sort((a, b) => b.length - a.length)) {
      if (textoNorm.includes(clave)) {
        serieKey = clave;
        break;
      }
    }
    if (!serieKey) continue;

    const { id, label } = SERIE_MAP[serieKey];
    if (!series[id]) series[id] = { id, label };

    // Resolver URL relativa → absoluta
    const urlAbs = href.startsWith('http')
      ? href
      : BASE_AIRA + '/' + href.replace(/^\.\.\//, '');

    if (href.includes('lstPosicionPublico')) {
      series[id].url    = urlAbs;
      series[id].golUrl = urlAbs.replace('lstPosicionPublico', 'lstGoleadorPublico');
    } else if (href.includes('lstProgramacionPublico')) {
      series[id].progUrl = urlAbs;
    }
  }

  return Object.values(series).filter(s => s.url);
}

// ---- Parsers de datos ----

function parseGoleadores(html) {
  const filas = [];
  const segmentos = html.split(/<tr class="itemGrilla/i);
  for (let i = 1; i < segmentos.length; i++) {
    const seg = segmentos[i];
    if (seg.includes('itemGrillaNula')) continue;
    const celdas = [];
    const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let m;
    while ((m = tdRe.exec(seg)) !== null) celdas.push(stripTags(m[1]).trim());
    if (celdas.length < 5) continue;
    const pos    = parseInt(celdas[0], 10);
    const equipo = celdas[1];
    const jugador = celdas[2];
    const goles  = parseInt(celdas[4], 10);
    if (!jugador || isNaN(goles)) continue;
    filas.push({ pos, equipo, jugador, goles });
  }
  return filas;
}

function generarRankingMaristas(todos) {
  if (!todos.length) {
    return '<tbody><tr><td colspan="4" style="text-align:center;color:var(--muted);padding:16px">Sin goleadores registrados aún.</td></tr></tbody>';
  }
  const sorted = todos.slice().sort((a, b) => b.goles - a.goles);
  const lineas = sorted.map((f, i) => {
    const medal = i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : `${i + 1}`;
    return `            <tr class="yo"><td>${medal}</td><td><img src="escudo.png" alt="" style="width:16px;vertical-align:middle;margin-right:4px"/><strong>${toTitleCase(f.jugador)}</strong></td><td><span class="serie-badge">${f.serie}</span></td><td><strong>${f.goles}</strong> ⚽</td></tr>`;
  });
  return '          <tbody>\n' + lineas.join('\n') + '\n          </tbody>';
}

function actualizarGoles(html, tbodyNuevo) {
  const startMarker = '<!-- GOLES:maristas -->';
  const endMarker   = '<!-- /GOLES:maristas -->';
  const si = html.indexOf(startMarker);
  const ei = html.indexOf(endMarker);
  if (si === -1 || ei === -1) {
    console.log('  ⚠  Marcadores GOLES:maristas no encontrados');
    return html;
  }
  return html.slice(0, si + startMarker.length) + '\n' + tbodyNuevo + '\n        ' + html.slice(ei);
}


function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
}

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function parsePosiciones(html) {
  const rows = [];
  const segmentos = html.split(/<tr class="itemGrilla/i);

  for (let i = 1; i < segmentos.length; i++) {
    const seg = segmentos[i];

    const posMatch = seg.match(/<td[^>]*>\s*(\d+)\s*<\/td>/);
    if (!posMatch) continue;
    const pos = parseInt(posMatch[1], 10);
    if (isNaN(pos) || pos < 1 || pos > 60) continue;

    const nombreMatch = seg.match(/<a\s+class="LinkDetalle"[^>]*>([^<]+)<\/a>/i);
    if (!nombreMatch) continue;
    const nombre = nombreMatch[1].trim();
    if (!nombre || nombre.length < 2) continue;

    const despues = seg.slice(seg.indexOf('</table>') + 8);
    const numericos = [];
    const numRe = /<td[^>]*>\s*(-?\d+)\s*<\/td>/g;
    let n;
    while ((n = numRe.exec(despues)) !== null) numericos.push(parseInt(n[1], 10));
    if (numericos.length < 8) continue;

    const [pj, pg, pe, pp, gf, gc, , pts] = numericos;
    rows.push({ pos, nombre, pj, pg, pe, pp, gf, gc, pts });
  }

  return rows;
}

function parseProgramacion(html) {
  const partidos = [];
  const segmentos = html.split(/<tr class="itemGrilla/i);

  for (let i = 1; i < segmentos.length; i++) {
    const seg = segmentos[i];
    if (seg.includes('itemGrillaNula')) continue;

    const celdas = [];
    const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let m;
    while ((m = tdRe.exec(seg)) !== null) celdas.push(stripTags(m[1]).trim());
    if (celdas.length < 6) continue;

    const programacion = celdas[0];
    const cancha       = celdas[2] ? 'Cancha ' + celdas[2].trim() : '';
    const local        = celdas[3];
    const visita       = celdas[4];
    const fecha        = celdas[5];

    if (!local.toUpperCase().includes(NUESTRO_EQUIPO) &&
        !visita.toUpperCase().includes(NUESTRO_EQUIPO)) continue;

    let fechaDate = null;
    const fm = programacion.match(/(\d{2})\/(\d{2})\/(\d{4})\s*(\d{2}):(\d{2})/);
    if (fm) {
      const [, dd, mm, yyyy, hh, min] = fm;
      fechaDate = new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00`);
    }

    partidos.push({ programacion, local, visita, fecha, fechaDate, cancha });
  }

  return partidos;
}

// ---- Generadores de HTML ----

function generarTbody(filas) {
  if (!filas.length) return null;
  const lineas = filas.map(f => {
    const esNuestro    = f.nombre.toUpperCase().includes(NUESTRO_EQUIPO);
    const nombreMostrar = toTitleCase(f.nombre);
    const equipoCell   = esNuestro
      ? `<td class="t-equipo"><img src="escudo.png" alt="" /><strong>${nombreMostrar}</strong></td>`
      : `<td class="t-equipo"><span></span>${nombreMostrar}</td>`;
    const rowClass = esNuestro ? ' class="yo"' : '';
    return `            <tr${rowClass}><td>${f.pos}</td>${equipoCell}<td>${f.pj}</td><td>${f.pg}</td><td>${f.pe}</td><td>${f.pp}</td><td>${f.gf}</td><td>${f.gc}</td><td><strong>${f.pts}</strong></td></tr>`;
  });
  return '          <tbody>\n' + lineas.join('\n') + '\n          </tbody>';
}

function generarProximaFecha(todosPartidos) {
  if (!todosPartidos.length) {
    return '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:16px">Sin partidos programados próximamente.</td></tr>';
  }
  return todosPartidos.map(p => {
    const esLocal   = p.local.toUpperCase().includes(NUESTRO_EQUIPO);
    const localCell = esLocal
      ? `<td><strong style="color:var(--red)">${toTitleCase(p.local)}</strong></td>`
      : `<td>${toTitleCase(p.local)}</td>`;
    const visitCell = !esLocal
      ? `<td><strong style="color:var(--red)">${toTitleCase(p.visita)}</strong></td>`
      : `<td>${toTitleCase(p.visita)}</td>`;
    return `              <tr>
                <td class="serie-badge">${p.serie}</td>
                <td style="text-align:center;white-space:nowrap">${p.fecha}</td>
                <td style="white-space:nowrap">${p.programacion}</td>
                ${localCell}
                ${visitCell}
                <td style="white-space:nowrap">${p.cancha || '—'}</td>
              </tr>`;
  }).join('\n');
}

function actualizarHTML(html, serieId, tbodyNuevo) {
  const startMarker = `<!-- TBODY:${serieId} -->`;
  const endMarker   = `<!-- /TBODY:${serieId} -->`;
  const si = html.indexOf(startMarker);
  const ei = html.indexOf(endMarker);
  if (si === -1 || ei === -1) {
    console.log(`  ⚠  Marcadores no encontrados para ${serieId}`);
    return html;
  }
  return html.slice(0, si + startMarker.length) + '\n' + tbodyNuevo + '\n          ' + html.slice(ei);
}

// ---- Main ----

async function main() {
  console.log('\nDescubriendo series desde futbol.aira.cl...\n');

  // 1. Obtener todos los links desde side.aspx
  let series;
  try {
    const sideHtml = await fetchPage(SIDE_URL);
    series = parseSideLinks(sideHtml);
  } catch (err) {
    console.error('  ✗  No se pudo acceder a futbol.aira.cl:', err.message);
    process.exit(1);
  }

  if (!series.length) {
    console.error('  ✗  No se encontraron series en side.aspx. Verifica la conexion.');
    process.exit(1);
  }

  console.log(`  ✓  ${series.length} series encontradas: ${series.map(s => s.label).join(', ')}\n`);

  let html = fs.readFileSync(HTML_FILE, 'utf8');
  let actualizadas  = 0;
  const todosPartidos = [];
  const goleadoresMaristas = [];

  // 2. Por cada serie: posiciones + programacion
  for (const serie of series) {
    // Posiciones
    process.stdout.write(`  Posiciones ${serie.id.padEnd(13)}... `);
    try {
      const pageHtml = await fetchPage(serie.url);
      const filas    = parsePosiciones(pageHtml);
      if (!filas.length) { console.log('sin datos'); }
      else {
        html = actualizarHTML(html, serie.id, generarTbody(filas));
        actualizadas++;
        console.log(`OK (${filas.length} equipos)`);
      }
    } catch (err) { console.log(`Error: ${err.message}`); }

    // Programacion (si tiene URL)
    if (serie.progUrl) {
      process.stdout.write(`  Programacion ${serie.id.padEnd(10)}... `);
      try {
        const progHtml = await fetchPage(serie.progUrl);
        const partidos = parseProgramacion(progHtml);
        partidos.forEach(p => { p.serie = serie.label; });
        todosPartidos.push(...partidos);
        console.log(`OK (${partidos.length} partidos de Maristas)`);
      } catch (err) { console.log(`Error: ${err.message}`); }
    }

    // Goleadores
    if (serie.golUrl) {
      process.stdout.write(`  Goleadores   ${serie.id.padEnd(10)}... `);
      try {
        const golHtml = await fetchPage(serie.golUrl);
        const filas   = parseGoleadores(golHtml);
        const propios = filas.filter(f => f.equipo.toUpperCase().includes(NUESTRO_EQUIPO));
        propios.forEach(f => { f.serie = serie.label; });
        goleadoresMaristas.push(...propios);
        console.log(`OK (${propios.length} goleadores de Maristas)`);
      } catch (err) { console.log(`Error: ${err.message}`); }
    }
  }

  // 3. Ranking goleadores Maristas
  html = actualizarGoles(html, generarRankingMaristas(goleadoresMaristas));
  console.log(`\n  Goleadores Maristas: ${goleadoresMaristas.length} jugador(es) en el ranking`);

  // 5. Proxima fecha
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let proximos = todosPartidos
    .filter(p => !p.fechaDate || p.fechaDate >= hoy)
    .sort((a, b) => (a.fechaDate || 0) - (b.fechaDate || 0));

  if (!proximos.length && todosPartidos.length) {
    proximos = todosPartidos.sort((a, b) => (b.fechaDate || 0) - (a.fechaDate || 0)).slice(0, 5);
  }

  if (proximos.length) {
    const hoyStr = new Date().toLocaleDateString('es-CL', { day:'2-digit', month:'2-digit', year:'numeric' });
    html = html.replace(
      /<tbody id="proxima-tbody">[\s\S]*?<\/tbody>/,
      `<tbody id="proxima-tbody">\n${generarProximaFecha(proximos)}\n            </tbody>`
    );
    html = html.replace(/Actualizado: [^<]*/, `Actualizado: ${hoyStr}`);
    console.log(`\n  Proxima fecha: ${proximos.length} partido(s) listado(s)`);
  }

  // 6. Guardar
  fs.writeFileSync(HTML_FILE, html, 'utf8');
  if (actualizadas > 0) {
    console.log(`\n  ✓  index.html actualizado (${actualizadas}/${series.length} series)\n`);
  } else {
    console.log('\n  ✓  index.html actualizado (goleadores y programacion)\n');
  }
}

main().catch(err => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
