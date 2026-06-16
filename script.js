// Club Atletico Maristas — JS

// ---- NEWS RENDER ----
(function () {
  const grid = document.getElementById('newsGrid');
  if (!grid || typeof NOTICIAS === 'undefined' || !NOTICIAS.length) return;

  function likeKey(n) {
    return 'like_' + n.titulo.replace(/\s+/g, '_').slice(0, 60);
  }

  function getLikes(n) {
    try { return parseInt(localStorage.getItem(likeKey(n)) || '0', 10); } catch(e) { return 0; }
  }

  function shareRow(n) {
    const url  = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(n.titulo + ' — Club Atletico Maristas');
    const liked = localStorage.getItem(likeKey(n) + '_voted') === '1';
    const count = getLikes(n);
    return `<div class="news-actions">
      <button class="ns-like${liked ? ' liked' : ''}" data-likekey="${likeKey(n)}" title="Me gusta">
        <i class="fas fa-thumbs-up"></i>
        <span class="like-count">${count}</span>
      </button>
      <div class="news-share">
        <span class="news-share-label">Compartir:</span>
        <a class="ns-btn ns-wa"  href="https://wa.me/?text=${text}%20${url}" target="_blank" rel="noopener" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        <a class="ns-btn ns-tw"  href="https://twitter.com/intent/tweet?text=${text}&url=${url}" target="_blank" rel="noopener" title="X / Twitter"><i class="fab fa-x-twitter"></i></a>
        <button class="ns-btn ns-ig" onclick="(function(b){var t=b.closest('[data-ntitle]');var title=t?t.dataset.ntitle:'Club Atletico Maristas';if(navigator.share){navigator.share({title:title,url:window.location.href})}else{alert('Abre Instagram en tu celular para compartir.')}})(this)" title="Instagram / Compartir"><i class="fab fa-instagram"></i></button>
        <button class="ns-btn ns-copy" onclick="(function(b){navigator.clipboard&&navigator.clipboard.writeText(window.location.href).then(function(){var o=b.innerHTML;b.innerHTML='<i class=\\'fas fa-check\\'></i>';setTimeout(function(){b.innerHTML=o},1500)});})(this)" title="Copiar enlace"><i class="fas fa-link"></i></button>
      </div>
    </div>`;
  }

  function imgOrPlaceholder(n) {
    return n.imagen
      ? `<img src="${n.imagen}" alt="${n.titulo}" loading="lazy" />`
      : `<div style="width:100%;height:100%;background:var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:28px"><i class="fas fa-futbol"></i></div>`;
  }

  function bigCard(n) {
    return `<div class="news-big" data-ntitle="${n.titulo.replace(/"/g,'&quot;')}">
      <a class="news-img-wrap" href="#">${imgOrPlaceholder(n)}<span class="news-cat">${n.serie}</span></a>
      <div class="news-body">
        <time>${n.fecha}</time>
        <h3><a href="#">${n.titulo}</a></h3>
        ${n.resumen ? `<p>${n.resumen}</p>` : ''}
        <a href="#" class="news-link">Leer más <i class="fas fa-arrow-right"></i></a>
        ${shareRow(n)}
      </div>
    </div>`;
  }

  function smallCard(n) {
    return `<div class="news-small" data-ntitle="${n.titulo.replace(/"/g,'&quot;')}">
      <a class="news-img-wrap" href="#">${imgOrPlaceholder(n)}<span class="news-cat">${n.serie}</span></a>
      <div class="news-body">
        <time>${n.fecha}</time>
        <h3><a href="#">${n.titulo}</a></h3>
        ${shareRow(n)}
      </div>
    </div>`;
  }

  grid.classList.add('news-grid-all');
  grid.innerHTML = NOTICIAS.map(bigCard).join('');

  grid.addEventListener('click', function(e) {
    const btn = e.target.closest('.ns-like');
    if (!btn) return;
    const key = btn.dataset.likekey;
    const voted = localStorage.getItem(key + '_voted') === '1';
    const countEl = btn.querySelector('.like-count');
    let count = parseInt(localStorage.getItem(key) || '0', 10);
    if (voted) {
      count = Math.max(0, count - 1);
      localStorage.removeItem(key + '_voted');
      btn.classList.remove('liked');
    } else {
      count += 1;
      localStorage.setItem(key + '_voted', '1');
      btn.classList.add('liked');
    }
    localStorage.setItem(key, count);
    countEl.textContent = count;
  });
})();

// ---- MOBILE NAV ----
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');
burger?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// ---- ACTIVE NAV LINK ----
window.addEventListener('scroll', () => {
  const y = window.scrollY + 80;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`#nav a[href="#${sec.id}"]`);
    if (!link) return;
    link.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
  });
}, { passive: true });

