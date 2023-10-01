const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadFile(url, output) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${output}`);
    const file = fs.createWriteStream(output);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (error) => {
        fs.unlink(output);
        reject(error);
      });
  });
}

(async () => {
  const assetDir = path.join(__dirname, '..', 'game', 'assets');
  await downloadFile(
    'https://esotericsoftware.com/files/examples/4.0/spineboy/export/spineboy-ess.json',
    path.join(assetDir, 'spineboy-ess.json'),
  );
  await downloadFile(
    'https://esotericsoftware.com/files/examples/4.0/spineboy/export/spineboy.png',
    path.join(assetDir, 'spineboy.png'),
  );
  await downloadFile(
    'https://esotericsoftware.com/files/examples/4.0/spineboy/export/spineboy.atlas',
    path.join(assetDir, 'spineboy.atlas'),
  );
})();
