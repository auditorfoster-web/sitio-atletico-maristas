// fixture-data.js — FUENTE ÚNICA del fixture del Torneo Apertura 2026.
// La consumen fixture.html (vista completa) e index.html (sección "Próxima Fecha").
// La serie (s) se extrajo del color del fixture PDF oficial y se validó con AIRA.
// Para actualizar el calendario, edita SOLO este archivo.
//
// Última sincronización: fixture oficial "TORNEO APERTURA 2026 — LIGA LA REINA",
// actualización del 10 de agosto de 2026. De ahí salen las fechas 14 (15/08, la
// única con las cinco series), 15 (22/08) y 16 (29/08).

// Series (color = CLAVE del fixture oficial)
window.FIXTURE_SERIES = {
  junior:      { label: 'Junior',       color: '#ffffff' },
  senior:      { label: 'Senior',       color: '#f9bf8e' },
  supersenior: { label: 'Super Senior', color: '#702fa0' },
  dorada:      { label: 'Dorada',       color: '#ffbf00' },
  diamante:    { label: 'Diamante',     color: '#91cf50' },
};

// Partidos de Atlético Maristas por fecha.
window.FIXTURE = [
  { n:1, fecha:"11 y 12 de Abril", dias:[
    { dia:"Sábado 11/04", p:[
      { h:"11:10", c:"Cancha 2", vs:"Doveramigos", home:false, s:"senior" },
      { h:"12:50", c:"Cancha 2", vs:"Doveramigos", home:false, s:"junior" },
    ]},
    { dia:"Domingo 12/04", p:[
      { h:"9:40",  c:"Cancha 2", vs:"BICE", home:false, s:"dorada" },
      { h:"11:00", c:"Cancha 2", vs:"BICE", home:false, s:"supersenior" },
      { h:"11:00", c:"Cancha 3", vs:"Mapuches", home:false, s:"diamante" },
    ]},
  ]},
  { n:2, fecha:"18 y 19 de Abril", dias:[
    { dia:"Sábado 18/04", p:[
      { h:"11:10", c:"Cancha 3", vs:"San Nicolás", home:true, s:"senior" },
    ]},
    { dia:"Domingo 19/04", p:[
      { h:"9:40",  c:"Cancha 2", vs:"Jaguares", home:true, s:"dorada" },
      { h:"11:00", c:"Cancha 2", vs:"Jaguares", home:true, s:"diamante" },
      { h:"12:20", c:"Cancha 2", vs:"San Nicolás", home:true, s:"junior" },
      { h:"12:20", c:"Cancha 3", vs:"Fluminense", home:false, s:"supersenior" },
    ]},
  ]},
  { n:3, fecha:"25 de Abril (+ recuperativos)", nota:"El domingo 26/04 se postergó por la Maratón de Santiago. Los partidos se recuperaron en mayo.", dias:[
    { dia:"Sábado 25/04", p:[
      { h:"12:50", c:"Cancha 2", vs:"Estudiantes", home:true, s:"junior" },
      { h:"19:50", c:"Cancha 2", vs:"BICE", home:false, s:"senior" },
    ]},
    { dia:"Recuperativo · Martes 05/05", p:[
      { h:"21:30", c:"Cancha 1", vs:"Estudiantes", home:false, s:"dorada" },
      { h:"21:30", c:"Cancha 3", vs:"Manchester", home:false, s:"supersenior" },
    ]},
    { dia:"Recuperativo · Miércoles 13/05", p:[
      { h:"20:00", c:"Cancha 1", vs:"Estudiantes", home:false, s:"diamante" },
    ]},
  ]},
  { n:4, fecha:"9 y 10 de Mayo", dias:[
    { dia:"Sábado 09/05", p:[
      { h:"9:30",  c:"Cancha 1", vs:"Climazul", home:false, s:"junior" },
      { h:"11:10", c:"Cancha 1", vs:"Climazul", home:false, s:"senior" },
    ]},
    { dia:"Domingo 10/05", p:[
      { h:"9:40",  c:"Cancha 2", vs:"Ciclón", home:true, s:"dorada" },
      { h:"11:00", c:"Cancha 2", vs:"Ciclón", home:true, s:"diamante" },
      { h:"12:20", c:"Cancha 2", vs:"Ciclón", home:true, s:"supersenior" },
    ]},
  ]},
  { n:5, fecha:"16 y 17 de Mayo", nota:"Senior, Super Senior y Diamante: LIBRE (descansan) esta fecha.", dias:[
    { dia:"Sábado 16/05", p:[
      { h:"9:30",  c:"Cancha 3", vs:"Jaguares", home:true, s:"junior" },
      { h:"16:50", c:"Cancha 3", vs:"Climazul", home:false, s:"dorada" },
    ]},
  ]},
  { n:6, fecha:"30 y 31 de Mayo", nota:"Fecha de clásicos: Atlético Maristas vs Unión Marista en todas las series.", dias:[
    { dia:"Sábado 30/05", p:[
      { h:"11:10", c:"Cancha 2", vs:"Unión Marista", home:false, s:"senior" },
    ]},
    { dia:"Domingo 31/05", p:[
      { h:"9:40",  c:"Cancha 2", vs:"Unión Marista", home:true, s:"dorada" },
      { h:"11:00", c:"Cancha 3", vs:"Unión Marista", home:true, s:"diamante" },
      { h:"12:20", c:"Cancha 2", vs:"Unión Marista", home:false, s:"junior" },
      { h:"12:20", c:"Cancha 3", vs:"Unión Marista", home:true, s:"supersenior" },
    ]},
  ]},
  { n:7, fecha:"6 y 7 de Junio", dias:[
    { dia:"Sábado 06/06", p:[
      { h:"9:30",  c:"Cancha 3", vs:"AC Lo Campino", home:false, s:"junior" },
      { h:"11:10", c:"Cancha 3", vs:"AC Lo Campino", home:false, s:"senior" },
    ]},
    { dia:"Domingo 07/06", p:[
      { h:"9:40",  c:"Cancha 3", vs:"Mapuches", home:true, s:"dorada" },
      { h:"11:00", c:"Cancha 3", vs:"Stadio Italiano", home:true, s:"diamante" },
      { h:"12:20", c:"Cancha 3", vs:"Mapuches", home:true, s:"supersenior" },
    ]},
  ]},
  { n:8, fecha:"Reprogramada (originalmente 13 de Junio)", nota:"La fecha 8 se suspendió el 13/06 y fue reprogramada: Súper Senior, Dorada y Diamante se juegan el sábado 25/07, y Senior y Junior el sábado 08/08.", dias:[
    { dia:"Reprogramado · Sábado 25/07", p:[
      { h:"15:30", c:"Cancha 2", vs:"Doveramigos", home:false, s:"diamante" },
      { h:"16:50", c:"Cancha 2", vs:"Doveramigos", home:false, s:"dorada" },
      { h:"18:20", c:"Cancha 2", vs:"Doveramigos", home:false, s:"supersenior" },
    ]},
    { dia:"Reprogramado · Sábado 08/08", p:[
      { h:"12:50", c:"Cancha 1", vs:"Manchester", home:false, s:"junior" },
      { h:"19:50", c:"Cancha 1", vs:"Manchester", home:false, s:"senior" },
    ]},
  ]},
  { n:9, fecha:"20 y 21 de Junio", dias:[
    { dia:"Sábado 20/06", p:[
      { h:"11:10", c:"Cancha 1", vs:"Improvisados", home:true, s:"senior" },
      { h:"12:50", c:"Cancha 1", vs:"América", home:true, s:"junior" },
    ]},
    { dia:"Domingo 21/06", p:[
      { h:"9:40",  c:"Cancha 1", vs:"Alianza", home:true, s:"dorada" },
      { h:"11:00", c:"Cancha 1", vs:"Alianza", home:true, s:"diamante" },
      { h:"12:20", c:"Cancha 1", vs:"Defensor", home:true, s:"supersenior" },
    ]},
  ]},
  { n:10, fecha:"4 y 5 de Julio", dias:[
    { dia:"Sábado 04/07", p:[
      { h:"12:50", c:"Cancha 3", vs:"América", home:true, s:"junior" },
      { h:"19:50", c:"Cancha 3", vs:"Alianza", home:false, s:"senior" },
    ]},
    { dia:"Domingo 05/07", p:[
      { h:"9:40",  c:"Cancha 2", vs:"América", home:true, s:"dorada" },
      { h:"11:00", c:"Cancha 2", vs:"Universitario", home:true, s:"diamante" },
      { h:"12:20", c:"Cancha 2", vs:"Leyenda 216", home:true, s:"supersenior" },
    ]},
  ]},
  { n:11, fecha:"11 y 12 de Julio", dias:[
    { dia:"Sábado 11/07", p:[
      { h:"9:30",  c:"Cancha 2", vs:"Ciclón", home:true, s:"junior" },
      { h:"19:50", c:"Cancha 1", vs:"Ciclón", home:true, s:"senior" },
    ]},
    { dia:"Domingo 12/07", p:[
      { h:"9:40",  c:"Cancha 1", vs:"Juventus", home:true, s:"dorada" },
      { h:"11:00", c:"Cancha 1", vs:"Juventus", home:true, s:"diamante" },
      { h:"12:20", c:"Cancha 2", vs:"Charkaplax", home:true, s:"supersenior" },
    ]},
  ]},
  { n:12, fecha:"25 de Julio", nota:"En esta fecha juegan Senior y Junior (las otras series inician su Clausura).", dias:[
    { dia:"Sábado 25/07", p:[
      { h:"9:30",  c:"Cancha 2", vs:"Juventus", home:true, s:"junior" },
      { h:"11:10", c:"Cancha 2", vs:"Charkaplax", home:true, s:"senior" },
    ]},
  ]},
  { n:13, fecha:"1 de Agosto", nota:"Juegan Senior y Junior.", dias:[
    { dia:"Sábado 01/08", p:[
      { h:"9:30",  c:"Cancha 1", vs:"Dinastía", home:true, s:"junior" },
      { h:"11:10", c:"Cancha 1", vs:"Dinastía", home:true, s:"senior" },
    ]},
  ]},
  // --- Fixture oficial actualizado al 10/08/2026 ---
  { n:14, fecha:"15 de Agosto", nota:"Única fecha con las cinco series en cancha: Junior y Senior en la mañana (Cancha 1) y Diamante, Dorada y Súper Senior en la tarde (Cancha 2).", dias:[
    { dia:"Sábado 15/08", p:[
      { h:"9:30",  c:"Cancha 1", vs:"Dinastía", home:true, s:"junior" },
      { h:"11:10", c:"Cancha 1", vs:"Dinastía", home:true, s:"senior" },
      { h:"15:30", c:"Cancha 2", vs:"Doveramigos", home:false, s:"diamante" },
      { h:"16:50", c:"Cancha 2", vs:"Doveramigos", home:false, s:"dorada" },
      { h:"18:20", c:"Cancha 2", vs:"Doveramigos", home:false, s:"supersenior" },
    ]},
  ]},
  { n:15, fecha:"22 de Agosto", nota:"Juegan Senior y Junior. Súper Senior, Dorada y Diamante inician el Clausura y aún no tienen rival asignado en el fixture oficial.", dias:[
    { dia:"Sábado 22/08", p:[
      { h:"9:30",  c:"Cancha 2", vs:"Juventus", home:true, s:"junior" },
      { h:"11:10", c:"Cancha 2", vs:"Charkaplax", home:true, s:"senior" },
    ]},
  ]},
  { n:16, fecha:"29 de Agosto", nota:"Juegan Senior y Junior. En las fechas siguientes (5/09, 12/09 y 26/09) el fixture al 10/08 aún no asigna partidos a Atlético Maristas. Los días 19 y 20 de septiembre no se juega.", dias:[
    { dia:"Sábado 29/08", p:[
      { h:"12:50", c:"Cancha 1", vs:"Manchester", home:false, s:"junior" },
      { h:"19:50", c:"Cancha 1", vs:"Manchester", home:false, s:"senior" },
    ]},
  ]},

  // ---- CLAUSURA 2026 ----
  // Torneo nuevo, con su propia numeracion: AIRA la llama "Fecha 2" (de ahi el
  // nLabel), pero `n` sigue la cuenta corrida de la temporada porque es la CLAVE
  // de FIXTURE_FIN y no puede repetirse con la fecha 2 del Apertura.
  // Tomado de la Programacion de AIRA (futbol.aira.cl), CL. 2026 - FASE REGULAR.
  { n:17, nLabel:'2 (Clausura)', fecha:"6 de Septiembre", nota:"Arranca el Clausura 2026 para Súper Senior, Dorada y Diamante: las tres juegan de visita en Cancha 1. Junior y Senior siguen en el Apertura y el fixture oficial aún no les asigna rival.", dias:[
    { dia:"Domingo 06/09", p:[
      { h:"9:40",  c:"Cancha 1", vs:"Estudiantes", home:false, s:"dorada" },
      { h:"11:00", c:"Cancha 1", vs:"Estudiantes", home:false, s:"diamante" },
      { h:"12:20", c:"Cancha 1", vs:"Mapuches",    home:false, s:"supersenior" },
    ]},
  ]},
];

