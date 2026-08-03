@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title Update Data Gempa QuakePulse

echo ================================================
echo       UPDATE DATA GEMPA DARI FILE EXCEL
echo ================================================
echo.

set "INPUT_FILE=%~1"

where py >nul 2>&1
if %errorlevel%==0 (
    if defined INPUT_FILE (
        py -3 "tools\update_data_gempa.py" "%INPUT_FILE%" --project-root "%CD%" --backup
    ) else (
        py -3 "tools\update_data_gempa.py" --project-root "%CD%" --backup
    )
    goto :RESULT
)

where python >nul 2>&1
if %errorlevel%==0 (
    if defined INPUT_FILE (
        python "tools\update_data_gempa.py" "%INPUT_FILE%" --project-root "%CD%" --backup
    ) else (
        python "tools\update_data_gempa.py" --project-root "%CD%" --backup
    )
    goto :RESULT
)

echo Python belum terpasang di komputer.
echo Instal Python 3 dari python.org, lalu centang Add Python to PATH.
set "EXIT_CODE=1"
goto :END

:RESULT
set "EXIT_CODE=%errorlevel%"
if "%EXIT_CODE%"=="0" (
    echo.
    echo Data website sudah diperbarui. Upload perubahan folder data ke GitHub.
) else (
    echo.
    echo Update gagal. Baca pesan kesalahan di atas.
)

:END
echo.
pause
exit /b %EXIT_CODE%
