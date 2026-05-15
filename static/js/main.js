import { startBtn } from "./dom.js";

import { setupMic } from "./audio.js";

import { animateEyes }
    from "./eyeTracking.js";

// I start eye animation immediately

animateEyes();

// I wait for the user to press the start button before enabling audio

startBtn.addEventListener(
    "click",
    setupMic
);