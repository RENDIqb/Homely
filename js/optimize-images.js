// Запустите этот скрипт Node.js для оптимизации изображений
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'Background/';
const outputDir = 'Background/optimized/';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
        sharp(path.join(inputDir, file))
            .resize(450, 562) // Точный размер экрана
            .jpeg({ quality: 70, progressive: true })
            .toFile(path.join(outputDir, file.replace(/\.[^/.]+$/, '-optimized.jpg')))
            .then(() => console.log(`Optimized: ${file}`))
            .catch(err => console.error(`Error with ${file}:`, err));
    }
});