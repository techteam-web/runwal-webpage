// Crop script for copy_3.jpg
// Usage: node scripts/crop-image.js [percentFromLeft]
// percentFromLeft: number between 0 and 100, default 12 (crop 12% from left)

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const percent = process.argv[2] ? Number(process.argv[2]) : 12;
if (isNaN(percent) || percent < 0 || percent >= 100) {
	console.error('Invalid percent. Provide a number between 0 and 99.');
	process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');
const srcPath = path.join(publicDir, 'copy_3.jpg');
const outPath = path.join(publicDir, 'copy_3_cropped.jpg');

if (!fs.existsSync(srcPath)) {
	console.error('Source image not found:', srcPath);
	process.exit(1);
}

(async () => {
	try {
		const img = sharp(srcPath);
		const metadata = await img.metadata();
		const width = metadata.width;
		const height = metadata.height;

		const cropFromLeft = Math.round((percent / 100) * width);
		const newWidth = width - cropFromLeft;
		if (newWidth <= 0) {
			throw new Error('Crop percent too large, resulting width <= 0');
		}

		await img.extract({ left: cropFromLeft, top: 0, width: newWidth, height }).toFile(outPath);
		console.log('Cropped image written to', outPath);
	} catch (err) {
		console.error('Error cropping image:', err);
		process.exit(1);
	}
})();
