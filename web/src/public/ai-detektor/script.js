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

let BASE_URL = "https://api.jooo.tech/query";

const input = document.getElementById('input');
const submit = document.getElementById('submit');

const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const sentenceCount = document.getElementById('sentence-count');

const inputContainer = document.getElementById('input-container');
const outputContainer = document.getElementById('output-container');

const aggregateOverview = document.getElementById('aggregate-overview');

function smartSplitTextIntoChunks(text, maxChunkSize) {
    const sentences = text.split(/[.!?]/);

    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if (currentChunk.split(' ').length + sentence.split(' ').length <= maxChunkSize) {
            currentChunk += sentence + '.';
        } else {
            chunks.push(currentChunk);
            currentChunk = sentence + '.';
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

function getLevel(ai) {
    if (ai < 0.3) return "✔️";
    if (ai < 0.6) return "❓";
    if (ai < 0.8) return "⚠️❗";
    return "❌";
}

input.addEventListener('input', () => {
    const stats = countTextStats(input.value);
    charCount.textContent = stats.characters
    wordCount.textContent = stats.words;
    sentenceCount.textContent = stats.sentences;
});

submit.addEventListener('click', () => {
    getDetectionResults(input.value);
});

function getHighlight(prob) {
    if (prob > 0.5) return "--ai-highlight";
    if (prob > 0.3) return "--mix-highlight";
    return "--human-highlight";
}

async function getDetectionResults(text) {
    if (text.length === 0) {
        hideModal();

        notify("Error", "Please write something", 3000, ["bg-red-500", "text-white", "shadow-inset"]);

        input.animate([
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

        input.focus();
        return;
    }

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

            <div class="w-full mt-2">
                <div class="h-1 bg-[#000000A0] backdrop-blur-sm rounded-full shadow">
                    <div id="detection-progress" class="h-full bg-primary rounded-full duration-1000" style="width: 0%"></div>
                </div>
            </div>
        </div>
    </div>`;

    const detectionProgressBar = document.getElementById('detection-progress');
    const queryArray = smartSplitTextIntoChunks(text, 200);

    const verdicts = {
        "ZERO_GPT": ZEROGPT_VERDICT(text),
        "GPT_ZERO": GPTZERO_VERDICT(text),
        "GLTR": GLTR_VERDICT(text),
        "SEO_AI": SEOAI_VERDICT(text),
        "ROBERTA": ROBERTA_VERDICT(queryArray),
        "RADAR": RADAR_AGGREGATE(text)
    };

    setTimeout(() => {
        detectionProgressBar.style.width = "10%";
    }, 100);

    let resolved = 0;

    for (const [key, value] of Object.entries(verdicts)) {
        verdicts[key] = value.then((response) => {
            verdicts[key] = response;
            notify("Success", `${key} done`, 3000, ["bg-green-500", "text-white", "shadow-inset"]);
            detectionProgressBar.style.width = `${(resolved++ + 1) / Object.keys(verdicts).length * 100}%`;
        });
    }

    await Promise.all(Object.values(verdicts));

    console.log(verdicts);
    inputContainer.classList.add('hidden');
    outputContainer.classList.remove('hidden');

    let subtemplates = {
        ZERO_GPT: null,
        GPT_ZERO: null,
        GLTR: null,
        SEO_AI: null,
        ROBERTA: null,
        RADAR: null
    }

    for (const [key, value] of Object.entries(verdicts)) {
        switch (key) {
            case "ZERO_GPT":
                subtemplates.ZERO_GPT = `<div
                                class="bg-[#00000050] border border-border border-opacity-50 rounded-lg p-4 backdrop-blur-sm w-full">
                                <div class="flex justify-between text-lg font-semibold">
                                    <h3>
                                        ZeroGPT
                                    </h3>
    
                                    <p>
                                        ${getLevel(value.fake_score)}
                                    </p>
                                </div>
    
                                <div
                                    class="bg-[#00000050] backdrop-blur-sm rounded-md overflow-hidden mt-2.5 border border-border border-opacity-50 divide-y divide-border divide-opacity-50 font-sometype-mono">
                                    <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(--ai-highlight) ${value.fake_score}%, transparent ${value.fake_score}%) no-repeat;
                            ">
                                        ${value.fake_score}% / Fake Score
                                    </div>
                                    <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(--human-highlight) ${value.human_score}%, transparent ${value.human_score}%) no-repeat;
                            ">
                                        ${value.human_score}% / Human Score
                                    </div>
                                </div>
                            </div>`;
                break;
            case "GPT_ZERO":
                const highlighted_sentences = value.data.filter(item => item.highlight_sentence_for_ai).length;
                const highlighted_percentage = highlighted_sentences / value.data.length * 100;

                subtemplates.GPT_ZERO = `<div
                                class="bg-[#00000050] border border-border border-opacity-50 rounded-lg p-4 backdrop-blur-sm w-full">
                                <div class="flex justify-between text-lg font-semibold">
                                    <h3>
                                        GPTZero
                                    </h3>
    
                                    <p>
                                        ${getLevel(value.completely_generated_prob)}
                                    </p>
                                </div>
    
                                <div
                                    class="bg-[#00000050] backdrop-blur-sm rounded-md overflow-hidden mt-2.5 border border-border border-opacity-50 divide-y divide-border divide-opacity-50 font-sometype-mono">
                                    <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(${getHighlight(value.average_generated_prob)}) ${value.average_generated_prob * 100}%, transparent ${value.average_generated_prob * 100}%) no-repeat;
                            ">
                                        ${Math.round(value.average_generated_prob * 100)}% / Average Generated
                                    </div>
                                    <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(${getHighlight(value.average_generated_prob)}) ${value.completely_generated_prob * 100}%, transparent ${value.completely_generated_prob * 100}%) no-repeat;
                            ">
                                        ${Math.round(value.completely_generated_prob * 100)}% / Completely Generated
                                    </div>
                                    <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(${getHighlight(highlighted_percentage / 100)}) ${highlighted_percentage}%, transparent ${highlighted_percentage}%) no-repeat;
                            ">
                                        ${highlighted_percentage}% (${highlighted_sentences}/${value.sentences}) / Suspicous Sentences
                                    </div>
                                </div>
                            </div>`;
                break;
            case "GLTR":
                break;
            case "SEO_AI":
                subtemplates.SEO_AI = ` <div
                                class="bg-[#00000050] border border-border border-opacity-50 rounded-md p-4 backdrop-blur-sm font-sometype-mono w-full">
                                <div class="flex justify-between text-lg font-semibold">
                                    <h3>
                                        seo.ai
                                    </h3>
    
                                    <p>
                                        ${getLevel(value.mean)}
                                    </p>
                                </div>
    
                                <div
                                    class="bg-[#00000050] backdrop-blur-sm rounded-md overflow-hidden mt-2.5 border border-border border-opacity-50 divide-y divide-border divide-opacity-50 font-sometype-mono">
                                    <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(${getHighlight(value.mean)}) ${value.mean * 100}%, transparent ${value.mean * 100}%) no-repeat;
                            ">
                                        ${Math.round(value.mean * 100)} / AI %
                                    </div>
                                </div>
                            </div>`;
                break;
            case "ROBERTA":
                console.log(value)

                subtemplates.ROBERTA = `<div
                                class="bg-[#00000050] border border-border border-opacity-50 rounded-md p-4 backdrop-blur-sm font-sometype-mono w-full">
                                <div class="flex justify-between text-lg font-semibold">
                                    <h3>
                                        RoBERTA
                                    </h3>
    
                                    <p>
                                        ${
                                            getLevel(value.data.reduce((acc, item) => acc + item[0].score, 0) / value.data.length)
                                        }
                                    </p>
                                </div>
    
                                <div
                                    class="bg-[#00000050] backdrop-blur-sm rounded-md overflow-hidden mt-2.5 border border-border border-opacity-50 divide-y divide-border divide-opacity-50 font-sometype-mono">
                                    ${
                                        (() => {
                                            let wordCount = 0;

                                            return value.query_array.map((item, index) => {
                                                const stats = countTextStats(item);
                                                const oldWordCount = wordCount;
                                                const words = stats.words;
                                                
                                                wordCount += words;

                                                const fake = value.data[index][0].score;
                                                const real = value.data[index][1].score;

                                                return `
                                                    <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                                        background: linear-gradient(to right, var(${getHighlight(fake)}) ${fake * 100}%, transparent ${fake * 100}%) no-repeat;
                                                        ">
                                                        ${Math.round(fake * 100)}% / WORDS ${oldWordCount + 1}-${wordCount}
                                                    </div>
                                                `;
                                            }).join('')
                                        })()
                                    }
                                </div>
                            </div > `;
                break;
            case "RADAR":
                const probs = Object.entries(value);
                let median = 0;

                probs.sort((a, b) => b[1] - a[1]);

                if (probs.length % 2 === 0) {
                    median = (probs[probs.length / 2 - 1][1] + probs[probs.length / 2][1]) / 2;
                } else {
                    median = probs[Math.floor(probs.length / 2)][1];
                }

                subtemplates.RADAR = `<div
        class="bg-[#00000050] border border-border border-opacity-50 rounded-lg p-4 backdrop-blur-sm w-full">
                                <div class="flex justify-between text-lg font-semibold">
                                    <h3>
                                        RADAR models
                                    </h3>
    
                                    <p>
                                        ${getLevel(median)}
                                    </p>
                                </div>
    
                                <div
                                    class="bg-[#00000050] backdrop-blur-sm rounded-md overflow-hidden mt-2.5 border border-border border-opacity-50 divide-y divide-border divide-opacity-50 font-sometype-mono">
                                    ${
                    // hide for now
                    `
                                        <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                            background: linear-gradient(to right, var(--ai-highlight) ${median * 100}%, transparent ${median * 100}%) no-repeat;
                                        ">
                                            ${Math.round(median * 100)}% / Median
                                        </div>
                                        `, ""
                    }

                                    ${probs.map(prob => `
                                            <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                                background: linear-gradient(to right, var(${getHighlight(prob[1])}) ${prob[1] * 100}%, transparent ${prob[1] * 100}%) no-repeat;
                                            ">
                                                ${Math.round(prob[1] * 100)}% / ${prob[0]}
                                            </div>
                                        `).join('')
                    }
                                </div>
                            </div > `;
                break;
        }
    }


    let template = `<div
        class="bg-[#00000050] border border-border border-opacity-50 rounded-md p-4 backdrop-blur-sm font-sometype-mono w-full">
                        <div class="flex justify-between text-lg font-semibold">
                            <h3>
                                Aggregate Overview
                            </h3>
    
                            <p>
                                ⚠️
                            </p>
                        </div>
    
                        <div>
                            <div
                                class="bg-[#00000050] backdrop-blur-sm rounded-md overflow-hidden mt-2.5 border border-border border-opacity-50 divide-y divide-border divide-opacity-50 font-sometype-mono">
                                <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(--ai-highlight) 91.39910340309143%, transparent 91.39910340309143%) no-repeat;
                            ">
                                    91% / GPTZero
                                </div>
                                <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(--ai-highlight) 85.625159740448%, transparent 85.625159740448%) no-repeat;
                            ">
                                    86% / ZeroGPT
                                </div>
                                <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(--mix-highlight) 68.8165545463562%, transparent 68.8165545463562%) no-repeat;
                            ">
                                    69% / RoBERTA
                                </div>
                                <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(--mix-highlight) 68.8165545463562%, transparent 68.8165545463562%) no-repeat;
                            ">
                                    69% / SEO.AI
                                </div>
                                <div class="w-full text-xss font-bold px-1.5 py-1" style="
                                background: linear-gradient(to right, var(--mix-highlight) 68.8165545463562%, transparent 68.8165545463562%) no-repeat;
                            ">
                                    69% / RADAR(s)
                                </div>
                            </div>
                        </div>
                    </div >
            <div class="flex gap-4 w-full">
                <div class="w-full flex flex-col gap-2">
                    ${subtemplates.RADAR}

                    ${subtemplates.ROBERTA}

                    ${subtemplates.SEO_AI}
                </div>
                <div class="w-full flex flex-col gap-2">
                    ${subtemplates.GPT_ZERO}

                    ${subtemplates.ZERO_GPT}
                </div>
            </div>`;

    aggregateOverview.innerHTML = template;

    setTimeout(hideModal, 900);
}

/* "inspired" by https://ai.jooo.tech/detector.js */

function VERDICT_WRAPPER(path, text) {
    return fetch(BASE_URL + "/" + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "text": text }),
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error("Error: " + response.status + " " + response.statusText);
        }
        return response.json();
    });
}

function ZEROGPT_VERDICT(query_text) {
    return VERDICT_WRAPPER("zerogpt", query_text)
}

function GPTZERO_VERDICT(query_text) {
    return VERDICT_WRAPPER("gptzero", query_text)
}

function GLTR_VERDICT(query_text) {
    return VERDICT_WRAPPER("gltr_interp", query_text)
}

function SEOAI_VERDICT(query_text) {
    return fetch("https://tools.seo.ai/api/ai-detection", {
        method: "POST",
        body: JSON.stringify({ "text": query_text }),

        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error("Error: " + response.status + " " + response.statusText);
        }
        return response.json();
    }).then((data) => {
        return {
            "prediction": data.subScores[0],
            "entropy": data.subScores[1],
            "correlation": data.subScores[2],
            "perplexity": data.subScores[3],
            "mean": data.score,
        }
    });
}

function ROBERTA_VERDICT(query_array) {
    return fetch("https://api-inference.huggingface.co/models/roberta-base-openai-detector", {
        method: "POST",
        body: JSON.stringify(query_array),
        headers: { "Authorization": "Bearer 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" }
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error("Error: " + response.status + " " + response.statusText);
        }
        return response.json();
    }).then((data) => {
        return {
            query_array,
            data
        }
    });
}

async function RADAR_AGGREGATE(query_text) {
    const results = await Promise.all([
        DOLLY_V2_3B_VERDICT(query_text),
        CAMEL_5B_VERDICT(query_text),
        DOLLY_V1_6B_VERDICT(query_text),
        VICUNA_7B_VERDICT(query_text)
    ]);

    const models = ["DOLLY V2 3B", "CAMEL 5B", "DOLLY V1 6B", "VICUNA 7B"];
    const jsonResults = await Promise.all(results.map(result => result.json()));
    const probabilities = {};

    jsonResults.forEach((result, index) => {
        const model = models[index];
        probabilities[model] = result.results[0].p
    });

    return probabilities
}

function RADAR_WRAPPER(query_text, index) {
    return fetch("https://radar-app.vizhub.ai/api/checkTexts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model_index: index,
            texts: [query_text]
        })
    });
}


function DOLLY_V2_3B_VERDICT(query_text) {
    return RADAR_WRAPPER(query_text, 0);
}

function CAMEL_5B_VERDICT(query_text) {
    return RADAR_WRAPPER(query_text, 1);
}

function DOLLY_V1_6B_VERDICT(query_text) {
    return RADAR_WRAPPER(query_text, 2);
}

function VICUNA_7B_VERDICT(query_text) {
    return RADAR_WRAPPER(query_text, 3);
}
