// copied from random tutorials i found online, including Scaledrone 
const configuration = {
  iceServers: [{
      urls: "stun:stun.stunprotocol.org"
  }]
};

let pcSeq = 0;
const pcs = new Map();
// RTCDataChannel
const dcs = new Map();
let lastInvite = `invite.html`

function newPeerConnection() {
  return new RTCPeerConnection(configuration)
}

function generateOffer() {
  pcSeq++
  const pc = newPeerConnection();
  pcs.set(pcSeq, pc)
  console.log("pcs are now ", pc)
  pc.onicecandidate = handleicecandidate(() => {
    textelement = document.getElementById('lastinvite');
    const offer = pc.localDescription;
    console.log("unencoded", JSON.stringify(offer.toJSON()))
    const details = document.getElementById("deets").value
    const encoded = `invite.html?sdp=${encodeURIComponent(pc.localDescription.sdp)}&id=${pcSeq}&details=${encodeURIComponent(details)}`
    console.log("encoded", encoded)
    textelement.href = encoded;
    textelement.textContent = "link to last invite generated"
    textelement.style = "color:#AC33FF;"
    lastInvite = `${window.location.hostname}/${encoded}`
  })

  const dataChannel = pc.createDataChannel('rsvps');
  dcs.set(pcSeq, dataChannel)
  dataChannel.onopen = fakeServerOnClientOpen(pcSeq)
  dataChannel.onmessage = fakeServerOnMessage

  pc.onconnectionstatechange = (ev) => {
    console.log("peer connection state change", ev)
    console.log("PC", pc.currentRemoteDescription, pc.pendingRemoteDescription)
    switch (pc.connectionState) {
      case "connected":
        console.log("the peers are connected")
    }
  }
  pc.oniceconnectionstatechange = iceConnectionStateChange


  let createOfferPromise = pc.createOffer();
  createOfferPromise.then((offer) => {
    console.log("done creating peer connection offer")
    const setDesc = pc.setLocalDescription(offer);
    setDesc.then(() => {
      console.log("set local")
    }).catch((reason) => {
      console.error("set local failed: ", reason)
    })
  }).catch((reason) => {
    console.error("peer connection offer failed: ", reason)
  })
}

function iceConnectionStateChange(event) {
  console.log('ice connection state: ' + event.target.iceConnectionState);
}


let rsvps = [
  "Arushi is attending the party and bringing a fun n flirty drinking game",
];

function fakeServerOnMessage(message) {
  console.log("got message", message)
}

function fakeServerOnClientOpen(channelId) {
  return function(event) {
    console.log("data channel got opened!!", event)
    dc = dcs.get(channelId)
    for (const rsvp of rsvps) {
      dc.send(rsvp)
    }
  }
}

function gotRSVP() {
  const blurb = document.getElementById("rsvpBlurb").value 
  document.getElementById("rsvpBlurb").value = ""

  const jsonBlurb = JSON.parse(blurb)

  console.log("blurb", blurb)
  console.log("json blurb", jsonBlurb)

  const peerID = parseInt(jsonBlurb.id, 10)
  const rsvp = `${jsonBlurb.name} is bringing ${jsonBlurb.bringing}`
  rsvps.push(rsvp)

  addToGuestList(rsvp)

  pcs.get(peerID).setRemoteDescription({
    "type": jsonBlurb.type,
    "sdp": jsonBlurb.sdp
  })

  for (const [id, dc] of dcs) {
    if (dc.readyState === "open") {
      dc.send(rsvp)
    }
  }

  return false
}

function copyLastInvite() {
  window.navigator.clipboard.writeText(lastInvite)
}