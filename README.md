# Spotifinho Pessoal

Um projeto minimalista de streaming de música para uso pessoal, focado em simplicidade, funcionalidade e facilidade de hospedagem em plataformas gratuitas como Vercel.

## A Ideia

O objetivo é ter um player de música web que funcione no celular, sem a necessidade de um servidor persistente rodando 24/7 para os arquivos de áudio. A arquitetura será dividida em:

1.  **Frontend Estático:** Uma interface web simples (HTML, CSS, JavaScript vanilla) hospedada em uma plataforma como Vercel.
2.  **API Serverless (Lista de Músicas):** Uma função serverless (Node.js ou Python) que retorna uma lista *pré-definida* de músicas e seus URLs diretos. Esta função também será hospedada no Vercel.
3.  **Armazenamento de Áudio:** Os arquivos de música (`.mp3`, etc.) serão hospedados em um serviço de armazenamento de objetos estático e público (ex: Cloudflare R2, GitHub Pages para arquivos pequenos, ou até mesmo um servidor de arquivos simples que você já tenha).

## Como Funciona (A "Gambiarra")

*   Você terá seus arquivos de música hospedados em algum lugar público na internet (ex: `https://seuservico.com/minhas_musicas/`).
*   A API serverless não vai "escanear" um diretório. Em vez disso, ela terá uma lista *hardcoded* (definida no código) com os metadados de cada música (título, artista) e o URL direto para o arquivo de áudio.
*   O frontend fará uma requisição a essa API para obter a lista de músicas e, ao clicar em uma, usará o URL direto para reproduzir o áudio via `<audio>` tag do HTML5.

## Caminhos de Desenvolvimento

### 1. Preparar o Armazenamento de Áudio

Escolha um serviço de armazenamento estático e faça o upload das suas músicas. Certifique-se de que os arquivos estejam acessíveis publicamente via URL direto.

*   **Opções:**
    *   **Cloudflare R2:** Oferece um generoso plano gratuito e é ideal para arquivos grandes.
    *   **GitHub Pages:** Se suas músicas forem pequenas e você não se importar em tê-las em um repositório público (e legalmente permitido).
    *   **Um servidor de arquivos simples:** Se você já tiver um VPS ou Raspberry Pi rodando, pode configurar um servidor HTTP básico para servir os arquivos.

### 2. Desenvolver a API Serverless (Lista de Músicas)

Crie uma função serverless que retorne um JSON com a lista de suas músicas. Cada entrada deve conter `id`, `title`, `artist` e o `url` completo para o arquivo de áudio no seu serviço de armazenamento.

*   **Exemplo de Estrutura JSON:**
    ```json
    [
        {"id": "1", "title": "Bohemian Rhapsody", "artist": "Queen", "url": "https://seuservico.com/musicas/bohemian_rhapsody.mp3"},
        {"id": "2", "title": "Stairway to Heaven", "artist": "Led Zeppelin", "url": "https://seuservico.com/musicas/stairway_to_heaven.mp3"}
    ]
    ```
*   **Tecnologia:** Node.js com Express ou Python com Flask/FastAPI (para Vercel, você usaria o modelo de funções serverless).

### 3. Desenvolver o Frontend (Interface Web)

Crie um `index.html` com CSS mínimo e JavaScript vanilla.

*   **Funcionalidades:**
    *   Um campo de busca para filtrar a lista de músicas (filtragem client-side).
    *   Uma lista simples para exibir as músicas.
    *   Um player de áudio HTML5 (`<audio controls>`).
*   **Interação:** O JavaScript fará uma requisição à sua API serverless para obter a lista de músicas e, ao clicar em uma, definirá o `src` do player de áudio para o URL da música.

### 4. Implantação (Vercel)

*   **Frontend:** O `index.html`, CSS e JavaScript podem ser implantados como um projeto de "Static Site" no Vercel.
*   **API Serverless:** A função serverless pode ser implantada como uma "Serverless Function" no mesmo projeto Vercel (ou em um separado, se preferir).

## Próximos Passos

1.  Defina onde você vai hospedar seus arquivos de áudio.
2.  Comece a criar a API serverless com a lista de suas músicas e seus URLs.
3.  Desenvolva o frontend para consumir essa API e reproduzir as músicas.

Vamos começar a codificar!