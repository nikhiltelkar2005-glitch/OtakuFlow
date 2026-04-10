const output = document.getElementById('output');
const currentCategory = document.getElementById('current-category');
const mainElement = document.querySelector('main');
const heroBlade = document.getElementById('hero-blade');

const btnHome = document.getElementById('btn-home');
const btnSelectPath = document.getElementById('btn-select-path');
const btnTrending = document.getElementById('btn-trending');
const btnTop = document.getElementById('btn-top');
const btnFirstTime = document.getElementById('btn-first-time');
const btnMostWatched = document.getElementById('btn-most-watched');
const btnForYou = document.getElementById('btn-for-you');
const btnCompass = document.getElementById('btn-compass');

const toggleSearch = document.getElementById('toggle-search');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const btnProfile = document.getElementById('btn-profile');
const profileSidebar = document.getElementById('profile-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const themeToggle = document.getElementById('theme-toggle');

const selectionOverlay = document.getElementById('selection-overlay');
const selectionGrid = document.getElementById('selection-grid');
const selectionTitle = document.getElementById('selection-title');
const selectionSubtitle = document.getElementById('selection-subtitle');
const selectionProgressSteps = document.querySelectorAll('.progress-step');

const btnCategories = document.getElementById('btn-categories');
const categoriesMenu = document.getElementById('categories-menu');
const genreList = document.getElementById('genre-list');

let currentStep = 1;
const selectionState = {
    genre: null,
    mood: null,
    era: null,
    genreName: "",
    moodName: "",
    eraName: ""
};

const journeyData = {
    1: {
        title: "Every journey begins with a choice",
        subtitle: "What story calls to you?",
        options: [
            { id: 1, name: "Action", icon: "action", description: "High-octane battles", svg: `<span class="anime-emoji">⚔️</span>` },
            { id: 22, name: "Romance", icon: "romance", description: "Heartfelt stories", svg: `<svg class="anime-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899" stroke-width="2"/></svg>` },
            { id: 2, name: "Adventure", icon: "adventure", description: "Grand journeys", svg: `<span class="anime-emoji">🗺️</span>` },
            { id: 10, name: "Fantasy", icon: "fantasy", description: "Magic & realms", svg: `<span class="anime-emoji">🐉</span>` }
        ]
    },
    2: {
        title: "What energy flows through you",
        subtitle: "right now?",
        options: [
            { id: 41, name: "Intense", icon: "action", description: "High stakes thrills", svg: `<svg class="anime-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="2"/></svg>` },
            { id: 36, name: "Chill", icon: "scifi", description: "Relaxing slice of life", svg: `<span class="anime-emoji">🍵</span>` },
            { id: 8, name: "Emotional", icon: "romance", description: "Deep drama", svg: `<svg class="anime-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/></svg>` },
            { id: 7, name: "Mysterious", icon: "mystery", description: "Unravel secrets", svg: `<span class="anime-emoji">🔮</span>` }
        ]
    },
    3: {
        title: "Awaken your true form…",
        subtitle: "what style do you wield?",
        options: [
            { id: "flash", name: "Flash Episode", icon: "action", description: "Quick movie or special", svg: `<span class="anime-emoji">⚡</span>` },
            { id: "mini", name: "Mini Arc", icon: "adventure", description: "Short 1-cour session", svg: `<span class="anime-emoji">📜</span>` },
            { id: "binge", name: "Binge Saga", icon: "fantasy", description: "Longer 2+ cour watch", svg: `<span class="anime-emoji">🏆</span>` },
            { id: "endless", name: "Endless Journey", icon: "mystery", description: "Classic long runners", svg: `<span class="anime-emoji">♾️</span>` }
        ]
    }
};

const allButtons = [btnHome, btnFirstTime, btnTop, btnMostWatched, btnTrending, btnForYou];
const BASE_URL = CONFIG.API_BASE_URL;

function initTheme() {
    const savedTheme = localStorage.getItem('otakuFlow_theme') || 'dark';
    document.body.classList.toggle('light_mode', savedTheme === 'light');
}

themeToggle.addEventListener('click', () => {
    const isLightMode = document.body.classList.toggle('light_mode');
    localStorage.setItem('otakuFlow_theme', isLightMode ? 'light' : 'dark');
});

function isLoggedIn() {
    return localStorage.getItem('otakuFlow_isLoggedIn') === 'true';
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('otakuFlow_favs')) || [];
}

function toggleFavorite(anime) {
    let favs = getFavorites();
    const index = favs.findIndex(f => f.mal_id === anime.mal_id);
    if (index > -1) {
        favs.splice(index, 1);
    } else {
        favs.push(anime);
    }
    localStorage.setItem('otakuFlow_favs', JSON.stringify(favs));
}

function isFavorite(animeId) {
    return getFavorites().some(f => f.mal_id === animeId);
}

