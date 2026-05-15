import {
    TALK_THRESHOLD,
    IDLE_THRESHOLD,
    MIN_VOLUME
} from "./config.js";

import { startBtn }
    from "./dom.js";

import {
    startTalking,
    stopTalking
} from "./avatar.js";

// I set up the user's microphone and analyse volume levels here

export async function setupMic() {

    try {
    // I hide the start button oncethe avatar system begins running

    startBtn.style.display = "none";

    const stream =
            await navigator.mediaDevices
                .getUserMedia({
                    audio: true
                });

        const audioContext =
            new AudioContext();

        await audioContext.resume();

        const source =
            audioContext
                .createMediaStreamSource(stream);

        const analyser =
            audioContext.createAnalyser();

        source.connect(analyser);

        analyser.fftSize = 512;

        analyser.smoothingTimeConstant = 0.7;

        const dataArray =
            new Uint8Array(
                analyser.frequencyBinCount
            );

        // I track whether the avatar is currently speaking

        let speaking = false;

        function checkAudio() {

            analyser
                .getByteTimeDomainData(dataArray);

            let sum = 0;

            for (
                let i = 0;
                i < dataArray.length;
                i++
            ) {

                let value =
                    dataArray[i] - 128;

                sum += value * value;
            }

            // I calculate RMS volume because it produces smoother loudness values

            let volume =
                Math.sqrt(
                    sum / dataArray.length
                );

            // I remove tiny background noise so the avatar does not chatter

            if (volume < MIN_VOLUME) {

                volume = 0;
            }

            // I switch to talking when volume passes my threshold

            if (
                volume > TALK_THRESHOLD
                && !speaking
            ) {

                speaking = true;

                startTalking();
            }

            // I return to idle when the user stops speaking

            else if (
                volume < IDLE_THRESHOLD
                && speaking
            ) {

                speaking = false;

                stopTalking();
            }

            requestAnimationFrame(checkAudio);
        }

        checkAudio();

    } catch (error) {

        console.error(error);

        alert(
            "Microphone access failed."
        );
    }
}