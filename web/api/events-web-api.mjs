import * as eventServices from '../../services/event-services.mjs'


// High-order function that processes the query parameters
function processQuery(internalFunction) {

    return function(req, rsp) {

        // Gets the size and the page numbers from the query
        const size = req.query.s || 30
        const page = req.query.p || 1

        // Error 400: Size or page are equal to 0 or negative
        if(page < 1 || size < 1)
            return rsp.status(400).json("Invalid parameters")

        internalFunction(req, rsp, size, page)

    }
}

// Process the query before all these functions
export const getPopularEvents = processQuery(_getPopularEvents)
export const searchEvents = processQuery(_searchEvents)


async function _getPopularEvents(req, rsp, size, page) {

    // Get an array of the popular events
    const popularEvents = await eventServices.getPopularEvents(size, page)

    // Error 400: Function had a problem getting the events
    if(!popularEvents)
        rsp.status(400).json("Bad request")

    // Success
    rsp.json(popularEvents)

}

async function _searchEvents(req, rsp, size, page) {

    // Gets the name to search from the parameters
    const name = req.params.name

    // Gets an array of the events found with that name
    const eventsFound = await eventServices.searchEvents(size, page, name)

    // Error 400: Function had a problem searching the event
    if(!eventsFound)
        return rsp.status(400).json("Bad request")

    // Error 404: Array is empty
    if(eventsFound.length == 0)
        return rsp.status(404).json(`No events with the name ${name} found`)

    // Success
    rsp.json(eventsFound)

}