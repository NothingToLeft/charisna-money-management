$ErrorActionPreference = "SilentlyContinue"

$target = Join-Path $env:LOCALAPPDATA "Programs\CHARISNA Money Management"
$startMenu = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\CHARISNA Money Management"
$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "CHARISNA Money Management.lnk"

Get-Process -Name "CHARISNA Money Management" -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -LiteralPath $desktopShortcut -Force
Remove-Item -LiteralPath $startMenu -Recurse -Force
Remove-Item -LiteralPath "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement" -Recurse -Force
Remove-Item -LiteralPath "HKCU:\Software\CHARISNA\MoneyManagement" -Recurse -Force

$escapedTarget = $target.Replace('"', '""')
Start-Process -FilePath "cmd.exe" -ArgumentList "/c timeout /t 2 /nobreak >nul & rmdir /s /q `"$escapedTarget`"" -WindowStyle Hidden
