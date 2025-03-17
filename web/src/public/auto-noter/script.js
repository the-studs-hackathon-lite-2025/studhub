const inputContainer = document.getElementById('input-container');
const outputContainer = document.getElementById('output-container');

let modalContainer = document.getElementById('modal-container');
let modal = document.getElementById('modal');
let modalOpenTime;
let modalCloseTime;

let modal_name;

let canClose = true;

function modalHideOnClick(e) {
    const timePassed = Date.now() > (modalOpenTime + 450);
    if (e.target === modalContainer && timePassed && canClose) hideModal();
}

function hideModal(instant = false) {
    modalContainer = document.getElementById('modal-container');

    if (!modalContainer) {
        return setTimeout(() => {
            hideModal();
        }, 25);
    }

    modal = document.getElementById('modal');

    modalCloseTime = Date.now();

    if (instant) modalCloseTime -= 750;

    modalContainer.classList.remove("backdrop-brightness-75", "backdrop-saturate-50", "backdrop-blur-md")
    modal.classList.add("scale-50", "opacity-0", "blur-lg", "translate-y-6")

    setTimeout(() => {
        modalContainer.classList.add("opacity-0");
        setTimeout(() => {
            modalContainer.classList.add("hidden");
        }, instant ? 0 : 500);
    }, instant ? 0 : 200);
}


function showModal(modal_name) {
    if (Date.now() < (modalCloseTime + 750)) return;

    modal_name = modal_name || "default";

    modalContainer = document.getElementById('modal-container');
    modal = document.getElementById('modal');

    modalContainer.onclick = modalHideOnClick;

    modalOpenTime = Date.now();
    modalContainer.classList.remove("hidden");

    setTimeout(() => {
        modalContainer.classList.add("backdrop-brightness-75", "backdrop-saturate-50", "backdrop-blur-md")
        modalContainer.classList.remove("opacity-0");

        setTimeout(() => {
            modal.classList.remove("scale-50", "opacity-0", "blur-lg", "translate-y-6")
        }, 200)
    }, 0)
}

hideModal(true);

const dropZone = document.getElementById('drop-zone');
const dropZoneContent = document.getElementById('drop-zone-content');
const fileInput = document.getElementById('file-input');
const icon = document.getElementById('icon');
const message = document.getElementById('message');
const dropText = document.querySelector('.drop-text');

const response = document.getElementById('response');
const path = document.getElementById('path');
const responseTime = document.getElementById('response-time');

let lastTimeout = null;
let timeSinceDragAndDropHover = 0;

function hideDragAndDrop() {
    if (Date.now() - timeSinceDragAndDropHover < 600) {

    } else {
        message.style.color = '#e9e7f420';
        message.querySelector("a").style.opacity = 0.3;
        dropText.style.display = 'inline-block';
        dropText.style.scale = '1.2';
        dropText.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0)' }
        ], {
            duration: 600,
            easing: 'ease-out'
        });

        timeSinceDragAndDropHover = Date.now();
    }
}

function showDragAndDrop() {
    if (lastTimeout) {
        clearTimeout(lastTimeout);
    }
    setTimeout(() => {
        message.style.color = '#e9e7f4';
        message.querySelector("a").style.opacity = 1;
        dropText.style.scale = '1';
        timeSinceDragAndDropHover = 0;
    }, 600);
}

let dropLeaveTimeout = null;

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', function (e) {
    uploadFiles(e.target.files);
});

dropZone.addEventListener('dragover', function (e) {
    if (dropLeaveTimeout) clearTimeout(dropLeaveTimeout);

    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    icon.classList.add('scale-90', 'animate-pulse');
    hideDragAndDrop();
});

dropZone.addEventListener('dragleave', function (e) {
    if (dropLeaveTimeout) clearTimeout(dropLeaveTimeout);

    dropLeaveTimeout = setTimeout(() => {
        e.stopPropagation();
        e.preventDefault();
        icon.classList.remove('scale-90', 'animate-pulse');
        showDragAndDrop();

        dropLeaveTimeout = null;
    }, 100);
});

