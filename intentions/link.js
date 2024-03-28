window.onload = replaceHrefs
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return null
}

function replaceHrefs() {
    const links = document.querySelectorAll('a');
    for (const link of links) {
        const url = new URL(link.href)
        if (url.hostname == window.location.hostname) {
            link.href = link.href + "?code=" + getQueryVariable("code")
        }
    }
}
