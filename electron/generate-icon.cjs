const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico').default;

const rootDir = path.join(__dirname, '..');
const sourcePng = path.join(rootDir, 'build-resources', 'icon.png');
const tempDir = path.join(rootDir, 'build-resources', '.icon-temp');
const targetIco = path.join(rootDir, 'build-resources', 'icon.ico');
const sizes = [16, 24, 32, 48, 64, 128, 256];

async function main() {
  if (!fs.existsSync(sourcePng)) {
    throw new Error(`Missing source icon: ${sourcePng}`);
  }

  fs.mkdirSync(tempDir, { recursive: true });

  const generatedPngs = [];
  for (const size of sizes) {
    const outputPath = path.join(tempDir, `icon-${size}.png`);
    await sharp(sourcePng).resize(size, size, { fit: 'cover' }).png().toFile(outputPath);
    generatedPngs.push(outputPath);
  }

  const icoBuffer = await pngToIco(generatedPngs);
  fs.writeFileSync(targetIco, icoBuffer);
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log(`Generated Windows icon: ${targetIco}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
