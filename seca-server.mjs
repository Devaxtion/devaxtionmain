import swaggerUI from 'swagger-ui-express'
import yaml from 'yamljs'
import url from 'url'
import path from 'path'

import express from 'express'
import cors from 'cors'
import hbs from 'hbs'


// Import Web Site
import groupsSiteInit from './web/site/groups-web-site.mjs'
import eventsSiteInit from './web/site/events-web-site.mjs'

// Import Web API
import groupsApiInit from './web/api/groups-web-api.mjs'
import eventsApiInit from './web/api/events-web-api.mjs'
import usersApiInit from './web/api/users-web-api.mjs'

// Import Services
import groupServicesInit from './services/group-services.mjs'
import eventServicesInit from './services/event-services.mjs'
import userServicesInit from './services/user-services.mjs'

// Import Data
//import groupsDataInit from './data/elastic/groups-data-elastic.mjs'
import groupsDataInit from './data/memory/groups-data-mem.mjs'
import usersDataInit from './data/memory/users-data-mem.mjs'
import tmDataInit from './data/ticketmaster/tm-events-data.mjs'






// Init Data
const groupsData = await groupsDataInit()
const usersData = usersDataInit()
const tmData = tmDataInit()

// Init Services
const userServices = userServicesInit(usersData)
const groupServices = groupServicesInit(userServices, groupsData)
const eventServices = eventServicesInit(tmData)

// Init Web API
const groupsApi = groupsApiInit(groupServices, eventServices)
const eventsApi = eventsApiInit(eventServices)
const usersApi = usersApiInit(userServices)

// Init Web Site
const groupsSite = groupsSiteInit(groupServices, eventServices)
const eventsSite = eventsSiteInit(eventServices)

const port = 1904
const swaggerDocument = yaml.load('./docs/events-api.yaml')
const currentDir = url.fileURLToPath(new URL('.', import.meta.url))
const viewsDir = path.join(currentDir, 'web', 'site', 'views')

let app = express()

app.use(cors())
app.use(express.json())
// { extended: true } not to give the warning in the console
app.use(express.urlencoded( { extended: true } ))
app.use(express.static('./web/site/public'))

// SwaggerUI Docs
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// View Engine
app.set('view engine', 'hbs')
app.set('views', viewsDir)
hbs.registerPartials(path.join(viewsDir, 'partials'))


// Web site routes

    // Events
    app.get('/events', function(req, rsp) {rsp.render('events')})
    app.get('/events/popular', eventsSite.getPopularEvents)
    app.get('/events/search', eventsSite.searchEvents)

    // Groups
    app.get('/groups', groupsSite.getAllGroups)
    app.post('/groups/create', groupsSite.createGroup)
    app.get('/groups/:id', groupsSite.getGroupDetails)
    app.get('/groups/:id/update', groupsSite.updateGroupForm)
    app.post('/groups/:id/update', groupsSite.updateGroup)
    app.post('/groups/:id/delete', groupsSite.deleteGroup)
    app.get('/groups/:id/events', groupsSite.getAllEvents)
    app.post('/groups/:id/events', groupsSite.addEvent)
    app.get('/groups/:id/events/:eventid', groupsSite.getEvent)
    app.post('/groups/:id/events/:eventid/delete', groupsSite.removeEvent)

// Web API routes

    // Users
    app.post('/api/users', usersApi.createUser)

app.listen(port, () => console.log(`Server waiting for requests on port ${port}`))