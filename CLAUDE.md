# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Serve the admin panel (http://localhost:3001)
npm run admin
# or
node admin-server.js

# Pull live standings and fixtures from futbol.aira.cl and rewrite index.html
npm run actualizar
# or
node actualizar.js

# Auto-schedule updates (miércoles 14:00 - jueves 12:00)
node scheduler.js

# Compress all images in fotos/ in-place (requires sharp)
node comprimir-fotos.js
```

No build step, linter, or test suite — this is a static site with two Node.js utilities.

### `scheduler.js`
Automatic update scheduler. Runs `actualizar.js` continuously every 60 minutes during the execution window:
- **Start:** Wednesday 14:00 (2 PM)
- **End:** Thursday 12:00 (noon)

Run with `node scheduler.js` and keep it running in the background (systemd service, PM2, or similar). Logs each execution and status every 6 hours. Gracefully handles SIGINT/SIGTERM for clean shutdown.

## Architecture

The site is a **single-page static website** (`index.html` + `styles.css` + `script.js`) with no framework or bundler. Two independent Node scripts handle content updates:

### Data flow

```
futbol.aira.cl  ──►  actualizar.js  ──►  index.html    (standings/fixtures injected inline)
futbol.aira.cl  ──►  actualizar.js  ──►  resultados.js  (last result per serie, JS source)
admin panel UI  ──►  admin-server.js ──►  noticias.js   (news array rewritten as JS source)
noticias.js     ──►  index.html      (loaded via <script> tag, read at runtime by script.js)
resultados.js   ──►  index.html      (loaded via <script>; rendered into #res-grid)
```

### `actualizar.js`
Scrapes `futbol.aira.cl/lig/side.aspx`, discovers the 5 series URLs (Junior, Senior, Super Senior, Dorada, Diamante), fetches standings and fixtures for each, then surgically rewrites `index.html` in-place using HTML marker comments:

It also fetches **past results** per serie. AIRA's results page (`lstResultadoEquipoPublico.aspx`, linked from each team in the standings) only returns data when the request carries the `ASP.NET_SessionId` cookie set on the first request — so `fetchPage` maintains a cookie jar. The most recent played match of each serie is written to **`resultados.js`** (`window.RESULTADOS`), which `script.js` renders into the "Últimos Resultados" section (`#res-grid`).

```html
<!-- TBODY:junior --> ... <!-- /TBODY:junior -->
```

The `<tbody id="proxima-tbody">` block and the `Actualizado: DD/MM/YYYY` text are also replaced by regex. **Adding a new serie requires adding it to `SERIE_MAP` and adding the corresponding markers in `index.html`.**

### `admin-server.js`
Minimal HTTP server (no framework) at `localhost:3001` serving `admin.html`. REST-ish API:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/noticias` | GET / POST | Read or overwrite `noticias.js` |
| `/api/fotos` | GET | List all images under `fotos/` |
| `/api/upload` | POST | Save base64-encoded image to `fotos/<folder>/` |
| `/api/delete-foto` | POST | Delete an image (path-traversal guarded) |
| `/api/actualizar` | POST | Spawn `actualizar.js` as a child process |

`noticias.js` is written as raw JS source (not JSON) so it can be loaded via `<script>` in the browser. `admin-server.js` parses it by extracting the array literal and evaluating it with `new Function`.

### `noticias.js`
Declares `const NOTICIAS = [...]` — a plain JS array consumed by `script.js` at runtime. The first entry is always the featured (large) news item; the rest appear as secondary cards. Edit directly or through the admin panel.

### `fotos/` structure
Organised by serie: `fotos/junior/`, `fotos/dorada/`, `fotos/super senior/`, etc. Paths are referenced directly in `index.html` hero slides, player cards, and `noticias.js` image fields.

### `script.js`
Handles all client-side interactivity: hero slider (lazy-loads `data-bg` images on demand), nav highlight on scroll, competition/squad tab switching, player filter, and lightbox gallery.
