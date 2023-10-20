import { getClosestStops } from '../src/gis.js';
import { getRouteByName, getRoutesByGroup, getRouteStopPredictions, RouteGroup, setORSAPIKey } from '../src/index.js';

setORSAPIKey(process.env["ORS_API_KEY"])

getRouteStopPredictions("01-04").then((predictions) => {
})
