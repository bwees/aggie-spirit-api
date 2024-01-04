import { getAuthentication } from "./connection.js"

/**
 * Get the initial data for the map
 * @param {string} auth authentication to use for the request
 * @returns base data for the map
 */
export async function getBaseData(auth) {
    var res = await fetch("https://aggiespirit.ts.tamu.edu/RouteMap/GetBaseData", {
        method: "POST",
        headers: {
            "cookie": auth
        }
    })
    
    return await res.json()
}

/**
 * Gets the route info for given route(s)
 * @param {string[]} patternIds route ids to get info for
 * @param {string} auth authentication to use for the request
 * @returns route info for the given route(s)
 */
export async function getPatternPaths(patternIds, auth) {
    // Constructing the body data
    const bodyData = patternIds.map(id => `routeKeys%5B%5D=${encodeURIComponent(id)}`).join('&');

    var res = await fetch("https://aggiespirit.ts.tamu.edu/RouteMap/GetPatternPaths", {
        method: "POST",
       headers: {
            "cookie": auth,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: bodyData
    });

    return await res.json();
}

/**
 * Get the active vehicles on given route(s)
 * @param {string[]} patternIds 
 * @param {*} auth authentication to use for the request
 * @returns list of active vehicles on the given route(s)
 */
export async function getVehicles(patternIds, auth) {
    const bodyData = patternIds.map(id => `routeKeys%5B%5D=${encodeURIComponent(id)}`).join('&');


    var res = await fetch("https://aggiespirit.ts.tamu.edu/RouteMap/GetPatternPaths", {
        method: "POST",
        headers: {
            "cookie": auth,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: bodyData
    })
    
    return await res.json()
}

/**
 * Get the next departure times for a stop
 * @param {string} routeId route id to get departure times for
 * @param {string[]} directionIds direction id to get departure times for
 * @param {string} stopCode stop id to get departure times for
 * @param {string} auth authentication to use for the request
 * @returns list of departure times for the given stop
 */

export async function getNextDepartureTimes(routeId, directionIds, stopCode, auth) {
    var bodyData = []
    directionIds.forEach((directionId, i) => {
        bodyData.push(`routeDirectionKeys%5B${i}%5D%5BrouteKey%5D=${encodeURIComponent(routeId)}&routeDirectionKeys%5B${i}%5D%5BdirectionKey%5D=${encodeURIComponent(directionId)}&stopCode=${encodeURIComponent(stopCode)}`)
    })

    bodyData = bodyData.join('&')

    var res = await fetch("https://aggiespirit.ts.tamu.edu/RouteMap/GetNextDepartTimes", {
        method: "POST",
        headers: {
            "cookie": auth,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: bodyData
    })

    return await res.json()
}
