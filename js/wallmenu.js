// Массив с путями к оптимизированным обоям (меньшего размера)
const wallpapers = [
    'Background/background-00.jpg',
    'Background/Background-01.jpg',
    'Background/Background-02.jpg'
];

let currentWallpaperIndex = 0;
let openMenuTimeout = null;
let isMenuOpen = false;

// Кэшируем элементы
const elements = {
    systemScreen: document.querySelector('.system-screen'),
    menu: document.querySelector('.wallpaper-menu'),
    wallpaperImg: document.querySelector('.wallpaper-image'),
    arrowLeft: document.querySelector('.arrow-left'),
    arrowRight: document.querySelector('.arrow-right')
};

// Предзагрузка изображений
function preloadImages() {
    wallpapers.forEach((src, index) => {
        if (index > 0) { // Первое уже загружено
            const img = new Image();
            img.src = src;
        }
    });
}

// 1. Логика открытия по зажатию (оптимизированная)
function handleMouseDown(e) {
    openMenuTimeout = setTimeout(() => {
        showMenu();
    }, 500);
}

function handleMouseUp() {
    if (openMenuTimeout) {
        clearTimeout(openMenuTimeout);
        openMenuTimeout = null;
    }
}

function handleMenuClick(e) {
    if (e.target === elements.wallpaperImg) {
        setWallpaper(wallpapers[currentWallpaperIndex]);
        hideMenu();
        return;
    }
    
    if (e.target === elements.menu) {
        hideMenu();
    }
}

// 2. Навигация стрелками
function handleArrowLeft(e) {
    e.stopPropagation();
    currentWallpaperIndex = (currentWallpaperIndex - 1 + wallpapers.length) % wallpapers.length;
    updateWallpaperImage();
}

function handleArrowRight(e) {
    e.stopPropagation();
    currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
    updateWallpaperImage();
}

// Вспомогательные функции
function showMenu() {
    if (isMenuOpen) return;
    
    const savedWallpaper = localStorage.getItem('currentWallpaper');
    if (savedWallpaper) {
        const index = wallpapers.indexOf(savedWallpaper);
        if (index !== -1) {
            currentWallpaperIndex = index;
        }
    }
    updateWallpaperImage();
    elements.menu.style.display = 'flex';
    isMenuOpen = true;
}

function hideMenu() {
    elements.menu.style.display = 'none';
    isMenuOpen = false;
}

function updateWallpaperImage() {
    elements.wallpaperImg.src = wallpapers[currentWallpaperIndex];
}

function setWallpaper(path) {
    elements.systemScreen.style.backgroundImage = `url(${path})`;
    localStorage.setItem('currentWallpaper', path);
}

// Инициализация
function init() {
    // Добавляем обработчики
    elements.systemScreen.addEventListener('mousedown', handleMouseDown);
    elements.systemScreen.addEventListener('mouseup', handleMouseUp);
    elements.systemScreen.addEventListener('touchstart', handleMouseDown, {passive: true});
    elements.systemScreen.addEventListener('touchend', handleMouseUp, {passive: true});
    
    elements.menu.addEventListener('click', handleMenuClick);
    elements.arrowLeft.addEventListener('click', handleArrowLeft);
    elements.arrowRight.addEventListener('click', handleArrowRight);
    
    // Закрытие меню при клике вне system-screen
    document.body.addEventListener('click', (e) => {
        if (isMenuOpen && !e.target.closest('.system-screen')) {
            hideMenu();
        }
    });
    
    // Загружаем сохраненные обои
    const savedWallpaper = localStorage.getItem('currentWallpaper');
    if (savedWallpaper) {
        setWallpaper(savedWallpaper);
    } else {
        setWallpaper(wallpapers[0]);
    }
    
    // Предзагрузка изображений
    setTimeout(preloadImages, 1000);
}

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}