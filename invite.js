window.onload = processInvite

async function processInvite() {
    const date = getQueryVariable("details")
    if (getApiKey() === null || getFileKey() === null || date === null) {
        console.log("hmm, seems like you didn't get an invite code. sorry!")
        document.getElementById('reject').hidden = false
        document.getElementById('loading').hidden = true
        return
    }
    const em = document.createElement('em')
    em.style = "color:yellowgreen;"
    em.textContent = " " + decodeURIComponent(date)
    document.getElementById("details").appendChild(em)

    document.getElementById('foot').hidden = false
    document.getElementById("seelistdiv").hidden = false
    document.getElementById('invite').hidden = false
    document.getElementById('rsvp').hidden = false
    document.getElementById('loading').hidden = true
}

async function sendToArushi() {
    const attendee = document.getElementById("pname").value
    const bringing = document.getElementById("gift").value
    if (attendee === "" || bringing === "") {
        document.getElementById("nicetry").hidden = false
        return
    }

    document.getElementById("nicetry").hidden = true
    document.getElementById("specialpass").hidden = false
    await createComment(attendee, bringing);
    await fetchGuestList();

    return false
}

async function showGuestList() {
    const pw = document.getElementById("guestlistpass").value
    if (!(await checkPassToHash(pw, '蓇䥇낒嶟䯽ᮝ\uD9B0굌첟栳㻜뷩믡Ɀ郌'))) {
        document.getElementById("wrongpass").hidden = false
        return
    }

    document.getElementById("wrongpass").hidden = true
    await fetchGuestList();
}