// ---- SQUAD SERIES TABS ----
document.querySelectorAll('[data-stab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.comp-tabs');
    group.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.squad-tab').forEach(t => t.classList.remove('active-tab'));
    const tab = document.getElementById('stab-' + btn.dataset.stab);
    if (tab) tab.classList.add('active-tab');
  });
});

// ---- COMPETITION TABS ----
document.querySelectorAll('.ctab').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.comp-tabs');
    group.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.tab) {
      document.querySelectorAll('#tab-junior,#tab-senior,#tab-supersenior,#tab-dorada,#tab-diamante').forEach(t => t.classList.remove('active-tab'));
      const tab = document.getElementById('tab-' + btn.dataset.tab);
      if (tab) tab.classList.add('active-tab');
    }
    if (btn.dataset.gtab) {
      document.querySelectorAll('#gtab-junior,#gtab-senior,#gtab-supersenior,#gtab-dorada,#gtab-diamante').forEach(t => t.classList.remove('active-tab'));
      const tab = document.getElementById('gtab-' + btn.dataset.gtab);
      if (tab) tab.classList.add('active-tab');
    }
  });
});

// ---- PLAYER FILTER ----
document.querySelectorAll('.fbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.pcard').forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.p !== f));
  });
});

// ---- LIGHTBOX ----
const lb    = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCount = document.getElementById('lbCount');
let allItems = [], idx = 0;

function openLB(i) {
  allItems = [...document.querySelectorAll('#galeria-grid .gitem[data-src]')];
  idx = i;
  lbImg.src = allItems[i].dataset.src;
  lbCount.textContent = `${i+1} / ${allItems.length}`;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLB() { lb.classList.remove('active'); document.body.style.overflow = ''; }

document.querySelectorAll('#galeria-grid .gitem[data-src]').forEach((el, i) => {
  el.addEventListener('click', () => openLB(i));
});

document.getElementById('lbClose').addEventListener('click', closeLB);
document.getElementById('lbPrev').addEventListener('click', () => openLB((idx - 1 + allItems.length) % allItems.length));
document.getElementById('lbNext').addEventListener('click', () => openLB((idx + 1) % allItems.length));
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  document.getElementById('lbPrev').click();
  if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
  if (e.key === 'Escape')     closeLB();
});

// ---- CONTACT FORM ----
document.getElementById('contactForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;
  try {
    const r = await fetch(e.target.action, {
      method: 'POST',
      body: new FormData(e.target),
      headers: { 'Accept': 'application/json' }
    });
    if (r.ok) {
      btn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
      btn.style.background = '#16a34a';
      e.target.reset();
      setTimeout(() => { btn.innerHTML = 'Enviar <i class="fas fa-paper-plane"></i>'; btn.style.background = ''; btn.disabled = false; }, 3000);
    } else {
      btn.innerHTML = 'Error al enviar';
      btn.style.background = '#dc2626';
      setTimeout(() => { btn.innerHTML = 'Enviar <i class="fas fa-paper-plane"></i>'; btn.style.background = ''; btn.disabled = false; }, 3000);
    }
  } catch {
    btn.innerHTML = 'Error de conexion';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.innerHTML = 'Enviar <i class="fas fa-paper-plane"></i>'; btn.style.background = ''; btn.disabled = false; }, 3000);
  }
});

// ---- HERO SLIDER ----
(function () {
  // Inyecta las fotos del hero desde hero-fotos.js. Los 3 videos del drone ya
  // estan en el HTML y van siempre primero; aca elegimos un set de fotos que
  // ROTA SOLO cada 2 semanas (mismo set durante 14 dias, distinto al siguiente
  // bloque). Determinista: depende solo de la fecha, no del azar de cada carga.
  (function inyectarFotos() {
    const cont = document.getElementById('heroSlider');
    const fotos = window.HERO_FOTOS;
    if (!cont || !Array.isArray(fotos) || !fotos.length) return;

    const CUANTAS = 10; // cuantas fotos mostrar por bloque de 2 semanas

    // Bloque quincenal: nº de semanas desde epoch dividido en 2.
    const semanas = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    let seed = (Math.floor(semanas / 2) + 1) >>> 0;

    // PRNG determinista (LCG) sembrado con el bloque quincenal.
    function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }

    // Barajado Fisher-Yates sobre una copia, con el RNG sembrado.
    const pool = fotos.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }

    pool.slice(0, CUANTAS).forEach((src) => {
      const d = document.createElement('div');
      d.className = 'hs-slide';
      d.setAttribute('data-bg', src);
      cont.appendChild(d);
    });
  })();

  const slides = Array.from(document.querySelectorAll('.hs-slide'));
  const dotsWrap = document.getElementById('hsDots');
  if (!slides.length || !dotsWrap) return;

  let current = 0, timer;

  // Crear dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'hs-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function loadSlide(slide) {
    if (slide.dataset.bg && !slide.style.backgroundImage)
      slide.style.backgroundImage = "url('" + slide.dataset.bg + "')";
  }

  // Reproduce el video de la slide activa y pausa el resto (slides de drone).
  function playActive() {
    slides.forEach((s) => {
      const v = s.querySelector('video');
      if (!v) return;
      if (s.classList.contains('active')) {
        try { v.currentTime = 0; const p = v.play(); if (p) p.catch(() => {}); } catch (e) {}
      } else {
        v.pause();
      }
    });
  }

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    loadSlide(slides[current]);
    loadSlide(slides[(current + 1) % slides.length]); // pre-carga siguiente
    slides[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
    playActive();
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  // Pre-carga slide 1 antes de que aparezca y reproduce el video inicial
  loadSlide(slides[1]);
  playActive();

  document.querySelector('.hs-prev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.hs-next')?.addEventListener('click', () => goTo(current + 1));

  // Pausa al pasar el mouse
  const hero = document.querySelector('.hero');
  hero?.addEventListener('mouseenter', () => clearInterval(timer));
  hero?.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 5000); });

  timer = setInterval(() => goTo(current + 1), 5000);
})();

