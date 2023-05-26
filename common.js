async function newPeerConnection(apiKey) {
    const response = await fetch(`https://bday.metered.live/api/v1/turn/credentials?apiKey=${apiKey}`);
    const iceServers = await response.json();
    return new RTCPeerConnection({
      iceServers: iceServers
    });
  }

function handleicecandidate(callback) {
    return function(event) {
        if (event.candidate != null) {
            console.log('new ice candidate');
          } else {
            callback()
          }
    }
}

function handleconnectionstatechange(event) {
    console.log('handleconnectionstatechange');
    console.log(event);
}
  
function handleiceconnectionstatechange(event) {
    console.log('ice connection state: ' + event.target.iceConnectionState);
}
  
function addToGuestList(rsvp) {
    const gl = document.getElementById("theGuestList")
    let li = document.createElement("li")
    li.textContent = rsvp
    gl.appendChild(li)
}