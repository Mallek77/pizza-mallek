const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jfif'));

async function convert() {
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const baseName = path.parse(file).name;
    
    // Convert to JPG (universal support)
    const jpgPath = path.join(imagesDir, `${baseName}.jpg`);
    await sharp(inputPath)
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpgPath);
    console.log(`Converted: ${file} -> ${baseName}.jpg`);

    // Convert to WebP (modern, smaller)
    const webpPath = path.join(imagesDir, `${baseName}.webp`);
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(webpPath);
    console.log(`Converted: ${file} -> ${baseName}.webp`);
  }
  console.log('All conversions complete!');
}

convert().catch(console.error);