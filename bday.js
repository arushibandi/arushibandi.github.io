
let pcSeq = 0;
const pcs = new Map();
// RTCDataChannel
const dcs = new Map();
let lastInvite = `/invite.html`

let rsvps = [
  "Arushi is attending the party and bringing a fun n flirty drinking game",
];

function createInvite() {
  const api = document.getElementById("api").value
  const db = document.getElementById("db").value
  const details = document.getElementById("details").value
  lastInvite = `/invite.html?api=${api}&db=${db}&details=${details}`
  document.getElementById("inviteLink").href= lastInvite
  document.getElementById("inviteLink").style = "color:#e230f2"
}

function copyLastInvite() {
  window.navigator.clipboard.writeText(`${window.location.hostname}${lastInvite}`)
}