// Fecha de término de cada jornada (último día del fin de semana) para detectar
// automáticamente la PRÓXIMA FECHA según el día de hoy, sin depender de AIRA.
window.FIXTURE_FIN = {
  1:'2026-04-12', 2:'2026-04-19', 3:'2026-04-26', 4:'2026-05-10', 5:'2026-05-17',
  6:'2026-05-31', 7:'2026-06-07', 8:'2026-08-08', 9:'2026-06-21', 10:'2026-07-05',
  11:'2026-07-12', 12:'2026-07-25', 13:'2026-08-01',
  14:'2026-08-15', 15:'2026-08-22', 16:'2026-08-29',
  17:'2026-09-06'
};

// Etiqueta visible de una jornada. El Clausura reinicia la numeracion, asi que
// `n` (clave interna, unica) y lo que se muestra dejaron de coincidir.
window.fixtureNLabel = function (f) {
  return (f && f.nLabel) || (f && f.n) || '';
};

// Fecha de hoy en ISO local (YYYY-MM-DD).
window.fixtureHoyISO = function () {
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
};

// ISO (YYYY-MM-DD) de un día del fixture. El texto trae "DD/MM"; el año se saca
// de FIXTURE_FIN de la jornada a la que pertenece.
window.fixtureDiaISO = function (diaTxt, n) {
  var m = String(diaTxt || '').match(/(\d{2})\/(\d{2})/);
  if (!m) return null;
  var anio = String(window.FIXTURE_FIN[n] || '').slice(0, 4) || '9999';
  return anio + '-' + m[2] + '-' + m[1];
};