async function fetchAndRender(url, categoryTitle, activeBtn, isFallback = false) {
    heroBlade.style.display = (categoryTitle === 'Home — Discover') ? 'block' : 'none';
    if (activeBtn) setActiveButton(activeBtn);
    showLoading();
    currentCategory.textContent = categoryTitle;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if ((!data.data || data.data.length === 0) && !isFallback && url.includes('genres=')) {
            const parts = url.split('genres=');
            const genreParts = parts[1].split('&')[0].split(',');
            const fallbackUrl = url.replace(/genres=[^&]+/, `genres=${genreParts[0]}`);
            
            if (fallbackUrl !== url) {
                return fetchAndRender(fallbackUrl, `${categoryTitle} (showing best matches)`, activeBtn, true);
            }
        }
        
        renderData(data.data);
    } catch (error) {
        output.innerHTML = `<div class="error-msg">Error fetching data: ${error.message}</div>`;
    }
}

async function fetchAndRenderHero() {
    try {
        const youtubeId = "YnczpEoeaDM";
        heroBlade.innerHTML = `
            <div class="hero-video-container">
                <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0" 
                        frameborder="0" allow="autoplay; encrypted-media"></iframe>
            </div>
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="hero-tag"><span>🏴‍☠️</span> The Giant Kingdom Awaits</div>
                <h1 class="hero-title">ELBAF AWAKES: LUFFY SETS SAIL</h1>
                <p class="hero-description">Luffy Sets Sail for the Giant Kingdom | One Piece Elbaf Arc Trailer. Witness the beginning of the most anticipated journey in history.</p>
                <div class="hero-actions">
                    <button class="hero-btn primary" onclick="window.open('https://www.youtube.com/watch?v=YnczpEoeaDM', '_blank')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="m5 3 14 9-14 9V3z"/></svg>
                        Watch Teaser
                    </button>
                </div>
            </div>
        `;
        heroBlade.style.display = 'block';
    } catch (error) {
        heroBlade.style.display = 'none';
    }
}

function setActiveButton(activeBtn) {
    allButtons.forEach(btn => btn.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
}

function showLoading() {
    output.innerHTML = `
        <div class="episodes-grid">
            ${Array(12).fill(0).map(() => `
                <div class="anime-list-item skeleton-item">
                    <div class="poster-stack skeleton-poster"></div>
                    <div class="item-content">
                        <div class="skeleton-text" style="height: 15px; width: 80%;"></div>
                        <div class="skeleton-text" style="height: 12px; width: 40%;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderData(dataArray) {
    if (!dataArray || dataArray.length === 0) {
        const isFavoritesView = currentCategory.textContent.includes('My Favorites');
        output.innerHTML = isFavoritesView ? `
            <div class="empty-state">
                <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg></div>
                <h2 class="empty-state-title">Your saved anime will display here</h2>
                <p class="empty-state-text">Start exploring and save your favorite episodes to build your collection.</p>
            </div>
        ` : '<p class="error-msg">No anime found matching this criteria.</p>';
        return;
    }

    output.innerHTML = `
        <div class="episodes-grid">
            ${dataArray.map(anime => {
                const title = anime.title_english || anime.title;
                const imageUrl = anime.images.webp.large_image_url || anime.images.webp.image_url;
                const isFav = isFavorite(anime.mal_id);
                const animeDataAttr = JSON.stringify(anime).replace(/"/g, '&quot;');
                
                return `
                    <div class="anime-list-item flip-card">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <div class="card-shimmer"></div>
                                <div class="poster-stack">
                                    <img src="${imageUrl}" class="main-poster" alt="${title}" loading="lazy">
                                    <div class="poster-overlay"><h3 class="item-title">${title}</h3></div>
                                </div>
                            </div>
                            <div class="flip-card-back">
                                <div class="item-content">
                                    <a href="${anime.url}" target="_blank" class="title-link"><h3 class="item-title">${title}</h3></a>
                                    <div class="item-synopsis">${anime.synopsis ? anime.synopsis.replace("[Written by MAL Rewrite]", "").trim() : "No synopsis available."}</div>
                                    <button class="read-more-btn">Read More</button>
                                    <div class="item-meta"><span>${anime.episodes || '??'} Episodes</span><span>Sub | Dub</span></div>
                                    <button class="save-btn ${isFav ? 'active' : ''}" data-anime="${animeDataAttr}">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                                        <span>${isFav ? 'Saved' : 'Save'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderStep(step) {
    const data = journeyData[step];
    selectionTitle.textContent = data.title;
    selectionSubtitle.textContent = data.subtitle;
    selectionProgressSteps.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === step));
    selectionGrid.innerHTML = data.options.map((opt, index) => `
        <div class="type-card fade-in" data-id="${opt.id}" data-name="${opt.name}" style="animation-delay: ${index * 0.1}s">
            <div class="type-icon ${opt.icon}">${opt.svg}</div>
            <h3>${opt.name}</h3>
            <p>${opt.description}</p>
        </div>
    `).join('');
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', () => {
            const { id, name } = card.dataset;
            if (currentStep === 1) { selectionState.genre = id; selectionState.genreName = name; }
            else if (currentStep === 2) { selectionState.mood = id; selectionState.moodName = name; }
            else if (currentStep === 3) { selectionState.era = id; selectionState.eraName = name; }
            if (currentStep < 3) { currentStep++; renderStep(currentStep); }
            else { finishJourney(); }
        });
    });
}

