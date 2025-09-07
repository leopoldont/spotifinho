# Instruções de Trabalho - Spotifinho

Este documento resume as instruções e o escopo atual do projeto.

---

## Instrução 1: Validação de Streaming/Download do YouTube com GUI Simples (ABANDONADO)

*   **Motivo:** Incompatibilidade com o objetivo de uso em celular e hospedagem web (Vercel).

---

## Instrução 2: Streaming de Música do YouTube via Web (Python + HTML/CSS/JS)

**Objetivo:** Implementar um sistema de streaming de música do YouTube com uma interface web simples, compatível com dispositivos móveis e hospedagem em plataformas como Vercel.

**Detalhes:**
*   **Fonte de Música:** YouTube.
*   **Tecnologias:**
    *   **Backend:** Python (com Flask ou FastAPI) para lidar com a lógica de busca e extração de URLs do YouTube.
    *   **Frontend:** HTML, CSS e JavaScript vanilla para a interface do usuário no navegador.
*   **Funcionalidades:**
    *   **Pesquisa de Músicas:** O usuário poderá pesquisar músicas diretamente pelo nome/artista na interface web.
    *   **Exibição de Resultados:** Os resultados da pesquisa do YouTube (título, artista, thumbnail, duração) serão exibidos na página.
    *   **Reprodução:** Ao selecionar um resultado, a música será reproduzida diretamente no navegador via streaming.
*   **Hospedagem:** A arquitetura será pensada para ser compatível com Vercel (frontend estático e backend como função serverless).

### Progresso Atual (Concluído)

*   **Estrutura do Projeto:** Configuração inicial do frontend (HTML, CSS, JS) e backend (Flask Python).
*   **Integração YouTube (Busca):** Implementação da busca de músicas no YouTube usando `yt-dlp` no backend. A interface web agora exibe resultados reais da pesquisa.
*   **Integração YouTube (Streaming):** Implementação da extração de URLs de streaming de áudio do YouTube usando `yt-dlp` no backend. A reprodução de músicas está funcional no navegador.
*   **Correção de Bug:** Resolvido o erro de formatação de duração que impedia a busca.

### Melhorias Realizadas (UI/UX Overhaul)

*   **Interface/Experiência do Usuário (Concluído):**
    *   **Novo Tema:** A interface foi redesenhada com um tema escuro moderno, inspirado no Spotify.
    *   **Player Aprimorado:** Adicionada uma seção "Now Playing" que exibe a arte, título e artista da música atual.
    *   **Feedback Visual:** A lista de resultados agora indica visualmente qual música está carregando e qual está tocando, melhorando a percepção de responsividade.
    *   **Correção de Thumbnails:** A exibição de thumbnails foi corrigida e integrada ao novo design.

### Próximos Passos (Pós-Teste)

*   **Deploy:** Preparar o projeto para deploy em uma plataforma como Vercel.

---

## Instrução 3: Especificação de Novas Funcionalidades

**Objetivo:** Definir o escopo para a próxima fase de desenvolvimento, focando em interação do usuário e gerenciamento de músicas.

### Funcionalidades Desejadas

1.  **Interações na Música:**
    *   **Curtir (`Like`):** Adicionar um ícone de coração (ou similar) em cada música na lista de resultados e no player. O estado "curtido" deve ser visualmente claro.
    *   **Salvar na Playlist:** Adicionar um ícone para salvar a música em uma playlist.
        *   **Fase 1:** A música será salva em uma única playlist padrão, chamada "Músicas Curtidas" ou "Minha Playlist".
        *   **Fase 2 (Futuro):** Desenvolver um sistema para criar e gerenciar múltiplas playlists.

2.  **Navegação e Biblioteca:**
    *   **Barra de Navegação:** Implementar uma barra de navegação fixa (inferior ou lateral) para acesso rápido às seções principais.
    *   **Seção Biblioteca:**
        *   Criar uma nova visualização/página "Biblioteca".
        *   Inicialmente, esta seção exibirá la playlist de "Músicas Curtidas".
        *   **Futuro:** A Biblioteca será o local para gerenciar playlists e acessar músicas baixadas.

3.  **Modo Offline (Futuro):**
    *   **Download de Músicas:** Implementar uma funcionalidade que permita ao usuário baixar músicas para o dispositivo.
    *   **Acesso Offline:** As músicas baixadas devem estar disponíveis para audição na seção "Biblioteca" mesmo quando o usuário estiver sem conexão com a internet.

### Reflexão sobre a Implementação

*   **Armazenamento de Dados:** Para salvar o estado de "curtidas" e as playlists, precisaremos de uma forma de armazenamento no lado do cliente. O `localStorage` do navegador é a solução mais simples e imediata para isso. Cada música "curtida" ou salva pode ter seu ID do YouTube e metadados armazenados em uma lista no `localStorage`.
*   **Estrutura da UI:** A introdução de uma barra de navegação e uma nova seção "Biblioteca" exigirá uma refatoração do `index.html` para suportar múltiplas "páginas" ou "visualizações". Podemos gerenciar a visibilidade das seções (Pesquisa, Biblioteca) com JavaScript, sem a necessidade de recarregar a página.
*   **Modo Offline:** O download de áudio do YouTube para o dispositivo do cliente é tecnicamente complexo e pode violar os termos de serviço do YouTube. Uma abordagem mais viável seria usar Service Workers para cachear os streams de áudio, permitindo a reprodução offline. Isso adiciona uma camada significativa de complexidade, mas é a abordagem correta para uma PWA (Progressive Web App).

### Funcionalidades Desejadas (Sessão 2)

1.  **Fila de Reprodução:**
    *   Implementar uma função "Adicionar à Fila" para as músicas.
    *   As músicas adicionadas à fila devem ser reproduzidas em sequência após a música atual terminar.

2.  **Sistema de Múltiplas Playlists:**
    *   Habilitar a criação e gerenciamento de múltiplas playlists na seção "Biblioteca".
    *   Ao lado do botão "Adicionar à Fila", criar um botão "Adicionar à Playlist...".
    *   Este botão deve revelar um submenu ou dropdown (com um bom design) que lista as playlists existentes para que o usuário possa escolher onde adicionar a música.

3.  **Melhorias de UI/UX:**
    *   Revisar e melhorar a funcionalidade de scroll em toda a aplicação, especialmente na lista de resultados e playlists.
    *   Ajustar as proporções dos elementos da interface (player, resultados, etc.) para uma melhor harmonia visual em diferentes tamanhos de tela.

