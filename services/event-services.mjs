import errors from '../common/errors.mjs'

export default function (tmData) {
    if(!tmData)
        throw errors.INVALID_ARGUMENT("tmData")

    return {
        getPopularEvents,
        searchEvents,
        getEvent

    }

    async function getPopularEvents(size, page) {

        // Decreases the value of page by 1 to match the page values in TicketMaster
        page--

        // Filter of most popular that Ticket Master accepts
        const filter = '&sort=relevance,desc'

        // Get the event data
        const eventData = await tmData.getEventData(size, page, filter)

        // Error: Function couldn't find an event
        if(!eventData)
            throw errors.NOT_FOUND("Events")

        // Process the array of events
        const events = processArrayOfEvents(eventData)

        // Success
        return events

    }

    async function searchEvents(size, page, name) {

        // Decreases the value of page by 1 to match the page values in TicketMaster
        page--

        // Filter for searching by keyword that Ticket Master accepts
        const filter = `&keyword=${name}`

        // Get the event data
        const eventData = await tmData.getEventData(size, page, filter)

        // Error: Function couldn't find an event
        if(!eventData._embedded)
            throw errors.NOT_FOUND("Events")

        // Process the array of events
        const events = processArrayOfEvents(eventData)

        // Success
        return events

    }

    async function getEvent(eventID) {

        // Error: eventID doesn't exist or it isn't a string
        if(typeof eventID != 'string')
            throw errors.INVALID_ARGUMENT("Event ID")

        // Get the event data
        const eventData = await tmData.getEventData(null, null, null, eventID)

        // Error: Event wasn't found
        if(!eventData)
            throw errors.NOT_FOUND("Event")

        // Process the event
        const event = processEvent(eventData)

        // Success
        return event

    }


    // Auxiliary Functions

    function processEvent(event) {

        const processedEvent = {

            ticketmasterID: event.id,
            name: event.name,
            date: event.dates.start.dateTime

        }

        // Doesn't add a segment and genre if they doesn't exist
        if (event.classifications && event.classifications.length > 0) {

            const classifications = event.classifications[0]

            // Some events have the 'classifications' property but they don't have segment or genre:
            if(classifications.segment && classifications.genre) {
                processedEvent.segment = classifications.segment.name
                processedEvent.genre = classifications.genre.name
            }

        }

        // Return the processed event
        return processedEvent

    }

    function processArrayOfEvents(eventData) {

        // Array of events
        const events = eventData._embedded.events

        // For each event in the array, call 'processEvent'
        const eventsArray = events.map(event => event = processEvent(event))

        // Return the array
        return eventsArray

    }

}