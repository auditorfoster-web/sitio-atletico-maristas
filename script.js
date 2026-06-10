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

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    loadSlide(slides[current]);
    loadSlide(slides[(current + 1) % slides.length]); // pre-carga siguiente
    slides[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  // Pre-carga slide 1 antes de que aparezca
  loadSlide(slides[1]);

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

// ---- CONTADOR POR FILA EN PROXIMA FECHA ----
// Lee la tabla "Proxima Fecha" (#proxima-tbody, que mantiene actualizar.js) y
// agrega a cada fila una columna "Comienza en" con su propia cuenta regresiva
// (D/H/M/S) hasta el partido de esa serie. Si JS no corre, la tabla queda igual.
(function () {
  var tbody = document.getElementById('proxima-tbody');
  if (!tbody) return;
  var tabla = tbody.closest('table');
  if (!tabla) return;

  // "DD/MM/YYYY HH:MM" -> Date (hora local). Devuelve null si no parsea.
  function parseFecha(txt) {
    var m = (txt || '').trim().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5]);
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // Encabezado de la columna nueva (una sola vez).
  var headRow = tabla.tHead && tabla.tHead.rows[0];
  if (headRow && !headRow.querySelector('.pf-cd-h')) {
    var th = document.createElement('th');
    th.className = 'pf-cd-h';
    th.textContent = 'Comienza en';
    headRow.appendChild(th);
  }

  // Una celda-contador por fila. La columna "Programación" es la 3a (índice 2).
  var relojes = [];
  Array.prototype.forEach.call(tbody.rows, function (tr) {
    if (tr.cells.length < 3) return;
    var when = parseFecha(tr.cells[2].textContent);
    var td = document.createElement('td');
    td.className = 'pf-cd';
    tr.appendChild(td);
    if (!when) { td.innerHTML = '<span class="pf-badge done">—</span>'; return; }
    td.innerHTML = '<span class="cd">' +
      '<b>00</b><small>d</small><b>00</b><small>h</small>' +
      '<b>00</b><small>m</small><b>00</b><small>s</small></span>';
    var b = td.querySelectorAll('.cd b');
    relojes.push({
      target: when.getTime(), fin: when.getTime() + 2 * 3600e3, td: td,
      d: b[0], h: b[1], m: b[2], s: b[3], state: ''
    });
  });
  if (!relojes.length) return;

  function tick() {
    var now = Date.now();
    relojes.forEach(function (r) {
      var diff = r.target - now;
      if (diff <= 0) {
        // Ya empezó: badge "En juego" mientras dura (~2h), luego "Finalizado".
        var want = now < r.fin ? 'live' : 'done';
        if (r.state !== want) {
          r.td.innerHTML = '<span class="pf-badge ' + want + '">' +
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
