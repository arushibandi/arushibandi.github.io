window.onload = processInvite

async function processInvite() {
    const date = getQueryVariable("details")
    if (getApiKey() === null || getFileKey() === null || date === null) {
        console.log("hmm, seems like you didn't get an invite code. sorry!")
        document.getElementById('reject').hidden = false
        return
    }
    document.getElementById("details").textContent = document.getElementById("details").textContent + " " + decodeURIComponent(date)
    document.getElementById('invite').hidden = false
    document.getElementById('rsvp').hidden = false
}

async function sendToArushi() {
    const attendee = document.getElementById("pname").value
    const bringing = document.getElementById("gift").value
    if (attendee === "" || bringing === "") {
        document.getElementById("nicetry").hidden = false
        return
    }

    document.getElementById("nicetry").hidden = true
    await createComment(attendee, bringing)

    const rsvps =  await fetchComments()
    console.log(rsvps);

    const list = document.getElementById("allRsvps")
    while(list.firstChild) {
        list.removeChild(list.firstChild)
    }

    for (const rsvp of rsvps) {
        const ul = document.createElement('ul')
        const parts = rsvp.message.split(" * ");
        const emoji = emojis[parseInt(parts[0], 10)]
        const message = parts[1]
        ul.textContent = emoji + " " + message
        list.appendChild(ul)
    }

    return false
}