// Etiqueta humana "DD de Mes" a partir de un ISO (para fechas reprogramadas sueltas).
window.fixtureFechaLarga = function (iso) {
  var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? (Number(m[3]) + ' de ' + MESES[Number(m[2]) - 1]) : '';
};

// Devuelve la PRÓXIMA FECHA e INCLUYE todos los partidos que se juegan en esa
// ventana de fechas, aunque pertenezcan a otra jornada por reprogramación.
// Ej.: la Fecha 8 se reprogramó y Súper Senior/Dorada/Diamante se juegan el 25/07,
// el mismo día que la Fecha 12 (Junior/Senior): en el home aparecen todos.
// Cada día del resultado lleva `n` (número de fecha real) para etiquetar cada fila.
// Devuelve null si la temporada ya terminó.
window.fixtureProxima = function () {
  var hoy = window.fixtureHoyISO();

  // Jornada vigente: la primera cuyo último día (FIXTURE_FIN) aún no pasó.
  var primary = null;
  for (var i = 0; i < window.FIXTURE.length; i++) {
    if ((window.FIXTURE_FIN[window.FIXTURE[i].n] || '9999') >= hoy) { primary = window.FIXTURE[i]; break; }
  }

  var lo = null, hi = null, fechaLbl = null;
  if (primary) {
    // Ventana = fin de semana completo de la jornada vigente (min/max de sus días).
    primary.dias.forEach(function (d) {
      var iso = window.fixtureDiaISO(d.dia, primary.n);
      if (!iso) return;
      if (!lo || iso < lo) lo = iso;
      if (!hi || iso > hi) hi = iso;
    });
    fechaLbl = primary.fecha;
  } else {
    // Sin jornada vigente por FIN, pero pueden quedar días reprogramados sueltos
    // (ej. Junior/Senior de la Fecha 8 el 08/08). Toma el día futuro más cercano.
    window.FIXTURE.forEach(function (f) {
      f.dias.forEach(function (d) {
        var iso = window.fixtureDiaISO(d.dia, f.n);
        if (iso && iso >= hoy && (!lo || iso < lo)) { lo = iso; }
      });
    });
    if (!lo) return null;           // temporada realmente terminada
    hi = lo;                         // ventana de un solo día
    fechaLbl = window.fixtureFechaLarga(lo);
  }

  // Reúne TODOS los días (de cualquier jornada) dentro de [lo, hi]. Primero la
  // jornada vigente para conservar el orden natural, luego el resto.
  var dias = [], ns = {};
  function add(f) {
    f.dias.forEach(function (d) {
      var iso = window.fixtureDiaISO(d.dia, f.n);
      if (iso && iso >= lo && iso <= hi) {
        dias.push({ dia: d.dia, p: d.p, n: f.n, nLabel: f.nLabel });
        ns[f.n] = f.nLabel || f.n;
      }
    });
  }
  if (primary) add(primary);
  window.FIXTURE.forEach(function (f) { if (f !== primary) add(f); });

  var nsArr = Object.keys(ns).map(Number).sort(function (a, b) { return a - b; });
  // Mismo orden que nsArr, pero con la etiqueta visible de cada jornada.
  var nsLabels = nsArr.map(function (k) { return ns[k]; });
  // `n` = jornada principal para resaltar en la vista completa (fixture.html):
  // la vigente por FIN si existe, o la del día reprogramado más cercano.
  var principal = primary || null;
  var principalN = principal ? principal.n : nsArr[0];
  return {
    n: principalN,
    nLabel: principal ? principal.nLabel : ns[principalN],
    fecha: fechaLbl, dias: dias, ns: nsArr, nsLabels: nsLabels
  };
};
