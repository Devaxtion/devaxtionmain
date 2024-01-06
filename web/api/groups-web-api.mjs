import * as groupServices from '../../services/group-services.mjs'
import * as eventServices from '../../services/event-services.mjs'


// High-order function that processes the request
function processRequest(internalFunction) {

    return function(req, rsp) {

        // Gets the token from the request
        const token = getToken(req)

        // If the token doesn't exist, it returns an error
        if(!token)
            return rsp.status(401).json("Not authorized")

        internalFunction(req, rsp, token)

    }
}

// Process the request before all these functions
export const getAllGroups = processRequest(_getAllGroups)
export const createGroup = processRequest(_createGroup)
export const getGroupDetails = processRequest(_getGroupDetails)
export const updateGroup = processRequest(_updateGroup)
export const deleteGroup = processRequest(_deleteGroup)
export const getAllEvents = processRequest(_getAllEvents)
export const addEvent = processRequest(_addEvent)
export const getEvent = processRequest(_getEvent)
export const removeEvent = processRequest(_removeEvent)


// Groups

function _getAllGroups(req, rsp, token) {

    // Get an array with all the groups from that user
    let groups = groupServices.getAllGroups(token)

    // Error 401: Function didn't return an array
    if(!groups)
        return rsp.status(401).json("Invalid token")

    // Error 404: Function returns an empty array
    if(groups.length == 0)
        return rsp.status(404).json("No groups found")

    // Transform the groups array
    // to show how many events the group have
    groups = groups.map(group => ({
        ...group,
        events: group.events.length
    }))

    // Success
    rsp.json(groups)

}

function _createGroup(req, rsp, token) {

    // Gets the group info from the parameters
    const groupInfo = {
        name: req.body.name,
        description: req.body.description
    }

    if(!groupInfo.name || !groupInfo.description)
        return rsp.status(400).json({
            error: "Missing a required parameter"
          })

    // Creates the group with 'groupInfo'
    const createdGroup = groupServices.createGroup(token, groupInfo)

    // Error 401: Function couldn't create a group
    if(!createdGroup)
        return rsp.status(401).json("Invalid token")

    // Success
    rsp.status(201).json({
        status: `Group created`,
        group: createdGroup
    })

}

function _getGroupDetails(req, rsp, token) {

    // Gets the group ID from the parameters
    const groupID = Number(req.params.id)

    // Gets the group
    const group = groupServices.getGroupDetails(token, groupID)

    // Error 404: Group wasn't found
    if(!group)
        return rsp.status(404).json(`Group ${groupID} not found`)

    // Success
    rsp.json(group)

}

function _updateGroup(req, rsp, token) {

    // Gets the group info from the parameters
    const groupID = Number(req.params.id)
    const groupInfo = {
        name: req.body.name,
        description: req.body.description
    }

    if(!groupInfo.name || !groupInfo.description)
    return rsp.status(400).json({
        error: "Missing a required parameter"
      })

    // Updates the group
    const updatedGroup = groupServices.updateGroup(token, groupID, groupInfo)

    // Error 404: Group wasn't found
    if(!updatedGroup)
        return rsp.status(404).json(`Group ${groupID} not found`)

    // Success
    rsp.json({
        status: `Group ${groupID} updated`,
        group: updatedGroup
    })

}

function _deleteGroup(req, rsp, token) {

    // Gets the group ID from the parameters
    const groupID = Number(req.params.id)

    // Deletes the group selected
    const deleted = groupServices.deleteGroup(token, groupID)

    // Success
    if(deleted)
        return rsp.json(`Group ${groupID} deleted`)
    
    // Error 404: Group wasn't found
    rsp.status(404).json(`Group ${groupID} not found`)

}

// Group Events

function _getAllEvents(req, rsp, token) {

    // Gets the group ID from the parameters
    const groupID = Number(req.params.id)

    // Gets an array with all events from that group
    const events = groupServices.getAllEvents(token, groupID)

    // Error 404: Group wasn't found
    if(!events)
        return rsp.status(404).json(`Group ${groupID} not found`)

    // Error 404: Events array is empty
    if(events.length == 0)
        return rsp.status(404).json("No events found")

    // Success
    rsp.json(events)

}

async function _addEvent(req, rsp, token) {

    // Gets the event ID from the parameters
    const eventID = req.body.id

    if(!eventID)
        return rsp.status(400).json({
            error: "Missing a required parameter"
        })

    // Searches the event with that ID
    const event = await eventServices.getEvent(eventID)

    // Error 404: Event wasn't found
    if(!event)
        return rsp.status(404).json(`Event ${eventID} not found`)


    // Gets the group ID from the parameters
    const groupID = Number(req.params.id)

    // Adds that event to the group selected
    const added = groupServices.addEvent(token, groupID, event)

    // Success
    if(added)
        return rsp.json(`Event ${eventID} added to the group ${groupID}`)
    
    // Error 404: Group wasn't found
    rsp.status(404).json(`Group ${groupID} not found`)

}

function _getEvent(req, rsp, token) {

    // Gets the IDs from the parameters
    const groupID = Number(req.params.id)
    const eventID = Number(req.params.eventid)

    // Gets the event
    const event = groupServices.getEvent(token, groupID, eventID)

    // Error 404: Event wasn't found in the selected Group
    if(!event)
        return rsp.status(404).json(`Event ${eventID} not found in group ${groupID}`)

    // Success
    rsp.json(event)

}

function _removeEvent(req, rsp, token) {

    // Gets the IDs from the parameters
    const groupID = Number(req.params.id)
    const eventID = Number(req.params.eventid)

    // Removes the event from the group
    const removed = groupServices.removeEvent(token, groupID, eventID)

    // Success
    if(removed)
        return rsp.json(`Event ${eventID} removed from group ${groupID}`)
    
    // Error 404: Event wasn't found in the selected Group
    rsp.status(404).json(`Event ${eventID} not found in group ${groupID}`)

}

// Auxiliary module function
function getToken(req) {
    const token = req.get("Authorization")
    if(token)
        return token.split(" ")[1]
}