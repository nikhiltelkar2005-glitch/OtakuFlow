const output = document.getElementById('output');
const currentCategory = document.getElementById('current-category');
const btnHome = document.getElementById('btn-home');
const btnTrending = document.getElementById('btn-trending');
const btnTop = document.getElementById('btn-top');
const btnFirstTime = document.getElementById('btn-first-time');
const btnMostWatched = document.getElementById('btn-most-watched');
const btnForYou = document.getElementById('btn-for-you');
const btnCategories = document.getElementById('btn-categories');
const categoriesMenu = document.getElementById('categories-menu');
const genreList = document.getElementById('genre-list');
const btnProfile = document.getElementById('btn-profile');
const profileSidebar = document.getElementById('profile-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const toggleSearch = document.getElementById('toggle-search');
const searchContainer = document.getElementById('search-container');
const themeToggle = document.getElementById('theme-toggle');
const mainElement = document.querySelector('main');
const selectionOverlay = document.getElementById('selection-overlay');
const selectionGrid = document.getElementById('selection-grid');
const selectionTitle = document.getElementById('selection-title');
const selectionSubtitle = document.getElementById('selection-subtitle');
const selectionProgressSteps = document.querySelectorAll('.progress-step');

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
        title: "CHOOSE YOUR GENRE",
        subtitle: "What kind of stories do you enjoy?",
        options: [
            { id: 1, name: "Action", icon: "action", description: "High-octane battles", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 13l2 2"/></svg>` },
            { id: 22, name: "Romance", icon: "romance", description: "Heartfelt stories", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>` },
            { id: 2, name: "Adventure", icon: "adventure", description: "Grand journeys", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M9 14c0-1.25.75-3 2.5-3s2.5 1.75 2.5 3c0 1.25-.503 2.5-1.5 3.5c-.733.733-2.333 1.333-3.5 1.333c-1.167 0-2.667-.866-3.5-1.5c-1-1.334-1.5-2.667-1.5-3.333Z"/><path d="m15 15 3 3h3l1-1"/></svg>` },
            { id: 10, name: "Fantasy", icon: "fantasy", description: "Magic & realms", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11.5 11.5 3 3"/><path d="m16 16 3 3"/><path d="M16 11c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4Z"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M22 12h-3"/><path d="M5 12H2"/><path d="m4.93 4.93 2.12 2.12"/><path d="m16.95 16.95 2.12 2.12"/><path d="m4.93 19.07 2.12-2.12"/><path d="m16.95 7.05 2.12-2.12"/></svg>` }
        ]
    },
    2: {
        title: "CHOOSE YOUR MOOD",
        subtitle: "How are you feeling today?",
        options: [
            { id: 41, name: "Intense", icon: "action", description: "High stakes thrills", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
            { id: 36, name: "Chill", icon: "scifi", description: "Relaxing slice of life", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>` },
            { id: 8, name: "Emotional", icon: "romance", description: "Deep drama", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` },
            { id: 7, name: "Mysterious", icon: "mystery", description: "Unravel secrets", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M9.17 14.83a4 4 0 1 1 5.66 0"/></svg>` }
        ]
    },
    3: {
        title: "CHOOSE YOUR STYLE",
        subtitle: "How much time do you have?",
        options: [
            { id: "flash", name: "Flash Episode", icon: "action", description: "Quick movie or special", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
            { id: "mini", name: "Mini Arc", icon: "adventure", description: "Short 1-cour session", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 8v8"/><path d="M17 8v8"/><path d="M7 12h10"/></svg>` },
            { id: "binge", name: "Binge Saga", icon: "fantasy", description: "Longer 2+ cour watch", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>` },
            { id: "endless", name: "Endless Journey", icon: "mystery", description: "Classic long runners", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/><path d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"/></svg>` }
        ]
    }
};

const allButtons = [btnHome, btnFirstTime, btnTop, btnMostWatched, btnTrending, btnForYou];
const BASE_URL = 'https://api.jikan.moe/v4';

function initTheme() {

    const savedTheme = localStorage.getItem('otakuFlow_theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light_mode');
    } else {
        document.body.classList.remove('light_mode');
    }
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
function saveFavorites(favs) {
    localStorage.setItem('otakuFlow_favs', JSON.stringify(favs));
}
function toggleFavorite(anime) {
    let favs = getFavorites();
    const index = favs.findIndex(f => f.mal_id === anime.mal_id);
    if (index > -1) {
        favs.splice(index, 1);
    } else {
        favs.push(anime);
    }
    saveFavorites(favs);
}
function isFavorite(animeId) {
    const favs = getFavorites();
    return favs.some(f => f.mal_id === animeId);
}
output.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('.save-btn');
    const readMoreBtn = e.target.closest('.read-more-btn');
    if (saveBtn) {
        e.preventDefault();
        e.stopPropagation();
        const animeData = JSON.parse(saveBtn.dataset.anime);
        toggleFavorite(animeData);
        const isNowFav = saveBtn.classList.toggle('active');
        const span = saveBtn.querySelector('span');
        if (span) span.textContent = isNowFav ? 'Saved' : 'Save';
        if (currentCategory.textContent === 'For You — My Favorites') {
            renderData(getFavorites());
        }
    }
    if (readMoreBtn) {
        e.preventDefault();
        const synopsis = readMoreBtn.previousElementSibling;
        const isExpanded = synopsis.classList.toggle('expanded');
        readMoreBtn.textContent = isExpanded ? 'Show Less' : 'Read More';
    }
});
toggleSearch.addEventListener('click', (e) => {
    e.preventDefault();
    const isHidden = searchContainer.style.display === 'none' || searchContainer.style.display === '';
    searchContainer.style.display = isHidden ? 'flex' : 'none';
    mainElement.classList.toggle('search-active', isHidden);
    if (isHidden) searchInput.focus();
});
btnProfile.addEventListener('click', () => {
    if (isLoggedIn()) {
        profileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    } else {
        window.location.href = 'login.html';
    }
});
function closeSidebar() {
    profileSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
}
sidebarOverlay.addEventListener('click', closeSidebar);
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (item.classList.contains('logout')) {
            e.preventDefault();
            localStorage.setItem('otakuFlow_isLoggedIn', 'false');
            alert("Logging out from Otaku-Flow...");
            closeSidebar();
            window.location.reload();
        } else {
            closeSidebar();
        }
    });
});
btnCategories.addEventListener('click', () => {
    categoriesMenu.classList.toggle('active');
    if (categoriesMenu.classList.contains('active') && genreList.children.length === 0) {
        fetchGenres();
    }
});
async function fetchGenres() {
    genreList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.5;">Loading categories...</p>';
    try {
        const response = await fetch(`${BASE_URL}/genres/anime`);
        const data = await response.json();
        renderGenres(data.data);
    } catch (error) {
        genreList.innerHTML = '<p class="error-msg">Error loading categories.</p>';
    }
}
function renderGenres(genres) {
    genreList.innerHTML = genres.map(genre => `
        <button class="genre-btn" data-id="${genre.mal_id}">${genre.name}</button>
    `).join('');
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const genreId = btn.dataset.id;
            const genreName = btn.textContent;
            categoriesMenu.classList.remove('active');
            fetchAndRender(`${BASE_URL}/anime?genres=${genreId}&order_by=score&sort=desc&limit=12`, `Category: ${genreName}`, null);
        });
    });
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
async function fetchAndRender(url, categoryTitle, activeBtn, isFallback = false) {
    if (activeBtn !== undefined) setActiveButton(activeBtn);
    showLoading();
    currentCategory.textContent = categoryTitle;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if ((!data.data || data.data.length === 0) && !isFallback && url.includes('genres=')) {
            // Try fallback: Keep Genre & Style, but drop Mood
            const fallbackUrl = url.replace(/genres=\d+,(\d+)/, (match, moodId) => {
                // If the URL has "genres=base,mood", we strip the mood
                const parts = url.split('genres=');
                const genreParts = parts[1].split('&')[0].split(',');
                return `genres=${genreParts[0]}`;
            });
            
            if (fallbackUrl !== url) {
                console.log("No results for combined filters. Retrying broader search...");
                return fetchAndRender(fallbackUrl, `${categoryTitle} (showing best matches)`, activeBtn, true);
            }
        }
        
        renderData(data.data);
    } catch (error) {
        output.innerHTML = `<div class="error-msg">Error fetching data: ${error.message}</div>`;
    }
}
function renderStep(step) {
    const data = journeyData[step];
    selectionTitle.textContent = data.title;
    selectionSubtitle.textContent = data.subtitle;

    selectionProgressSteps.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.step) === step);
    });

    selectionGrid.innerHTML = data.options.map((opt, index) => `
        <div class="type-card fade-in" data-id="${opt.id}" data-name="${opt.name}" style="animation-delay: ${index * 0.1}s">
            <div class="type-icon ${opt.icon}">
                ${opt.svg}
            </div>
            <h3>${opt.name}</h3>
            <p>${opt.description}</p>
        </div>
    `).join('');

    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', () => handleSelection(card.dataset.id, card.dataset.name));
    });
}

