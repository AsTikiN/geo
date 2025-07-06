@echo off
echo Starting setup process...

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
echo Script directory: %SCRIPT_DIR%

REM Change to the script directory
cd /d "%SCRIPT_DIR%"
echo Current working directory: %CD%

echo Installing yarn globally...
npm install -g yarn

echo Running yarn install...
yarn

echo Building the project...
yarn build

echo Generating Prisma client...
npx prisma generate

echo Setup complete!
pause 