// ---- TEAM SHIELDS from AIRA ----
const ESCUDOS = {
  // JUNIOR
  'san nicolas fc junior':'10281','dinastia fc junior':'30310',
  'ac lo campino junior':'30322','america junior':'200',
  'jaguares junior':'10275','ciclon junior':'6',
  'doveramigos junior':'10238','estudiantes junior':'28',
  'juventus junior':'10','union marista junior':'18',
  'climazul junior':'214','alianza junior':'2',
  'manchester unido junior':'218',
  // SENIOR
  'ciclon senior':'41','ac lo campino senior':'30323',
  'san nicolas fc senior':'10283','banco bice senior':'30297',
  'dinastia fc senior':'30327','alianza senior':'37',
  'charkaplax fc senior':'20293','cd improvisados senior':'10278',
  'doveramigos senior':'30311','manchester unido senior':'227',
  'climazul senior':'10289','union marista senior':'52',
  // SUPER SENIOR
  'doveramigos super senior':'198','mapuches super senior':'233',
  'defensor super senior':'30320','ciclon super senior':'74',
  'banco bice super senior':'30298','leyenda 216 super senior':'30325',
  'manchester unido super senior':'10258','union marista super senior':'85',
  'fluminense super senior':'30329','charkaplax fc super senior':'30307',
  // DORADA
  'mapuches dorados':'114','doveramigos dorados':'232',
  'union marista dorados':'118','america dorados':'211',
  'climazul dorados':'30333','alianza dorados':'103',
  'estudiantes dorados':'109','juventus dorados':'111',
  'ciclon dorados':'107','banco bice dorados':'30299',
  'jaguares dorados':'110',
  // DIAMANTE
  'mapuches diamantes':'235','union marista diamantes':'151',
  'doveramigos diamantes':'206','alianza diamantes':'10266',
  'jaguares diamantes':'143','stadio italiano diamantes':'149',
  'universitario diamantes':'150','estudiantes diamantes':'142',
  'ciclon diamantes':'140','juventus diamantes':'144',
};
const BASE_ESCUDO = 'https://futbol.aira.cl/fotos/2/escudos/';

function setInitials(el, name) {
  const words = name.split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  const hue = ((hash % 360) + 360) % 360;
  el.style.cssText = 'width:22px;height:22px;background:hsl(' + hue + ',48%,40%);color:#fff;' +
    'font-size:8px;font-weight:800;display:inline-flex;align-items:center;' +
    'justify-content:center;border-radius:50%;flex-shrink:0;';
  el.textContent = initials;
}

document.querySelectorAll('td.t-equipo').forEach(td => {
  const span = td.querySelector('span:empty');
  if (!span) return;
  const name = td.textContent.trim();
  const id = ESCUDOS[name.toLowerCase()];
  if (id) {
    const img = document.createElement('img');
    img.src = BASE_ESCUDO + id + '.png';
    img.alt = name;
    img.style.cssText = 'width:22px;height:22px;object-fit:contain;flex-shrink:0;';
    img.onerror = function () {
      const fb = document.createElement('span');
      setInitials(fb, name);
      img.replaceWith(fb);
    };
    span.replaceWith(img);
  } else {
    setInitials(span, name);
  }
});

// ---- INSTAGRAM POSTS ----
(function () {
  const grid = document.getElementById('instagramGrid');
  if (!grid || typeof INSTAGRAM_POSTS === 'undefined' || !INSTAGRAM_POSTS.length) return;

  function postCard(post) {
    return `<div class="ig-post">
      <img src="${post.imagen}" alt="${post.caption}" class="ig-post-img" loading="lazy" />
      <div class="ig-post-body">
        <p class="ig-post-caption">${post.caption}</p>
        <div class="ig-post-footer">
          <span class="ig-post-date">${post.fecha}</span>
          ${post.enlace ? `<a href="${post.enlace}" target="_blank" rel="noopener" class="ig-post-link"><i class="fab fa-instagram"></i> Ver</a>` : ''}
        </div>
      </div>
    </div>`;
  }

  grid.innerHTML = INSTAGRAM_POSTS.map(postCard).join('');
})();

