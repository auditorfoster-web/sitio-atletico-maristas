/**
 * admin-server.js — Panel de Administracion
 * Club Atletico Maristas
 *
 * Uso: node admin-server.js
 * Abre: http://localhost:3001
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');
const { exec } = require('child_process');

const PORT = 3001;
const BASE = __dirname;
const NOTICIAS_FILE     = path.join(BASE, 'noticias.js');
const EQUIPO_FILE       = path.join(BASE, 'equipo-semana.js');
const INSTAGRAM_FILE    = path.join(BASE, 'instagram-posts.js');
const FOTOS_DIR         = path.join(BASE, 'fotos');

// ---- Utilidades ----

const MAX_BODY = 20 * 1024 * 1024; // 20 MB

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', c => {
      total += c.length;
      if (total > MAX_BODY) { req.destroy(); return reject(new Error('Payload demasiado grande')); }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function sendJSON(res, data, status = 200) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function serveFile(res, filePath) {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.webp': 'image/webp'
  };
  const ct = types[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('No encontrado'); return; }
    res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': 'max-age=60' });
    res.end(data);
  });
}

// ---- Noticias ----

function getNoticias() {
  try {
    const content = fs.readFileSync(NOTICIAS_FILE, 'utf8');
    const start = content.indexOf('[');
    const end   = content.lastIndexOf(']');
    if (start === -1 || end === -1) return [];
    return (new Function('return ' + content.slice(start, end + 1)))();
  } catch { return []; }
}

function saveNoticias(arr) {
  const lines = arr.map((n, i) => {
    const cmt = i === 0
      ? '  // ---- NOTICIA PRINCIPAL (aparece grande en el sitio) ----\n'
      : i === 1 ? '  // ---- NOTICIAS SECUNDARIAS ----\n' : '';

    // Campos base (siempre presentes).
    const props = [
      `    serie:   ${JSON.stringify(n.serie   || '')}`,
      `    titulo:  ${JSON.stringify(n.titulo  || '')}`,
      `    fecha:   ${JSON.stringify(n.fecha   || '')}`,
      `    resumen: ${JSON.stringify(n.resumen || '')}`,
    ];

    // Campos ricos (cita del DT + estadisticas), solo si vienen definidos, para
    // no perderlos al guardar desde el panel.
    if (n.cita)      props.push(`    cita:       ${JSON.stringify(n.cita)}`);
    if (n.citaAutor) props.push(`    citaAutor:  ${JSON.stringify(n.citaAutor)}`);
    if (Array.isArray(n.estadisticas) && n.estadisticas.length) {
      const stats = n.estadisticas.map(s =>
        `      { l: ${JSON.stringify(s.l || '')}, v: ${JSON.stringify(s.v || '')} }`
      ).join(',\n');
      props.push(`    estadisticas: [\n${stats}\n    ]`);
    }

    // Video opcional de la noticia (se muestra en un escenario 16:9).
    if (n.video)        props.push(`    video:        ${JSON.stringify(n.video)}`);
    if (n.videoPoster)  props.push(`    videoPoster:  ${JSON.stringify(n.videoPoster)}`);
    if (n.videoCaption) props.push(`    videoCaption: ${JSON.stringify(n.videoCaption)}`);

    // Imagen principal (hero) + galeria opcional de fotos adicionales.
    props.push(`    imagen:  ${JSON.stringify(n.imagen || '')}`);
    if (Array.isArray(n.imagenes) && n.imagenes.length) {
      const imgs = n.imagenes.map(src => `      ${JSON.stringify(src || '')}`).join(',\n');
      props.push(`    imagenes: [\n${imgs}\n    ]`);
    }

    return `${cmt}  {\n${props.join(',\n')}\n  }`;
  });

  const out = `// ================================================================
//  NOTICIAS — Club Atletico Maristas
//  Editado desde el panel de administracion — admin-server.js
//
//  La primera noticia aparece GRANDE (noticia principal).
//  Las siguientes aparecen como noticias secundarias.
// ================================================================

const NOTICIAS = [

${lines.join(',\n\n')}

];
`;
  fs.writeFileSync(NOTICIAS_FILE, out, 'utf8');
}

// ---- Equipo de la Semana ----

function getEquipo() {
  try {
    const content = fs.readFileSync(EQUIPO_FILE, 'utf8');
    const start = content.indexOf('const EQUIPO_SEMANA =') + 'const EQUIPO_SEMANA ='.length;
    const end   = content.lastIndexOf('};') + 1;
    if (start < 20 || end === 0) return { titulo: 'Equipo de la Semana', subtitulo: '', jugadores: [] };
    return (new Function('return ' + content.slice(start, end).trim()))();
  } catch { return { titulo: 'Equipo de la Semana', subtitulo: '', jugadores: [] }; }
}

function saveEquipo(data) {
  const jugadores = (data.jugadores || []).map(j =>
    `    { nombre: ${JSON.stringify(j.nombre || '')}, serie: ${JSON.stringify(j.serie || '')}, posicion: ${JSON.stringify(j.posicion || '')}, numero: ${Number(j.numero) || 0}, imagen: ${JSON.stringify(j.imagen || '')} }`
  ).join(',\n');

  const out = `// ================================================================
//  EQUIPO DE LA SEMANA — Club Atletico Maristas
//  Editado desde el panel de administracion — admin-server.js
// ================================================================

const EQUIPO_SEMANA = {
  titulo:    ${JSON.stringify(data.titulo    || 'Equipo de la Semana')},
  subtitulo: ${JSON.stringify(data.subtitulo || '')},
  jugadores: [
${jugadores}
  ]
};
`;
  fs.writeFileSync(EQUIPO_FILE, out, 'utf8');
}

// ---- Instagram Posts ----

function getInstagram() {
  try {
    const content = fs.readFileSync(INSTAGRAM_FILE, 'utf8');
    const start = content.indexOf('[');
    const end   = content.lastIndexOf(']');
    if (start === -1 || end === -1) return [];
    return (new Function('return ' + content.slice(start, end + 1)))();
  } catch { return []; }
}

function saveInstagram(arr) {
  const lines = arr.map((post, i) => {
    return `  {\n    imagen:  ${JSON.stringify(post.imagen  || '')},\n    caption: ${JSON.stringify(post.caption || '')},\n    fecha:   ${JSON.stringify(post.fecha   || '')},\n    enlace:  ${JSON.stringify(post.enlace  || '')}\n  }`;
  });

  const out = `// ================================================================
//  INSTAGRAM POSTS — Club Atletico Maristas
//  Editado desde el panel de administracion — admin-server.js
//
//  Array de posts para mostrar en la sección de Instagram
// ================================================================

const INSTAGRAM_POSTS = [

${lines.join(',\n\n')}

];
`;
  fs.writeFileSync(INSTAGRAM_FILE, out, 'utf8');
}

// ---- Fotos ----

function listFotos() {
  const result = [];
  function walk(dir, rel) {
    let entries;
    try { entries = fs.readdirSync(dir); } catch { return; }
    for (const e of entries) {
      const full    = path.join(dir, e);
      const relPath = rel ? rel + '/' + e : e;
      try {
        if (fs.statSync(full).isDirectory()) {
          walk(full, relPath);
        } else if (/\.(jpe?g|png|gif|webp)$/i.test(e)) {
          result.push(relPath);
        }
      } catch {}
    }
  }
  walk(FOTOS_DIR, '');
  return result;
}

// ---- Servidor HTTP ----

const server = http.createServer(async (req, res) => {
  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const method   = req.method.toUpperCase();

  // Solo permitir requests desde localhost (previene ataques CSRF desde sitios externos)
  const origin = req.headers.origin || '';
  const allowedOrigins = [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : `http://localhost:${PORT}`;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  corsOrigin,
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  try {

    // ---- Pagina admin ----
    if (pathname === '/' || pathname === '/admin' || pathname === '/admin.html') {
      return serveFile(res, path.join(BASE, 'admin.html'));
    }

    // ---- API: Noticias ----
    if (pathname === '/api/noticias') {
      if (method === 'GET') {
        return sendJSON(res, getNoticias());
      }
      if (method === 'POST') {
        const body = await readBody(req);
        let parsed;
        try { parsed = JSON.parse(body.toString('utf8')); } catch { return sendJSON(res, { ok: false, error: 'JSON invalido' }, 400); }
        if (!Array.isArray(parsed)) return sendJSON(res, { ok: false, error: 'Se esperaba un arreglo' }, 400);
        saveNoticias(parsed);
        return sendJSON(res, { ok: true });
      }
    }

    // ---- API: Equipo de la Semana ----
    if (pathname === '/api/equipo-semana') {
      if (method === 'GET') {
        return sendJSON(res, getEquipo());
      }
      if (method === 'POST') {
        const body = await readBody(req);
        let parsed;
        try { parsed = JSON.parse(body.toString('utf8')); } catch { return sendJSON(res, { ok: false, error: 'JSON invalido' }, 400); }
        saveEquipo(parsed);
        return sendJSON(res, { ok: true });
      }
    }

    // ---- API: Instagram Posts ----
    if (pathname === '/api/instagram') {
      if (method === 'GET') {
        return sendJSON(res, getInstagram());
      }
      if (method === 'POST') {
        const body = await readBody(req);
        let parsed;
        try { parsed = JSON.parse(body.toString('utf8')); } catch { return sendJSON(res, { ok: false, error: 'JSON invalido' }, 400); }
        if (!Array.isArray(parsed)) return sendJSON(res, { ok: false, error: 'Se esperaba un arreglo' }, 400);
        saveInstagram(parsed);
        return sendJSON(res, { ok: true });
      }
    }

    // ---- API: Listar fotos ----
    if (pathname === '/api/fotos' && method === 'GET') {
      return sendJSON(res, listFotos());
    }

    // ---- API: Subir foto ----
    if (pathname === '/api/upload' && method === 'POST') {
      const body = await readBody(req);
      let parsed;
      try { parsed = JSON.parse(body.toString('utf8')); } catch { return sendJSON(res, { ok: false, error: 'JSON invalido' }, 400); }
      const { filename, folder, data } = parsed;
      if (!filename || !data) return sendJSON(res, { ok: false, error: 'Faltan campos requeridos' }, 400);

      const safeName  = path.basename(filename).replace(/[^\w.\- ]/g, '_');
      const targetDir = folder
        ? path.join(FOTOS_DIR, folder)
        : FOTOS_DIR;

      if (!path.resolve(targetDir).startsWith(path.resolve(FOTOS_DIR))) {
        return sendJSON(res, { ok: false, error: 'Carpeta invalida' }, 400);
      }

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, safeName), Buffer.from(data, 'base64'));

      const relPath = 'fotos/' + (folder ? folder + '/' : '') + safeName;
      return sendJSON(res, { ok: true, path: relPath });
    }

    // ---- API: Eliminar foto ----
    if (pathname === '/api/delete-foto' && method === 'POST') {
      const body = await readBody(req);
      let parsed;
      try { parsed = JSON.parse(body.toString('utf8')); } catch { return sendJSON(res, { ok: false, error: 'JSON invalido' }, 400); }
      const { path: fotoPath } = parsed;

      const resolved = path.resolve(BASE, fotoPath);
      if (!resolved.startsWith(path.resolve(FOTOS_DIR))) {
        return sendJSON(res, { ok: false, error: 'Ruta invalida' }, 400);
      }
      if (fs.existsSync(resolved)) fs.unlinkSync(resolved);
      return sendJSON(res, { ok: true });
    }

    // ---- API: Ejecutar actualizar.js ----
    if (pathname === '/api/actualizar' && method === 'POST') {
      const scriptPath = path.join(BASE, 'actualizar.js');
      exec(`node "${scriptPath}"`, { cwd: BASE, timeout: 90000 }, (err, stdout, stderr) => {
        sendJSON(res, { ok: !err, output: (stdout || '') + (stderr || '') });
      });
      return;
    }

    // ---- Archivos estaticos ----
    if (pathname.startsWith('/fotos/')) {
      const filePath = path.join(BASE, decodeURIComponent(pathname));
      if (!path.resolve(filePath).startsWith(path.resolve(FOTOS_DIR))) {
        res.writeHead(403); return res.end();
      }
      return serveFile(res, filePath);
    }

    if (pathname === '/escudo.png') {
      return serveFile(res, path.join(BASE, 'escudo.png'));
    }

    if (pathname === '/noticias.js') {
      return serveFile(res, NOTICIAS_FILE);
    }

    if (pathname === '/equipo-semana.js') {
      return serveFile(res, EQUIPO_FILE);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('No encontrado');

  } catch (err) {
    console.error('Error interno:', err.message);
    sendJSON(res, { ok: false, error: 'Error interno del servidor' }, 500);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   Admin Panel — Club Atletico Maristas   ║');
  console.log('  ╠══════════════════════════════════════════╣');
  console.log(`  ║   http://localhost:${PORT}                     ║`);
  console.log('  ║   Ctrl+C para detener el servidor        ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});
