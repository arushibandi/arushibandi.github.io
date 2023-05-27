window.onload = processInvite

async function processInvite() {
    const date = getQueryVariable("details")
    if (getApiKey() === null || getFileKey() === null || date === null) {
        console.log("hmm, seems like you didn't get an invite code. sorry!")
        document.getElementById('reject').hidden = false
        return
    }
    const em = document.createElement('em')
    em.style = "color:yellowgreen;"
    em.textContent = " " + decodeURIComponent(date)
    document.getElementById("details").appendChild(em)

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
    await fetchGuestList()

    return false
}