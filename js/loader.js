function hideLoader() {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
}

window.addEventListener('load', function() {
    setTimeout(hideLoader, 300);
});

setTimeout(hideLoader, 3000);