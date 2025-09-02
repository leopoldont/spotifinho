document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsList = document.getElementById('resultsList');
    const audioPlayer = document.getElementById('audioPlayer');

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            resultsList.innerHTML = '<li style="color: red;">Por favor, digite algo para pesquisar.</li>';
            return;
        }

        resultsList.innerHTML = '<li>Buscando...</li>';
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.error) {
                resultsList.innerHTML = `<li style="color: red;">${data.error}</li>`;
                return;
            }

            displayResults(data);
        } catch (error) {
            console.error('Erro na busca:', error);
            resultsList.innerHTML = '<li style="color: red;">Erro ao buscar músicas.</li>';
        }
    }

    function displayResults(results) {
        resultsList.innerHTML = '';
        if (results.length === 0) {
            resultsList.innerHTML = '<li>Nenhum resultado encontrado.</li>';
            return;
        }

        results.forEach(result => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${result.thumbnail}" alt="${result.title}">
                <div class="info">
                    <h3>${result.title}</h3>
                    <p>${result.artist}</p>
                </div>
                <span class="duration">${result.duration}</span>
            `;
            listItem.addEventListener('click', () => playSong(result.id));
            resultsList.appendChild(listItem);
        });
    }

    async function playSong(videoId) {
        try {
            const response = await fetch(`/api/stream?id=${encodeURIComponent(videoId)}`);
            const data = await response.json();

            if (data.error) {
                alert(`Erro ao obter URL de streaming: ${data.error}`);
                return;
            }

            if (data.stream_url) {
                audioPlayer.src = data.stream_url;
                audioPlayer.play();
            } else {
                alert('Não foi possível obter o URL de streaming.');
            }
        } catch (error) {
            console.error('Erro ao reproduzir música:', error);
            alert('Erro ao reproduzir música.');
        }
    }
});
