/** Web only: load the dotLottie renderer from our own build (public/dotlottie-player.wasm) instead of a CDN. */
import { setWasmUrl } from '@lottiefiles/dotlottie-react';

setWasmUrl(new URL('dotlottie-player.wasm', document.baseURI).href);
