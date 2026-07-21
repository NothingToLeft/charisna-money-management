@echo off
setlocal
cd /d "%~dp0"
title CHARISNA Money Management v11.1 Stability and Input Fix
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-charisna-money.ps1"
if errorlevel 1 (
  echo.
  echo CHARISNA Money Management gagal dijalankan.
  echo Tutup jendela CHARISNA Money Management lama jika port 8765 sedang digunakan.
  echo Silakan screenshot pesan kesalahan jika masih gagal.
  pause
)
endlocal