// ---- SCROLL REVEAL ----
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; obs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.news-big,.news-small,.result,.pcard,.gitem,.ig-post').forEach(el => {
  el.style.cssText += 'opacity:0;transform:translateY(18px);transition:opacity .4s ease,transform .4s ease';
  obs.observe(el);
});

// ---- HASH SCROLL FIX (celular / enlaces externos) ----
// Las noticias, el equipo de la semana, los posts de Instagram y otras
// secciones se inyectan por JS, y las imagenes + el widget de Behold cargan
// despues. Esto desplaza la posicion del ancla al abrir un enlace #seccion
// directamente (sobre todo en el navegador interno de Instagram, donde el
// evento 'load' puede tardar mucho o no llegar). Por eso reintentamos por
// nuestra cuenta y desactivamos la restauracion de scroll del navegador.
(function () {
  // Aceptamos el destino por #seccion o por ?ir=seccion / ?goto=seccion.
  // El parametro de URL es mas robusto en el navegador interno de Instagram,
  // que a veces cachea la pagina o le quita el # al enlace.
  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { params = null; }
  var raw = (location.hash && location.hash.slice(1)) ||
            (params && (params.get('ir') || params.get('goto'))) || '';
  if (!raw) return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  var id = decodeURIComponent(raw);
  var stop = false;

  // Si el usuario empieza a navegar DE VERDAD, dejamos de forzar el scroll.
  // Importante: usamos 'touchmove' (deslizar), NO 'touchstart' (tocar), porque
  // al abrir el link desde Instagram el dedo ya esta tocando la pantalla y un
  // 'touchstart' cancelaria el scroll antes de que ocurra.
  ['wheel', 'touchmove', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () { stop = true; }, { passive: true, once: true });
  });

  function go() {
    if (stop) return;
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  // Reintentos mientras el contenido y las imagenes terminan de asentarse.
  var tries = 0;
  var timer = setInterval(function () {
    go();
    if (stop || ++tries >= 14) clearInterval(timer); // ~ hasta 7s
  }, 500);

  document.addEventListener('DOMContentLoaded', go);
  window.addEventListener('load', go);
  // Safari/iPhone suele restaurar la pagina desde su cache (bfcache) sin
  // disparar load; 'pageshow' si se dispara, asi re-aseguramos el scroll.
  window.addEventListener('pageshow', function () { stop = false; go(); setTimeout(go, 300); });
})();

// ---- CLIC EN ENLACES INTERNOS (#seccion) ----
// El scroll suave nativo se pierde cuando las imagenes de arriba cargan y
// empujan el contenido (el navegador aborta la animacion y te deja arriba).
// Hacemos el scroll nosotros mismos y lo re-ajustamos un par de veces por si
// el contenido se mueve. Cubre el menu de navegacion (escritorio y celular).
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var href = a.getAttribute('href');
  if (!href || href === '#') return;            // ignora enlaces vacios (#)
  var el = document.getElementById(decodeURIComponent(href.slice(1)));
  if (!el) return;                              // ignora si no existe el destino

  e.preventDefault();
  if (history.pushState) history.pushState(null, '', href);
  else location.hash = href;

  var n = 0;
  (function reposition() {
    el.scrollIntoView({ block: 'start', behavior: 'auto' });
    if (++n < 5) setTimeout(reposition, 130);   // re-ajusta ~650ms
  })();
});

// ---- ESCUDOS DE RIVALES (fuente unica, compartida) ----
// Se busca la 1a palabra clave que aparezca en el nombre del equipo; si no hay
// coincidencia se usa el monograma. Lo usan la Proxima Fecha y Ultimos Resultados.
// Para sumar un escudo nuevo: deja el PNG en escudos/ y agrega su clave aqui.
window.ESCUDOS_RIVAL = [
  ['manchester', 'manchester.png'],
  ['doveramigos', 'doveramigos.png'],
  ['ciclon', 'ciclon.png'],
  ['charkaplax', 'CHARKAPLAX.png'],
  ['bice', 'bice.png'],
  ['defensor', 'defensor.png'],
  ['mapuche', 'mapuches.png'],
  ['union marista', 'union marista.png'],
  ['leyenda', 'leyenda.png'],
  ['campino', 'AC LO CAMPINO.png'],
  ['alianza', 'ALIANZA.png'],
  ['america', 'AMERICA.png'],
  ['improvisados', 'CD IMPROVISADOS.png'],
  ['clima', 'CLIMAAZUL.png'],
  ['estudiantes', 'ESTUDIANTES.png'],
  ['jaguares', 'JAGUARES.png'],
  ['juventus', 'JUVENTUS.png'],
  ['nicolas', 'SAN NICOLAS.png'],
  ['stadio', 'STADIO ITALIAN.png'],
  ['italiano', 'STADIO ITALIAN.png'],
  ['universitario', 'UNIVERSITARIO DIAMANTES.png']
];
window.ES_AM_RE = /atl[eé]tico\s+marista/i;
window.SERIE_TOKENS_RIVAL = ['junior','senior','super','dorada','dorado','dorados',
  'diamante','diamantes','platino','platinos'];
