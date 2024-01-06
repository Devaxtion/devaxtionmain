import { fetchWithRateLimit } from "./fetch-rate-limiter.mjs"


// Information to reach API
const apiKey = 'ZBAlKRLRI0Q4jzBxHRxHGOeC5cESWiWg'

// Retry the fetch when the rate limit is triggered
const fetch = fetchWithRateLimit([429], 1000)


// Fetch data
async function fetchData(URL) {

    try {

        // Access the API
        const response = await fetch(URL)

        // Error: Request failed
        if (!response.ok)
            throw new Error('Request failed!')

        // Success: Return the json response
        return await response.json()

    } catch (error) {
        console.error("Error fetching data:", error)
    }

}

// Process the URL and its parameters
function processURL(size, page, filter, eventID) {

    // If eventID was given puts a slash before the value
    // If not, its transformed into a empty string
    eventID = eventID ? `/${eventID}` : ""

    // Creates the URL with the given values
    const params = `apikey=${apiKey}` + `&size=${size}` + `&page=${page}` + filter
    const baseURL = 'https://app.ticketmaster.com/discovery/v2/events'
    const URL = baseURL + eventID + '.json?' + params

    // Fetch event data with the URL created
    return URL

}

// Function to get the event data in form of JSON response
export async function getEventData(size, page, filter, eventID) {

    const URL = processURL(size, page, filter, eventID)
    const eventData = await fetchData(URL)

    return eventData

}