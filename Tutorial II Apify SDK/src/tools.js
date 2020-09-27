const Apify = require('apify'); 
const routes = require('./routes');

const {utils: {log}} = Apify;

//FUNCTION TO GET FIRST URL FROM INPUT
exports.getSources = async () => {
    log.debug('Getting sources');
    const input = await Apify.getInput(); // GETTING INPUT (SRC: /apify_storage/key_value_stores/default/INPUT.json)
    // CHECKING INPUT
    if (input.length === 0) {
        throw new Error('No input');
    }

    const keyword = input.keyword; // KEYWORD == 'PHONES' 
    // FUNCTION SIMPLY RETURNS AN ARRAY OF OBJECT THAT WE CAN PASS TO REQUESTQUEUE
    return [{
        url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
        userData: // CUSTOM USER DATA ASSIGNED TO THE REQUEST
            {
                label: 'SEARCH_PAGE', // USED TO LABEL DIFFERENT REQUESTS
                keyword
            }
    }]
};

//FUNCTION TO CREATE ROUTES (SEARCH_PAGE, ITEM_PAGE, OFFER_PAGE) 
exports.createRouter = (globalContext) => {

    return async function (routeName, requestContext) {
        const route = routes[routeName];
        // CHECKS IF ROUTE IS CORRECT AVAILABLE ROUTES: SEARCH_PAGE, ITEM_PAGE, OFFER_PAGE
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        // JUST RETURNS FUNCTION FROM ./routes THAT MUST PROCESS PAGE DEPENDING ON ROUTENAME (LABEL)
        return route(requestContext, globalContext);
    };
};