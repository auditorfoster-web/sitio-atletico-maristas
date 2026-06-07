/**
 * scheduler.js — Club Atletico Maristas
 * Ejecuta actualizar.js automáticamente todos los días a las 09:00
 *
 * Uso: node scheduler.js
 * (Ejecutar en segundo plano o como servicio — PM2, NSSM, etc.)
 */

const { spawn } = require('child_process');
const path = require('path');

const ACTUALIZAR_SCRIPT = path.join(__dirname, 'actualizar.js');

// Hora objetivo (formato 24h)
const TARGET_HOUR = 9;
const TARGET_MINUTE = 0;

let lastRunDate = null; // 'YYYY-MM-DD' del último disparo

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function runActualizar() {
  const now = new Date().toLocaleString('es-CL');
  console.log(`[${now}] Ejecutando actualizar.js...`);

  const child = spawn('node', [ACTUALIZAR_SCRIPT], { cwd: __dirname });

  child.stdout.on('data', (data) => {
    console.log(`[STDOUT] ${data.toString().trim()}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[ERROR] ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    const endTime = new Date().toLocaleString('es-CL');
    if (code === 0) {
      console.log(`[${endTime}] ✓ actualizar.js completado exitosamente\n`);
    } else {
      console.error(`[${endTime}] ✗ actualizar.js falló con código: ${code}\n`);
    }
  });

  child.on('error', (err) => {
    console.error(`Error al ejecutar actualizar.js: ${err.message}`);
  });
}

function checkAndExecute() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const today = todayString();

  // Dispara si es la hora objetivo y aún no corrió hoy
  if (hour === TARGET_HOUR && minute === TARGET_MINUTE && lastRunDate !== today) {
    lastRunDate = today;
    runActualizar();
  }
}

// Revisa cada 30 segundos (suficientemente preciso, sin sobrecargar)
setInterval(checkAndExecute, 30 * 1000);

// También ejecuta al iniciar si ya pasó las 9 AM de hoy y no ha corrido
const now = new Date();
if (now.getHours() >= TARGET_HOUR) {
  const today = todayString();
  console.log(`[INFO] Ya son las ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')} — ejecutando actualizar.js ahora (primera vez del día).`);
  lastRunDate = today;
  runActualizar();
} else {
  const minutosRestantes = (TARGET_HOUR - now.getHours()) * 60 - now.getMinutes();
  console.log(`[INFO] Próxima ejecución en ~${minutosRestantes} minutos (hoy a las 09:00).`);
}

console.log('🚀 Scheduler iniciado — actualización diaria a las 09:00\n');

// Estado cada 6 horas
setInterval(() => {
  const ts = new Date().toLocaleString('es-CL');
  console.log(`[${ts}] Scheduler activo | Último disparo: ${lastRunDate ?? 'ninguno'}`);
}, 6 * 60 * 60 * 1000);

process.on('SIGINT', () => {
  console.log('\n⛔ Scheduler detenido por usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⛔ Scheduler detenido');
  process.exit(0);
});
