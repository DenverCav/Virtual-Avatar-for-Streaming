import { eyes } from "./dom.js";

import {
    EYE_SMOOTHING,
    EYE_RANGE_X,
    EYE_RANGE_Y
} from "./config.js";

import {
    setDebugValue
} from "./debug.js";

// I store where the mouse WANTS the eyes to move

let eyeTargetX = 0;
let eyeTargetY = 0;

// I store the CURRENT eye position so I can smoothly interpolate movement

let eyeCurrentX = 0;
let eyeCurrentY = 0;

// I listen for mouse movement so I can update my eye targets

document.addEventListener("mousemove", (e) => {

    eyeTargetX =
        (e.clientX / window.innerWidth - 0.5);

    eyeTargetY =
        (e.clientY / window.innerHeight - 0.5);
});



// I continuously animate the eyes using interpolation

export function animateEyes() {

    eyeCurrentX +=
        (eyeTargetX - eyeCurrentX)
        * EYE_SMOOTHING;

    eyeCurrentY +=
        (eyeTargetY - eyeCurrentY)
        * EYE_SMOOTHING;

    // I move the eyes slightly to fake directional looking

    eyes.style.transform =
        `translate(
            ${eyeCurrentX * EYE_RANGE_X}px,
            ${eyeCurrentY * EYE_RANGE_Y}px
        )`;

    setDebugValue(
    "eyeX",
    eyeCurrentX
);

setDebugValue(
    "eyeY",
    eyeCurrentY
);

    requestAnimationFrame(animateEyes);
}