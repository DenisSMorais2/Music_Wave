 // Enhanced MP3 Player with full functionality
        class EnhancedMP3Player {
            constructor() {
                this.songs = [];
                this.playlists = [];
                this.likedSongs = new Set();
                this.currentSongIndex = 0;
                this.currentPlaylist = null;
                this.isPlaying = false;
                this.isShuffling = false;
                this.repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
                this.currentVolume = 0.7;
                this.userProfile = {
                    name: 'User',
                    avatar: null
                };
                
                this.init();
            }
            
            init() {
                this.cacheDOMElements();
                this.bindEvents();
                this.loadUserData();
                this.updateGreeting();
                this.updateVolumeIcon();
                if (this.audioPlayer) {
                    this.audioPlayer.volume = this.currentVolume;
                }
            }
            
            cacheDOMElements() {
                // Audio and file elements
                this.audioPlayer = document.getElementById('audio-player');
                this.fileInput = document.getElementById('file-input');
                this.avatarInput = document.getElementById('avatar-input');
                
                // Containers
                this.songsContainer = document.getElementById('songs-container');
                this.searchResultsContainer = document.getElementById('search-results-container');
                this.libraryContent = document.getElementById('library-content');
                this.playlistList = document.getElementById('playlist-list');
                
                // Control buttons
                this.playBtn = document.getElementById('play-btn');
                this.prevBtn = document.getElementById('prev-btn');
                this.nextBtn = document.getElementById('next-btn');
                this.shuffleBtn = document.getElementById('shuffle-btn');
                this.repeatBtn = document.getElementById('repeat-btn');
                
                // Progress and time
                this.progressBar = document.getElementById('progress-bar');
                this.currentTimeSpan = document.getElementById('current-time');
                this.durationSpan = document.getElementById('duration');
                
                // Volume and current song info
                this.volumeControl = document.getElementById('volume-control');
                this.volumeBtn = document.getElementById('volume-btn');
                this.currentSongTitle = document.getElementById('current-song-title');
                this.currentSongArtist = document.getElementById('current-song-artist');
                this.currentAlbumArt = document.getElementById('current-album-art-img');
                this.likeBtn = document.getElementById('like-btn');
                
                // UI elements
                this.fab = document.getElementById('fab');
                this.menuToggle = document.getElementById('menu-toggle');
                this.sidebar = document.getElementById('sidebar');
                this.overlay = document.getElementById('overlay');
                this.uploadBtn = document.getElementById('upload-btn');
                this.searchInput = document.getElementById('search-input');
                
                // Modals
                this.nowPlayingModal = document.getElementById('now-playing-modal');
                this.playlistModal = document.getElementById('playlist-modal');
                this.addToPlaylistModal = document.getElementById('add-to-playlist-modal');
                this.profileModal = document.getElementById('profile-modal');
                
                // User profile elements
                this.userProfile = document.getElementById('user-profile');
                this.userDropdown = document.getElementById('user-dropdown');
                this.userName = document.getElementById('user-name');
                this.userAvatar = document.getElementById('user-avatar');
            }
            
            bindEvents() {
                // Navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.switchTab(item.dataset.tab);
                    });
                });

                // Mobile menu
                this.menuToggle?.addEventListener('click', () => this.toggleMobileMenu());
                this.overlay?.addEventListener('click', () => this.closeMobileMenu());
                this.fab?.addEventListener('click', () => this.uploadBtn.click());

                // Player controls
                this.playBtn?.addEventListener('click', () => this.togglePlay());
                this.prevBtn?.addEventListener('click', () => this.previousSong());
                this.nextBtn?.addEventListener('click', () => this.nextSong());
                this.shuffleBtn?.addEventListener('click', () => this.toggleShuffle());
                this.repeatBtn?.addEventListener('click', () => this.toggleRepeat());
                this.likeBtn?.addEventListener('click', () => this.toggleLike());

                // Audio events
                this.audioPlayer?.addEventListener('loadedmetadata', () => this.updateDuration());
                this.audioPlayer?.addEventListener('timeupdate', () => this.updateProgress());
                this.audioPlayer?.addEventListener('ended', () => this.handleSongEnd());

                // Progress bar
                this.progressBar?.addEventListener('input', () => this.seekTo());

                // Volume control
                this.volumeControl?.addEventListener('input', () => this.adjustVolume());
                this.volumeBtn?.addEventListener('click', () => this.toggleMute());

                // File upload
                this.uploadBtn?.addEventListener('click', () => this.fileInput?.click());
                this.fileInput?.addEventListener('change', (e) => this.handleFileUpload(e));

                // Search
                this.searchInput?.addEventListener('input', () => this.handleSearch());

                // User profile
                this.userProfile?.addEventListener('click', () => this.toggleUserDropdown());
                document.getElementById('profile-btn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showProfileModal();
                });

                // Avatar upload
                document.getElementById('upload-avatar-btn')?.addEventListener('click', () => {
                    this.avatarInput?.click();
                });
                this.avatarInput?.addEventListener('change', (e) => this.handleAvatarUpload(e));

                // Playlist creation
                document.getElementById('create-playlist-btn')?.addEventListener('click', () => this.showCreatePlaylistModal());
                document.getElementById('cancel-playlist-btn')?.addEventListener('click', () => this.hideCreatePlaylistModal());
                document.getElementById('create-playlist-confirm-btn')?.addEventListener('click', () => this.createNewPlaylist());

                // Now playing modal
                document.getElementById('close-now-playing')?.addEventListener('click', () => this.hideNowPlayingModal());

                // Profile modal
                document.getElementById('cancel-profile-btn')?.addEventListener('click', () => this.hideProfileModal());
                document.getElementById('save-profile-btn')?.addEventListener('click', () => this.saveProfile());

                // Add to playlist modal
                document.getElementById('cancel-add-playlist-btn')?.addEventListener('click', () => this.hideAddToPlaylistModal());

                // Filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', () => this.filterLibrary(btn.dataset.filter));
                });

                // Close dropdowns when clicking outside
                document.addEventListener('click', (e) => {
                    if (!this.userProfile?.contains(e.target)) {
                        this.hideUserDropdown();
                    }
                });
            }
            
            switchTab(tabName) {
                // Update navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active', 'text-white');
                    item.classList.add('text-gray-400');
                });
                
                const activeNavItem = document.querySelector(`[data-tab="${tabName}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.add('active', 'text-white');
                    activeNavItem.classList.remove('text-gray-400');
                }

                // Update content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const activeContent = document.getElementById(`${tabName}-tab`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }

                // Load tab-specific content
                if (tabName === 'search') {
                    this.updateSearchResults();
                } else if (tabName === 'library') {
                    this.updateLibraryContent();
                }

                this.closeMobileMenu();
            }
            
            toggleMobileMenu() {
                this.sidebar?.classList.toggle('active');
                this.overlay?.classList.toggle('active');
            }

            closeMobileMenu() {
                this.sidebar?.classList.remove('active');
                this.overlay?.classList.remove('active');
            }
            
            handleFileUpload(event) {
                const files = Array.from(event.target.files);
                
                files.forEach(file => {
                    if (file.type.startsWith('audio/')) {
                        const song = {
                            id: Date.now() + Math.random(),
                            title: file.name.replace(/\.[^/.]+$/, ""),
                            artist: 'Unknown Artist',
                            album: 'Unknown Album',
                            duration: 0,
                            file: file,
                            url: URL.createObjectURL(file),
                            albumArt: null,
                            liked: false,
                            addedDate: new Date()
                        };

                        // Try to extract metadata
                        if (window.jsmediatags) {
                            window.jsmediatags.read(file, {
                                onSuccess: (tag) => {
                                    if (tag.tags.title) song.title = tag.tags.title;
                                    if (tag.tags.artist) song.artist = tag.tags.artist;
                                    if (tag.tags.album) song.album = tag.tags.album;
                                    if (tag.tags.picture) {
                                        const base64String = this.arrayBufferToBase64(tag.tags.picture.data);
                                        song.albumArt = `data:${tag.tags.picture.format};base64,${base64String}`;
                                    }
                                    this.updateAllDisplays();
                                },
                                onError: (error) => {
                                    console.log('Error reading tags:', error);
                                }
                            });
                        }

                        this.songs.push(song);
                    }
                });

                this.updateAllDisplays();
                this.saveUserData();
                event.target.value = '';
            }
            
            arrayBufferToBase64(buffer) {
                let binary = '';
                const bytes = new Uint8Array(buffer);
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            }
            
            updateAllDisplays() {
                this.updateSongsDisplay();
                this.updateSearchResults();
                this.updateLibraryContent();
                this.updateUserStats();
            }

            updateSongsDisplay() {
                if (!this.songsContainer) return;
                
                this.songsContainer.innerHTML = '';
                this.songs.slice(0, 10).forEach((song, index) => {
                    const songCard = this.createSongCard(song, index);
                    this.songsContainer.appendChild(songCard);
                });
            }

            updateSearchResults() {
                if (!this.searchResultsContainer) return;
                
                const query = this.searchInput?.value?.toLowerCase() || '';
                const filteredSongs = query ? 
                    this.songs.filter(song => 
                        song.title.toLowerCase().includes(query) ||
                        song.artist.toLowerCase().includes(query) ||
                        song.album.toLowerCase().includes(query)
                    ) : this.songs;

                this.searchResultsContainer.innerHTML = '';
                filteredSongs.forEach((song, index) => {
                    const songCard = this.createSongCard(song, this.songs.indexOf(song));
                    this.searchResultsContainer.appendChild(songCard);
                });
            }

            updateLibraryContent() {
                if (!this.libraryContent) return;
                
                this.libraryContent.innerHTML = '';
                
                // Add playlists section
                const playlistsSection = document.createElement('div');
                playlistsSection.className = 'mb-8';
                playlistsSection.innerHTML = `
                    <h3 class="text-xl font-bold mb-4">Your Playlists</h3>
                    <div id="library-playlists" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
                `;
                this.libraryContent.appendChild(playlistsSection);
                
                const playlistsGrid = document.getElementById('library-playlists');
                
                // Liked Songs playlist
                const likedPlaylist = this.createPlaylistCard({
                    name: 'Liked Songs',
                    songs: Array.from(this.likedSongs),
                    cover: null,
                    isLiked: true
                });
                playlistsGrid.appendChild(likedPlaylist);
                
                // User playlists
                this.playlists.forEach(playlist => {
                    const playlistCard = this.createPlaylistCard(playlist);
                    playlistsGrid.appendChild(playlistCard);
                });

                // Add songs section
                const songsSection = document.createElement('div');
                songsSection.innerHTML = `
                    <h3 class="text-xl font-bold mb-4">All Songs</h3>
                    <div id="library-songs" class="space-y-2"></div>
                `;
                this.libraryContent.appendChild(songsSection);
                
                const songsGrid = document.getElementById('library-songs');
                this.songs.forEach((song, index) => {
                    const songItem = this.createLibrarySongItem(song, index);
                    songsGrid.appendChild(songItem);
                });
            }

            createSongCard(song, index) {
                const card = document.createElement('div');
                card.className = 'song-card bg-gray-800 p-4 rounded hover:bg-gray-700 transition cursor-pointer group';
                
                const albumArt = song.albumArt ? 
                    `<img src="${song.albumArt}" alt="Album Art" class="absolute inset-0 w-full h-full object-cover rounded">` :
                    '<i class="fas fa-music text-white text-3xl"></i>';
                
                card.innerHTML = `
                    <div class="album-art relative mb-4 pt-[100%] bg-gradient-to-br from-purple-500 to-blue-500 rounded overflow-hidden">
                        ${albumArt}
                        <div class="play-overlay">
                            <button class="play-song-btn bg-green-500 rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition" data-index="${index}">
                                <i class="fas fa-play text-white ml-1"></i>
                            </button>
                        </div>
                    </div>
                    <h3 class="font-medium mb-1 truncate">${song.title}</h3>
                    <p class="text-sm text-gray-400 truncate">${song.artist}</p>
                `;

                card.querySelector('.play-song-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.playSong(index);
                });

                return card;
            }

            createPlaylistCard(playlist) {
                const card = document.createElement('div');
                card.className = 'song-card bg-gray-800 p-4 rounded hover:bg-gray-700 transition cursor-pointer group';
                
                const songCount = playlist.isLiked ? this.likedSongs.size : playlist.songs.length;
                const cover = playlist.cover || (playlist.isLiked ? 
                    '<i class="fas fa-heart text-purple-500 text-3xl"></i>' :
                    '<i class="fas fa-music text-white text-3xl"></i>');
                
                card.innerHTML = `
                    <div class="album-art relative mb-4 pt-[100%] bg-gradient-to-br from-purple-500 to-blue-500 rounded overflow-hidden">
                        ${typeof cover === 'string' && cover.startsWith('data:') ? 
                            `<img src="${cover}" alt="Playlist Cover" class="absolute inset-0 w-full h-full object-cover rounded">` : 
                            `<div class="absolute inset-0 flex items-center justify-center">${cover}</div>`}
                        <div class="play-overlay">
                            <button class="play-playlist-btn bg-green-500 rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition">
                                <i class="fas fa-play text-white ml-1"></i>
                            </button>
                        </div>
                    </div>
                    <h3 class="font-medium mb-1 truncate">${playlist.name}</h3>
                    <p class="text-sm text-gray-400 truncate">${songCount} songs</p>
                `;

                card.querySelector('.play-playlist-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.playPlaylist(playlist);
                });

                return card;
            }

            createLibrarySongItem(song, index) {
                const item = document.createElement('div');
                item.className = 'playlist-item flex items-center p-3 rounded hover:bg-gray-800 cursor-pointer group';
                
                const albumArt = song.albumArt ? 
                    `<img src="${song.albumArt}" alt="Album Art" class="w-full h-full object-cover rounded">` :
                    '<i class="fas fa-music text-white"></i>';
                
                item.innerHTML = `
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded mr-4 flex items-center justify-center relative overflow-hidden">
                        ${albumArt}
                        <button class="play-song-btn absolute inset-0 bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition" data-index="${index}">
                            <i class="fas fa-play text-white text-sm"></i>
                        </button>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium truncate">${song.title}</h4>
                        <p class="text-sm text-gray-400 truncate">${song.artist}</p>
                    </div>
                    <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
                        <button class="like-song-btn text-gray-400 hover:text-green-500" data-index="${index}">
                            <i class="fa${song.liked ? 's' : 'r'} fa-heart"></i>
                        </button>
                        <button class="add-to-playlist-btn text-gray-400 hover:text-white" data-index="${index}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                `;

                item.querySelector('.play-song-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.playSong(index);
                });

                item.querySelector('.like-song-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleSongLike(index);
                });

                item.querySelector('.add-to-playlist-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showAddToPlaylistModal(index);
                });

                return item;
            }

            playSong(index) {
                if (index >= 0 && index < this.songs.length) {
                    this.currentSongIndex = index;
                    const song = this.songs[index];
                    
                    if (song.url) {
                        this.audioPlayer.src = song.url;
                        this.audioPlayer.load();
                        this.audioPlayer.play().then(() => {
                            this.isPlaying = true;
                            this.updatePlayButton();
                            this.updateCurrentSongInfo();
                            this.updateNowPlayingModal();
                        }).catch(error => {
                            console.error('Error playing song:', error);
                        });
                    }
                }
            }

            playPlaylist(playlist) {
                if (playlist.isLiked) {
                    const likedSongIds = Array.from(this.likedSongs);
                    if (likedSongIds.length > 0) {
                        const firstLikedSong = this.songs.find(song => song.id === likedSongIds[0]);
                        if (firstLikedSong) {
                            const index = this.songs.indexOf(firstLikedSong);
                            this.playSong(index);
                        }
                    }
                } else if (playlist.songs.length > 0) {
                    const firstSong = this.songs.find(song => song.id === playlist.songs[0]);
                    if (firstSong) {
                        const index = this.songs.indexOf(firstSong);
                        this.playSong(index);
                    }
                }
            }

            togglePlay() {
                if (this.songs.length === 0) return;

                if (this.isPlaying) {
                    this.audioPlayer.pause();
                    this.isPlaying = false;
                } else {
                    if (this.audioPlayer.src) {
                        this.audioPlayer.play().then(() => {
                            this.isPlaying = true;
                        }).catch(error => {
                            console.error('Error playing song:', error);
                        });
                    } else {
                        this.playSong(0);
                    }
                }
                this.updatePlayButton();
                this.updateNowPlayingModal();
            }

            previousSong() {
                if (this.songs.length === 0) return;
                
                let newIndex;
                if (this.isShuffling) {
                    newIndex = Math.floor(Math.random() * this.songs.length);
                } else {
                    newIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.songs.length - 1;
                }
                this.playSong(newIndex);
            }

            nextSong() {
                if (this.songs.length === 0) return;
                
                let newIndex;
                if (this.isShuffling) {
                    newIndex = Math.floor(Math.random() * this.songs.length);
                } else {
                    newIndex = this.currentSongIndex < this.songs.length - 1 ? this.currentSongIndex + 1 : 0;
                }
                this.playSong(newIndex);
            }

            toggleShuffle() {
                this.isShuffling = !this.isShuffling;
                this.shuffleBtn?.classList.toggle('text-green-500', this.isShuffling);
                this.shuffleBtn?.classList.toggle('text-gray-400', !this.isShuffling);
                this.updateNowPlayingModal();
            }

            toggleRepeat() {
                this.repeatMode = (this.repeatMode + 1) % 3;
                const icon = this.repeatBtn?.querySelector('i');
                
                switch (this.repeatMode) {
                    case 0:
                        this.repeatBtn?.classList.remove('text-green-500');
                        this.repeatBtn?.classList.add('text-gray-400');
                        if (icon) icon.className = 'fas fa-redo';
                        break;
                    case 1:
                        this.repeatBtn?.classList.add('text-green-500');
                        this.repeatBtn?.classList.remove('text-gray-400');
                        if (icon) icon.className = 'fas fa-redo';
                        break;
                    case 2:
                        this.repeatBtn?.classList.add('text-green-500');
                        this.repeatBtn?.classList.remove('text-gray-400');
                        if (icon) icon.className = 'fas fa-redo-alt';
                        break;
                }
                this.updateNowPlayingModal();
            }

            toggleLike() {
                if (this.songs.length === 0 || this.currentSongIndex < 0) return;
                this.toggleSongLike(this.currentSongIndex);
            }

            toggleSongLike(index) {
                if (index >= 0 && index < this.songs.length) {
                    const song = this.songs[index];
                    song.liked = !song.liked;
                    
                    if (song.liked) {
                        this.likedSongs.add(song.id);
                    } else {
                        this.likedSongs.delete(song.id);
                    }
                    
                    this.updateLikeButton();
                    this.updateAllDisplays();
                    this.saveUserData();
                }
            }

            handleSongEnd() {
                switch (this.repeatMode) {
                    case 2: // Repeat one
                        this.audioPlayer.currentTime = 0;
                        this.audioPlayer.play();
                        break;
                    case 1: // Repeat all
                        this.nextSong();
                        break;
                    default: // No repeat
                        if (this.currentSongIndex < this.songs.length - 1) {
                            this.nextSong();
                        } else {
                            this.isPlaying = false;
                            this.updatePlayButton();
                        }
                        break;
                }
            }

            updatePlayButton() {
                if (this.playBtn) {
                    const icon = this.playBtn.querySelector('i');
                    if (this.isPlaying) {
                        icon.className = 'fas fa-pause text-sm';
                    } else {
                        icon.className = 'fas fa-play text-sm';
                    }
                }
            }

            updateCurrentSongInfo() {
                if (this.songs.length > 0 && this.currentSongIndex >= 0) {
                    const song = this.songs[this.currentSongIndex];
                    if (this.currentSongTitle) this.currentSongTitle.textContent = song.title;
                    if (this.currentSongArtist) this.currentSongArtist.textContent = song.artist;
                    
                    if (this.currentAlbumArt) {
                        if (song.albumArt) {
                            this.currentAlbumArt.src = song.albumArt;
                            this.currentAlbumArt.classList.remove('hidden');
                        } else {
                            this.currentAlbumArt.classList.add('hidden');
                        }
                    }
                    
                    this.updateLikeButton();
                }
            }

            updateLikeButton() {
                if (this.likeBtn && this.songs.length > 0 && this.currentSongIndex >= 0) {
                    const song = this.songs[this.currentSongIndex];
                    const icon = this.likeBtn.querySelector('i');
                    if (song.liked) {
                        icon.className = 'fas fa-heart';
                        this.likeBtn.classList.add('text-green-500');
                        this.likeBtn.classList.remove('text-gray-400');
                    } else {
                        icon.className = 'far fa-heart';
                        this.likeBtn.classList.remove('text-green-500');
                        this.likeBtn.classList.add('text-gray-400');
                    }
                }
            }

            updateDuration() {
                if (this.durationSpan) {
                    this.durationSpan.textContent = this.formatTime(this.audioPlayer.duration);
                }
            }

            updateProgress() {
                if (this.progressBar && this.currentTimeSpan) {
                    const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                    this.progressBar.value = progress || 0;
                    this.currentTimeSpan.textContent = this.formatTime(this.audioPlayer.currentTime);
                }
                
                // Update now playing modal progress
                const npProgress = document.getElementById('np-progress');
                const npCurrentTime = document.getElementById('np-current-time');
                if (npProgress && npCurrentTime) {
                    const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                    npProgress.value = progress || 0;
                    npCurrentTime.textContent = this.formatTime(this.audioPlayer.currentTime);
                }
            }

            seekTo() {
                if (this.audioPlayer.duration) {
                    const time = (this.progressBar.value / 100) * this.audioPlayer.duration;
                    this.audioPlayer.currentTime = time;
                }
            }

            adjustVolume() {
                this.currentVolume = this.volumeControl.value / 100;
                this.audioPlayer.volume = this.currentVolume;
                this.updateVolumeIcon();
            }

            toggleMute() {
                if (this.audioPlayer.volume > 0) {
                    this.audioPlayer.volume = 0;
                    this.volumeControl.value = 0;
                } else {
                    this.audioPlayer.volume = this.currentVolume;
                    this.volumeControl.value = this.currentVolume * 100;
                }
                this.updateVolumeIcon();
            }

            updateVolumeIcon() {
                if (this.volumeBtn) {
                    const icon = this.volumeBtn.querySelector('i');
                    const volume = this.audioPlayer.volume;
                    
                    if (volume === 0) {
                        icon.className = 'fas fa-volume-mute';
                    } else if (volume < 0.5) {
                        icon.className = 'fas fa-volume-down';
                    } else {
                        icon.className = 'fas fa-volume-up';
                    }
                }
            }

            formatTime(seconds) {
                if (!seconds || isNaN(seconds)) return '0:00';
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }

            handleSearch() {
                this.updateSearchResults();
            }

            // Modal functions
            showNowPlayingModal() {
                this.nowPlayingModal?.classList.add('active');
                this.updateNowPlayingModal();
            }

            hideNowPlayingModal() {
                this.nowPlayingModal?.classList.remove('active');
            }

            updateNowPlayingModal() {
                if (this.songs.length > 0 && this.currentSongIndex >= 0) {
                    const song = this.songs[this.currentSongIndex];
                    
                    const artElement = document.getElementById('now-playing-art');
                    const titleElement = document.getElementById('now-playing-title');
                    const artistElement = document.getElementById('now-playing-artist');
                    const playButton = document.getElementById('np-play');
                    const likeButton = document.getElementById('np-like');
                    const shuffleButton = document.getElementById('np-shuffle');
                    const repeatButton = document.getElementById('np-repeat');
                    const durationElement = document.getElementById('np-duration');
                    
                    if (artElement) {
                        if (song.albumArt) {
                            artElement.innerHTML = `<img src="${song.albumArt}" class="w-full h-full object-cover ${this.isPlaying ? 'rotating' : ''}" alt="Album Art">`;
                        } else {
                            artElement.innerHTML = '<i class="fas fa-music text-white text-6xl"></i>';
                        }
                    }
                    
                    if (titleElement) titleElement.textContent = song.title;
                    if (artistElement) artistElement.textContent = song.artist;
                    if (durationElement) durationElement.textContent = this.formatTime(this.audioPlayer.duration);
                    
                    if (playButton) {
                        const icon = playButton.querySelector('i');
                        icon.className = this.isPlaying ? 'fas fa-pause text-lg' : 'fas fa-play text-lg';
                    }
                    
                    if (likeButton) {
                        const icon = likeButton.querySelector('i');
                        if (song.liked) {
                            icon.className = 'fas fa-heart text-xl';
                            likeButton.classList.add('text-green-500');
                            likeButton.classList.remove('text-gray-400');
                        } else {
                            icon.className = 'far fa-heart text-xl';
                            likeButton.classList.remove('text-green-500');
                            likeButton.classList.add('text-gray-400');
                        }
                    }
                    
                    if (shuffleButton) {
                        shuffleButton.classList.toggle('text-green-500', this.isShuffling);
                        shuffleButton.classList.toggle('text-gray-400', !this.isShuffling);
                    }
                    
                    if (repeatButton) {
                        const icon = repeatButton.querySelector('i');
                        switch (this.repeatMode) {
                            case 0:
                                repeatButton.classList.remove('text-green-500');
                                repeatButton.classList.add('text-gray-400');
                                if (icon) icon.className = 'fas fa-redo text-xl';
                                break;
                            case 1:
                                repeatButton.classList.add('text-green-500');
                                repeatButton.classList.remove('text-gray-400');
                                if (icon) icon.className = 'fas fa-redo text-xl';
                                break;
                            case 2:
                                repeatButton.classList.add('text-green-500');
                                repeatButton.classList.remove('text-gray-400');
                                if (icon) icon.className = 'fas fa-redo-alt text-xl';
                                break;
                        }
                    }
                }
                
                // Bind now playing modal controls
                this.bindNowPlayingControls();
            }
            
            bindNowPlayingControls() {
                document.getElementById('np-play')?.addEventListener('click', () => this.togglePlay());
                document.getElementById('np-prev')?.addEventListener('click', () => this.previousSong());
                document.getElementById('np-next')?.addEventListener('click', () => this.nextSong());
                document.getElementById('np-shuffle')?.addEventListener('click', () => this.toggleShuffle());
                document.getElementById('np-repeat')?.addEventListener('click', () => this.toggleRepeat());
                document.getElementById('np-like')?.addEventListener('click', () => this.toggleLike());
                document.getElementById('np-add-playlist')?.addEventListener('click', () => {
                    if (this.currentSongIndex >= 0) {
                        this.showAddToPlaylistModal(this.currentSongIndex);
                    }
                });
                
                const npProgress = document.getElementById('np-progress');
                npProgress?.addEventListener('input', () => {
                    if (this.audioPlayer.duration) {
                        const time = (npProgress.value / 100) * this.audioPlayer.duration;
                        this.audioPlayer.currentTime = time;
                    }
                });
            }

            showCreatePlaylistModal() {
                this.playlistModal?.classList.add('active');
                document.getElementById('playlist-name-input')?.focus();
            }

            hideCreatePlaylistModal() {
                this.playlistModal?.classList.remove('active');
                const input = document.getElementById('playlist-name-input');
                if (input) input.value = '';
            }

            createNewPlaylist() {
                const input = document.getElementById('playlist-name-input');
                const name = input?.value.trim();
                if (name) {
                    const playlist = {
                        id: Date.now(),
                        name: name,
                        songs: [],
                        cover: null,
                        created: new Date()
                    };
                    
                    this.playlists.push(playlist);
                    this.updatePlaylistsList();
                    this.updateLibraryContent();
                    this.hideCreatePlaylistModal();
                    this.saveUserData();
                }
            }

            updatePlaylistsList() {
                if (!this.playlistList) return;
                
                // Clear existing custom playlists
                const customPlaylists = this.playlistList.querySelectorAll('.custom-playlist');
                customPlaylists.forEach(item => item.remove());
                
                // Add new playlists
                this.playlists.forEach(playlist => {
                    const li = document.createElement('li');
                    li.className = 'custom-playlist';
                    li.innerHTML = `
                        <a href="#" class="playlist-item text-gray-400 hover:text-white transition" data-playlist="${playlist.id}">
                            <i class="fas fa-music text-green-500 mr-2"></i>
                            ${playlist.name}
                        </a>
                    `;
                    
                    li.querySelector('.playlist-item').addEventListener('click', (e) => {
                        e.preventDefault();
                        this.playPlaylist(playlist);
                    });
                    
                    this.playlistList.appendChild(li);
                });
            }

            showAddToPlaylistModal(songIndex) {
                this.addToPlaylistModal?.classList.add('active');
                this.currentSongToAdd = songIndex;
                
                const selection = document.getElementById('playlist-selection');
                if (selection) {
                    selection.innerHTML = '';
                    
                    // Add liked songs option
                    const likedOption = document.createElement('div');
                    likedOption.className = 'flex items-center p-3 rounded hover:bg-gray-700 cursor-pointer';
                    likedOption.innerHTML = `
                        <i class="fas fa-heart text-purple-500 mr-3"></i>
                        <span>Liked Songs</span>
                    `;
                    likedOption.addEventListener('click', () => {
                        this.addSongToLiked(songIndex);
                        this.hideAddToPlaylistModal();
                    });
                    selection.appendChild(likedOption);
                    
                    // Add user playlists
                    this.playlists.forEach(playlist => {
                        const option = document.createElement('div');
                        option.className = 'flex items-center p-3 rounded hover:bg-gray-700 cursor-pointer';
                        option.innerHTML = `
                            <i class="fas fa-music text-green-500 mr-3"></i>
                            <span>${playlist.name}</span>
                        `;
                        option.addEventListener('click', () => {
                            this.addSongToPlaylist(songIndex, playlist.id);
                            this.hideAddToPlaylistModal();
                        });
                        selection.appendChild(option);
                    });
                }
            }

            hideAddToPlaylistModal() {
                this.addToPlaylistModal?.classList.remove('active');
                this.currentSongToAdd = null;
            }

            addSongToLiked(songIndex) {
                if (songIndex >= 0 && songIndex < this.songs.length) {
                    const song = this.songs[songIndex];
                    song.liked = true;
                    this.likedSongs.add(song.id);
                    this.updateAllDisplays();
                    this.saveUserData();
                }
            }

            addSongToPlaylist(songIndex, playlistId) {
                if (songIndex >= 0 && songIndex < this.songs.length) {
                    const song = this.songs[songIndex];
                    const playlist = this.playlists.find(p => p.id === playlistId);
                    
                    if (playlist && !playlist.songs.includes(song.id)) {
                        playlist.songs.push(song.id);
                        
                        // Update playlist cover to the last added song's album art
                        if (song.albumArt) {
                            playlist.cover = song.albumArt;
                        }
                        
                        this.updateAllDisplays();
                        this.saveUserData();
                    }
                }
            }

            // User profile functions
            toggleUserDropdown() {
                this.userDropdown?.classList.toggle('active');
            }

            hideUserDropdown() {
                this.userDropdown?.classList.remove('active');
            }

            showProfileModal() {
                this.profileModal?.classList.add('active');
                this.hideUserDropdown();
                this.updateProfileModal();
            }

            hideProfileModal() {
                this.profileModal?.classList.remove('active');
            }

            updateProfileModal() {
                const nameInput = document.getElementById('profile-name-input');
                const avatar = document.getElementById('profile-avatar');
                
                if (nameInput) nameInput.value = this.userProfile.name;
                
                if (avatar) {
                    if (this.userProfile.avatar) {
                        avatar.innerHTML = `<img src="${this.userProfile.avatar}" alt="Avatar" class="w-full h-full object-cover">`;
                    } else {
                        avatar.innerHTML = '<i class="fas fa-user text-3xl text-white"></i>';
                    }
                }
                
                this.updateUserStats();
            }

            updateUserStats() {
                const songsCount = document.getElementById('songs-count');
                const playlistsCount = document.getElementById('playlists-count');
                const likedSongsCount = document.getElementById('liked-songs-count');
                const likedCountHome = document.getElementById('liked-count');
                
                if (songsCount) songsCount.textContent = this.songs.length;
                if (playlistsCount) playlistsCount.textContent = this.playlists.length;
                if (likedSongsCount) likedSongsCount.textContent = this.likedSongs.size;
                if (likedCountHome) likedCountHome.textContent = `${this.likedSongs.size} songs`;
            }

            saveProfile() {
                const nameInput = document.getElementById('profile-name-input');
                if (nameInput) {
                    this.userProfile.name = nameInput.value.trim() || 'User';
                    if (this.userName) this.userName.textContent = this.userProfile.name;
                }
                
                this.saveUserData();
                this.hideProfileModal();
            }

            handleAvatarUpload(event) {
                const file = event.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.userProfile.avatar = e.target.result;
                        
                        // Update all avatar displays
                        if (this.userAvatar) {
                            this.userAvatar.innerHTML = `<img src="${this.userProfile.avatar}" alt="Avatar" class="w-full h-full object-cover">`;
                        }
                        
                        const profileAvatar = document.getElementById('profile-avatar');
                        if (profileAvatar) {
                            profileAvatar.innerHTML = `<img src="${this.userProfile.avatar}" alt="Avatar" class="w-full h-full object-cover">`;
                        }
                        
                        this.saveUserData();
                    };
                    reader.readAsDataURL(file);
                }
                event.target.value = '';
            }

            filterLibrary(filter) {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('bg-green-500');
                    btn.classList.add('bg-gray-800');
                });
                
                const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
                if (activeBtn) {
                    activeBtn.classList.add('bg-green-500');
                    activeBtn.classList.remove('bg-gray-800');
                }
                
                // Filter content based on selection
                this.updateLibraryContent();
            }

            updateGreeting() {
                const hour = new Date().getHours();
                const greetingElement = document.querySelector('h2');
                
                if (greetingElement && greetingElement.textContent.includes('afternoon')) {
                    if (hour < 12) {
                        greetingElement.textContent = 'Good morning';
                    } else if (hour < 18) {
                        greetingElement.textContent = 'Good afternoon';
                    } else {
                        greetingElement.textContent = 'Good evening';
                    }
                }
            }

            // Data persistence
            saveUserData() {
                const data = {
                    songs: this.songs.map(song => ({
                        ...song,
                        url: null, // Don't save blob URLs
                        file: null // Don't save file objects
                    })),
                    playlists: this.playlists,
                    likedSongs: Array.from(this.likedSongs),
                    userProfile: this.userProfile,
                    currentVolume: this.currentVolume,
                    isShuffling: this.isShuffling,
                    repeatMode: this.repeatMode
                };
                
                try {
                    localStorage.setItem('musicWaveData', JSON.stringify(data));
                } catch (error) {
                    console.error('Error saving data:', error);
                }
            }

            loadUserData() {
                try {
                    const data = localStorage.getItem('musicWaveData');
                    if (data) {
                        const parsed = JSON.parse(data);
                        
                        this.playlists = parsed.playlists || [];
                        this.likedSongs = new Set(parsed.likedSongs || []);
                        this.userProfile = { ...this.userProfile, ...parsed.userProfile };
                        this.currentVolume = parsed.currentVolume || 0.7;
                        this.isShuffling = parsed.isShuffling || false;
                        this.repeatMode = parsed.repeatMode || 0;
                        
                        // Update UI with loaded data
                        if (this.userName) this.userName.textContent = this.userProfile.name;
                        if (this.userAvatar && this.userProfile.avatar) {
                            this.userAvatar.innerHTML = `<img src="${this.userProfile.avatar}" alt="Avatar" class="w-full h-full object-cover">`;
                        }
                        if (this.volumeControl) this.volumeControl.value = this.currentVolume * 100;
                        
                        this.updatePlaylistsList();
                        this.updateUserStats();
                    }
                } catch (error) {
                    console.error('Error loading data:', error);
                }
            }
        }

        // Global function to open now playing modal
        function openNowPlaying() {
            if (window.musicPlayer && window.musicPlayer.songs.length > 0) {
                window.musicPlayer.showNowPlayingModal();
            }
        }

        // Initialize player when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            window.musicPlayer = new EnhancedMP3Player();
            console.log('🎵 Enhanced MP3 Player initialized successfully!');
        });