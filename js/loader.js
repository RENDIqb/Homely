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

function isPageCached() {
    return window.performance && 
           performance.navigation && 
           performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD;
}

function areCriticalResourcesLoaded() {
    const bgElement = document.querySelector('.image-wrapper');
    if (bgElement) {
        const bgImageUrl = window.getComputedStyle(bgElement).backgroundImage;
        if (bgImageUrl && bgImageUrl !== 'none') {
            if (bgImageUrl.includes('data:image')) {
                return true;
            }
            
            const img = new Image();
            img.src = bgImageUrl.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            return img.complete;
        }
    }
    return false;
}

function initLoader() {
    if ((isPageCached() || performance.getEntriesByType("navigation")[0].type === 'reload') && 
        areCriticalResourcesLoaded()) {
        hideLoader();
        return;
    }
    
    showLoader();
    
    window.addEventListener('load', function() {
        setTimeout(hideLoader, 300);
    });
    
    setTimeout(hideLoader, 3000);
}

document.addEventListener('DOMContentLoaded', initLoader);