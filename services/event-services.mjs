import { json } from 'express'
import * as tmData from '../tm-events-data.mjs'


export async function getPopularEvents(size, page) {

    // Decreases the value of page by 1 to match the page values in TicketMaster
    page--

    // Filter of most popular that Ticket Master accepts
    const filter = '&sort=relevance,desc'

    // Get the event data
    const jsonResponse = await tmData.getEventData(size, page, filter)

    // Error: Function couldn't get event data
    if(!jsonResponse) return

    // Process the array of events
    const eventData = processArrayOfEvents(jsonResponse)

    // Success
    return eventData

}

export async function searchEvents(size, page, name) {

    // Decreases the value of page by 1 to match the page values in TicketMaster
    page--

    // Filter for searching by keyword that Ticket Master accepts
    const filter = `&keyword=${name}`

    // Get the event data
    const jsonResponse = await tmData.getEventData(size, page, filter)

    // Error: Function couldn't get event data
    if(!jsonResponse) return

    // Process the array of events
    const eventData = processArrayOfEvents(jsonResponse)

    // Success
    return eventData

}


export async function getEvent(eventID) {

    // Get the event data
    const jsonResponse = await tmData.getEventData(null, null, null, eventID)

    // Error: Function couldn't get event data
    if(!jsonResponse) return

    // Process the event
    const event = processEvent(jsonResponse)

    // Success
    return event

}


// Auxiliary Functions

function processEvent(event) {

    const classifications = event.classifications || undefined

    // Return the event
    return {

        id: event.id,
        name: event.name,
        date: event.dates.start.dateTime,
        // Doesn't add a segment and genre if one of them doesn't exist
        segment: classifications ? classifications[0].segment.name : undefined,
        genre: classifications ? classifications[0].genre.name : undefined

    }

}

function processArrayOfEvents(jsonResponse) {

    // Error: Array doesn't contain events
    if(!jsonResponse._embedded)
        return

    // Array of events
    const eventData = jsonResponse._embedded.events

    // Error: Event not found
    if(!eventData)
        return

    // For each event in the array, call 'processEvent'
    const events = eventData.map(event => event = processEvent(event))

    // Return the array
    return events

}