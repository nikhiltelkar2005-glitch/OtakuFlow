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
const allButtons = [btnHome, btnFirstTime, btnTop, btnMostWatched, btnTrending, btnForYou];

const BASE_URL = 'https://api.jikan.moe/v4';

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('otakuFlow_theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

themeToggle.addEventListener('click', () => {
    const isLightMode = document.body.classList.toggle('light-mode');
    localStorage.setItem('otakuFlow_theme', isLightMode ? 'light' : 'dark');
});

// Authentication Logic Helpers
function isLoggedIn() {
    return localStorage.getItem('otakuFlow_isLoggedIn') === 'true';
}

// Favorite Logic Helpers
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

// Global Event Delegation for Favorites
output.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (favBtn) {
        e.preventDefault();
        e.stopPropagation();
        const animeData = JSON.parse(favBtn.dataset.anime);
        toggleFavorite(animeData);
        favBtn.classList.toggle('active');
        
        // If we are in the "For You" section, re-render to reflect removal
        if (currentCategory.textContent === 'For You — My Favorites') {
            renderData(getFavorites());
        }
    }
});

// Toggle Search Bar
toggleSearch.addEventListener('click', (e) => {
    e.preventDefault();
    const isHidden = searchContainer.style.display === 'none' || searchContainer.style.display === '';
    searchContainer.style.display = isHidden ? 'flex' : 'none';
    mainElement.classList.toggle('search-active', isHidden);
    if (isHidden) searchInput.focus();
});

// Toggle Profile Sidebar / Redirect to Login
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

// Handle Sidebar Logout/Links
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

// Toggle Categories Menu
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
                <div class="anime-list-item skeleton-item" style="opacity: 0.5;">
                    <div class="poster-stack" style="background: var(--bg-card); border: 1px solid var(--border-color);"></div>
                    <div class="item-content">
                        <div style="height: 15px; width: 80%; background: var(--bg-card); margin-bottom: 5px;"></div>
                        <div style="height: 12px; width: 40%; background: var(--bg-card);"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function fetchAndRender(url, categoryTitle, activeBtn) {
    if (activeBtn !== undefined) setActiveButton(activeBtn);
    showLoading();
    currentCategory.textContent = categoryTitle;
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderData(data.data);
    } catch (error) {
        output.innerHTML = `<div class="error-msg">Error fetching data: ${error.message}</div>`;
    }
}

async function init() {
    initTheme();
    fetchAndRender(`${BASE_URL}/top/anime?limit=12`, 'Home — Discover', btnHome);
}

function renderData(dataArray) {
    if (!dataArray || dataArray.length === 0) {
        if (currentCategory.textContent === 'For You — My Favorites') {
            output.innerHTML = `
                <div style="text-align:center; padding: 3rem; opacity: 0.5;">
                    <h2 style="font-size: 3rem;">💔</h2>
                    <p>You haven't liked any anime yet. Start adding some!</p>
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
                
                const times = ['10:30pm', '10:00pm', '9:30pm', '9:00pm', '8:30pm'];
                const time = times[Math.floor(Math.random() * times.length)];
                const isPremium = Math.random() > 0.7;

                const storageData = JSON.stringify({
                    mal_id: anime.mal_id,
                    title: anime.title,
                    title_english: anime.title_english,
                    images: anime.images,
                    episodes: anime.episodes,
                    url: anime.url
                }).replace(/"/g, '&quot;');

                return `
                    <a href="${anime.url}" target="_blank" class="anime-list-item">
                        <div class="poster-stack">
                            <img src="${imageUrl}" class="main-poster" alt="${title}" loading="lazy">
                            <button class="fav-btn ${isFav ? 'active' : ''}" data-anime="${storageData}" title="Add to Favorites">
                                ❤
                            </button>
                        </div>
                        <div class="item-content">
                            <h3 class="item-title">${title}</h3>
                            <div class="item-meta">
                                ${isPremium ? '<span class="premium-icon">👑 Episode 1</span>' : `<span>${episodes} Episodes</span>`}
                                <span>Sub | Dub</span>
                                <span class="release-time">${time}</span>
                            </div>
                        </div>
                    </a>
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
