import { startBtn } from "./dom.js";

import { setupMic } from "./audio.js";

import { animateEyes } from "./eyeTracking.js";

import { recordingMode } from "./config.js";

// I switch the page into recording mode when I want to record with a green screen.

if (recordingMode) {
    document.body.classList.add("recording-mode");
}

// I start eye animation immediately

animateEyes();

// I wait for the user to press the start button before enabling audio

startBtn.addEventListener(
    "click",
    setupMic
);