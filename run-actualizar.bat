@echo off
:: Script interno usado por el Programador de Tareas de Windows
:: No ejecutar manualmente — usa iniciar-admin.bat o el panel de administracion

cd /d "%~dp0"

:: Crear carpeta de logs si no existe
if not exist "%~dp0logs" mkdir "%~dp0logs"

:: Ejecutar actualizacion y guardar log con fecha
echo. >> "%~dp0logs\actualizacion.log"
echo [%date% %time%] Iniciando actualizacion automatica... >> "%~dp0logs\actualizacion.log"
node "%~dp0actualizar.js" >> "%~dp0logs\actualizacion.log" 2>&1
echo [%date% %time%] Fin. >> "%~dp0logs\actualizacion.log"
