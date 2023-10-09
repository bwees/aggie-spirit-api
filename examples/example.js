import { getClosestStops } from '../src/gis.js';
import { getRouteByName, getRoutesByGroup, RouteGroup } from '../src/index.js';

getClosestStops(30.642298,-96.467580).then((stops) => {
    console.log(stops)
})
