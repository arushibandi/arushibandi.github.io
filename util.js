var emojis = [
	'👀','🥺','😡','🏄🏾‍♀️','🤪','💗','🎉','👍🏼','🤑','🤔','😇','💜','😍','🥂','😎','🥰','🤞🏻','🦦','☃️','🫐','🍠','🥞','🤓','👹','😭','🧦','🦕','🦖','🐉','🙃','😴','👻','😳','😁','😩','😋','😷','😇','😏','👽','🔥','✨','💥','💦','👄','💄','🐸','🐯','🐣','🌚','🔮','🎉','🗽','🚗'
];

function randomEmoji() {
  const emoji =  emojis[Math.floor(Math.random() * emojis.length)];
  const hex = emoji.codePointAt(0).toString(16)
  const emo = String.fromCodePoint("0x"+hex);
  return emo
};

function getApiKey() {
    return getQueryVariable("api")
}

function getFileKey() {
    return getQueryVariable("db")
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

async function createComment(attendee,  bringing) {
    await fetch(`https://api.figma.com/v1/files/${getFileKey()}/comments`, {
        method: 'POST',
        body: JSON.stringify({ 
            "message":  `${Math.floor(Math.random() * emojis.length)} * ${attendee} is bringing ${bringing}`,
        }),
        headers: {
            "X-Figma-Token": getApiKey(),
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
}

async function fetchComments() {
    const resp = await fetch(`https://api.figma.com/v1/files/${getFileKey()}/comments`, {
        headers: {
            'X-Figma-Token': getApiKey(),
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
    const comments = await resp.json()
    return comments.comments
}

async function fetchGuestList() {
    const rsvps =  await fetchComments()

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
}