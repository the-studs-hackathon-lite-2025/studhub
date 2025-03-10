/* By the goat https://codepen.io/davidtorroija */

const canvasElm = document.getElementById('canvas');

obj = {}
function init() {
    obj.canvas = canvasElm;
    obj.ctx = obj.canvas.getContext('2d');
    obj.width = canvasElm.offsetWidth
    obj.height = canvasElm.offsetHeight
    obj.canvas.width = obj.width * window.devicePixelRatio;
    obj.canvas.height = obj.height * window.devicePixelRatio;
    obj.canvas.style.width = obj.width + 'px';
    obj.canvas.style.height = obj.height + 'px';
    obj.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function randomInteger(max = 256) {
    return Math.floor(Math.random() * max);
}
let timeOffset = 100;
let now = parseInt(performance.now()) / timeOffset;

function loop() {
    //console.log("arr", obj.frequencyArray)
    obj.ctx.clearRect(0, 0, obj.canvas.width, obj.canvas.height);
    let max = 0;

    if (parseInt(performance.now() / timeOffset) > now) {
        now = parseInt(performance.now() / timeOffset);
        obj.analyser.getFloatTimeDomainData(obj.frequencyArray)
        for (var i = 0; i < obj.frequencyArray.length; i++) {
            if (obj.frequencyArray[i] > max) {
                max = obj.frequencyArray[i];
            }
        }

        var freq = Math.floor(max * 100);


        obj.bars.push({
            x: obj.width,
            y: (obj.height / 2) - (freq / 2),
            height: freq,
            width: 5
        });
    }
    draw();
    requestAnimationFrame(loop);
}
obj.bars = [];

function draw() {
    for (i = 0; i < obj.bars.length; i++) {
        const bar = obj.bars[i];
        obj.ctx.fillStyle = `rgb(${bar.height * 2},100,222)`;
        obj.ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
        bar.x = bar.x - 2;

        if (bar.x < 1) {
            obj.bars.splice(i, 1)
        }

    }
}

function soundAllowed(stream) {
    var AudioContext = (window.AudioContext || window.webkitAudioContext)
    var audioContent = new AudioContext();
    var streamSource = audioContent.createMediaStreamSource(stream);

    obj.analyser = audioContent.createAnalyser();
    streamSource.connect(obj.analyser);
    obj.analyser.fftSize = 512;
    obj.frequencyArray = new Float32Array(obj.analyser.fftSize);
    init()
    loop()
}

function soundNotAllowed() {

}



navigator.mediaDevices.getUserMedia({ audio: true }).then(soundAllowed).catch(soundNotAllowed)