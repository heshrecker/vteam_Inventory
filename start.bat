@echo off

REM Start Backend
start cmd /k "cd C:\Users\Kelum Anawarathna\inventory-app\backend && node server.js"

REM Start Frontend (Serving the build folder)
start cmd /k "cd C:\Users\Kelum Anawarathna\inventory-app && npm start"

echo System is running...
pause
