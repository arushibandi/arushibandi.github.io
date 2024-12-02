/* Data fetching helper functions */
// createJSONComment takes in a file key, an api key, and text data which gets written into the body of a comment.
async function createJSONComment(body, fileKey, apiKey) {
    const resp = await fetch(`https://api.figma.com/v1/files/${fileKey}/comments`, {
        method: 'POST',
        body: JSON.stringify({
            "message": body
        }),
        headers: {
            "X-Figma-Token": apiKey,
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
    console.log(resp)
}

// fetchCommentsAsJSON takes in a file key and an api key and returns the comments in that Figma file as a list of strings
async function fetchCommentsAsJSON(fileKey, apiKey) {
    const resp = await fetch(`https://api.figma.com/v1/files/${fileKey}/comments`, {
        headers: {
            'X-Figma-Token': apiKey,
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
    const comments = await resp.json()
    return comments.comments.map((c) => c.message)
}

/* Helpers for generating a custom link */
function createLink(base, key, file) {
    return `${base}?key=${key}&file=${file}`
}

/* Use these functions on your site to extract the file key and API key from the URL */
function getURLParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getAPIKey() {
    return getURLParam("key")
}

function getFileKey() {
    return getURLParam("file")
}
