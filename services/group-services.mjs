import errors from '../common/errors.mjs'

export default function (userServices, groupsData) {
    if(!userServices)
        throw errors.INVALID_ARGUMENT("userServices")
    if(!groupsData)
        throw errors.INVALID_ARGUMENT("groupsData")

    return {
        getAllGroups,
        createGroup,
        getGroupDetails: processGroup(_getGroupDetails),
        updateGroup: processGroup(_updateGroup),
        deleteGroup: processGroup(_deleteGroup),
        //getAllEvents: processGroup(_getAllEvents),
        addEvent: processGroup(_addEvent),
        getEvent: processGroup(_getEvent),
        removeEvent: processGroup(_removeEvent)
    }

    // High-order function that checks if the group selected belongs to the user
    function processGroup(internalFunction) {

        return async function(token, groupID, ...args) {

            // Error: groupID isn't a string
            if(typeof groupID != 'string')
                throw errors.INVALID_ARGUMENT("Group ID")

            // Find the user with the given token
            const userID = await userServices.getUserID(token)

            // Find the selected group
            const group = await groupsData.getGroupDetails(groupID)

            // Error: Group doesn't exist
            if(!group)
                throw errors.NOT_FOUND(`Group ${groupID}`)

            // Error: Group doesn't belong to user
            if(group.userID !== userID)
                throw errors.NOT_AUTHORIZED()

            // Success
            return internalFunction(group, ...args)

        }
    }

    // Groups

    async function getAllGroups(token) {

        // Find the user with the given token
        const userID = await userServices.getUserID(token)

        // Get all the groups from that user
        const groups = await groupsData.getAllGroups(userID)

        // Success
        return groups
        
    }

    async function createGroup(token, groupInfo) {

        // Find the user with the given token
        const userID = await userServices.getUserID(token)

        // Error: Body doesn't contain a 'name' property that is a string
        if(typeof groupInfo.name != 'string')
            throw errors.INVALID_ARGUMENT("Group name")

        // Creates the new group
        const newGroup = {
            name: groupInfo.name,
            description: groupInfo.description,
            userID: userID,
            nextEventID: 1,
            events: []
        }
        
        groupsData.createGroup(newGroup)

        // Success
        return newGroup
        
    }

    function _getGroupDetails(group) {

        return group

    }

    function _updateGroup(group, groupInfo) {

        // Error: Name was given but it isn't a string
        if(groupInfo.name && typeof groupInfo.name != 'string')
            throw errors.INVALID_ARGUMENT("Group name")

        // Error: Description was given but it isn't a string
        if(groupInfo.description && typeof groupInfo.description != 'string')
            throw errors.INVALID_ARGUMENT("Group description")

        // Update the 'name' if it exists
        if(groupInfo.name)
            group.name = groupInfo.name

        // Update the 'description' if it exists
        if(groupInfo.description)
            group.description = groupInfo.description

        // Success
        return groupsData.updateGroup(group)

    }

    async function _deleteGroup(group) {

        return await groupsData.deleteGroup(group.id)

    }


    // Group Events

    function _addEvent(group, event) {

        const newEvent = {
            ...event,
            id: group.nextEventID++,
            groupID: group.id
        }

        // Pushes the event into the 'groups' array
        group.events.push(newEvent)

        // Adds the event
        return groupsData.updateGroup(group)

    }

    function _getEvent(group, eventID) {

        // Finds the event
        const event = group.events.find(event => event.id == eventID)

        // Error: Event not found
        if(!event)
            throw errors.NOT_FOUND(`Event ${eventID}`)

        // Success
        return event

    }

    function _removeEvent(group, eventID) {

        // Updates the array of events
        group.events = group.events.filter(event => event.id != eventID)

        // Updates the group with updated array of events
        return groupsData.updateGroup(group)

    }

}