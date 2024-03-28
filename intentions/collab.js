var emojis = [
    '🌐', '🔗', '🕸️', '🛰️', '📡', '🌿', '🍃', '🗺️', '🧭', '🔌', '🌱', '🫘', '🖇️', '⛓️', '🍂', '🥒'
];

function randomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function getApiKey() {
    jsonStr = atob(getQueryVariable("code"))
    data = JSON.parse(jsonStr)
    return data.apiKey
}

function getFileKey() {
    jsonStr = atob(getQueryVariable("code"))
    data = JSON.parse(jsonStr)
    return data.fileKey
}


async function fetchComments() {
    const resp = await fetch(`https://api.figma.com/v1/files/${getFileKey()}/comments`, {
        headers: {
            'X-Figma-Token': getApiKey(),
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
    const res = await resp.json()
    return res.comments
}

async function createComment(intntn) {
    await fetch(`https://api.figma.com/v1/files/${getFileKey()}/comments`, {
        method: 'POST',
        body: JSON.stringify({
            "message": `${intntn}`,
        }),
        headers: {
            "X-Figma-Token": getApiKey(),
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
}

async function refetchIntentions() {
    const intntn = document.getElementById("intention").value
    if (intntn != "") {
        await createComment(intntn)
    }
    const allIntntns = await fetchComments()
    const list = document.getElementById("cotentions")
    list.innerHTML = ''
    for (const intntn of allIntntns) {
        const msg = intntn.message;
        const item = document.createElement('li');
        item.style.fontSize = (16 + Math.floor(Math.random() * 16)).toString() + "px"
        item.style.paddingLeft = (Math.floor(Math.random() * 600)).toString() + "px"
        item.textContent = randomEmoji() + msg;
        list.appendChild(item);
    }
}