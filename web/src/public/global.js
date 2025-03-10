/* 
    STUD ROUTER - v1.0.0
    (c) 2025 Joseph Gerald
*/

setTimeout(hookMobile, 100);

function hookMobile() {
    const hamburger = document.getElementById('hamburger');
    const closeHamburger = document.getElementById('close-hamburger');
    const navMenu = document.getElementById('header');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('backdrop-blur-xl', 'backdrop-brightness-50', 'backdrop-contrast-50');
    
        navMenu.classList.toggle('mobile-hidden');
        closeHamburger.classList.toggle('hidden');
    });
    
    closeHamburger.addEventListener('click', () => {
        navMenu.classList.toggle('backdrop-blur-xl', 'backdrop-brightness-50', 'backdrop-contrast-50');
    
        navMenu.classList.toggle('mobile-hidden');
        closeHamburger.classList.toggle('hidden');
    });
}

async function queryAPI(endpoint, data) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}

async function navigateTo(path) {  
    window.onload = null;
    const res = await fetch(path)
    const html = await res.text();

    if (res.status !== 200) {
        console.error("[STUD ROUTER] Non 2xx status code; Skipping SPA navigation.", res.status);
        location.href = path;
        return;
    }

    document.body.innerHTML = html;

    history.pushState({}, '', path);

    const scripts = Array.from(document.querySelectorAll('script'));
    replaceATags();

    for (const script of scripts) {
        if (script.src) {
            const src = new URL(script.src);

            if (src.pathname === '/global.js') continue

            try {
                const code = await fetch(src).then(res => res.text());

                if (script.type === 'module') {
                    await import(src);
                    continue;
                }
    
                setTimeout(() => {
                    try {
                        eval(code);
                    } catch (e) {
                        console.log("Failed to eval script", src);
                        console.error(e);
                    }
                }, 25);
            } catch(e) {
                console.error("Failed to fetch script", src);
                console.error(e);
            }
        } else {
            try {
                eval(script.innerHTML);
            } catch (e) {
                console.error(e);
            }
        }
    }

    if (window.onload) window.onload();
}

window.onpopstate = event => {
    if (location.href.endsWith("#")) return;
    navigateTo(location.pathname);
}

function replaceATags() {
    const links = Array.from(document.querySelectorAll('a'));

    for (const link of links) {
        console.log("Hooked", link.href);
        if (link.href.endsWith("#")) continue;

        link.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            navigateTo(link.href);
        });
    }

    hookMobile();
}

window.onload = replaceATags;

function notify(title, message, duration = 2500, classes = []) {
    const notification = document.createElement("notification");
    let notifications = document.getElementById("notifications");

    if (!notifications) {
        notifications = document.createElement("div");
        notifications.id = "notifications";
        notifications.classList.add("fixed", "bottom-3", "right-3", "m-4", "z-50");
        document.body.appendChild(notifications);
    }

    notification.classList.add("bg-[#15151530]", "hover:bg-[#15151560]", "backdrop-blur-lg", "w-full", "sm:min-w-[275px]", "flex", "flex-col");
    notification.classList.add("duration-500", "blur-sm", "opacity-0", "translate-x-[calc(100%+2rem)]", "scale-x-1/2", "h-0", "overflow-y-hidden");
    notification.classList.add("rounded-md", "border", "border-[#00000030]", "border-l-accent")
    notification.classList.add("shadow-md", ...classes);

    setTimeout(() => {
        notification.classList.add("h-[76px]", "p-4", "py-3", "mt-2", "cursor-pointer");
        notification.classList.remove("opacity-0", "blur-sm", "translate-x-[calc(100%+2rem)]", "scale-x-1/2", "h-0");
    }, 25);

    notification.innerHTML = `
        <span class="flex justify-between"><h3 class="text-xl font-semibold">${title}</h3> <small>${(duration/1000).toFixed(0)}s</small></span>
        <p class="opacity-80">${message}</p>
    `;

    notifications.appendChild(notification);

    classes.forEach(klass => notification.classList.add(klass));

    const timerIncrementMS = 1000;

    const callback = () => {
        const timer = notification.querySelector("small");
        const timeLeft = parseFloat(timer.textContent) - (timerIncrementMS / 1000);

        if (notification.matches(":hover") && timeLeft > 0) return;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            notification.classList.add("translate-x-[calc(100%+2rem)]", "scale-x-1/2", "blur-sm", "opacity-0");
            setTimeout(() => {
                notification.remove();
            }, 1000);
        } else {
            timer.textContent = timeLeft.toFixed(Math.max(4 - timerIncrementMS.toString().split("0").length, 0)) + "s";
        }
    }

    const timerInterval = setInterval(callback, timerIncrementMS);

    notification.addEventListener("click", () => {
        notification.querySelector("small").textContent = "0s";

        callback();
        clearInterval(timerInterval);
    });
}