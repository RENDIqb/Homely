function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
    }
}

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showLoader();
});

function checkAllImagesLoaded() {
    const images = document.querySelectorAll('img');
    const backgroundImages = document.querySelectorAll('[style*="background-image"]');
    let imagesToLoad = images.length;
    let backgroundsToLoad = backgroundImages.length;
    let totalLoaded = 0;
    
    if (imagesToLoad === 0 && backgroundsToLoad === 0) {
        return Promise.resolve();
    }
    
    return new Promise((resolve) => {
        images.forEach(img => {
            if (img.complete) {
                imagesToLoad--;
                checkAllResourcesLoaded();
            } else {
                img.addEventListener('load', () => {
                    imagesToLoad--;
                    checkAllResourcesLoaded();
                });
                img.addEventListener('error', () => {
                    imagesToLoad--;
                    checkAllResourcesLoaded();
                });
            }
        });
        
        backgroundImages.forEach(el => {
            const bgImage = el.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            if (bgImage) {
                const img = new Image();
                img.src = bgImage;
                if (img.complete) {
                    backgroundsToLoad--;
                    checkAllResourcesLoaded();
                } else {
                    img.addEventListener('load', () => {
                        backgroundsToLoad--;
                        checkAllResourcesLoaded();
                    });
                    img.addEventListener('error', () => {
                        backgroundsToLoad--;
                        checkAllResourcesLoaded();
                    });
                }
            } else {
                backgroundsToLoad--;
                checkAllResourcesLoaded();
            }
        });
        
        function checkAllResourcesLoaded() {
            if (imagesToLoad <= 0 && backgroundsToLoad <= 0) {
                resolve();
            }
        }
    });
}

window.addEventListener('load', function() {
    checkAllImagesLoaded().then(() => {
        setTimeout(hideLoader, 300);
    });
});

setTimeout(hideLoader, 5000);