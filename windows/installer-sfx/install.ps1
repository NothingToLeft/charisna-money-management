$ErrorActionPreference = "Stop"

$source = $PSScriptRoot
$target = Join-Path $env:LOCALAPPDATA "Programs\CHARISNA Money Management"
$appExe = Join-Path $target "CHARISNA Money Management.exe"
$icon = Join-Path $target "charisna.ico"
$startMenu = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\CHARISNA Money Management"
$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "CHARISNA Money Management.lnk"
$startShortcut = Join-Path $startMenu "CHARISNA Money Management.lnk"

Get-Process -Name "CHARISNA Money Management" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

New-Item -ItemType Directory -Path $target -Force | Out-Null
Get-ChildItem -LiteralPath $source -Force |
    Where-Object { $_.Name -notin @("install.ps1", "installer-config.txt") } |
    Copy-Item -Destination $target -Recurse -Force

New-Item -ItemType Directory -Path $startMenu -Force | Out-Null
$shell = New-Object -ComObject WScript.Shell
foreach ($shortcutPath in @($desktopShortcut, $startShortcut)) {
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $appExe
    $shortcut.WorkingDirectory = $target
    $shortcut.IconLocation = $icon
    $shortcut.Save()
}

$uninstallKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement"
New-Item -Path $uninstallKey -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name "DisplayName" -Value "CHARISNA Money Management" -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name "DisplayVersion" -Value "13.0.0" -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name "Publisher" -Value "CHARISNA" -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name "DisplayIcon" -Value $icon -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name "UninstallString" -Value ('powershell.exe -NoProfile -ExecutionPolicy Bypass -File "' + (Join-Path $target "uninstall.ps1") + '"') -PropertyType String -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name "NoModify" -Value 1 -PropertyType DWord -Force | Out-Null
New-ItemProperty -Path $uninstallKey -Name "NoRepair" -Value 1 -PropertyType DWord -Force | Out-Null

Start-Process -FilePath $appExe
