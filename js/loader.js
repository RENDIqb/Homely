class EnhancedPageLoader {
    constructor() {
        this.loader = document.getElementById('loader');
        this.minDisplayTime = 1000;
        this.maxWaitTime = 8000;
        this.startTime = Date.now();
        this.isFirstLoad = !sessionStorage.getItem('pageAlreadyLoaded');
        this.resources = {
            images: [],
            fonts: [],
            styles: [],
            critical: []
        };
        this.loadedCount = 0;
        this.totalCount = 0;
        
        this.init();
    }

    init() {
        if (!this.loader) return;
        
        if (!this.isFirstLoad || this.shouldSkipLoader()) {
            this.removeLoaderImmediately();
            return;
        }

        this.showLoader();
        this.collectResources();
        this.setupEventListeners();
        this.setSafetyTimeout();
        this.startLoading();
    }

    collectResources() {
        // Критические ресурсы
        this.resources.critical = [
            '../assets/showcase.png',
            'css/fonts.css',
            'css/body.css',
            'css/content.css',
            'css/loader.css'
        ];

        // Изображения
        const images = document.querySelectorAll('img');
        this.resources.images = Array.from(images).map(img => img.src);

        // Фон
        const bgElements = document.querySelectorAll('[style*="background-image"], .image-wrapper');
        bgElements.forEach(el => {
            const bgImage = window.getComputedStyle(el).backgroundImage;
            if (bgImage && bgImage !== 'none' && !bgImage.includes('data:image')) {
                const url = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                this.resources.images.push(url);
            }
        });

        // Шрифты из CSS
        this.resources.fonts = [
            '../Fonts/NotoSans-Regular.ttf',
            '../Fonts/NotoSans-Italic.ttf',
            '../Fonts/NotoSans-Medium.ttf',
            '../Fonts/NotoSans-Bold.ttf'
        ];

        // Стили
        const styles = document.querySelectorAll('link[rel="stylesheet"]');
        this.resources.styles = Array.from(styles).map(link => link.href);

        // Подсчет общего количества
        this.totalCount = this.resources.critical.length + 
                         this.resources.images.length + 
                         this.resources.fonts.length;
    }

    async startLoading() {
        try {
            // Предзагрузка критических ресурсов
            await this.preloadCriticalResources();
            
            // Загрузка шрифтов
            await this.loadFonts();
            
            // Загрузка изображений
            await this.loadImages();
            
            // Все загружено
            this.onResourcesLoaded();
            
        } catch (error) {
            console.warn('Loading completed with warnings:', error);
            this.onResourcesLoaded(); // Все равно завершаем
        }
    }

    async preloadCriticalResources() {
        const promises = this.resources.critical.map(resource => {
            return new Promise((resolve) => {
                const link = document.createElement('link');
                link.rel = resource.endsWith('.css') ? 'preload' : 'preload';
                link.as = resource.endsWith('.css') ? 'style' : 'image';
                link.href = resource;
                link.onload = () => {
                    this.updateProgress();
                    resolve();
                };
                link.onerror = () => {
                    this.updateProgress();
                    resolve(); // Продолжаем даже при ошибке
                };
                document.head.appendChild(link);
            });
        });

        await Promise.all(promises);
    }

    async loadFonts() {
        if (!('fonts' in document)) {
            this.updateProgress(this.resources.fonts.length);
            return;
        }

        const fontPromises = this.resources.fonts.map(fontUrl => {
            return new Promise((resolve) => {
                const font = new FontFace('NotoSans', `url(${fontUrl})`);
                
                font.load().then(loadedFont => {
                    document.fonts.add(loadedFont);
                    this.updateProgress();
                    resolve();
                }).catch(() => {
                    this.updateProgress();
                    resolve(); // Продолжаем при ошибке
                });
            });
        });

        await Promise.all(fontPromises);
    }

    async loadImages() {
        const imagePromises = this.resources.images.map(imageUrl => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.updateProgress();
                    resolve();
                };
                img.onerror = () => {
                    this.updateProgress();
                    resolve(); // Продолжаем при ошибке
                };
                img.src = imageUrl;
            });
        });

        await Promise.all(imagePromises);
    }

    updateProgress() {
        this.loadedCount++;
        const percentage = Math.min(100, Math.round((this.loadedCount / this.totalCount) * 100));
        
        // Можно добавить отображение прогресса, если нужно
        const progressElements = this.loader.querySelectorAll('.loader-circle');
        if (progressElements.length > 0) {
            // Анимируем точки в зависимости от прогресса
            progressElements.forEach((circle, index) => {
                if (percentage >= (index + 1) * 25) {
                    circle.style.opacity = '1';
                    circle.style.transform = 'scale(1)';
                }
            });
        }
    }

    onResourcesLoaded() {
        this.resourcesLoaded = true;
        this.hideLoader();
    }

    shouldSkipLoader() {
        return this.isPageCached() && this.areCriticalResourcesCached();
    }

    isPageCached() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return navigation && navigation.type === 'back_forward';
    }

    areCriticalResourcesCached() {
        // Проверяем, закэшированы ли критические ресурсы
        return this.resources.critical.every(resource => {
            if (resource.endsWith('.png')) {
                const img = new Image();
                img.src = resource;
                return img.complete;
            }
            return true;
        });
    }

    showLoader() {
        if (this.loader) {
            this.loader.classList.remove('hidden');
        }
    }

    async hideLoader() {
        if (!this.loader || this.loader.classList.contains('hidden')) return;

        const elapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsed);

        await new Promise(resolve => setTimeout(resolve, remainingTime));

        this.loader.classList.add('hidden');
        sessionStorage.setItem('pageAlreadyLoaded', 'true');
        
        setTimeout(() => {
            if (this.loader && this.loader.parentNode) {
                this.loader.parentNode.removeChild(this.loader);
            }
        }, 500);
    }

    removeLoaderImmediately() {
        if (this.loader && this.loader.parentNode) {
            this.loader.parentNode.removeChild(this.loader);
        }
    }

    setupEventListeners() {
        // Резервные обработчики
        window.addEventListener('load', () => {
            if (!this.resourcesLoaded) {
                this.resourcesLoaded = true;
                this.hideLoader();
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            if (document.readyState === 'complete' && !this.resourcesLoaded) {
                this.resourcesLoaded = true;
                this.hideLoader();
            }
        });
    }

    setSafetyTimeout() {
        setTimeout(() => {
            if (!this.resourcesLoaded) {
                this.resourcesLoaded = true;
                this.hideLoader();
            }
        }, this.maxWaitTime);
    }
}

// Глобальные функции
window.showLoader = function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
};

window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('pageAlreadyLoaded');
});

// Инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new EnhancedPageLoader();
    });
} else {
    new EnhancedPageLoader();
}