function finishJourney() {
    selectionOverlay.classList.add('hidden');
    let url = `${BASE_URL}/anime?order_by=score&sort=desc&limit=12&genres=${selectionState.genre},${selectionState.mood}`;
    if (selectionState.era === "flash") url += '&max_episodes=1';
    else if (selectionState.era === "mini") url += '&min_episodes=2&max_episodes=13';
    else if (selectionState.era === "binge") url += '&min_episodes=14&max_episodes=50';
    else if (selectionState.era === "endless") url += '&min_episodes=51';
    fetchAndRender(url, `Discovery Path: ${selectionState.genreName} + ${selectionState.moodName}`, null);
}

async function getZoroChoice() {
    btnCompass.classList.add('spinning');
    heroBlade.style.display = 'none';
    showLoading();
    currentCategory.textContent = "Zoro's Compass — Seeking Greatness...";
    try {
        const randomPage = Math.floor(Math.random() * 5) + 1;
        const response = await fetch(`${BASE_URL}/top/anime?page=${randomPage}&limit=25`);
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const chosenAnime = [data.data[randomIndex]];
            await new Promise(resolve => setTimeout(resolve, 1500));
            renderData(chosenAnime);
            output.insertAdjacentHTML('afterbegin', `
                <div class="zoro-choice-header">
                    <h2><span>⚔️</span> Zoro Lost His Way!</h2>
                    <p>...but he found this masterpiece for you instead.</p>
                </div>
            `);
            currentCategory.textContent = "Zoro's Choice — Sanctuary Found";
        }
    } catch (error) {
        currentCategory.textContent = "The path is blocked! Try again later.";
    } finally {
        btnCompass.classList.remove('spinning');
    }
}

btnHome.addEventListener('click', (e) => {
    e.preventDefault();
    fetchAndRenderHero();
    fetchAndRender(`${BASE_URL}/top/anime?limit=12`, 'Home — Discover', btnHome);
});
btnSelectPath.addEventListener('click', (e) => {
    e.preventDefault();
    selectionOverlay.classList.remove('hidden');
    currentStep = 1;
    renderStep(1);
});
btnFirstTime.addEventListener('click', (e) => {
    e.preventDefault();
    fetchAndRender(`${BASE_URL}/top/anime?type=tv&filter=bypopularity&limit=12`, 'Newbie Hub — Begin Your Journey', btnFirstTime);
});
btnTop.addEventListener('click', (e) => {
    e.preventDefault();
    fetchAndRender(`${BASE_URL}/top/anime?limit=12`, 'Heat — Trending', btnTop);
});
btnMostWatched.addEventListener('click', (e) => {
    e.preventDefault();
    fetchAndRender(`${BASE_URL}/top/anime?filter=bypopularity&limit=12`, 'Binge Zone — Most Popular', btnMostWatched);
});
btnTrending.addEventListener('click', (e) => {
    e.preventDefault();
    fetchAndRender(`${BASE_URL}/seasons/now?limit=12`, 'New Stuff — Latest Episodes', btnTrending);
});
btnForYou.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveButton(btnForYou);
    currentCategory.textContent = 'For You — My Favorites';
    renderData(getFavorites());
});
btnCompass.addEventListener('click', (e) => { e.preventDefault(); setActiveButton(null); getZoroChoice(); });
toggleSearch.addEventListener('click', (e) => {
    e.preventDefault();
    const isHidden = searchContainer.style.display === 'none' || searchContainer.style.display === '';
    searchContainer.style.display = isHidden ? 'flex' : 'none';
    mainElement.classList.toggle('search-active', isHidden);
    if (isHidden) searchInput.focus();
});
btnSearch.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        fetchAndRender(`${BASE_URL}/anime?q=${query}&limit=12`, `Search: "${query}"`, null);
        searchContainer.style.display = 'none';
        mainElement.classList.remove('search-active');
    }
});
btnProfile.addEventListener('click', () => {
    if (isLoggedIn()) {
        profileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    } else {
        window.location.href = 'login.html';
    }
});
sidebarOverlay.addEventListener('click', () => {
    profileSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});
output.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('.save-btn');
    const readMoreBtn = e.target.closest('.read-more-btn');
    if (saveBtn) {
        e.preventDefault(); e.stopPropagation();
        const animeData = JSON.parse(saveBtn.dataset.anime);
        toggleFavorite(animeData);
        const isNowFav = saveBtn.classList.toggle('active');
        saveBtn.querySelector('span').textContent = isNowFav ? 'Saved' : 'Save';
    }
    if (readMoreBtn) {
        e.preventDefault();
        const synopsis = readMoreBtn.previousElementSibling;
        const isExpanded = synopsis.classList.toggle('expanded');
        readMoreBtn.textContent = isExpanded ? 'Show Less' : 'Read More';
    }
});

async function init() {
    initTheme();
    renderStep(1);
    fetchAndRenderHero();
    fetchAndRender(`${BASE_URL}/top/anime?limit=12`, 'Home — Discover', btnHome);
}

init();
