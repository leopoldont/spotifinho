document.addEventListener('DOMContentLoaded', () => {
    // Views
    const searchView = document.getElementById('searchView');
    const libraryView = document.getElementById('libraryView');

    // Navigation
    const navSearch = document.getElementById('navSearch');
    const navLibrary = document.getElementById('navLibrary');

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsList = document.getElementById('resultsList');

    // Library
    const libraryList = document.getElementById('libraryList');

    // Player
    const audioPlayer = document.getElementById('audioPlayer');
    const playerInfo = document.getElementById('playerInfo');
    const currentTrackThumbnail = document.getElementById('currentTrackThumbnail');
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');

    // --- Local Storage ---
    const getLikedSongs = () => {
        return JSON.parse(localStorage.getItem('likedSongs') || '[]');
    };

    const saveLikedSongs = (songs) => {
        localStorage.setItem('likedSongs', JSON.stringify(songs));
    };

    // --- Navigation ---
    navSearch.addEventListener('click', () => {
        searchView.style.display = 'block';
        libraryView.style.display = 'none';
        navSearch.classList.add('active');
        navLibrary.classList.remove('active');
    });

    navLibrary.addEventListener('click', () => {
        searchView.style.display = 'none';
        libraryView.style.display = 'block';
        navSearch.classList.remove('active');
        navLibrary.classList.add('active');
        loadLibrary();
    });

    // --- Search ---
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

            displayResults(data, resultsList);
        } catch (error) {
            console.error('Erro na busca:', error);
            resultsList.innerHTML = '<li style="color: red;">Erro ao buscar músicas.</li>';
        }
    }

    // --- Library ---
    function loadLibrary() {
        const likedSongs = getLikedSongs();
        displayResults(likedSongs, libraryList);
    }

    // --- Display ---
    function displayResults(results, targetList) {
        targetList.innerHTML = '';
        if (results.length === 0) {
            targetList.innerHTML = '<li>Nenhuma música na sua biblioteca. Curta algumas para começar!</li>';
            return;
        }

        const likedSongs = getLikedSongs();

        results.forEach(result => {
            const isLiked = likedSongs.some(song => song.id === result.id);
            const listItem = document.createElement('li');
            listItem.dataset.videoId = result.id;
            listItem.innerHTML = `
                <img src="${result.thumbnail}" alt="${result.title}" class="track-thumbnail">
                <div class="info">
                    <h3>${result.title}</h3>
                    <p>${result.artist}</p>
                </div>
                <div class="track-actions">
                    <button class="like-button ${isLiked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <span class="duration">${result.duration}</span>
            `;

            // Click to play
            listItem.querySelector('.info').addEventListener('click', () => playSong(result));
            listItem.querySelector('.track-thumbnail').addEventListener('click', () => playSong(result));

            // Click to like
            const likeButton = listItem.querySelector('.like-button');
            likeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLike(result, likeButton);
            });

            targetList.appendChild(listItem);
        });
    }

    // --- Player & Actions ---
    async function playSong(track) {
        document.querySelectorAll('.results-list li').forEach(item => {
            item.classList.remove('loading', 'playing');
        });

        const listItemInSearch = document.querySelector(`#resultsList li[data-video-id="${track.id}"]`);
        const listItemInLibrary = document.querySelector(`#libraryList li[data-video-id="${track.id}"]`);

        if (listItemInSearch) listItemInSearch.classList.add('loading');
        if (listItemInLibrary) listItemInLibrary.classList.add('loading');

        try {
            const response = await fetch(`/api/stream?id=${encodeURIComponent(track.id)}`);
            const data = await response.json();

            if (listItemInSearch) listItemInSearch.classList.remove('loading');
            if (listItemInLibrary) listItemInLibrary.classList.remove('loading');

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

                if (listItemInSearch) listItemInSearch.classList.add('playing');
                if (listItemInLibrary) listItemInLibrary.classList.add('playing');

                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("A reprodução automática foi impedida:", error);
                        if (listItemInSearch) listItemInSearch.classList.remove('playing');
                        if (listItemInLibrary) listItemInLibrary.classList.remove('playing');
                    });
                }
            } else {
                alert('Não foi possível obter o URL de streaming.');
            }
        } catch (error) {
            console.error('Erro ao reproduzir música:', error);
            alert('Erro ao reproduzir música.');
            if (listItemInSearch) listItemInSearch.classList.remove('loading', 'playing');
            if (listItemInLibrary) listItemInLibrary.classList.remove('loading', 'playing');
        }
    }

    function toggleLike(track, likeButton) {
        let likedSongs = getLikedSongs();
        const songIndex = likedSongs.findIndex(song => song.id === track.id);

        if (songIndex > -1) {
            likedSongs.splice(songIndex, 1);
            likeButton.classList.remove('liked');
        } else {
            likedSongs.push(track);
            likeButton.classList.add('liked');
        }

        saveLikedSongs(likedSongs);

        // If we are in the library view, refresh it to show the change
        if (libraryView.style.display === 'block') {
            loadLibrary();
        }
    }

    currentTrackThumbnail.onerror = function() {
        this.style.display = 'none';
    };

    // Initial load
    loadLibrary();
});