/** Copies the dotLottie web renderer (WASM) next to the web build so animations load without a CDN. */
const fs = require('fs');
const path = require('path');
const src = require.resolve('@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm');
const dest = path.join(__dirname, '..', 'public', 'dotlottie-player.wasm');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log('[lottie] wasm copied to public/');
