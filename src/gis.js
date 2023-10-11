import Openrouteservice from 'openrouteservice-js'
import { RouteGroup, getRoutesByGroup } from './map_api.js';


export var ors_api_key = ""
/**
 * Wrapper function to retreive the Openrouteservice API object since the API key is not passed to each function
 * @returns {Openrouteservice.Directions} Openrouteservice API object
 */
function getORSAPI() {
    if (ors_api_key == "") throw new Error("Openrouteservice API key not set")
    return new Openrouteservice.Directions({ api_key: ors_api_key});
}

/**
 * Compute the distance between two GPS points in meters
 * @param {Number} lat1 latitude of first point
 * @param {Number} lon1 longitude of first point
 * @param {Number} lat2 latitude of second point
 * @param {Number} lon2 longitude of second point
 * @returns {Number} distance in meters
 */
function metersBetweenGPSPoints(lat1, lon1, lat2, lon2) {
    function degreesToRadians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
    var earthRadiusKm = 6371;
  
    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);
  
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c * 1000;
  }

/**
 * Converts from an object with each value an array of routes to a flattened array of routes
 * If an array is passed, it is returned
 * @param {Object | Array} routes 
 * @returns flattened array of routes
 */
function flattenRoutes(routes) {
    if (Array.isArray(routes)) return routes

    var flattened = []
    for (var group in routes) {
        for (var route in routes[group]) {
            flattened.push(routes[group][route])
        }
    }

    return flattened
}

/**
 * Gets the closest stops to a given GPS point
 * @param {Number} lat latitude of point
 * @param {Number} lon longitude of point
 * @param {Number} limit returns the closest n stops
 * @param {Object | Array} routes the routes to search for stops on, defaults to all routes
 * @returns {Array}
 */
export async function getClosestStops(lat, lon, routes=await getRoutesByGroup(RouteGroup.ALL), limit=10) {
    routes = flattenRoutes(routes)

    var distances = []

    for (var route in routes) {
        for (var pattern in routes[route].routeInfo.patternPaths) {
            var pattern = routes[route].routeInfo.patternPaths[pattern]
            for (var stop in pattern.patternPoints) {
                var stop = pattern.patternPoints[stop]
                if (stop && stop.isStop) {
                    var distance = metersBetweenGPSPoints(lat, lon, stop.latitude, stop.longitude)
                    distances.push({stop: stop, route: routes[route], pattern: pattern, distance: distance})
                }
            }
        }
    }
                
    return distances.sort((a, b) => a.distance - b.distance).slice(0, limit)
}