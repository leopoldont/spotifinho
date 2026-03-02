@echo off
title Spotifinho - Executor
color 0A

echo ======================================================
echo           INICIANDO O SPOTIFINHO
echo ======================================================
echo.

echo -- Passo 1 de 3: Instalando/verificando dependencias...
pip install -r requirements.txt > nul
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao instalar as dependencias. Verifique sua conexao com a internet e a instalacao do Python.
    pause
    exit /b
)
echo    - Dependencias OK.
echo.

echo -- Passo 2 de 3: Iniciando o servidor local...
rem Inicia o servidor Python em uma nova janela com o titulo "Spotifinho - Servidor"
start "Spotifinho - Servidor" python app.py

rem Pausa para dar tempo ao servidor de iniciar
echo    - Aguardando o servidor iniciar (5 segundos)...
timeout /t 5 /nobreak > nul
echo    - Servidor iniciado.
echo.

echo -- Passo 3 de 3: Abrindo a aplicacao no navegador...
start http://127.0.0.1:5000
echo.

echo ======================================================
echo                      PRONTO!
echo ======================================================
echo.
echo O Spotifinho deve ter aberto no seu navegador.
echo.
echo IMPORTANTE: Uma segunda janela (com o titulo "Spotifinho - Servidor") foi aberta.
echo ELA PRECISA FICAR ABERTA para que o programa funcione.
echo Voce pode minimizar, mas nao fechar.
echo.
pause
