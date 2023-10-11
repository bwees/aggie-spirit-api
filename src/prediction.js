import { getRouteByName, getRouteBuses } from "./map_api.js";
import Openrouteservice from 'openrouteservice-js'
import { metersBetweenGPSPoints } from "./gis.js";

/////////////////////////
/// OPENROUTE SERVICE ///
/////////////////////////

var ors_api_key = ""
/**
 * Wrapper function to retreive the Openrouteservice API object since the API key is not passed to each function
 * @returns {Openrouteservice.Directions} Openrouteservice API object
 */
function getORSAPI() {
    if (ors_api_key == "") throw new Error("Openrouteservice API key not set")
    return new Openrouteservice.Directions({ api_key: ors_api_key});
}

export function setORSAPIKey(key) {
    ors_api_key = key
}

/////////////////////////

export async function getRouteStopPredictions(routeName, routeData) {
    routeData = routeData || await getRouteByName(routeName)
    var busLocations = await getRouteBuses(routeName)

    // get the list of waypoints for the route each bus is on
    for (var bus in busLocations) {
        // find the pattern the bus is on based on bus patternName
        var pattern = routeData.routePatterns.find((pattern) => {
            return pattern.name == busLocations[bus].patternName
        })

        // find the waypoints for the pattern
        var waypoints = routeData.routeInfo.patternPaths.find((path) => {
            return path.patternKey == pattern.key
        }).patternPoints


        busLocations[bus].patternWaypoints = waypoints
    
        // find the closest waypoint to each bus
        for (var waypoint in waypoints) {
            waypoints[waypoint].distance = metersBetweenGPSPoints(busLocations[bus].location.latitude, busLocations[bus].location.longitude, waypoints[waypoint].latitude, waypoints[waypoint].longitude)        
        }

        
        // array index of closest waypoint
        var closestWaypoint = waypoints.reduce((prev, curr) => {
            return prev.distance < curr.distance ? prev : curr
        })
        
        // remove all waypoints before the closest waypoint to the bus
        // this is because the bus has already passed these stops
        waypoints.splice(0, waypoints.indexOf(closestWaypoint))
        
        // get the predictions to the remaining stops
        // get indicies of the stops in waypoints
        var stopIndicies = []
        waypoints.forEach((waypoint, index) => {
            if (waypoint.isStop) stopIndicies.push(index)
        })


        for (var stopIndex in stopIndicies) {
            var index = stopIndicies[stopIndex]

            // get waypoints from index 0 to index
            var waypointsToStop = waypoints.slice(0, index)
            console.log(waypoints[index].name + " - " + (await getRoutePrediction(waypointsToStop)))
        }
        console.log("-----")

    }


    

    // return predictions
}

async function getRoutePrediction(waypoints) {
    var ors = getORSAPI()

    if (waypoints.length < 2) return 0
    if (waypoints.length > 70) {
        const chunkSize = 70
        var timeSum = 0
        // split waypoints into groups of 70
        for (let i = 0; i < waypoints.length; i += chunkSize) {
            const chunk = waypoints.slice(i, i + chunkSize);
            timeSum += await getRoutePrediction(chunk)
        }
        return timeSum
    }

    var points = waypoints.map((waypoint) => {
        return [waypoint.longitude, waypoint.latitude]
    })
    
    try {
        var response = await ors.calculate({
            coordinates: points,
            profile: 'driving-car',
        })
        
        return response.routes[0].summary.duration / 60
    } catch (err) {
        console.log("An error occurred: " + err.status)
        console.error(await err.response.json())
    }
}