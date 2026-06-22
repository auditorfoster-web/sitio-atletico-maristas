// fixture-data.js — FUENTE ÚNICA del fixture del Torneo Apertura 2026.
// La consumen fixture.html (vista completa) e index.html (sección "Próxima Fecha").
// La serie (s) se extrajo del color del fixture PDF oficial y se validó con AIRA.
// Para actualizar el calendario, edita SOLO este archivo.

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
];

// Fecha de término de cada jornada (último día del fin de semana) para detectar
// automáticamente la PRÓXIMA FECHA según el día de hoy, sin depender de AIRA.
window.FIXTURE_FIN = {
  1:'2026-04-12', 2:'2026-04-19', 3:'2026-04-26', 4:'2026-05-10', 5:'2026-05-17',
  6:'2026-05-31', 7:'2026-06-07', 8:'2026-06-13', 9:'2026-06-21', 10:'2026-07-05',
  11:'2026-07-12', 12:'2026-07-25', 13:'2026-08-01'
};

// Fecha de hoy en ISO local (YYYY-MM-DD).
window.fixtureHoyISO = function () {
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
};

// Devuelve el objeto de la PRÓXIMA FECHA (la primera cuyo último día aún no pasó),
// o null si la temporada ya terminó.
window.fixtureProxima = function () {
  var hoy = window.fixtureHoyISO();
  for (var i = 0; i < window.FIXTURE.length; i++) {
    if ((window.FIXTURE_FIN[window.FIXTURE[i].n] || '9999') >= hoy) return window.FIXTURE[i];
  }
  return null;
};
