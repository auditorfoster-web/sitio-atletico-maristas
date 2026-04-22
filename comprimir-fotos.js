// Comprime todas las fotos JPG/PNG de la carpeta fotos/ para web
// Resultado: max 1600px ancho, JPEG calidad 80 → ~200-400 KB por foto

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const FOTOS_DIR = path.join(__dirname, 'fotos');
const MAX_WIDTH = 1600;
const QUALITY = 80;

function getAllImages(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllImages(full));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function comprimirFoto(filePath) {
  const tmpPath = filePath + '.tmp';
  const ext = path.extname(filePath).toLowerCase();
  const statBefore = fs.statSync(filePath).size;

  try {
    const img = sharp(filePath).rotate(); // rotate() respeta el EXIF de orientación
    const meta = await img.metadata();

    // Solo redimensiona si es más ancha que MAX_WIDTH
    if (meta.width > MAX_WIDTH) {
      img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    if (ext === '.png') {
      await img.png({ compressionLevel: 9 }).toFile(tmpPath);
    } else {
      await img.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tmpPath);
    }

    const statAfter = fs.statSync(tmpPath).size;

    // Solo reemplaza si el archivo comprimido es más pequeño
    if (statAfter < statBefore) {
      fs.renameSync(tmpPath, filePath);
      const ahorro = ((1 - statAfter / statBefore) * 100).toFixed(0);
      const antes = (statBefore / 1024 / 1024).toFixed(1);
      const despues = (statAfter / 1024).toFixed(0);
      console.log(`  ✓ ${path.relative(__dirname, filePath).padEnd(50)} ${antes}MB → ${despues}KB (-${ahorro}%)`);
    } else {
      fs.unlinkSync(tmpPath);
      console.log(`  - ${path.relative(__dirname, filePath)} ya estaba optimizada`);
    }
  } catch (err) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    console.error(`  ✗ Error en ${filePath}: ${err.message}`);
  }
}

async function main() {
  const fotos = getAllImages(FOTOS_DIR);
  const totalMB = fotos.reduce((sum, f) => sum + fs.statSync(f).size, 0) / 1024 / 1024;
  console.log(`\nComprimiendo ${fotos.length} fotos (${totalMB.toFixed(0)} MB total)...\n`);

  for (const foto of fotos) {
    await comprimirFoto(foto);
  }

  const totalMBDespues = fotos.reduce((sum, f) => sum + fs.statSync(f).size, 0) / 1024 / 1024;
  console.log(`\nFinalizado: ${totalMB.toFixed(0)} MB → ${totalMBDespues.toFixed(0)} MB`);
}

main();
