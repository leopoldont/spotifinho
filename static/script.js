document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsList = document.getElementById('resultsList');
    const audioPlayer = document.getElementById('audioPlayer');
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const currentTrackThumbnail = document.getElementById('currentTrackThumbnail');
    const playerInfo = document.getElementById('playerInfo');

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
            listItem.dataset.videoId = result.id;
            listItem.innerHTML = `
                <img src="${result.thumbnail}" alt="${result.title}" class="track-thumbnail" onerror="this.style.display='none';">
                <div class="info">
                    <h3>${result.title}</h3>
                    <p>${result.artist}</p>
                </div>
                <span class="duration">${result.duration}</span>
            `;
            listItem.addEventListener('click', () => playSong(result));
            resultsList.appendChild(listItem);
        });
    }

    async function playSong(track) {
        document.querySelectorAll('#resultsList li').forEach(item => {
            item.classList.remove('loading', 'playing');
        });

        const listItem = document.querySelector(`li[data-video-id="${track.id}"]`);
        if (listItem) {
            listItem.classList.add('loading');
        }

        try {
            const response = await fetch(`/api/stream?id=${encodeURIComponent(track.id)}`);
            const data = await response.json();

            if (listItem) listItem.classList.remove('loading');

            if (data.error) {
                alert(`Erro ao obter URL de streaming: ${data.error}`);
                return;
            }

            if (data.stream_url) {
                audioPlayer.src = data.stream_url;
                playerInfo.style.display = 'flex';
                currentTrackThumbnail.src = track.thumbnail;
                currentTrackThumbnail.style.display = 'block';
                currentTrackTitle.textContent = track.title;
                currentTrackArtist.textContent = track.artist;
                
                if (listItem) listItem.classList.add('playing');

                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("A reprodução automática foi impedida:", error);
                        if (listItem) listItem.classList.remove('playing');
                    });
                }
            } else {
                alert('Não foi possível obter o URL de streaming.');
            }
        } catch (error) {
            console.error('Erro ao reproduzir música:', error);
            alert('Erro ao reproduzir música.');
            if (listItem) {
                listItem.classList.remove('loading', 'playing');
            }
        }
    }

    currentTrackThumbnail.onerror = function() {
        this.style.display = 'none';
    };
});