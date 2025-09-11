class PageLoader {
    constructor() {
        this.loader = document.getElementById('loader');
        this.minDisplayTime = 1000;
        this.maxWaitTime = 8000;
        this.startTime = Date.now();
        this.resourcesLoaded = false;
        this.imageLoaded = false;
        this.isFirstLoad = !sessionStorage.getItem('pageAlreadyLoaded');
        
        this.init();
    }

    init() {
        if (!this.loader) return;
        if (!this.isFirstLoad) {
            this.removeLoaderImmediately();
            return;
        }

        if (this.shouldSkipLoader()) {
            this.removeLoaderImmediately();
            return;
        }

        this.showLoader();
        this.setupEventListeners();
        this.setSafetyTimeout();
        this.preloadCriticalResources();
        this.trackBackgroundImage();
    }

    shouldSkipLoader() {
        return this.isPageCached() && this.areCriticalResourcesLoaded();
    }

    isPageCached() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return navigation && (
            navigation.type === 'back_forward' || 
            performance.navigation?.type === 2
        );
    }

    areCriticalResourcesLoaded() {
        return this.isBackgroundLoaded() && 
               this.isFontsLoaded() &&
               this.isPreloadResourceLoaded();
    }

    isBackgroundLoaded() {
        const bgElement = document.querySelector('.image-wrapper');
        if (!bgElement) return false;

        const bgImage = window.getComputedStyle(bgElement).backgroundImage;
        if (!bgImage || bgImage === 'none') return true;

        if (bgImage.includes('data:image') || bgImage.includes('gradient')) {
            return true;
        }

        const img = new Image();
        img.src = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        return img.complete;
    }

    isFontsLoaded() {
        if ('fonts' in document) {
            return Promise.all([
                document.fonts.load('1rem "NotoSans"'),
                document.fonts.load('1rem "NotoSans"')
            ]).then(() => true).catch(() => false);
        }
        return true;
    }

    isPreloadResourceLoaded() {
        const preloadLinks = document.querySelectorAll('link[rel="preload"]');
        return Array.from(preloadLinks).every(link => {
            if (link.as === 'image') {
                const img = new Image();
                img.src = link.href;
                return img.complete;
            }
            return true;
        });
    }

    preloadCriticalResources() {
        const criticalResources = [
            '../assets/showcase.png',
            'css/fonts.css',
            'css/body.css',
            'css/content.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.includes('.css') ? 'style' : 'image';
            link.href = resource;
            document.head.appendChild(link);
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
        window.addEventListener('load', () => {
            this.resourcesLoaded = true;
            this.checkAllResourcesLoaded();
        });

        document.addEventListener('DOMContentLoaded', () => {
            if (document.readyState === 'complete') {
                this.resourcesLoaded = true;
                this.checkAllResourcesLoaded();
            }
        });

        this.trackFontsLoading();
        this.trackImagesLoading();
    }

    trackBackgroundImage() {
        const imageWrapper = document.querySelector('.image-wrapper');
        if (!imageWrapper) {
            this.imageLoaded = true;
            return;
        }

        const bgImage = window.getComputedStyle(imageWrapper).backgroundImage;
        if (!bgImage || bgImage === 'none' || bgImage.includes('data:image')) {
            this.imageLoaded = true;
            return;
        }

        const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        
        const img = new Image();
        img.onload = () => {
            this.imageLoaded = true;
            this.checkAllResourcesLoaded();
        };
        img.onerror = () => {
            console.warn('Failed to load background image:', imageUrl);
            this.imageLoaded = true;
            this.checkAllResourcesLoaded();
        };
        img.src = imageUrl;
    }

    checkAllResourcesLoaded() {
        if (this.resourcesLoaded && this.imageLoaded) {
            this.hideLoader();
        }
    }

    async trackFontsLoading() {
        if ('fonts' in document) {
            try {
                await document.fonts.ready;
                this.resourcesLoaded = true;
                this.checkAllResourcesLoaded();
            } catch (error) {
                console.warn('Font loading tracking failed:', error);
            }
        }
    }

    trackImagesLoading() {
        const criticalImages = document.querySelectorAll('img[loading="eager"]');
        let loadedCount = 0;
        const totalCount = criticalImages.length;

        if (totalCount === 0) {
            this.resourcesLoaded = true;
            this.checkAllResourcesLoaded();
            return;
        }

        const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount === totalCount) {
                this.resourcesLoaded = true;
                this.checkAllResourcesLoaded();
            }
        };

        criticalImages.forEach(img => {
            if (img.complete) {
                checkAllLoaded();
            } else {
                img.addEventListener('load', checkAllLoaded);
                img.addEventListener('error', checkAllLoaded);
            }
        });
    }

    setSafetyTimeout() {
        setTimeout(() => {
            if (!this.resourcesLoaded || !this.imageLoaded) {
                this.resourcesLoaded = true;
                this.imageLoaded = true;
                this.hideLoader();
            }
        }, this.maxWaitTime);
    }
}

window.showLoader = function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
};

window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('pageAlreadyLoaded');
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PageLoader();
    });
} else {
    new PageLoader();
}