import { getClosestStops } from '../src/gis.js';
import { getRouteByName, getRoutesByGroup, getRouteStopPredictions, RouteGroup, setORSAPIKey } from '../src/index.js';

setORSAPIKey("5b3ce3597851110001cf62484ad38325dafe4d63baba938c586a2440")

getRouteStopPredictions("47").then((predictions) => {
})