window.nombreCortoRival = function (name) {
  var w = String(name).trim().split(/\s+/);
  while (w.length > 1 && window.SERIE_TOKENS_RIVAL.indexOf(w[w.length - 1].toLowerCase()) >= 0) w.pop();
  return w.join(' ');
};
window.escudoRivalSrc = function (name) {
  var n = String(name).toLowerCase();
  for (var i = 0; i < window.ESCUDOS_RIVAL.length; i++) {
    if (n.indexOf(window.ESCUDOS_RIVAL[i][0]) >= 0)
      return 'escudos/' + encodeURIComponent(window.ESCUDOS_RIVAL[i][1]);
  }
  return null;
};

// ---- TARJETAS "PROXIMO PARTIDO" POR SERIE ----
// Lee la tabla "Proxima Fecha" (#proxima-tbody, que mantiene actualizar.js) y
// arma una tarjeta por serie dentro de #fx-grid (3 por fila), con el cruce y una
// cuenta regresiva con cada unidad en su propio cuadrito (DÍAS/HRS/MIN/SEG).
// Si JS no corre, la tabla de abajo sigue mostrando todos los datos.
(function () {
  var tbody = document.getElementById('proxima-tbody');
  var grid = document.getElementById('fx-grid');
  if (!tbody || !grid) return;

  // "DD/MM/YYYY HH:MM" -> Date (hora local). Devuelve null si no parsea.
  function parseFecha(txt) {
    var m = (txt || '').trim().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5]);
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function box(lbl) { return '<span class="fx-u"><b>00</b><small>' + lbl + '</small></span>'; }
  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Sufijos de serie: se quitan del nombre del equipo (ya van en el badge).
  var SERIE_TOKENS = ['junior','senior','super','dorada','dorado','dorados',
                      'diamante','diamantes','platino','platinos'];
  function nombreCorto(name) {
    var w = name.trim().split(/\s+/);
    while (w.length > 1 && SERIE_TOKENS.indexOf(w[w.length - 1].toLowerCase()) >= 0) w.pop();
    return w.join(' ');
  }
  function iniciales(name) {
    return nombreCorto(name).split(/\s+/).slice(0, 2)
      .map(function (x) { return x.charAt(0); }).join('').toUpperCase();
  }
  var esAM = window.ES_AM_RE;
  // Escudos de rivales: se usa la fuente unica compartida (window.escudoRivalSrc).
  var escudoDe = window.escudoRivalSrc;
  function crest(name) {
    if (esAM.test(name)) {
      return '<span class="fx-crest"><img src="escudo.png" alt="Club Atlético Marista" /></span>';
    }
    var e = escudoDe(name);
    if (e) {
      return '<span class="fx-crest"><img src="' + e + '" alt="' + nombreCorto(name) + '" /></span>';
    }
    return '<span class="fx-crest initials">' + iniciales(name) + '</span>';
  }
  function team(name) {
    return '<div class="fx-team">' + crest(name) +
      '<span class="fx-name' + (esAM.test(name) ? ' am' : '') + '">' + nombreCorto(name) + '</span></div>';
  }

  // Escudo chico para la tabla "Proxima Fecha" (columnas Local y Visita).
  function miniCrest(name) {
    var src = esAM.test(name) ? 'escudo.png' : escudoDe(name);
    if (src) return '<img class="pf-logo" src="' + src + '" alt="" />';
    return '<span class="pf-logo pf-logo-mono">' + iniciales(name) + '</span>';
  }
  Array.prototype.forEach.call(tbody.rows, function (tr) {
    [3, 4].forEach(function (idx) {
      var cell = tr.cells[idx];
      if (!cell || cell.querySelector('.pf-logo')) return;
      var name = cell.textContent.trim();
      if (!name) return;
      cell.insertAdjacentHTML('afterbegin', miniCrest(name));
      cell.classList.add('pf-team-cell');
    });
  });

  var relojes = [];
  grid.innerHTML = '';

  Array.prototype.forEach.call(tbody.rows, function (tr) {
    var c = tr.cells;
    if (c.length < 6) return;
    var when = parseFecha(c[2].textContent);
    if (!when) return;
    var serie = c[0].textContent.trim();
    var cancha = c[5].textContent.trim();
    var fecha = pad(when.getDate()) + '/' + pad(when.getMonth() + 1);
    var hora = pad(when.getHours()) + ':' + pad(when.getMinutes());

    var card = document.createElement('div');
    card.className = 'fx-card';
    card.innerHTML =
      '<div class="fx-top">' +
        '<span class="fx-serie">' + serie + '</span>' +
        '<span class="fx-when"><i class="fas fa-location-dot"></i> ' + cancha + '</span>' +
      '</div>' +
      '<div class="fx-match">' +
        team(c[3].textContent.trim()) +
        '<div class="fx-vsbox">' +
          '<span class="fx-vs">VS</span>' +
          '<span class="fx-day">' + DIAS[when.getDay()] + '</span>' +
          '<span class="fx-datetime">' + fecha + ' · ' + hora + '</span>' +
        '</div>' +
        team(c[4].textContent.trim()) +
      '</div>' +
      '<div class="fx-count">' +
        '<span class="fx-count-label">Comienza en</span>' +
        '<div class="fx-clock">' +
          box('DÍAS') + '<span class="fx-sep">:</span>' +
          box('HRS') + '<span class="fx-sep">:</span>' +
          box('MIN') + '<span class="fx-sep">:</span>' +
          box('SEG') +
        '</div>' +
      '</div>';
    grid.appendChild(card);

    var b = card.querySelectorAll('.fx-u b');
    relojes.push({
      target: when.getTime(), fin: when.getTime() + 2 * 3600e3,
      card: card, count: card.querySelector('.fx-count'),
      d: b[0], h: b[1], m: b[2], s: b[3], state: ''
    });
  });
  if (!relojes.length) return;
  grid.hidden = false;

  function tick() {
    var now = Date.now();
    relojes.forEach(function (r) {
      var diff = r.target - now;
      if (diff <= 0) {
        // Ya empezó: "En juego" mientras dura (~2h), luego "Finalizado".
        var want = now < r.fin ? 'live' : 'done';
        if (r.state !== want) {
          r.card.classList.toggle('is-live', want === 'live');
          r.card.classList.toggle('is-done', want === 'done');
          r.count.innerHTML = '<span class="fx-badge ' + want + '">' +
            (want === 'live' ? 'En juego' : 'Finalizado') + '</span>';
          r.state = want;
        }
        return;
      }
      var sec = Math.floor(diff / 1000);
      r.d.textContent = pad(Math.floor(sec / 86400));
      r.h.textContent = pad(Math.floor(sec / 3600) % 24);
      r.m.textContent = pad(Math.floor(sec / 60) % 60);
      r.s.textContent = pad(sec % 60);
    });
  }
  tick();
  setInterval(tick, 1000);
})();

