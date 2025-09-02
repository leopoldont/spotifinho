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

### Melhorias Pendentes (Próximos Passos)

*   **Interface/Experiência do Usuário:**
    *   **Imagens das Músicas:** As miniaturas (thumbnails) das músicas não estão sendo carregadas/exibidas corretamente.
    *   **Delay no Pause:** O botão de pause apresenta um atraso perceptível.
    *   **Pré-buffer:** Implementar um tempo de pré-buffer antes de iniciar a reprodução para evitar interrupções no streaming.
*   **Deploy:** Preparar o projeto para deploy em uma plataforma como Vercel.

