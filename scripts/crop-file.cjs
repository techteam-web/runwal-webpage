// Usage: node scripts/crop-file.cjs "C01_2 .jpg" 12
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const filename = process.argv[2];
const percent = process.argv[3] ? Number(process.argv[3]) : 12;

if (!filename) {
  console.error('Usage: node scripts/crop-file.cjs "<filename in public>" <percentFromLeft>');
  process.exit(1);
}
if (isNaN(percent) || percent < 0 || percent >= 100) {
  console.error('Invalid percent. Provide a number between 0 and 99.');
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');
const srcPath = path.join(publicDir, filename);

if (!fs.existsSync(srcPath)) {
  console.error('Source image not found:', srcPath);
  process.exit(1);
}

const ext = path.extname(filename);
const base = path.basename(filename, ext);
const outName = `${base}_cropped${ext}`;
const outPath = path.join(publicDir, outName);

(async () => {
  try {
    const img = sharp(srcPath);
    const metadata = await img.metadata();
    const width = metadata.width;
    const height = metadata.height;

    const cropFromLeft = Math.round((percent / 100) * width);
    const newWidth = width - cropFromLeft;
    if (newWidth <= 0) throw new Error('Crop percent too large, resulting width <= 0');

    await img.extract({ left: cropFromLeft, top: 0, width: newWidth, height }).toFile(outPath);
    console.log('Cropped image written to', outPath);
  } catch (err) {
    console.error('Error cropping image:', err);
    process.exit(1);
  }
})();
