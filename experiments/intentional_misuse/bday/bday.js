
let pcSeq = 0;
const pcs = new Map();
// RTCDataChannel
const dcs = new Map();
let lastInvite = `/invite.html`
let lastAdmin = `/bday.html`

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

async function adminViewGuestList() {
  const api = getQueryVariable("api")
  const db = getQueryVariable("db")
  const pw = document.getElementById("password").value
  if (api === "" || db === "" || pw ==="") {
    document.getElementById('wrongPass').hidden = true
    return
  }

  if (!(await checkPassToHash(pw, '儜⼑ೇ甚ऺ䩭㪨쩂渪㟸ਵ㿣㎙詄癴'))) {
    document.getElementById('wrongPass').hidden = false
    return
  }

  document.getElementById('wrongPass').hidden = true
  await fetchGuestList()
}