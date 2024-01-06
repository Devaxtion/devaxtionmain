import * as userServices from './user-services.mjs'
import { groups } from '../seca-data-mem.mjs'


let nextGroupID = groups.length + 1

// High-order function that gets the user ID
function processUser(internalFunction) {

    return function(token, ...args) {
        
        // Find the user with the given token
        const userID = userServices.getUserID(token)

        // Success
        if(userID)
            return internalFunction(userID, ...args)

    }
}

// High-order function that checks if the group selected belongs to the user
function processGroup(internalFunction) {

    return function(token, groupID, ...args) {

        // Find the user with the given token
        const userID = userServices.getUserID(token)

        // Error: User with that token wasn't found
        if(!userID) return

        // Find the selected group and checks if it belongs to the user
        const group = groups.find(group => {
            return group.id == groupID && group.userID == userID
        })

        // Error: Group doesn't exist or it doesn't belong to user
        if(!group) return

        // Success
        return internalFunction(group, ...args)

    }
}

export const getAllGroups = processUser(_getAllGroups)
export const createGroup = processUser(_createGroup)
export const getGroupDetails = processGroup(_getGroupDetails)
export const updateGroup = processGroup(_updateGroup)
export const deleteGroup = processGroup(_deleteGroup)
export const getAllEvents = processGroup(_getAllEvents)
export const addEvent = processGroup(_addEvent)
export const getEvent = processGroup(_getEvent)
export const removeEvent = processGroup(_removeEvent)

// Groups

function _getAllGroups(userID) {

    // Get all the groups from that user
    return groups.filter(group => group.userID == userID)

}

function _createGroup(userID, groupInfo) {

    // Creates the new group
    const newGroup = {
        id: nextGroupID++,
        name: groupInfo.name,
        description: groupInfo.description,
        userID: userID,
        nextEventID: 1,
        events: []
    }
    
    // Pushes the new group into the array
    groups.push(newGroup)

    // Success
    return newGroup
    
}

function _getGroupDetails(group) {

    return group

}

function _updateGroup(group, groupInfo) {

    // Finds the index of the group selected
    const groupIdx = groups.findIndex(g => g == group)

    // Updates the 'name' and 'description' of the group selected
    groups[groupIdx] = {

        ...group,
        name: groupInfo.name,
        description: groupInfo.description

    }

    // Success
    return groups[groupIdx]

}

function _deleteGroup(group) {

    // Finds the index of the group selected
    const groupIdx = groups.findIndex(g => g == group)

    // Delete the group that index
    groups.splice(groupIdx, 1)

    // Success
    return true

}


// Group Events

function _getAllEvents(group) {

    return group.events

}

async function _addEvent(group, event) {

    const newEvent = {
        ...event,
        localID: group.nextEventID++,
        groupID: group.id
    }

    // Pushes the event into the 'groups' array
    group.events.push(newEvent)

    // Success
    return true

}

function _getEvent(group, eventID) {

    return group.events.find(event => event.localID == eventID)

}

function _removeEvent(group, eventID) {

    // Finds the index of the group selected
    const groupIdx = groups.findIndex(g => g == group)

    // Find the index of the event selected
    const eventIdx = groups[groupIdx].events.findIndex(event => event.localID == eventID)

    // Error: Event not found
    if(eventIdx == -1) return

    // The new array of events (without the removed one)
    const filteredEvents = group.events.filter(event => event.localID != eventID)
    
    // Update the event array
    groups[groupIdx].events = filteredEvents

    // Success
    return true

}