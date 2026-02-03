@echo off
echo ========================================
echo   SSDC Slot Watcher - Package Creator
echo ========================================
echo.

cd /d "%~dp0"

set OUTPUT_NAME=SSDC-Slot-Watcher-v1.0.zip
set FOLDER_NAME=ssdc-slot-watcher

echo Creating package...
echo.

powershell -Command "Compress-Archive -Path '%FOLDER_NAME%\*' -DestinationPath '%OUTPUT_NAME%' -Force"

if exist "%OUTPUT_NAME%" (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Package created: %OUTPUT_NAME%
    echo Location: %CD%\%OUTPUT_NAME%
    echo.
    echo You can now share this ZIP file!
    echo.
    pause
) else (
    echo.
    echo ERROR: Failed to create package
    echo.
    pause
)
