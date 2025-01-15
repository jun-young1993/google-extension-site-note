const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const DEST_DIR = path.join(__dirname, '../dist');
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip');

function extractExtensionData() {
  const manifest = require('../public/manifest.json');
  const name = manifest.name.toLowerCase().replace(/\s/g, '-');
  const version = manifest.version.replace(/\./g, '_');
  return { name, version };
}

function buildZip(src, dist, zipFilename) {
  console.info(`Building ${zipFilename}...`);
  const zipFilePath = path.join(dist, zipFilename);

  if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath);
  }

  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(zipFilePath);

  return new Promise((resolve, reject) => {
    archive.directory(src, false).on('error', reject).pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
}

const { name, version } = extractExtensionData();
const zipFilename = `${name}-v${version}.zip`;

if (!fs.existsSync(DEST_ZIP_DIR)) fs.mkdirSync(DEST_ZIP_DIR);

buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
  .then(() => console.info('SUCCESS'))
  .catch(console.err);
