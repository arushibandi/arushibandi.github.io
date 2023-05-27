
let pcSeq = 0;
const pcs = new Map();
// RTCDataChannel
const dcs = new Map();
let lastInvite = `/invite.html`
let lastAdmin = `/bday.html`

let rsvps = [
  "Arushi is attending the party and bringing a fun n flirty drinking game",
];

function createInvite() {
  const api = document.getElementById("api").value
  const db = document.getElementById("db").value
  const details = document.getElementById("details").value
  lastInvite = `/invite.html?api=${api}&db=${db}&details=${details}`
  lastAdmin = `/bday.html?api=${api}&db=${db}`
  document.getElementById("inviteLink").href= lastInvite
  document.getElementById("inviteLink").style = "color:#e230f2"
}

function copyLastInvite() {
  window.navigator.clipboard.writeText(`${window.location.hostname}${lastInvite}`)
}

function copyAdminLink() {
  window.navigator.clipboard.writeText(`${window.location.hostname}${lastAdmin}`)
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
  bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function makeLonger(str) {
  while (str.length < 100) {
    str += str
  }
  return str.slice(0, 100)
}

async function adminViewGuestList() {
  const api = getQueryVariable("api")
  const db = getQueryVariable("db")
  const pw = document.getElementById("password").value
  if (api === "" || db === "" || pw ==="") {
    return
  }
  const longerpw = makeLonger(pw)
  const buf = str2ab(longerpw)
  const hash = await window.crypto.subtle.digest("SHA-256", buf)
  if (ab2str(hash) !== '儜⼑ೇ甚ऺ䩭㪨쩂渪㟸ਵ㿣㎙詄癴') {
    document.getElementById('wrongPass').hidden = false
    return
  }
  document.getElementById('wrongPass').hidden = true
  await fetchGuestList()
}