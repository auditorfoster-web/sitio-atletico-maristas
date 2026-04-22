@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
set "RUN_BAT=%SCRIPT_DIR%run-actualizar.bat"

echo.
echo  ==========================================
echo   Programador de Actualizacion Automatica
echo   Club Atletico Maristas
echo  ==========================================
echo.

:: Verificar que Node.js existe
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo  [ERROR] Node.js no encontrado.
  echo  Instala Node.js desde https://nodejs.org y vuelve a ejecutar.
  echo.
  pause
  exit /b 1
)

echo  Script de actualizacion: %RUN_BAT%
echo.

:: Crear carpeta de logs
if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"

:: Tarea Miercoles
echo  Creando tarea para Miercoles...
schtasks /create /tn "MaristasActualizarMiercoles" /tr "cmd /c \"\"%RUN_BAT%\"\"" /sc WEEKLY /d WED /st 07:00 /f >nul 2>&1
if %errorlevel%==0 (
  echo  [OK] Tarea Miercoles creada ^(cada Miercoles a las 07:00^)
) else (
  echo  [ERROR] No se pudo crear la tarea del Miercoles.
  echo          Intenta hacer clic derecho en este archivo y "Ejecutar como administrador".
)

:: Tarea Jueves
echo  Creando tarea para Jueves...
schtasks /create /tn "MaristasActualizarJueves" /tr "cmd /c \"\"%RUN_BAT%\"\"" /sc WEEKLY /d THU /st 07:00 /f >nul 2>&1
if %errorlevel%==0 (
  echo  [OK] Tarea Jueves creada ^(cada Jueves a las 07:00^)
) else (
  echo  [ERROR] No se pudo crear la tarea del Jueves.
  echo          Intenta hacer clic derecho y "Ejecutar como administrador".
)

echo.
echo  Listo! El sitio se actualizara automaticamente cada Miercoles y Jueves.
echo  Los logs se guardan en: %SCRIPT_DIR%logs\actualizacion.log
echo.
echo  Para desactivar las tareas ejecuta: cancelar-actualizacion.bat
echo.
pause
