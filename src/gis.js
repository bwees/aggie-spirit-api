import Openrouteservice from 'openrouteservice-js'
import { RouteGroup, getRoutesByGroup } from './map_api.js';


export var ors_api_key = ""
function getORSAPI() {
    if (ors_api_key == "") throw new Error("Openrouteservice API key not set")
    return new Openrouteservice.Directions({ api_key: ors_api_key});
}

function flattenRoutes(routes) {
    if (!Array.isArray(routes)) {
        var flattened = []
        for (var group in routes) {
            for (var route in routes[group]) {
                flattened.push(routes[group][route])
            }
        }

        return flattened
    }

    return routes
}

export async function getClosestStops(lat, lon, limit = 10, routes) {
    var routes = routes || await getRoutesByGroup(RouteGroup.ALL)
    routes = flattenRoutes(routes)

    distances = []

    for (var route in routes) {
        routes[route].patternPaths = routes[route].patternPaths.filter((pattern) => pattern.isStop)
        for (var pattern in routes[route].patternPaths) {
            var pattern = routes[route].patternPaths[pattern]
            for (var stop in pattern) {
                var stop = pattern[stop]

                var distance = Math.sqrt(Math.pow(stop.lat - lat, 2) + Math.pow(stop.lon - lon, 2))
                distances.push({stop: stop, distance: distance})
            }
        }
    }
                
    return distances.sort((a, b) => a.distance - b.distance).slice(0, limit)
}