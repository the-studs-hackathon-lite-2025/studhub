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

const submit = document.getElementById('submit');
const enterManually = document.getElementById('enter-manually');
const url = document.getElementById('url');
const search = document.querySelector('.search');

async function submitWebsite() {
    canClose = false;
    let website = null;

    try {
        website = new URL(url.value);
    } catch (error) {
        search.animate([
            { boxShadow: "0 0 0 0.25rem rgba(255, 0, 0, 0.5)", scale: 0.95 },
            { boxShadow: "none" }
        ], {
            duration: 300,
            iterations: 1
        });

        notify("Invalid URL", "Please enter a valid URL", 3000, ["bg-red-500", "text-white"]);
        return
    }
    
    console.log(website);

    showModal("loading");

    modal.innerHTML = `
    <div class="flex gap-5 items-center">
        <svg class="size-10 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p class="text-xl">Processing<span class="opacity-50">, please be patient</span></p>
    </div>`;
}

submit.addEventListener('click', submitWebsite);