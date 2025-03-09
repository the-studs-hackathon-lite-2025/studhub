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

const title = document.getElementById('title');
const link = document.getElementById('link');
const website = document.getElementById('website');

const settTilIdag = document.getElementById('sett-til-idag');

const inputContainer = document.getElementById('input-container');
const overviewContainer = document.getElementById('overview-container');

const backToInput = document.getElementById('back-to-input');

backToInput.onclick = () => {    
    inputContainer.classList.remove('hidden');
    overviewContainer.classList.add('hidden');

    inputContainer.animate([
        { opacity: 0, transform: 'scale(1.2)' },
        { opacity: 0.75, transform: 'scale(0.975)' },
        { opacity: 1, transform: 'scale(1)' }
    ], {
        duration: 200,
        iterations: 1
    });
}

enterManually.onclick = () => {
    inputContainer.classList.add('hidden');
    overviewContainer.classList.remove('hidden');

    overviewContainer.animate([
        { transform: 'scale(0.955)' },
        { transform: 'scale(1.01)' },
        { transform: 'scale(1)' }
    ], {
        duration: 150,
        iterations: 1
    });
}

const [
    datePublishedDay,
    datePublishedMonth,
    datePublishedYear
] = document.querySelectorAll('.date-published');

const [
    dateAccessedDay,
    dateAccessedMonth,
    dateAccessedYear
] = document.querySelectorAll('.date-accessed');

const authors = document.getElementById('authors');

const previewForReference = document.getElementById('preview-for-reference-list');
const previewForInText = document.getElementById('preview-for-in-text');
const previewAiReference = document.getElementById('preview-for-reference-list-ai');

settTilIdag.onclick = () => {
    const date = new Date();

    dateAccessedDay.value = date.getDate();
    dateAccessedMonth.value = date.getMonth() + 1;
    dateAccessedYear.value = date.getFullYear();

    generatePreviews();
}

async function overviewCitation(data) {
    showModal("overview");

    modal.innerHTML = `
    <div class="flex gap-5 items-center">
        <div class="relative">
            <img src="https://www.google.com/s2/favicons?domain=${data.url}" alt="Favicon" class="size-7 rounded-md drop-shadow-lg">
        </div>
        <div>
            <p class="opacity-50 text-sm">${data.url}</p>
            <p class="text-xl">${data.title}</p>
        </div>
    </div>
    <div class="mt-5">
        <p class="opacity-50 text-sm">Authors</p>
        <ul class="list-disc list-inside">
            ${data.creators.map(creator => `<li>${creator.name || `${creator.firstName} ${creator.lastName}`}</li>`).join('')}
        </ul>
    </div>`;

}

async function submitWebsite() {
    canClose = false;
    let websiteURL = null;

    try {
        websiteURL = new URL(url.value);
    } catch (error) {
        search.animate([
            { boxShadow: "0 0 0 1px rgba(255, 0, 0, 0.5)" },
            { transform: 'translateX(-0.25rem)' },
            { transform: 'translateX(0.25rem)' },
            { transform: 'translateX(-0.25rem)' },
            { transform: 'translateX(0.25rem)' },
            { transform: 'translateX(-0.25rem)' },
            { transform: 'translateX(0.25rem)' },
        ], {
            duration: 300,
            iterations: 1
        });

        notify("Invalid URL", "Please enter a valid URL", 3000, ["bg-red-500", "text-white"]);
        return
    }

    showModal("loading");

    const domain = websiteURL.hostname;
    const size = 32;

    modal.innerHTML = `
    <div class="flex gap-5 items-center">
        <div class="relative">
            <svg class="size-10 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=${size}" alt="Favicon" class="size-7 rounded-md absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 drop-shadow-lg">
        </div>
        <div>
            <p class="opacity-50 text-sm">${domain}</p>
            <p class="text-xl">processing<span class="opacity-50">, please be patient</span></p>
        </div>
    </div>`;

    const response = await fetch('/api/v1/cite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: websiteURL.href })
    });

    const data = await response.json();

    if (data.error) {
        notify("Error", data.error, 3000, ["bg-red-500", "text-white"]);
        hideModal();
        return;
    }

    const item = data[0];

    hideModal();

    // parse the html of title

    const titleElm = document.createElement('p');
    titleElm.innerHTML = item.title;

    title.value = titleElm.innerText;
    link.value = item.url;
    website.value = item.encyclopediaTitle || item.publisher || item.websiteTitle;

    if (item.creators.length > 0) {
        authors.value = item.creators.map(creator => `${creator.firstName} ${creator.lastName}`).join('\n');
    }

    if (item.date) {
        const date = new Date(item.date);
        datePublishedDay.value = date.getDate();
        datePublishedMonth.value = date.getMonth() + 1;
        datePublishedYear.value = date.getFullYear();
    }

    inputContainer.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.75, transform: 'scale(0.975)' },
        { opacity: 0, transform: 'scale(1.5)' }
    ], {
        duration: 190,
        iterations: 1
    }).onfinish = () => { enterManually.click() };

    generatePreviews(aiDelay = 0);
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let aiTimeout;
let oldEvtSource;