// ---- ULTIMOS RESULTADOS ----
// Renderiza window.RESULTADOS (resultados.js) en #res-grid: una tarjeta por
// partido con escudo del local y la visita, el marcador y un chip W/E/D segun
// le fue a Atletico Maristas. Si no hay datos, muestra un aviso amable.
(function () {
  var grid = document.getElementById('res-grid');
  if (!grid) return;
  var lista = Array.isArray(window.RESULTADOS) ? window.RESULTADOS : [];

  if (!lista.length) {
    grid.innerHTML = '<p class="res-empty">Aún no hay resultados cargados.</p>';
    return;
  }

  var esAM = window.ES_AM_RE;
  var corto = window.nombreCortoRival;
  var escudoSrc = window.escudoRivalSrc;

  function iniciales(name) {
    return corto(name).split(/\s+/).slice(0, 2)
      .map(function (x) { return x.charAt(0); }).join('').toUpperCase();
  }
  function crest(name) {
    var src = esAM.test(name) ? 'escudo.png' : escudoSrc(name);
    if (src) return '<img class="res-logo" src="' + src + '" alt="" />';
    return '<span class="res-logo res-logo-mono">' + iniciales(name) + '</span>';
  }

  grid.innerHTML = lista.map(function (r) {
    var gl = parseInt(r.gl, 10), gv = parseInt(r.gv, 10);
    var amLocal = esAM.test(r.local), amVisita = esAM.test(r.visita);
    // Resultado desde la optica de Maristas (si juega).
    var chip = '', cls = '';
    if (amLocal || amVisita) {
      var golesAM = amLocal ? gl : gv, golesRiv = amLocal ? gv : gl;
      if (golesAM > golesRiv) { chip = 'Victoria'; cls = 'win'; }
      else if (golesAM < golesRiv) { chip = 'Derrota'; cls = 'loss'; }
      else { chip = 'Empate'; cls = 'draw'; }
    }
    // Goleadores de Maristas en el partido (cada uno con su cantidad).
    var goleadores = '';
    if (Array.isArray(r.golesAM) && r.golesAM.length) {
      var lista = r.golesAM.map(function (g) {
        return g.n + (g.g > 1 ? ' (' + g.g + ')' : '');
      }).join(', ');
      goleadores = '<div class="res-gol"><i class="fas fa-futbol"></i> ' + lista + '</div>';
    }

    return '<article class="res-card ' + cls + '">' +
      '<div class="res-top">' +
        '<span class="res-serie">' + (r.serie || '') + '</span>' +
        (r.fecha ? '<span class="res-fecha">' + r.fecha + '</span>' : '') +
      '</div>' +
      '<div class="res-cruce">' +
        '<div class="res-team' + (amLocal ? ' am' : '') + '">' + crest(r.local) +
          '<span class="res-name">' + corto(r.local) + '</span></div>' +
        '<div class="res-score"><b>' + (isNaN(gl) ? '-' : gl) + '</b>' +
          '<span>-</span><b>' + (isNaN(gv) ? '-' : gv) + '</b></div>' +
        '<div class="res-team' + (amVisita ? ' am' : '') + '">' + crest(r.visita) +
          '<span class="res-name">' + corto(r.visita) + '</span></div>' +
      '</div>' +
      goleadores +
      (chip ? '<div class="res-chip ' + cls + '">' + chip + '</div>' : '') +
    '</article>';
  }).join('');
})();

