import { getAuthentication } from "./connection.js"
import moment from "moment"

/**
 * Get the currently active routes
 * @param {string} auth Authentication to use for the request
 * @returns {string[]} list of route names ("01", "04", etc.)
 */
export async function getActiveRoutes(auth) {
    var res = await fetch("https://aggiespirit.ts.tamu.edu/Home/GetActiveRoutes", {
        method: "POST",
        headers: {
            "cookie": auth
        }
    })
    
    return await res.json()
}

/**
 * Gets the nearby routes for a given location, with optional radius
 * @param {string[]} favRoutes list of favorited routes
 * @param {number} latitude GPS latitude
 * @param {number} longitude GPS longitude
 * @param {number} maxRadius max radius to search
 * @param {number} minRadius min radius to search
 * @param {string} auth authentication to use for the request
 * @returns list of routes that satisy given constraints
 */
export async function getNearbyRoutes(favRoutes=[], latitude=30.6138, longitude=-96.3395, maxRadius=null, minRadius=null, auth) {
    var payload = {
        "latitude": latitude,
        "longitude": longitude,
        "minRadius": minRadius,
        "maxRadius": maxRadius,
        "favouriteRoutes": favRoutes
    }

    var res = await fetch("https://aggiespirit.ts.tamu.edu/Home/GetNearbyRoutes", {
        method: "POST",
        headers: {
            "cookie": auth,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    return await res.json()
}

/**
 * get the next stop times for a given route(s)
 * @param {string[]} routes route ids to get stop times for
 * @param {string} auth authentication to use for the request
 * @returns list of stop times for the given routes
 */
export async function getNextStopTimes(routes, auth) {
    var payload = {
        routes: routes
    }

    var res = await fetch("https://aggiespirit.ts.tamu.edu/Home/GetNextStopTimes", {
        method: "POST",
        headers: {
            "cookie": auth,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    return await res.json()
}

/**
 * Gets the schedules for a given stops(s)
 * @param {string} stopCode list of stop ids to get schedules for
 * @param {Date} date date to get schedules for
 * @param {string} auth authentication to use for the request
 * @returns list of schedules for the given stops
 */
export async function getStopSchedules(stopCode, date, auth) {
    date = moment(date).format("YYYY-MM-DD")

    var payload = {
        stopCode: stopCode,
        date: date
    }

    var res = await fetch("https://aggiespirit.ts.tamu.edu/Schedule/GetStopSchedules", {
        method: "POST",
        headers: {
            "cookie": auth,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    return await res.json()
}

/**
 * Gets the schedule estimates for a given stops(s)
 * @param {string} stopCode list of stop ids to get schedules for
 * @param {Date} date date to get schedules for
 * @param {string} auth authentication to use for the request
 * @returns list of schedules for the given stops
 */
export async function getStopEstimates(stopCode, date, auth) {
    date = moment(date).format("YYYY-MM-DD")

    var payload = {
        stopCode: stopCode,
        date: date
    }

    var res = await fetch("https://aggiespirit.ts.tamu.edu/Schedule/GetStopEstimates", {
        method: "POST",
        headers: {
            "cookie": auth,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    return await res.json()
}

