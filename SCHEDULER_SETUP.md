# Configuración del Scheduler Automático

El scheduler ejecuta `actualizar.js` automáticamente todos los **miércoles de 14:00 a jueves a las 12:00** (hora local).

## Requisitos

- Node.js instalado
- El archivo `actualizar.js` funcionando correctamente

## Uso Rápido

```bash
node scheduler.js
```

Mantén esta terminal abierta o configura un servicio en segundo plano.

---

## Configuración por Sistema Operativo

### Windows (CMD / PowerShell)

#### Opción 1: Ejecutar en segundo plano (simple)

```powershell
# En PowerShell como administrador
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "scheduler.js"
```

#### Opción 2: Usar PM2 (recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar el scheduler con PM2
pm2 start scheduler.js --name "maristas-scheduler"

# Hacer que se inicie automáticamente con Windows
pm2 install pm2-windows-startup
pm2 save
```

Ver estado:
```bash
pm2 status
pm2 logs maristas-scheduler
```

### Linux / macOS

#### Opción 1: Ejecutar en segundo plano

```bash
# Ejecutar en background
nohup node scheduler.js > scheduler.log 2>&1 &

# Ver logs
tail -f scheduler.log
```

#### Opción 2: systemd (recomendado para Linux)

Crear archivo `/etc/systemd/system/maristas-scheduler.service`:

```ini
[Unit]
Description=Atletico Maristas Scheduler
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/sitio-web
ExecStart=/usr/bin/node scheduler.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Activar servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable maristas-scheduler
sudo systemctl start maristas-scheduler
sudo systemctl status maristas-scheduler

# Ver logs
sudo journalctl -u maristas-scheduler -f
```

#### Opción 3: PM2 (macOS / Linux)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar scheduler
pm2 start scheduler.js --name "maristas-scheduler"

# Configurar para reiniciar con el sistema
pm2 startup
pm2 save
```

---

## Monitoreo

### Ver logs en tiempo real

```bash
# En la ventana del terminal donde corre
# (muestra automáticamente cada ejecución)

# O con PM2
pm2 logs maristas-scheduler
```

### Probar manualmente el horario

Para probar sin esperar al miércoles:

1. Edita `scheduler.js` temporalmente:
```javascript
// Reemplaza isExecutionTime() con:
function isExecutionTime() {
  return true; // Siempre activo (solo para pruebas)
}
```

2. Ejecuta:
```bash
node scheduler.js
```

3. Verifica que se ejecute cada 60 minutos

4. Restaura el código original cuando termines las pruebas

---

## Solución de Problemas

### El scheduler no ejecuta actualizar.js

1. Verifica que `actualizar.js` existe y está en la misma carpeta
2. Prueba ejecutar manualmente: `node actualizar.js`
3. Revisa los logs para errores de conexión a futbol.aira.cl

### ¿Cómo cambio el intervalo de ejecución?

Edita esta línea en `scheduler.js`:

```javascript
const EXECUTION_INTERVAL = 60; // Cambia 60 por otro valor en minutos
```

### ¿Cómo cambio el horario?

Edita la función `isExecutionTime()` en `scheduler.js`:

```javascript
function isExecutionTime() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hours = now.getHours();
  // ... modificar según necesites
}
```

**Referencia de días:**
- 0 = Domingo
- 1 = Lunes
- 2 = Martes
- 3 = Miércoles
- 4 = Jueves
- 5 = Viernes
- 6 = Sábado

---

## Hosting en Netlify

Si usas Netlify, puedes usar **Netlify Functions** o un servicio externo como:

- **GitHub Actions** — Ejecuta cada miércoles a las 14:00 UTC (gratuito)
- **Cron Job Services** — EasyCron, NCronJob, etc.

Consulta si necesitas ayuda para configurar uno de estos.
