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
const { actualizarMundial } = require('./actualizar-mundial');

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

// Cookie jar de sesion: AIRA exige la cookie ASP.NET_SessionId (creada en la
// primera peticion) para servir la pagina de resultados por equipo con datos.
const COOKIES = {};
function cookieHeader() {
  return Object.entries(COOKIES).map(([k, v]) => `${k}=${v}`).join('; ');
}

function fetchPage(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
      'Accept':          'text/html,application/xhtml+xml',
      'Accept-Language': 'es-CL,es;q=0.9'
    };
    if (Object.keys(COOKIES).length) headers['Cookie'] = cookieHeader();
    if (opts.referer) headers['Referer'] = opts.referer;

    const req = https.get(url, { headers }, res => {
      (res.headers['set-cookie'] || []).forEach(c => {
        const m = c.match(/^([^=]+)=([^;]*)/);
        if (m) COOKIES[m[1]] = m[2];
      });
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : BASE_AIRA + res.headers.location;
        return fetchPage(next, opts).then(resolve).catch(reject);
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
  const top3 = sorted.slice(0, 3);
  const lineas = top3.map((f, i) => {
    const medal = i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : '🥉 ';
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

// En la pagina de posiciones, cada equipo enlaza a su pagina de resultados
// (lstResultadoEquipoPublico.aspx). Devuelve el href de la fila de Maristas.
function hrefResultadoMaristas(posHtml) {
  const segs = posHtml.split(/<tr class="itemGrilla/i);
  for (let i = 1; i < segs.length; i++) {
    if (normalizar(segs[i]).includes(NUESTRO_EQUIPO)) {
      const m = segs[i].match(/href\s*=\s*['"]([^'"]*Resultado[^'"]*)['"]/i);
      if (m) return m[1];
    }
  }
  return null;
}

// Parsea la grilla de resultados de un equipo.
// Columnas: id | jornada | fecha+hora | Local | Visita | L/V/E | "gl-gv" | ptos
// Cada celda Local/Visita enlaza a la planilla del partido (verPlanillaPublico);
// guardamos el link de la celda de Maristas para luego sacar los goleadores.
function parseResultadosEquipo(html) {
  const out = [];
  const trs = html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
  for (const tr of trs) {
    const celdasRaw = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
    const tds = celdasRaw.map(stripTags);
    if (tds.length < 7) continue;
    const fm = (tds[2] || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (!fm) continue; // salta el encabezado u otras filas
    const gm = (tds[6] || '').match(/(\d+)\s*-\s*(\d+)/);
    if (!gm) continue; // sin marcador = no jugado
    const [, dd, mm, yyyy] = fm;

    // Cual celda (3=local, 4=visita) es Maristas, y su link de planilla
    const amIdx = normalizar(tds[3]).includes(NUESTRO_EQUIPO) ? 3
                : normalizar(tds[4]).includes(NUESTRO_EQUIPO) ? 4 : -1;
    let planillaAM = null;
    if (amIdx >= 0) {
      const lm = (celdasRaw[amIdx] || '').match(/href='([^']*verPlanilla[^']*)'/i);
      if (lm) planillaAM = lm[1];
    }

    out.push({
      jornada: parseInt(tds[1], 10) || 0,
      fecha: `${dd}/${mm}/${yyyy}`,
      fechaDate: new Date(`${yyyy}-${mm}-${dd}`),
      local: tds[3],
      visita: tds[4],
      gl: parseInt(gm[1], 10),
      gv: parseInt(gm[2], 10),
      planillaAM
    });
  }
  return out;
}

// Nombre de goleador como "Nombre + primer apellido".
// AIRA guarda "APELLIDO1 APELLIDO2 NOMBRE1 NOMBRE2"; los jugadores nuevos van
// como "APELLIDO (NUEVO) NOMBRE".
//   "AROCA SOTO MARTIN ALEXIS"  -> "Martin Aroca"
//   "URTASUN BASTIDAS XAVIER"   -> "Xavier Urtasun"
//   "PEREZ (NUEVO) MARCO"       -> "Marco Perez"
function nombreGoleador(raw) {
  const esNuevo = /\(NUEVO\)/i.test(raw);
  const t = raw.replace(/\(NUEVO\)/ig, '').replace(/\s+/g, ' ').trim().split(' ');
  const apellido = t[0] || '';
  const nombre = esNuevo ? (t[1] || '') : (t.length >= 3 ? t[2] : (t[1] || ''));
  return toTitleCase(`${nombre} ${apellido}`.trim());
}

// En la planilla del partido, la columna "Goles" muestra una imagen gol.gif por
// cada gol del jugador. Devuelve [{ nombre, goles }] de los que anotaron.
function parseGoleadoresPlanilla(html) {
  const tabs = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  const jt = tabs.find(t => /Jugador/i.test(t) && /Goles/i.test(t));
  if (!jt) return [];
  const rows = [...jt.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const out = [];
  for (const r of rows) {
    const cells = [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(c => c[1]);
    if (cells.length < 4) continue;
    const jugador = stripTags(cells[1]);
    if (!jugador || /Jugador/i.test(jugador)) continue;
    const nGoles = ((cells[3] || '').match(/gol\.gif/gi) || []).length;
    if (nGoles > 0) out.push({ nombre: nombreGoleador(jugador), goles: nGoles });
  }
  return out;
}

// Escribe resultados.js (consumido por script.js) con el ultimo resultado
// jugado de cada serie, del mas reciente al mas antiguo.
function escribirResultados(resultados) {
  const ordenados = resultados.slice().sort((a, b) => b.fechaDate - a.fechaDate);
  const esc = s => String(s).replace(/'/g, "\\'");
  const items = ordenados.map(r => {
    const gol = (r.goleadores && r.goleadores.length)
      ? `, golesAM:[${r.goleadores.map(g => `{n:'${esc(g.nombre)}',g:${g.goles}}`).join(',')}]`
      : '';
    return `  { serie:'${r.serie}', fecha:'${r.fecha}', local:'${esc(toTitleCase(r.local))}', gl:${r.gl}, visita:'${esc(toTitleCase(r.visita))}', gv:${r.gv}${gol} }`;
  }).join(',\n');
  const out =
    '// Generado por actualizar.js — NO editar a mano.\n' +
    '// Ultimo resultado jugado de cada serie (Atletico Maristas).\n' +
    'window.RESULTADOS = [\n' + items + (items ? '\n' : '') + '];\n';
  fs.writeFileSync(path.join(__dirname, 'resultados.js'), out, 'utf8');
}

// Parsea la pagina "Equipo" (verEquipoPublico.aspx) — tabla [30] Jugadores.
// Columnas: Serie | Jugador | F.Nacimiento (DD/MM/YYYY) | Edad | Bloq | FS | FC | FP
// Devuelve [{ serieJug, raw, fnac }] de las filas con fecha valida.
function parseRosterEquipo(html) {
  const tablas = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  const jt = tablas.find(t => /Nacimiento/i.test(t));
  if (!jt) return [];
  const out = [];
  const filas = [...jt.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  for (const r of filas) {
    const tds = [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(c => stripTags(c[1]));
    if (tds.length < 4) continue;
    const fm = (tds[2] || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!fm) continue; // encabezado u otras filas
    out.push({ serieJug: tds[0], raw: tds[1], fnac: tds[2] });
  }
  return out;
}

// Escribe cumpleanos.js (consumido por script.js) con los jugadores del club
// y su fecha de nacimiento. script.js muestra los cumpleaneros del dia.
// Dedup por nombre+fecha; descarta inscripciones placeholder (edad < 5).
function escribirCumpleanos(jugadores) {
  const anioActual = new Date().getFullYear();
  const vistos = new Set();
  const lista = [];
  for (const j of jugadores) {
    const fm = j.fnac.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!fm) continue;
    const [, dd, mm, yyyy] = fm;
    const y = parseInt(yyyy, 10);
    if (anioActual - y < 5) continue;            // placeholders INFANTIL (NUEVO)
    const clave = normalizar(j.raw) + '|' + j.fnac;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    lista.push({
      n: nombreGoleador(j.raw),
      s: toTitleCase(j.serieJug),
      d: parseInt(dd, 10),
      m: parseInt(mm, 10),
      y
    });
  }
  lista.sort((a, b) => (a.m - b.m) || (a.d - b.d));
  const esc = s => String(s).replace(/'/g, "\\'");
  const items = lista.map(p =>
    `  { n:'${esc(p.n)}', s:'${esc(p.s)}', d:${p.d}, m:${p.m}, y:${p.y} }`
  ).join(',\n');
  const out =
    '// Generado por actualizar.js — NO editar a mano.\n' +
    '// Jugadores del club con fecha de nacimiento (todas las series).\n' +
    '// script.js muestra el saludo a los cumpleaneros del dia.\n' +
    'window.CUMPLEANOS = [\n' + items + (items ? '\n' : '') + '];\n';
  fs.writeFileSync(path.join(__dirname, 'cumpleanos.js'), out, 'utf8');
  return lista.length;
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
  const resultadosMaristas = [];
  const rosterMaristas = [];

  // 2. Por cada serie: posiciones + programacion
  for (const serie of series) {
    // Posiciones
    process.stdout.write(`  Posiciones ${serie.id.padEnd(13)}... `);
    let posHtml = null;
    try {
      posHtml = await fetchPage(serie.url);
      const filas = parsePosiciones(posHtml);
      if (!filas.length) { console.log('sin datos'); }
      else {
        html = actualizarHTML(html, serie.id, generarTbody(filas));
        actualizadas++;
        console.log(`OK (${filas.length} equipos)`);
      }
    } catch (err) { console.log(`Error: ${err.message}`); }

    // Ultimo resultado jugado de Maristas en esta serie
    if (posHtml) {
      const href = hrefResultadoMaristas(posHtml);

      // Roster del equipo (pagina "Equipo" = verEquipoPublico) para cumpleaños.
      // El mismo token 'data=' del link de resultados sirve para el roster.
      if (href) {
        process.stdout.write(`  Roster       ${serie.id.padEnd(10)}... `);
        try {
          const eqUrl = BASE_AIRA + '/ini/' + href
            .replace('lstResultadoEquipoPublico', 'verEquipoPublico')
            .replace(/^\.?\/?/, '');
          const eqHtml = await fetchPage(eqUrl, { referer: serie.url });
          const roster = parseRosterEquipo(eqHtml);
          rosterMaristas.push(...roster);
          console.log(`OK (${roster.length} jugadores)`);
        } catch (err) { console.log(`Error: ${err.message}`); }
      }

      if (href) {
        process.stdout.write(`  Resultados   ${serie.id.padEnd(10)}... `);
        try {
          const resUrl = BASE_AIRA + '/ini/' + href.replace(/^\.?\/?/, '');
          const resHtml = await fetchPage(resUrl, { referer: serie.url });
          const jugados = parseResultadosEquipo(resHtml)
            .sort((a, b) => b.fechaDate - a.fechaDate);
          if (jugados.length) {
            const ult = jugados[0];
            ult.serie = serie.label;
            // Goleadores de Maristas en ese partido (planilla del partido)
            if (ult.planillaAM) {
              try {
                const planUrl = BASE_AIRA + '/ini/' + ult.planillaAM.replace(/^\.?\/?/, '');
                const planHtml = await fetchPage(planUrl, { referer: resUrl });
                ult.goleadores = parseGoleadoresPlanilla(planHtml);
              } catch { ult.goleadores = []; }
            }
            resultadosMaristas.push(ult);
            const gAM = (ult.goleadores || []).map(g => `${g.nombre} x${g.goles}`).join(', ');
            console.log(`OK (${ult.local} ${ult.gl}-${ult.gv} ${ult.visita})${gAM ? ' — ' + gAM : ''}`);
          } else { console.log('sin jugados'); }
        } catch (err) { console.log(`Error: ${err.message}`); }
      }
    }

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

  // 4. Ultimos resultados (resultados.js)
  escribirResultados(resultadosMaristas);
  console.log(`  Ultimos resultados: ${resultadosMaristas.length} serie(s)`);

  // 4b. Cumpleaños (cumpleanos.js)
  const nCumples = escribirCumpleanos(rosterMaristas);
  console.log(`  Cumpleaños: ${nCumples} jugador(es) con fecha de nacimiento`);

  // 4c. Mundial FIFA 2026 (mundial.js) — para el banner de partidos del dia
  try {
    const n = await actualizarMundial();
    console.log(`  Mundial 2026: ${n} partido(s) en el fixture`);
  } catch (err) { console.log(`  Mundial 2026: Error (${err.message})`); }

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
