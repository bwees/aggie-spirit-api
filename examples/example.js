import { getStopEstimates, getAuthentication, getBaseData, getNearbyRoutes, getPatternPaths } from "../src/index.js";

getAuthentication().then(async (auth) => {
    console.log(await getStopEstimates("0400", new Date(), auth))
})
