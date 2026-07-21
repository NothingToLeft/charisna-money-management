Unicode True
!include "MUI2.nsh"
!include "x64.nsh"

Name "CHARISNA Money Management"
OutFile "dist\CHARISNA-Money-Management-Setup-v12.0.0-x64.exe"
InstallDir "$LOCALAPPDATA\Programs\CHARISNA Money Management"
InstallDirRegKey HKCU "Software\CHARISNA\MoneyManagement" "InstallDir"
RequestExecutionLevel user
SetCompressor /SOLID lzma
SetCompressorDictSize 64
Icon "dist\.icon-ico\icon.ico"
UninstallIcon "dist\.icon-ico\icon.ico"

VIProductVersion "12.0.0.0"
VIAddVersionKey /LANG=1057 "ProductName" "CHARISNA Money Management"
VIAddVersionKey /LANG=1057 "CompanyName" "CHARISNA"
VIAddVersionKey /LANG=1057 "FileDescription" "Installer CHARISNA Money Management"
VIAddVersionKey /LANG=1057 "FileVersion" "12.0.0"
VIAddVersionKey /LANG=1057 "ProductVersion" "12.0.0"
VIAddVersionKey /LANG=1057 "LegalCopyright" "Copyright © 2026 CHARISNA"

!define MUI_ABORTWARNING
!define MUI_ICON "dist\.icon-ico\icon.ico"
!define MUI_UNICON "dist\.icon-ico\icon.ico"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "Indonesian"
!insertmacro MUI_LANGUAGE "English"

Section "Aplikasi Utama" SecMain
  SetShellVarContext current
  nsExec::ExecToLog 'taskkill /F /IM "CHARISNA Money Management.exe"'
  Pop $0

  SetOutPath "$INSTDIR"
  File /r "dist\win-unpacked\*.*"
  File /oname=charisna.ico "dist\.icon-ico\icon.ico"

  WriteRegStr HKCU "Software\CHARISNA\MoneyManagement" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement" "DisplayName" "CHARISNA Money Management"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement" "DisplayVersion" "12.0.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement" "Publisher" "CHARISNA"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement" "DisplayIcon" "$INSTDIR\charisna.ico"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement" "UninstallString" '"$INSTDIR\Uninstall CHARISNA.exe"'
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement" "NoRepair" 1

  WriteUninstaller "$INSTDIR\Uninstall CHARISNA.exe"
  CreateDirectory "$SMPROGRAMS\CHARISNA Money Management"
  CreateShortcut "$SMPROGRAMS\CHARISNA Money Management\CHARISNA Money Management.lnk" "$INSTDIR\CHARISNA Money Management.exe" "" "$INSTDIR\charisna.ico"
  CreateShortcut "$DESKTOP\CHARISNA Money Management.lnk" "$INSTDIR\CHARISNA Money Management.exe" "" "$INSTDIR\charisna.ico"
SectionEnd

Function .onInstSuccess
  Exec '"$INSTDIR\CHARISNA Money Management.exe"'
FunctionEnd

Section "Uninstall"
  SetShellVarContext current
  nsExec::ExecToLog 'taskkill /F /IM "CHARISNA Money Management.exe"'
  Pop $0
  Delete "$DESKTOP\CHARISNA Money Management.lnk"
  RMDir /r "$SMPROGRAMS\CHARISNA Money Management"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\CHARISNAMoneyManagement"
  DeleteRegKey HKCU "Software\CHARISNA\MoneyManagement"
  RMDir /r "$INSTDIR"
SectionEnd
