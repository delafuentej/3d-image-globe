import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "./public/images/webp";
const outputDir = "./public/images-optimized";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const sizes = [720, 1080, 1920]; // versiones adaptativas
const quality = 80; // calidad WebP

fs.readdirSync(inputDir).forEach((file) => {
  if (file.endsWith(".webp")) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;

    sizes.forEach((size) => {
      const outputPath = path.join(outputDir, `${baseName}-${size}.webp`);
      sharp(inputPath)
        .resize({ width: size })
        .webp({ quality, effort: 6 }) // effort: compresión más fuerte
        .toFile(outputPath)
        .then(() => console.log(`Optimized ${outputPath}`))
        .catch((err) => console.error(err));
    });
  }
});
