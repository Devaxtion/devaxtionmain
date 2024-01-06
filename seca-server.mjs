// import swaggerUI from 'swagger-ui-express'
// import yaml from 'yamljs'
// import cors from 'cors'

import express from 'express'
import swaggerUI from 'swagger-ui-express'
import yaml from 'yamljs'
import cors from 'cors'
import * as usersAPI from './web/api/users-web-api.mjs'
import * as eventsAPI from './web/api/events-web-api.mjs'
import * as groupsAPI from './web/api/groups-web-api.mjs'


console.log('Setting up server...')

const port = 1904
const swaggerDocument = yaml.load('./docs/events-api.yaml')

let app = express()

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(cors())
app.use(express.json())

// Users
app.post('/users', usersAPI.createUser)

// Events
app.get('/events',  (req, rsp) => {
    rsp.set('Content-Type', 'text/plain')
    rsp.send("- See the most popular events with /events/popular\n" +
    "- Search events by name with /events/search/<name>")})
app.get('/events/popular', eventsAPI.getPopularEvents)
app.get('/events/search',  (req, rsp) => {
    rsp.set('Content-Type', 'text/plain')
    rsp.send("Search events by name with /events/search/<name>")})
app.get('/events/search/:name', eventsAPI.searchEvents)

// Groups
app.get('/groups', groupsAPI.getAllGroups)
app.post('/groups', groupsAPI.createGroup)
app.get('/groups/:id', groupsAPI.getGroupDetails)
app.put('/groups/:id', groupsAPI.updateGroup)
app.delete('/groups/:id', groupsAPI.deleteGroup)
app.get('/groups/:id/events', groupsAPI.getAllEvents)
app.post('/groups/:id/events', groupsAPI.addEvent)
app.get('/groups/:id/events/:eventid', groupsAPI.getEvent)
app.delete('/groups/:id/events/:eventid', groupsAPI.removeEvent)

// Main
app.get('/', (req, rsp) => {
    rsp.set('Content-Type', 'text/plain')
    const message = "\n\nAvailable URIs:\n" +
                    "- /events\n" +
                    "- /groups\n" +
                    "- /docs"
    rsp.send(`SECA System ${message}`)
})

app.listen(port, () => console.log(`Server waiting for requests on port ${port}`))