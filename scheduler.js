/**
 * scheduler.js — Club Atletico Maristas
 * Ejecuta actualizar.js automáticamente todos los miércoles 14:00 a jueves 12:00
 *
 * Uso: node scheduler.js
 * (Ejecutar en segundo plano o como servicio del sistema)
 */

const { spawn } = require('child_process');
const path = require('path');

const ACTUALIZAR_SCRIPT = path.join(__dirname, 'actualizar.js');

// Intervalo de ejecución en minutos
const EXECUTION_INTERVAL = 60; // Cada hora

// Retorna true si estamos en el período de ejecución
function isExecutionTime() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=domingo, 1=lunes, ..., 3=miércoles, 4=jueves
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Miércoles (3) desde las 14:00 (840 minutos) hasta las 23:59
  if (dayOfWeek === 3 && totalMinutes >= 840) {
    return true;
  }

  // Jueves (4) desde las 00:00 (0 minutos) hasta las 12:00 (720 minutos)
  if (dayOfWeek === 4 && totalMinutes <= 720) {
    return true;
  }

  return false;
}

// Ejecuta actualizar.js
function runActualizar() {
  const now = new Date().toLocaleString('es-CL');
  console.log(`[${now}] Ejecutando actualizar.js...`);

  const child = spawn('node', [ACTUALIZAR_SCRIPT]);

  let output = '';
  let errorOutput = '';

  child.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`[STDOUT] ${data.toString().trim()}`);
  });

  child.stderr.on('data', (data) => {
    errorOutput += data.toString();
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

// Verifica si ya se ejecutó en esta ventana de tiempo (para evitar duplicados)
let lastExecutionWindow = null;

function checkAndExecute() {
  if (isExecutionTime()) {
    // Obtén la ventana actual (miércoles-jueves)
    const now = new Date();
    const windowId = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    // Si es una ventana diferente de la última ejecución, ejecuta
    if (lastExecutionWindow !== windowId) {
      // Se ejecuta cada hora durante el período
      runActualizar();
      lastExecutionWindow = windowId;
    } else {
      // Ya se ejecutó en esta ventana (pero se ejecutará de nuevo en la próxima hora)
      // Esto permite múltiples ejecuciones durante el período
      runActualizar();
    }
  }
}

// Inicia el scheduler
console.log('🚀 Scheduler iniciado');
console.log(`⏰ Se ejecutará cada ${EXECUTION_INTERVAL} minutos`);
console.log('📅 Horario: Miércoles 14:00 - Jueves 12:00 (hora local)\n');

// Ejecuta la verificación cada X minutos
setInterval(checkAndExecute, EXECUTION_INTERVAL * 60 * 1000);

// También verifica al iniciar
checkAndExecute();

// Manejo de señales para shutdown ordenado
process.on('SIGINT', () => {
  console.log('\n\n⛔ Scheduler detenido por usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⛔ Scheduler detenido');
  process.exit(0);
});

// Mostrar estado cada 6 horas
setInterval(() => {
  const now = new Date().toLocaleString('es-CL');
  const inWindow = isExecutionTime();
  const status = inWindow ? '✓ EN VENTANA DE EJECUCIÓN' : '✗ Fuera de horario';
  console.log(`[${now}] Estado: ${status}`);
}, 6 * 60 * 60 * 1000);
