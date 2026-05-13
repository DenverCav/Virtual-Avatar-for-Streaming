const img = document.getElementById("avatar");

async function setupMic() {

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });

    const audioContext = new AudioContext();

    await audioContext.resume();

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);

    analyser.fftSize = 512;

    analyser.smoothingTimeConstant = 0.85;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    let speaking = false;

    function checkAudio() {

        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;

        for (let i = 0; i < dataArray.length; i++) {

            let value = dataArray[i] - 128;
            sum += value * value;
        }

        const volume = Math.sqrt(sum / dataArray.length);

        // Talking
        if (volume > 12 && !speaking) {

            speaking = true;

            img.src = "/static/talk.png";

            img.classList.add("talking");
        }

        // Idle
        else if (volume < 8 && speaking) {

            speaking = false;

            img.src = "/static/idle.png";

            img.classList.remove("talking");
        }

        requestAnimationFrame(checkAudio);
    }

    checkAudio();
}

setupMic();