import errors from '../../common/errors.mjs'
import errorToHTTP from '../http-error-handling.mjs'

export default function(eventServices) {
    if(!eventServices)
        throw errors.INVALID_ARGUMENT("eventServices")

    return {
        getPopularEvents: processQuery(_getPopularEvents),
        searchEvents: processQuery(_searchEvents)
    }

    // High-order function that processes the query parameters
    function processQuery(internalFunction) {

        return async function(req, rsp) {

            // Gets the size and the page numbers from the query
            const size = Number(req.query.s) || 30
            const page = Number(req.query.p) || 1

            try {

                // Error: Size or page are invalid
                if(page < 1 || size < 1)
                    throw errors.INVALID_ARGUMENT("Query parameters")

                return await internalFunction(req, rsp, size, page)

            } catch (error) {
                const rspError = errorToHTTP(error)
                rsp.status(rspError.status).json(rspError.body)
            }

        }
    }

    async function _getPopularEvents(req, rsp, size, page) {

        // Get an array of the popular events
        const popularEvents = await eventServices.getPopularEvents(size, page)

        // Success
        rsp.json(popularEvents)

    }

    async function _searchEvents(req, rsp, size, page) {

        // Gets the name to search from the parameters
        const name = req.params.name

        // Gets an array of the events found with that name
        const events = await eventServices.searchEvents(size, page, name)

        // Success
        rsp.json(events)

    }

}