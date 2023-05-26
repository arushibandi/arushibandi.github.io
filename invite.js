window.onload = processInvite

// RTCPeerConnection
let pc;
let pcSeq = 0;
// RTCDataChannel
let dataChannel;
let myRSVP = ""

async function processInvite() {
    const invite = getQueryVariable("sdp")
    const id = getQueryVariable("id")
    const details = getQueryVariable("details")
    const apiKey = getQueryVariable("api")
    if (invite === null || pcSeq === null || details === null || apiKey === null) {
        console.log("hmm, seems like you didn't get an invite code. sorry!")
        document.getElementById('reject').hidden = false
        return
    }

    pc = await newPeerConnection(apiKey)
    document.getElementById("details").textContent = decodeURIComponent(details)
    document.getElementById("invite").hidden = false
    console.log("you got an invite: ", decodeURIComponent(invite))
    console.log("your peer connection id is ", id)
    pcSeq = id

    pc.onicecandidate = handleicecandidate(() => {
        console.log('lasticecandidate');
        const rsvpDiv = document.getElementById('rsvp');
        answer = pc.localDescription
        const connectionP = document.getElementById('connectionText')
        rsvpDiv.hidden = false
        connectionP.style = "color:#AC33FF;"
        connectionP.value = JSON.stringify(answer);
        console.log("my descriprtion", pc.localDescription)
        console.log("remote description", pc.remoteDescription)
    })
    pc.onconnectionstatechange = handleconnectionstatechange;
    pc.oniceconnectionstatechange = handleiceconnectionstatechange;
    pc.ondatachannel = handledatachannel;

    const offer = {
        "type": "offer",
        "sdp": decodeURIComponent(invite)
    }
    const setRemotePromise = pc.setRemoteDescription(offer);
    setRemotePromise.then(() => {
        const createAnswerPromise = pc.createAnswer();
        createAnswerPromise.then((answer) => {
            const setDesc = pc.setLocalDescription(answer);
            setDesc.then(() => {
              console.log("set local")
            }).catch((reason) => {
              console.error("set local failed: ", reason)
            })
        }).catch((r) => {
            console.error("create answer failed: ", r)
        })
    }).catch((r) => {
        console.error("set remote failed: ", r)
    });
}

function handledatachannel(event) {
    console.log('handledatachannel', dataChannel);
    dataChannel = event.channel;
    dataChannel.onopen = datachannelopen;
    dataChannel.onmessage = datachannelmessage;
}

function datachannelopen() {
  console.log('datachannelopen');
  dataChannel.send("hello??? am i open")
}

function datachannelmessage(message) {
    console.log("datachannelmessage", message)
    addToGuestList(message.data)
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    } 
    return null
}


function sendToArushi() {
    const attendee = document.getElementById("pname").value
    const bringing = document.getElementById("gift").value
    const blurb = {
        "sdp": pc.localDescription.sdp,
        "type": pc.localDescription.type,
        "id": pcSeq,
        "name": attendee,
        "bringing": bringing
    }
    myRSVP = JSON.stringify(blurb)
    console.log(myRSVP)

    document.getElementById("blurbInstructions").hidden = false
    navigator.clipboard.writeText(myRSVP)
    return false
}

function copyRSVP() {
    navigator.clipboard.writeText(myRSVP)
}