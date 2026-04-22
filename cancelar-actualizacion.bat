@echo off
echo.
echo  Eliminando tareas de actualizacion automatica...
echo.

schtasks /delete /tn "MaristasActualizarMiercoles" /f >nul 2>&1
if %errorlevel%==0 (echo  [OK] Tarea Miercoles eliminada) else (echo  [INFO] Tarea Miercoles no existia)

schtasks /delete /tn "MaristasActualizarJueves" /f >nul 2>&1
if %errorlevel%==0 (echo  [OK] Tarea Jueves eliminada) else (echo  [INFO] Tarea Jueves no existia)

echo.
echo  La actualizacion automatica ha sido desactivada.
echo.
pause
