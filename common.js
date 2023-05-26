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