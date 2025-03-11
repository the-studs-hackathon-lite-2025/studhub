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

    modalContainer.addEventListener('click', modalHideOnClick)

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


function countTextStats(text) {
    const charCount = text.length;
    const wordCount = text.match(/\w+/g)?.length || 0;
    const sentenceCount = text.match(/[.!?]+(?=\s|$)/g)?.length || 0;
    
    return {
        characters: charCount,
        words: wordCount,
        sentences: sentenceCount
    };
};

const input = document.getElementById('input');
const submit = document.getElementById('submit');

const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const sentenceCount = document.getElementById('sentence-count');

input.addEventListener('input', () => {
    const stats = countTextStats(input.value);
    charCount.textContent = stats.characters
    wordCount.textContent = stats.words;
    sentenceCount.textContent = stats.sentences;
});

submit.addEventListener('click', () => {
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
});