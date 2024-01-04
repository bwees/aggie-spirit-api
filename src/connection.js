/**
 * Retreives API authentication information for the endpoints.
 * auth must be passed to each function int he `auth` parameter.
 * If no auth is passed, the function will attempt to retreive it.
 * @returns {string} - the header for authentication
 */
export async function getAuthentication() {
    var res = await fetch("https://aggiespirit.ts.tamu.edu/", {credentials: "omit"})
    var cookies = res.headers.get("set-cookie").split(", ")

    // extract to a header 
    var header = ""
    for (var cookie of cookies) {
        cookie = cookie.split(";")[0]
        header += cookie + "; "
    }

    return header
}