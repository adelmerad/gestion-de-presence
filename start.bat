@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo Installation des dependances, cela peut prendre quelques minutes...
  call npm install
  if errorlevel 1 (
    echo.
    echo Une erreur est survenue pendant l'installation. Verifiez que Node.js est bien installe.
    pause
    exit /b 1
  )
)

echo.
echo Demarrage de l'application...
echo Le navigateur va s'ouvrir dans quelques secondes.
echo Pour arreter l'application, fermez cette fenetre ou appuyez sur Ctrl+C.
echo.

start "" cmd /c "timeout /t 5 /nobreak >nul && start "" http://localhost:3000"

call npm run dev