// ---- SALUDO DE CUMPLEAÑOS ----
// Lee window.CUMPLEANOS (cumpleanos.js) y muestra el banner solo si algun
// jugador del club cumple años HOY. Une los nombres ("A, B y C") y, si la
// fecha de nacimiento lo permite, agrega la edad que cumple.
(function () {
  var banner = document.getElementById('cumpleBanner');
  var cont   = document.getElementById('cumpleLista');
  if (!banner || !cont) return;
  var lista = Array.isArray(window.CUMPLEANOS) ? window.CUMPLEANOS : [];
  if (!lista.length) return;

  var hoy = new Date();
  var d = hoy.getDate(), m = hoy.getMonth() + 1, anio = hoy.getFullYear();
  var hoyCumplen = lista.filter(function (p) { return p.d === d && p.m === m; });
  if (!hoyCumplen.length) return;

  var nombres = hoyCumplen.map(function (p) {
    var edad = p.y ? (anio - p.y) : null;
    var serie = p.s ? ' · ' + p.s : '';
    return '<strong>' + p.n + '</strong>' +
      (edad ? ' <span class="cumple-edad">(' + edad + ')</span>' : '') +
      '<span class="cumple-serie">' + serie + '</span>';
  });

  var texto;
  if (nombres.length === 1) texto = nombres[0];
  else texto = nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1];

  cont.innerHTML = texto;
  banner.hidden = false;

  // --- Tarjeta de saludo en la seccion Plantel (con compartir por WhatsApp) ---
  var card = document.getElementById('cumpleCardWrap');
  var ccNom = document.getElementById('ccNombres');
  var ccShare = document.getElementById('ccShare');
  if (card && ccNom) {
    ccNom.innerHTML = hoyCumplen.map(function (p) {
      var edad = p.y ? (anio - p.y) : null;
      return '<span class="cc-jug"><span class="cc-jug-nombre">' + p.n + '</span>' +
        (edad ? '<span class="cc-jug-edad">' + edad + ' años</span>' : '') +
        (p.s ? '<span class="cc-jug-serie">' + p.s + '</span>' : '') + '</span>';
    }).join('');
    card.hidden = false;

    // Texto plano para WhatsApp (y como respaldo si no se puede compartir imagen).
    var nombresTxt = hoyCumplen.map(function (p) {
      return p.n + (p.y ? ' (' + (anio - p.y) + ')' : '');
    });
    var listaTxt = nombresTxt.length === 1 ? nombresTxt[0]
      : nombresTxt.slice(0, -1).join(', ') + ' y ' + nombresTxt[nombresTxt.length - 1];
    var sitio = location.origin + location.pathname;
    var msgWA = '🎂 ¡Feliz cumpleaños ' + listaTxt + '! 🎉\n' +
      'Toda la familia del Club Atlético Maristas te desea un gran día.\n' + sitio;

    // Dibuja una tarjeta 1080x1080 en canvas para compartir como imagen.
    function dibujarTarjeta(cb) {
      var W = 1080, cv = document.createElement('canvas');
      cv.width = W; cv.height = W;
      var ctx = cv.getContext('2d');
      var g = ctx.createLinearGradient(0, 0, W, W);
      g.addColorStop(0, '#c8102e'); g.addColorStop(1, '#7a0a1c');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, W);
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 16;
      ctx.strokeRect(34, 34, W - 68, W - 68);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFD700'; ctx.font = '900 62px Arial';
      ctx.fillText('¡FELIZ CUMPLEAÑOS!', W / 2, 430);
      ctx.font = '40px Arial'; ctx.fillText('🎂  🎉  🎈', W / 2, 510);
      // Nombres + edad, centrados verticalmente bajo el titulo.
      var startY = 620, n = hoyCumplen.length;
      var nameSize = n > 3 ? 46 : n > 1 ? 58 : 70;
      var step = nameSize + 30;
      hoyCumplen.forEach(function (p, i) {
        var edad = p.y ? (anio - p.y) : null;
        ctx.fillStyle = '#fff'; ctx.font = '700 ' + nameSize + 'px Arial';
        ctx.fillText(p.n + (edad ? '  (' + edad + ')' : ''), W / 2, startY + i * step);
      });
      // Pie
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.font = '700 34px Arial';
      ctx.fillText('CLUB ATLÉTICO MARISTAS', W / 2, W - 90);
      // Escudo arriba (puede fallar la carga: igual resolvemos)
      var img = new Image(); var done = false;
      function finish() { if (done) return; done = true; cv.toBlob(function (b) { cb(b); }, 'image/png'); }
      img.onload = function () { ctx.drawImage(img, W / 2 - 90, 110, 180, 180); finish(); };
      img.onerror = finish;
      img.src = 'escudo.png';
      setTimeout(finish, 1500); // respaldo por si la imagen no dispara eventos
    }

    if (ccShare) ccShare.addEventListener('click', function () {
      ccShare.disabled = true;
      dibujarTarjeta(function (blob) {
        ccShare.disabled = false;
        var file = blob && window.File
          ? new File([blob], 'cumpleanos-maristas.png', { type: 'image/png' }) : null;
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text: msgWA, title: 'Feliz cumpleaños — Maristas' })
            .catch(function () {});
        } else {
          // Sin compartir de imagen: descarga la tarjeta y abre WhatsApp con el texto.
          if (blob) {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'cumpleanos-maristas.png';
            document.body.appendChild(a); a.click(); a.remove();
          }
          window.open('https://wa.me/?text=' + encodeURIComponent(msgWA), '_blank', 'noopener');
        }
      });
    });
  }
})();

