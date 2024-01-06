import errors from '../../common/errors.mjs'
import errorToHTTP from '../http-error-handling.mjs'
    
export default function(groupServices, eventServices) {
    if(!groupServices)
        throw errors.INVALID_ARGUMENT("groupServices")
    if(!eventServices)
        throw errors.INVALID_ARGUMENT("eventServices")

    return {
        getAllGroups: processRequest(_getAllGroups),
        createGroup: processRequest(_createGroup),
        getGroupDetails: processRequest(_getGroupDetails),
        updateGroupForm: processRequest(_updateGroupForm),
        updateGroup: processRequest(_updateGroup),
        deleteGroup: processRequest(_deleteGroup),
        getAllEvents: processRequest(_getAllEvents),
        addEvent: processRequest(_addEvent),
        getEvent: processRequest(_getEvent),
        removeEvent: processRequest(_removeEvent)
    }

    // High-order function that processes the request
    function processRequest(internalFunction) {

        return async function(req, rsp) {

            // Gets the token from the request
            const token = getToken(req)

            // Error: Token wasn't given
            if(!token)
                rsp.status(401).json({error: "Invalid authentication token"})

            try {

                return await internalFunction(req, rsp, token)

            } catch (error) {
                const rspError = errorToHTTP(error)
                rsp.status(rspError.status).json(rspError.body)
            }

        }
    }


    // Groups

    async function _getAllGroups(req, rsp, token) {

        // Get an array with all the groups from that user
        const groups = await groupServices.getAllGroups(token)

        // Success
        rsp.render('groups', {groups})

    }

    async function _createGroup(req, rsp, token) {

        // Gets the group info from the parameters
        const groupInfo = {
            name: req.body.name,
            description: req.body.description
        }

        // Creates the group with 'groupInfo'
        const createdGroup = await groupServices.createGroup(token, groupInfo)

        // Success
        rsp.status(201).render('group-created', createdGroup)

    }

    async function _getGroupDetails(req, rsp, token) {

        // Gets the group ID from the parameters
        const groupID = req.params.id

        // Gets the group
        const group = await groupServices.getGroupDetails(token, groupID)

        // Success
        rsp.render('group', group)
    }

    async function _updateGroupForm(req, rsp, token) {

        // Gets the group ID from the parameters
        const groupID = req.params.id

        // Gets the group
        const group = await groupServices.getGroupDetails(token, groupID)
        
        // Success
        rsp.render('group-update', group)
    }

    async function _updateGroup(req, rsp, token) {

        // Gets the group info from the parameters
        const groupID = req.params.id
        const groupInfo = {
            name: req.body.name,
            description: req.body.description
        }

        // Updates the group
        const updatedGroup = await groupServices.updateGroup(token, groupID, groupInfo)

        // Success
        rsp.render('group-updated', updatedGroup)

    }

    async function _deleteGroup(req, rsp, token) {

        // Gets the group ID from the parameters
        const groupID = req.params.id

        // Deletes the group selected
        await groupServices.deleteGroup(token, groupID)

        // Success
        rsp.render('group-deleted')

    }

    // Group Events

    async function _getAllEvents(req, rsp, token) {

        // Gets the group ID from the parameters
        const groupID = req.params.id

        // Gets an array with all events from that group
        //const events = await groupServices.getAllEvents(token, groupID)

        const group = await groupServices.getGroupDetails(token, groupID)

        // Success
        rsp.render('group-events', group)

    }

    async function _addEvent(req, rsp, token) {

        // Gets the event ID from the body
        const eventID = req.body.id

        // Searches the event with that ID
        const event = await eventServices.getEvent(eventID)

        // Gets the group ID from the parameters
        const groupID = req.params.id

        // Adds that event to the group selected
        const group = await groupServices.addEvent(token, groupID, event)

        // Success
        rsp.render('group-event-added', group)

    }

    async function _getEvent(req, rsp, token) {

        // Gets the IDs from the parameters
        const groupID = req.params.id
        const eventID = req.params.eventid

        // Gets the event
        const event = await groupServices.getEvent(token, groupID, eventID)

        // Success
        rsp.render('group-event', event)

    }

    async function _removeEvent(req, rsp, token) {

        // Gets the IDs from the parameters
        const groupID = req.params.id
        const eventID = Number(req.params.eventid)

        // Removes the event from the group
        const group = await groupServices.removeEvent(token, groupID, eventID)

        // Success
        rsp.render('group-event-removed', group)

    }

    // Auxiliary module function
    function getToken(req) {
        return req.token = "936cdcf9-6f2f-4ef6-aec8-f8c8bfea1471"
    }

}