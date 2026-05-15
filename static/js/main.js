// =========================
// AVATAR ELEMENTS
// =========================

const idleImg = document.getElementById("idle");
const talkImg = document.getElementById("talk");

const startBtn = document.getElementById("startBtn");

// =========================
// SETTINGS
// =========================

// Higher = harder to activate talking
const TALK_THRESHOLD = 7;

// Lower = easier to return to idle
const IDLE_THRESHOLD = 4;

// Ignore tiny background noise
const MIN_VOLUME = 2;

// =========================
// START BUTTON
// =========================

startBtn.addEventListener("click", setupMic);

// =========================
// MICROPHONE SETUP
// =========================

async function setupMic() {

    try {

        // Hide button after starting
        startBtn.style.display = "none";

        // Ask for microphone access
        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        // Create audio context
        const audioContext = new AudioContext();

        // Some browsers require resume()
        await audioContext.resume();

        // Convert microphone stream
        const source =
            audioContext.createMediaStreamSource(stream);

        // Create analyser
        const analyser =
            audioContext.createAnalyser();

        // Connect source to analyser
        source.connect(analyser);

        // Audio quality settings
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.7;

        // Store audio data
        const dataArray =
            new Uint8Array(analyser.frequencyBinCount);

        // Track talking state
        let speaking = false;

        // =========================
        // MAIN AUDIO LOOP
        // =========================

        function checkAudio() {

            // Read microphone data
            analyser.getByteTimeDomainData(dataArray);

            let sum = 0;

            const length = dataArray.length;

            // Calculate RMS volume
            for (let i = 0; i < length; i++) {

                let value = dataArray[i] - 128;

                sum += value * value;
            }

            // Final volume value
            let volume =
                Math.sqrt(sum / length);

            // Remove tiny background noise
            if (volume < MIN_VOLUME) {

                volume = 0;
            }

            // =========================
            // TALKING
            // =========================

            if (volume > TALK_THRESHOLD && !speaking) {

                speaking = true;

                // Switch visible image
                idleImg.classList.remove("active");
                talkImg.classList.add("active");

                // Add animation
                talkImg.classList.add("talking");
            }

            // =========================
            // IDLE
            // =========================

            else if (volume < IDLE_THRESHOLD && speaking) {

                speaking = false;

                // Switch visible image
                talkImg.classList.remove("active");
                idleImg.classList.add("active");

                // Remove animation
                talkImg.classList.remove("talking");
            }

            // Run again next frame
            requestAnimationFrame(checkAudio);
        }

        // Start loop
        checkAudio();

    } catch (error) {

        console.error(
            "Microphone access failed:",
            error
        );

        alert(
            "Microphone access is required."
        );
    }
}