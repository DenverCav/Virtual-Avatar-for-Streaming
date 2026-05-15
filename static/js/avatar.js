import {
    beak,
    avatarContainer
} from "./dom.js";

// I use this function to switch the avatar into a talking state

export function startTalking() {

    beak.src =
        "/static/avatars/mouth-open.png";

    avatarContainer
        .classList.add("talking");
}

// I use this function to return the avatar back to idling

export function stopTalking() {

    beak.src =
        "/static/avatars/mouth-closed.png";

    avatarContainer
        .classList.remove("talking");
}