function handleSelection(id, name) {
    if (currentStep === 1) {
        selectionState.genre = id;
        selectionState.genreName = name;
    } else if (currentStep === 2) {
        selectionState.mood = id;
        selectionState.moodName = name;
    } else if (currentStep === 3) {
        selectionState.era = id;
        selectionState.eraName = name;
    }

    if (currentStep < 3) {
        currentStep++;
        renderStep(currentStep);
    } else {
        finishJourney();
    }
}

function finishJourney() {
    selectionOverlay.classList.add('hidden');

    let url = `${BASE_URL}/anime?order_by=score&sort=desc&limit=12`;
    url += `&genres=${selectionState.genre},${selectionState.mood}`;

    if (selectionState.era === "flash") url += `&max_episodes=1`;
    else if (selectionState.era === "mini") url += `&min_episodes=2&max_episodes=13`;
    else if (selectionState.era === "binge") url += `&min_episodes=14&max_episodes=50`;
    else if (selectionState.era === "endless") url += `&min_episodes=51`;

    fetchAndRender(url, `Discovery Path: ${selectionState.genreName} + ${selectionState.moodName}`, null);
}

async function init() {
    initTheme();
    selectionOverlay.classList.remove('hidden');
    renderStep(1);
}
function renderData(dataArray) {
    if (!dataArray || dataArray.length === 0) {
        if (currentCategory.textContent === 'For You — My Favorites') {
            output.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    </div>
                    <h2 class="empty-state-title">Your saved anime will display here</h2>
                    <p class="empty-state-text">Start exploring and save your favorite episodes to build your personal collection.</p>
                </div>
            `;
        } else {
            output.innerHTML = '<p class="error-msg">No anime found matching this criteria.</p>';
        }
        return;
    }
    const html = `
        <div class="episodes-grid">
            ${dataArray.map(anime => {
        const title = anime.title_english || anime.title;
        const imageUrl = anime.images.webp.large_image_url || anime.images.webp.image_url;
        const episodes = anime.episodes || '??';
        const animeId = anime.mal_id;
        const isFav = isFavorite(animeId);
        const storageData = JSON.stringify({
            mal_id: anime.mal_id,
            title: anime.title,
            title_english: anime.title_english,
            images: anime.images,
            episodes: anime.episodes,
            url: anime.url
        }).replace(/"/g, '&quot;');
        return `
                    <div class="anime-list-item flip-card" data-url="${anime.url}">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <div class="card-shimmer"></div>
                                <div class="poster-stack">
                                    <img src="${imageUrl}" class="main-poster" alt="${title}" loading="lazy">
                                    <div class="poster-overlay">
                                        <h3 class="item-title">${title}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="flip-card-back">
                                <div class="item-content">
                                    <a href="${anime.url}" target="_blank" class="title-link">
                                        <h3 class="item-title">${title}</h3>
                                    </a>
                                    <div class="item-synopsis">
                                        ${anime.synopsis ? anime.synopsis.replace("[Written by MAL Rewrite]", "").trim() : "No synopsis available."}
                                    </div>
                                    <button class="read-more-btn">Read More</button>
                                    <div class="item-meta">
                                        <span>${episodes} Episodes</span>
                                        <span>Sub | Dub</span>
                                    </div>
                                    <button class="save-btn ${isFav ? 'active' : ''}" data-anime="${storageData}">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
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
    output.innerHTML = html;
}
btnHome.addEventListener('click', (e) => {
    e.preventDefault();
    fetchAndRender(`${BASE_URL}/top/anime?limit=12`, 'Home — Discover', btnHome);
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
btnSearch.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        fetchAndRender(`${BASE_URL}/anime?q=${query}&limit=12`, `Search: "${query}"`, null);
        searchContainer.style.display = 'none';
        mainElement.classList.remove('search-active');
    }
});
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            fetchAndRender(`${BASE_URL}/anime?q=${query}&limit=12`, `Search: "${query}"`, null);
            searchContainer.style.display = 'none';
            mainElement.classList.remove('search-active');
        }
    }
});
init();
