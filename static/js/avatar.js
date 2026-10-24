import {
    beak,
    avatarContainer
} from "./dom.js";

// I use this function to switch the avatar into a talking state

export function startTalking() {

        console.log("Talking");

    beak.src =
        "/static/avatars/mouth-open.png";

    avatarContainer.classList.add("talking");

    avatarContainer.classList.add("avatar-active");

    console.log(avatarContainer.className);
}

// I use this function to return the avatar back to idling

export function stopTalking() {

        console.log("Idle");


    beak.src = "/static/avatars/mouth-closed.png";

    avatarContainer.classList.remove("talking");

    avatarContainer.classList.remove("avatar-active");
}