dropZone.addEventListener('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();

    uploadFiles(e.dataTransfer.files);
    icon.classList.remove('scale-90', 'animate-pulse');

    showDragAndDrop();
});

async function uploadFiles(files) {
    const formData = new FormData();
    formData.append('file', files[0]);
    const now = performance.now();

    // check if file is an audio file
    console.log(files[0].type);
    if (!files[0].type.startsWith('audio/')) {
        showModal('error');
        canClose = true;
        modal.innerHTML = `
        <div class="flex gap-5 items-center">
            <div class="relative">
                <svg class="size-10 fill-red-700 mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                    <path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z">
                    </path>
                </svg>
            </div>
            <div>
                <p class="opacity-50 text-sm">ERROR</p>
                <p class="text-xl">Bare lydfiler er tillatt</p>
            </div>
        </div>`;
        return;
    } else {
        showModal('loading');

        modal.classList.toggle("rounded-full", true);
        canClose = false;

        modal.innerHTML = `
    <div class="flex gap-5 items-center">
        <div class="relative">
            <svg class="size-10 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
        <div>
            <p class="text-xl">processing<span class="opacity-50">, please be patient</span></p>
        </div>
    </div>`;
    }

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    const id = data.id;

    modal.innerHTML = `
    <div class="flex gap-5 items-center">
        <div class="relative">
            <svg id="checkmark-svg" width="42" height="30" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_191_800)">
                    <path d="M11.8967 2.6718C12.3523 2.21619 12.3523 1.4775 11.8967 1.02188C11.441 0.566273 10.7024 0.566273 10.2467 1.02188L4.76597 6.50265L1.99163 3.7283C1.53601 3.27269 0.797321 3.27269 0.341709 3.7283C-0.113902 4.18392 -0.113904 4.92261 0.341708 5.37822L3.91727 8.95378C3.92494 8.96189 3.93274 8.96992 3.94068 8.97786C4.14357 9.18075 4.4026 9.29329 4.66776 9.31548C4.67681 9.31624 4.68587 9.31689 4.69493 9.31744C5.01684 9.33707 5.34534 9.2239 5.59132 8.97791C5.59986 8.96937 5.60825 8.96072 5.61647 8.95198L11.8967 2.6718Z" fill="#12B76A" />
                </g>
                <defs>
                    <filter id="filter0_i_191_800" x="0" y="0.680176" width="12.2383" height="9.22274" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.583333" />
                    <feGaussianBlur stdDeviation="0.291667" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_191_800" />
                    </filter>
                </defs>
            </svg>
        </div>
        <div>
            <p class="opacity-50 text-sm">SUCCESS</p>
            <p class="text-xl">File uploaded</p>
        </div>
    </div>`;

    document.getElementById('checkmark-svg').animate([
        { opacity: 0, transform: 'translateX(50%) rotate(90deg) scale(0)' },
        { transform: 'translateX(0) rotate(0deg) scale(1)', opacity: 1 }
    ], {
        duration: 300,
        easing: 'ease-out'
    }).onfinish = () => {
        hideModal();
    }

    handleUpload(id);
}

async function handleUpload(id) {
    const file = await fetch(`/api/transcribe/${id}`);
    const data = await file.json();

    inputContainer.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.75, transform: 'scale(1.05)' },
        { opacity: 0, transform: 'scale(0.9)' }
    ], {
        delay: 100,
        duration: 200,
        easing: 'ease-in'
    }).onfinish = () => {
        inputContainer.style.display = 'none';
        outputContainer.style.display = 'block';
        outputContainer.animate([
            { opacity: 0, transform: 'scale(0.9)' },
            { opacity: 0.75, transform: 'scale(1.05)' },
            { opacity: 1, transform: 'scale(1)' }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
    }
}

/* VISUALIZER */
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