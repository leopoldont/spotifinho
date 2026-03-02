# Spotifinho Web

Spotifinho Web é uma aplicação de streaming de música simples e auto-hospedada que utiliza o YouTube como fonte de áudio. O projeto foi desenvolvido com o objetivo de criar um player de música funcional e leve, ideal para estudos e uso pessoal.

## ✨ Funcionalidades Principais

- **Busca de Músicas:** Pesquise qualquer música, artista ou álbum disponível no YouTube.
- **Player de Áudio:** Um player integrado para tocar as músicas, com controles de reprodução.
- **Biblioteca Pessoal:**
    - Salve suas músicas favoritas na playlist "Músicas Curtidas".
    - Crie, renomeie e exclua playlists personalizadas.
    - Adicione e remova músicas de qualquer uma de suas playlists.
- **Fila de Reprodução:**
    - Adicione músicas a uma fila para ouvir em sequência.
    - Reordene as músicas na fila arrastando e soltando.
    - **Pré-carregamento Otimizado:** A próxima música da fila é baixada em segundo plano para garantir uma transição suave e sem delays.
- **Interface Responsiva:** O layout se adapta a diferentes tamanhos de tela, funcionando bem tanto em desktops quanto em navegadores de celular.

## 🛠️ Tecnologias Utilizadas

- **Backend:**
    - **Python:** Linguagem principal do servidor.
    - **Flask:** Micro-framework web para criar a API e servir a aplicação.
    - **yt-dlp:** Uma fork do `youtube-dl` para buscar informações e extrair os links de áudio do YouTube.
- **Frontend:**
    - **HTML5:** Estrutura da página.
    - **CSS3:** Estilização e responsividade.
    - **JavaScript (Vanilla):** Lógica do lado do cliente, manipulação do DOM, gerenciamento de estado (playlists, fila) e comunicação com a API.
- **Armazenamento:**
    - **LocalStorage do Navegador:** Utilizado para persistir as playlists e músicas curtidas do usuário diretamente no navegador.
    - **Cache de Áudio no Servidor:** As músicas pré-carregadas da fila são salvas temporariamente em uma pasta `temp_audio` no servidor.

## 🚀 Como Executar Localmente

1.  **Clone o repositório (ou tenha os arquivos em uma pasta):**
    ```bash
    git clone <url-do-repositorio>
    cd <pasta-do-projeto>
    ```

2.  **Instale as dependências do Python:**
    É recomendado criar um ambiente virtual primeiro.
    ```bash
    # Crie um ambiente virtual (opcional)
    python -m venv venv
    # Ative o ambiente
    # Windows
    .\venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate

    # Instale as dependências
    pip install -r requirements.txt
    ```

3.  **Execute a aplicação:**
    ```bash
    python app.py
    ```

4.  **Acesse no navegador:**
    Abra seu navegador e acesse `http://127.0.0.1:5000`.

## 🌐 Acessando de Outros Dispositivos (Serveo Tunneling)

Para acessar sua aplicação Spotifinho rodando localmente a partir de outros dispositivos (como seu celular) através da internet, você pode usar o Serveo para criar um túnel:

1.  **Certifique-se de que a aplicação está rodando:**
    Sua aplicação Spotifinho deve estar ativa e acessível em `http://localhost:5000` (ou a porta configurada).

2.  **Abra um novo terminal e crie o túnel:**
    Execute o seguinte comando em um terminal separado do que está rodando a aplicação:
    ```bash
    ssh -R 80:localhost:5000 serveo.net
    ```
    O Serveo irá gerar uma URL pública temporária (ex: `https://<nome-aleatorio>.serveo.net`).

3.  **Acesse a URL no seu dispositivo:**
    Use a URL fornecida pelo Serveo no navegador do seu celular ou de outro dispositivo para acessar o Spotifinho.