// El banner del Mundial es permanente (sin botón de cerrar): no requiere JS.

// ---- COMPARTIR SECCIONES (WhatsApp / Instagram) ----
// Cada .share-row[data-target][data-title] genera botones para que quien visita
// el sitio comparta esa seccion. WhatsApp usa wa.me; Instagram no permite
// publicar por URL, asi que usa el menu nativo (navigator.share) y, si no
// existe, copia el enlace para pegarlo en una historia.
(function () {
  var rows = document.querySelectorAll('.share-row');
  if (!rows.length) return;

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tmr);
    t._tmr = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  Array.prototype.forEach.call(rows, function (row) {
    var target = row.getAttribute('data-target');
    var title = row.getAttribute('data-title') || 'Club Atlético Maristas';
    var url = location.origin + location.pathname + '#' + target;
    var texto = '⚽ ' + title + ' — Club Atlético Maristas\n' + url;

    var label = document.createElement('span');
    label.className = 'share-label';
    label.innerHTML = '<i class="fas fa-share-alt"></i> Compartir';

    var wa = document.createElement('a');
    wa.className = 'share-btn wa';
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(texto);
    wa.target = '_blank'; wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Compartir por WhatsApp');
    wa.innerHTML = '<i class="fab fa-whatsapp"></i>';

    var ig = document.createElement('button');
    ig.type = 'button';
    ig.className = 'share-btn ig';
    ig.setAttribute('aria-label', 'Compartir por Instagram');
    ig.innerHTML = '<i class="fab fa-instagram"></i>';
    ig.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: title + ' — Club Atlético Maristas', text: texto, url: url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          toast('Enlace copiado — pégalo en tu historia de Instagram');
          window.open('https://www.instagram.com/clubatleticomaristas/', '_blank', 'noopener');
        }).catch(function () { toast('Copia el enlace: ' + url); });
      } else {
        toast('Copia el enlace: ' + url);
      }
    });

    row.appendChild(label);
    row.appendChild(wa);
    row.appendChild(ig);
  });
})();

// ---- CONTADOR DE VISITAS (Netlify Function + Blobs) ----
// Pide el total una vez por carga. Si la funcion no esta disponible, el
// contador queda oculto (no muestra nada roto).
(function () {
  var box = document.getElementById('visitas');
  var num = document.getElementById('visitas-num');
  if (!box || !num) return;
  fetch('/.netlify/functions/visitas')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
    .then(function (d) {
      if (typeof d.visitas !== 'number') return Promise.reject(d);
      num.textContent = d.visitas.toLocaleString('es-CL');
      box.hidden = false;
    })
    .catch(function () { /* silencioso */ });
})();