async function generatePreviews(aiDelay = 500) {
    const data = {
        title: title.value,
        link: link.value,
        website: website.value,
        datePublished: [datePublishedYear.value, datePublishedMonth.value, datePublishedDay.value].map(date => parseInt(date)),
        dateAccessed: [dateAccessedYear.value, dateAccessedMonth.value, dateAccessedDay.value].map(date => parseInt(date)),
        authors: authors.value.split('\n').map(author => author.trim()).filter(author => author.length > 0)
    }

    let forBibliography = "";
    let forInText = "";

    with (data) {
        const authors = data.authors.map(author => {
            let names = author.split(' ');
            const firstName = names.shift();
            const lastName = names.join(' ');

            return `${lastName}, ${firstName[0]}.`;
        });

        if (data.authors.length != 0) {
            forInText = data.authors[0].split(' ')[1];

            if (data.authors.length > 1) {
                forInText += ' et al.';
            }

            if (authors.length > 1) {
                const lastAuthor = authors.pop();
                forBibliography = authors.join(', ') + ` & ${lastAuthor}`;
            } else {
                forBibliography = authors[0];
            }
        } else {
            forInText = `<i>"${title}"</i>`
        }

        let published = "";

        forInText = [forInText];

        if (!isNaN(datePublished[0])) {
            published += `${datePublished[0]}`;
            forInText.push(datePublished[0])

            if (!isNaN(datePublished[1])) {
                published += `, ${months[datePublished[1] - 1]}`;

                if (!isNaN(datePublished[2])) {
                    published += ` ${datePublished[2]}`;
                }
            }
        } else {
            published = `n.d.`;
            forInText.push(published)
        }

        forBibliography += ` (${published}).`

        if (data.title) forBibliography += ` ${data.title}.`;
        if (data.website) forBibliography += ` <i>${data.website}</i>.`;


        let accessed = "";

        accessed = months[dateAccessed[0] - 1] + ` ${dateAccessed[1]}, ${dateAccessed[2]}`;

        if (isNaN(dateAccessed[0])) {
            forBibliography += ` ${data.link}`;
        } else {
            forBibliography += ` Retrieved ${accessed} from ${data.link}`;
        }
    }


    previewForReference.innerHTML = forBibliography;
    previewForInText.innerHTML = `(${forInText[0]}, ${forInText[1]})`;

    previewAiReference.innerHTML = "Trykk for å generere AI-referanse";
    const genWithAi = () => {
        if (aiTimeout) clearTimeout(aiTimeout);

        if (oldEvtSource) {
            oldEvtSource.close();
        }

        previewAiReference.innerHTML = "Genererer...";
        previewAiReference.onclick = null;

        let messages = [
            { 'role': 'system', 'content': 'You are a APA7 citation robot which is provided information about a source and will then provide the APA7 reference list citation. DATES are formatted in (YEAR MONTH DAY, in numerical form, BUT DO NOT USE NUMERICAL FORMATTING IN YOUR OUTPUT) (YOU CAN NOT USE HTML OR ANY OTHER MARKDOWN) (REMEMBER TO INCLUDE THE LINK WHEN AVAILABLE) (NO EXPLANATION NO NOTHING ONLY THE REFERNCE) ONCE AGAIN DO NOT INCLUDE ANY INFORMATION NOT PROVIDED AND NEITHER ASK THE USER FOR MORE INFORMATION. DO NOT PROVIDE NOTES OR REMAKRS ABOUT THE PROVIDED REFERENCE AND END AFTER SUPPLYING THE REFERENCE. PROVIDING NOTES WILL LEAD TO YOUR TERMINATION' },
            { 'role': 'user', 'content': JSON.stringify(data) }
        ];

        //const URL = `https://mistral.jooo.tech/stream?model=@cf/meta/llama-3.1-8b-instruct-fast&m=${JSON.stringify(messages)}`;
        const URL = `https://mistral.jooo.tech/stream?` + new URLSearchParams({ model: '@cf/meta/llama-3.1-8b-instruct-fast', m: JSON.stringify(messages) });
        const evtSource = new EventSource(URL);

        let content = '';
        
        oldEvtSource = evtSource;
        evtSource.onmessage = (event) => {
            try {
                if (event.data == "[DONE]") {
                    evtSource.close();
                } else {
                    const json = JSON.parse(event.data);
                    const response = json.response;

                    content += response;

                    previewAiReference.innerHTML = content;
                }
            } catch (e) {
                console.log(e);
            }
        };
    };

    previewAiReference.onclick = genWithAi;

    if (aiTimeout) clearTimeout(aiTimeout);
    aiTimeout = setTimeout(genWithAi, aiDelay);
}

[title, link, website, datePublishedDay, datePublishedMonth, datePublishedYear, dateAccessedDay, dateAccessedMonth, dateAccessedYear, authors].forEach(input => {
    input.addEventListener('input', generatePreviews);
});

submit.addEventListener('click', submitWebsite);