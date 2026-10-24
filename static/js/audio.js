import {
    TALK_THRESHOLD,
    IDLE_THRESHOLD,
    MIN_VOLUME,
    SPEECH_HOLD_TIME
} from "./config.js";

import {
    setDebugValue
} from "./debug.js";

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

        // Used to remember the last time audio was heard

        let lastTimeSpeaking = 0;

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

            // I update the last speech time whenever
            // the user is talking.

            if (volume > TALK_THRESHOLD) {

                lastTimeSpeaking = Date.now();

                    if (!speaking) {

                        speaking = true;

                        startTalking();
                    }
            }

            // I work out how long it has been
// since I last detected speech.

const timeSinceSpeech =
    Date.now() - lastTimeSpeaking;

// I only return to idle after the
// user has been quiet long enough.

if (
    speaking &&
    volume < IDLE_THRESHOLD &&
    timeSinceSpeech > SPEECH_HOLD_TIME
) {

    speaking = false;

    stopTalking();
}
setDebugValue(
    "volume",
    volume
);

setDebugValue(
    "speaking",
    speaking
);

requestAnimationFrame(checkAudio);
        }

        checkAudio();

    } catch (error) {

    console.error(error);

    alert(error.message);
}
}