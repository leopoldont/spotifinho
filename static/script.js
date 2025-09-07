document.addEventListener('DOMContentLoaded', () => {
    // Views
    const searchView = document.getElementById('searchView');
    const libraryView = document.getElementById('libraryView');
    const queueView = document.getElementById('queueView');

    // Navigation
    const navSearch = document.getElementById('navSearch');
    const navLibrary = document.getElementById('navLibrary');
    const navQueue = document.getElementById('navQueue');

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsList = document.getElementById('resultsList');

    // Library
    const libraryList = document.getElementById('libraryList');
    const libraryTitle = document.getElementById('libraryTitle');
    const libraryBackButton = document.getElementById('libraryBackButton');
    const createPlaylistButton = document.getElementById('createPlaylistButton');
    const libraryActions = document.getElementById('libraryActions');

    // Queue
    const queueList = document.getElementById('queueList');

    // Modal
    const addToPlaylistModal = document.getElementById('addToPlaylistModal');
    const modalPlaylistList = document.getElementById('modalPlaylistList');
    const closeButton = document.querySelector('.close-button');
    let trackToAdd = null;

    // Playlist Context Menu
    const playlistContextMenu = document.getElementById('playlistContextMenu');
    const renamePlaylistOption = document.getElementById('renamePlaylistOption');
    const deletePlaylistOption = document.getElementById('deletePlaylistOption');
    let activePlaylistForMenu = null;

    // Player
    const audioPlayer = document.getElementById('audioPlayer');
    const playerInfo = document.getElementById('playerInfo');
    const currentTrackThumbnail = document.getElementById('currentTrackThumbnail');
    const currentTrackTitle = document.getElementById('currentTrackTitle');
    const currentTrackArtist = document.getElementById('currentTrackArtist');

    // --- Queue ---
    let playQueue = [];

    // --- Local Storage ---
    const getPlaylists = () => {
        let data = JSON.parse(localStorage.getItem('spotifinho_data'));

        // Migration from old format (simple array of liked songs)
        const oldData = JSON.parse(localStorage.getItem('likedSongs'));
        if (oldData && Array.isArray(oldData)) {
            if (!data) data = {};
            if (!data.playlists) data.playlists = {};
            data.playlists['Músicas Curtidas'] = oldData;
            localStorage.removeItem('likedSongs'); // Remove old data
            savePlaylists(data.playlists);
        }

        if (!data || !data.playlists) {
            return { 'Músicas Curtidas': [] };
        }
        return data.playlists;
    };

    const savePlaylists = (playlists) => {
        localStorage.setItem('spotifinho_data', JSON.stringify({ playlists }));
    };

    const getLikedSongs = () => {
        const playlists = getPlaylists();
        return playlists['Músicas Curtidas'] || [];
    };

    const saveLikedSongs = (songs) => {
        const playlists = getPlaylists();
        playlists['Músicas Curtidas'] = songs;
        savePlaylists(playlists);
    };

    // --- Navigation ---
    navSearch.addEventListener('click', () => {
        searchView.style.display = 'block';
        libraryView.style.display = 'none';
        queueView.style.display = 'none';
        navSearch.classList.add('active');
        navLibrary.classList.remove('active');
        navQueue.classList.remove('active');
    });

    navLibrary.addEventListener('click', () => {
        searchView.style.display = 'none';
        libraryView.style.display = 'block';
        queueView.style.display = 'none';
        navSearch.classList.remove('active');
        navLibrary.classList.add('active');
        navQueue.classList.remove('active');
        showPlaylists();
    });

    navQueue.addEventListener('click', () => {
        searchView.style.display = 'none';
        libraryView.style.display = 'none';
        queueView.style.display = 'block';
        navSearch.classList.remove('active');
        navLibrary.classList.remove('active');
        navQueue.classList.add('active');
        showQueue();
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
    let currentLibraryView = 'playlists'; // 'playlists' or 'songs'

    function showPlaylists() {
        currentLibraryView = 'playlists';
        libraryTitle.textContent = 'Minha Biblioteca';
        libraryBackButton.style.display = 'none';
        libraryActions.style.display = 'block';
        libraryList.innerHTML = '';

        const playlists = getPlaylists();
        const playlistNames = Object.keys(playlists);

        if (playlistNames.length === 0) {
            libraryList.innerHTML = '<li>Nenhuma playlist encontrada.</li>';
            return;
        }

        playlistNames.forEach(name => {
            const listItem = document.createElement('li');
            listItem.className = 'playlist-item';
            listItem.innerHTML = `
                <div class="info">
                    <h3>${name}</h3>
                    <p>${playlists[name].length} músicas</p>
                </div>
            `;
            listItem.addEventListener('click', () => showPlaylistSongs(name));

            const threeDots = document.createElement('div');
            threeDots.className = 'playlist-actions';
            threeDots.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
            threeDots.addEventListener('click', (e) => {
                e.stopPropagation();
                showPlaylistMenu(e.currentTarget, name);
            });

            listItem.appendChild(threeDots);
            libraryList.appendChild(listItem);
        });
    }

    function showPlaylistMenu(button, playlistName) {
        // Can't edit the main liked songs playlist
        if (playlistName === 'Músicas Curtidas') return;

        activePlaylistForMenu = playlistName;
        const rect = button.getBoundingClientRect();
        playlistContextMenu.style.display = 'block';
        playlistContextMenu.style.top = `${rect.bottom}px`;
        playlistContextMenu.style.left = `${rect.left - playlistContextMenu.offsetWidth + rect.width}px`; // Align to the right

        // This function will handle closing the menu
        const closeMenuHandler = (event) => {
            // Close if the click is outside the menu that is being opened
            if (playlistContextMenu.style.display === 'block' && !playlistContextMenu.contains(event.target) && !button.contains(event.target)) {
                closePlaylistMenu();
            }
        };

        // Use a timeout to avoid the same click event that opened the menu from closing it immediately
        setTimeout(() => {
            document.addEventListener('click', closeMenuHandler);
        }, 0);

        // Make sure we remove the listener once the menu is closed
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'style' && playlistContextMenu.style.display === 'none') {
                    document.removeEventListener('click', closeMenuHandler);
                    observer.disconnect();
                }
            }
        });
        observer.observe(playlistContextMenu, { attributes: true });
    }

    function closePlaylistMenu() {
        playlistContextMenu.style.display = 'none';
        activePlaylistForMenu = null;
    }

    renamePlaylistOption.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!activePlaylistForMenu) return;
        const newName = prompt(`Digite o novo nome para a playlist "${activePlaylistForMenu}":`);
        if (newName && newName.trim() !== '') {
            renamePlaylist(activePlaylistForMenu, newName.trim());
        }
        closePlaylistMenu();
    });

    deletePlaylistOption.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!activePlaylistForMenu) return;
        const confirmation = confirm(`Deseja realmente excluir a playlist "${activePlaylistForMenu}"?`);
        if (confirmation) {
            deletePlaylist(activePlaylistForMenu);
        }
        closePlaylistMenu();
    });

    function renamePlaylist(oldName, newName) {
        const playlists = getPlaylists();
        if (playlists[newName]) {
            alert('Uma playlist com este nome já existe.');
            return;
        }
        playlists[newName] = playlists[oldName];
        delete playlists[oldName];
        savePlaylists(playlists);
        showPlaylists();
    }

    function deletePlaylist(playlistName) {
        const playlists = getPlaylists();
        delete playlists[playlistName];
        savePlaylists(playlists);
        showPlaylists();
    }

    function showPlaylistSongs(playlistName) {
        currentLibraryView = 'songs';
        libraryTitle.textContent = playlistName;
        libraryBackButton.style.display = 'block';
        libraryActions.style.display = 'none';
        
        const playlists = getPlaylists();
        const songs = playlists[playlistName] || [];
        displayResults(songs, libraryList, { playlistName: playlistName });
    }

    libraryBackButton.addEventListener('click', showPlaylists);

    createPlaylistButton.addEventListener('click', () => {
        const playlistName = prompt('Digite o nome da nova playlist:');
        if (playlistName && playlistName.trim() !== '') {
            const playlists = getPlaylists();
            if (!playlists[playlistName]) {
                playlists[playlistName] = [];
                savePlaylists(playlists);
                showPlaylists();
            } else {
                alert('Uma playlist com este nome já existe.');
            }
        }
    });

    // --- Queue Display ---
    let draggedIndex = -1;

    function showQueue() {
        queueList.innerHTML = '';
        if (playQueue.length === 0) {
            queueList.innerHTML = '<li>A fila de reprodução está vazia.</li>';
            return;
        }

        playQueue.forEach((track, index) => {
            const listItem = document.createElement('li');
            listItem.dataset.index = index;
            listItem.draggable = true;
            listItem.innerHTML = `
                <img src="${track.thumbnail}" alt="${track.title}" class="track-thumbnail">
                <div class="info">
                    <h3>${track.title}</h3>
                    <p>${track.artist}</p>
                </div>
                <div class="track-actions queue-actions">
                    <button class="queue-move-up" title="Mover para Cima"><i class="fas fa-arrow-up"></i></button>
                    <button class="queue-move-down" title="Mover para Baixo"><i class="fas fa-arrow-down"></i></button>
                    <button class="queue-remove" title="Remover da Fila"><i class="fas fa-times"></i></button>
                </div>
            `;

            // Click to play
            listItem.querySelector('.info').addEventListener('click', () => {
                // To play a song from the queue, we move it to the top and play it
                const toPlay = playQueue.splice(index, 1)[0];
                playQueue.unshift(toPlay);
                playSong(playQueue.shift());
                showQueue(); // Refresh queue to show new order
            });

            // Action buttons
            listItem.querySelector('.queue-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                playQueue.splice(index, 1);
                showQueue();
            });

            listItem.querySelector('.queue-move-up').addEventListener('click', (e) => {
                e.stopPropagation();
                if (index > 0) {
                    const [item] = playQueue.splice(index, 1);
                    playQueue.splice(index - 1, 0, item);
                    showQueue();
                }
            });

            listItem.querySelector('.queue-move-down').addEventListener('click', (e) => {
                e.stopPropagation();
                if (index < playQueue.length - 1) {
                    const [item] = playQueue.splice(index, 1);
                    playQueue.splice(index + 1, 0, item);
                    showQueue();
                }
            });

            // Drag and Drop
            listItem.addEventListener('dragstart', (e) => {
                draggedIndex = index;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => listItem.classList.add('dragging'), 0);
            });

            listItem.addEventListener('dragend', () => {
                listItem.classList.remove('dragging');
            });

            queueList.appendChild(listItem);
        });
    }

    queueList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(queueList, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            queueList.appendChild(dragging);
        } else {
            queueList.insertBefore(dragging, afterElement);
        }
    });

    queueList.addEventListener('drop', (e) => {
        e.preventDefault();
        const droppedOn = e.target.closest('li');
        if (!droppedOn) return;
        const droppedIndex = parseInt(droppedOn.dataset.index);
        
        const [draggedItem] = playQueue.splice(draggedIndex, 1);
        playQueue.splice(droppedIndex, 0, draggedItem);
        
        showQueue();
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- Modal Logic ---
    function openAddToPlaylistModal(track) {
        trackToAdd = track;
        modalPlaylistList.innerHTML = '';
        const playlists = getPlaylists();
        const playlistNames = Object.keys(playlists);

        playlistNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            li.addEventListener('click', () => {
                addTrackToPlaylist(name);
            });
            modalPlaylistList.appendChild(li);
        });

        addToPlaylistModal.style.display = 'flex';
    }

    function closeAddToPlaylistModal() {
        addToPlaylistModal.style.display = 'none';
        trackToAdd = null;
    }

    function addTrackToPlaylist(playlistName) {
        const playlists = getPlaylists();
        // Avoid duplicates
        if (!playlists[playlistName].some(song => song.id === trackToAdd.id)) {
            playlists[playlistName].push(trackToAdd);
            savePlaylists(playlists);
        }
        closeAddToPlaylistModal();
    }

    closeButton.addEventListener('click', closeAddToPlaylistModal);
    window.addEventListener('click', (event) => {
        if (event.target == addToPlaylistModal) {
            closeAddToPlaylistModal();
        }
    });

    // --- Display ---
    function displayResults(results, targetList, options = {}) {
        targetList.innerHTML = '';
        if (results.length === 0) {
            targetList.innerHTML = '<li>Nenhuma música encontrada.</li>';
            if (options.playlistName === 'Músicas Curtidas') {
                targetList.innerHTML = '<li>Nenhuma música na sua biblioteca. Curta algumas para começar!</li>';
            }
            return;
        }

        const likedSongs = getLikedSongs();

        results.forEach((result, index) => {
            const isLiked = likedSongs.some(song => song.id === result.id);
            const listItem = document.createElement('li');
            listItem.dataset.videoId = result.id;

            let actionsHtml = `
                <button class="like-button ${isLiked ? 'liked' : ''}" title="Salvar na Biblioteca">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="add-to-queue-button" title="Adicionar à Fila">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="add-to-playlist-button" title="Adicionar à Playlist">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            `;

            // If showing songs from a playlist, add a remove button
            if (options.playlistName) {
                actionsHtml += `
                    <button class="remove-from-playlist-button" title="Remover da Playlist">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            }

            listItem.innerHTML = `
                <img src="${result.thumbnail}" alt="${result.title}" class="track-thumbnail">
                <div class="info">
                    <h3>${result.title}</h3>
                    <p>${result.artist}</p>
                </div>
                <div class="track-actions">
                    ${actionsHtml}
                </div>
                <span class="duration">${result.duration}</span>
            `;

            // Click to play
            listItem.querySelector('.info').addEventListener('click', () => playSong(result));
            listItem.querySelector('.track-thumbnail').addEventListener('click', () => playSong(result));

            // Action buttons
            const likeButton = listItem.querySelector('.like-button');
            if (likeButton) {
                likeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleLike(result, likeButton);
                });
            }

            const addToQueueButton = listItem.querySelector('.add-to-queue-button');
            if (addToQueueButton) {
                addToQueueButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToQueue(result, addToQueueButton);
                });
            }

            const addToPlaylistButton = listItem.querySelector('.add-to-playlist-button');
            if (addToPlaylistButton) {
                addToPlaylistButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openAddToPlaylistModal(result);
                });
            }

            const removeFromPlaylistButton = listItem.querySelector('.remove-from-playlist-button');
            if (removeFromPlaylistButton) {
                removeFromPlaylistButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeSongFromPlaylist(result.id, options.playlistName, index);
                });
            }

            targetList.appendChild(listItem);
        });
    }

    function removeSongFromPlaylist(songId, playlistName) {
        const playlists = getPlaylists();
        if (!playlists[playlistName]) return;

        const songIndex = playlists[playlistName].findIndex(song => song.id === songId);
        if (songIndex > -1) {
            playlists[playlistName].splice(songIndex, 1);
            savePlaylists(playlists);
            // Refresh the view
            showPlaylistSongs(playlistName);
        }
    }

    // --- Player & Actions ---
    async function playSong(track) {
        // If the track already has a local path, just play it.
        if (track.preloaded_path) {
            audioPlayer.src = track.preloaded_path;
            updatePlayerUI(track);
            startPlayback(track);
            return; // Skip fetching from API
        }

        // Otherwise, fetch the stream URL as before.
        try {
            const response = await fetch(`/api/stream?id=${encodeURIComponent(track.id)}`);
            const data = await response.json();

            if (data.error) {
                alert(`Erro ao obter URL de streaming: ${data.error}`);
                return;
            }

            if (data.stream_url) {
                audioPlayer.src = data.stream_url;
                updatePlayerUI(track);
                startPlayback(track);
            } else {
                alert('Não foi possível obter o URL de streaming.');
            }
        } catch (error) {
            console.error('Erro ao reproduzir música:', error);
            alert('Erro ao reproduzir música.');
            clearPlayingUI(track);
        }
    }

    function updatePlayerUI(track) {
        document.querySelectorAll('.results-list li, .library-items-list li').forEach(item => {
            item.classList.remove('playing');
        });

        const listItemInSearch = document.querySelector(`#resultsList li[data-video-id="${track.id}"]`);
        const listItemInLibrary = document.querySelector(`#libraryList li[data-video-id="${track.id}"]`);

        playerInfo.style.display = 'flex';
        currentTrackThumbnail.src = track.thumbnail;
        currentTrackThumbnail.style.display = 'block';
        currentTrackTitle.textContent = track.title;
        currentTrackArtist.textContent = track.artist;

        if (listItemInSearch) listItemInSearch.classList.add('playing');
        if (listItemInLibrary) listItemInLibrary.classList.add('playing');
    }

    function startPlayback(track) {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Preload the next song only after the current one starts playing successfully
                preloadNextSongInQueue();
            }).catch(error => {
                console.error("A reprodução automática foi impedida:", error);
                clearPlayingUI(track);
            });
        }
    }

    function clearPlayingUI(track) {
        const listItemInSearch = document.querySelector(`#resultsList li[data-video-id="${track.id}"]`);
        const listItemInLibrary = document.querySelector(`#libraryList li[data-video-id="${track.id}"]`);
        if (listItemInSearch) listItemInSearch.classList.remove('playing');
        if (listItemInLibrary) listItemInLibrary.classList.remove('playing');
    }

    async function preloadNextSongInQueue() {
        if (playQueue.length > 0) {
            const nextTrack = playQueue[0]; // Peek at the next track
            if (nextTrack && !nextTrack.preloaded_path) {
                console.log(`Pré-carregando: ${nextTrack.title}`);
                try {
                    const response = await fetch('/api/preload', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: nextTrack.id }),
                    });
                    const data = await response.json();
                    if (data.preloaded_path) {
                        // Update the track object in the queue with the preloaded path
                        nextTrack.preloaded_path = data.preloaded_path;
                        console.log(`Pré-carregado com sucesso: ${nextTrack.title}`);
                    }
                } catch (error) {
                    console.error('Falha no pré-carregamento:', error);
                }
            }
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

        // If we are in the library, viewing the liked songs playlist, refresh the view
        if (libraryView.style.display === 'block' && currentLibraryView === 'songs' && libraryTitle.textContent === 'Músicas Curtidas') {
            showPlaylistSongs('Músicas Curtidas');
        }
    }

    function addToQueue(track, button) {
        playQueue.push(track);
        
        // Visual feedback on the button
        if (button) {
            button.classList.add('added');
            setTimeout(() => {
                button.classList.remove('added');
            }, 1000);
        }

        // If queue view is active, refresh it
        if (queueView.style.display === 'block') {
            showQueue();
        }
    }

    audioPlayer.addEventListener('ended', () => {
        if (playQueue.length > 0) {
            const nextTrack = playQueue.shift(); // Get the next track and remove it from the queue
            playSong(nextTrack);
            // The call to preloadNextSongInQueue() is now inside playSong(), so it's handled automatically.
        } else {
            // Optional: Clear player UI when the queue is empty
            playerInfo.style.display = 'none';
            currentTrackThumbnail.style.display = 'none';
            document.querySelectorAll('.results-list li, .library-items-list li').forEach(item => {
                item.classList.remove('playing');
            });
        }
    });

    currentTrackThumbnail.onerror = function() {
        this.style.display = 'none';
    };

    // Initial load
    showPlaylists();
});