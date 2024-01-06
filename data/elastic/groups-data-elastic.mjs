import { get, post, del, put } from './fetch-wrapper.mjs'
import urlManager from './url-manager.mjs'


export default async function () {

    const indexName = 'groups'
    const groupsURL = urlManager(indexName)

    // Init ElasticSearch 'Groups' Index
    await put(groupsURL.createIndex())

    return {
        getAllGroups,
        createGroup,
        getGroupDetails,
        updateGroup,
        deleteGroup
    }

    async function getAllGroups(userID) {

        const uri = `${groupsURL.getAll()}?q=userID:${userID}`
        const body = await get(uri)
        const groups = body.hits.hits.map(processGroup)
        return groups

    }

    async function createGroup(group) {

        const body = await post(groupsURL.create(), group)
        group.id = body._id
        return group

    }

    async function getGroupDetails(groupID) {
        const groupData = await get(groupsURL.get(groupID))
        const group = processGroup(groupData)
        return group
    }

    async function updateGroup(group) {
        await put(groupsURL.update(group.id), group)
        return group
    }

    async function deleteGroup(groupID) {
        const body = await del(groupsURL.delete(groupID))
        return body._id
    }


    function processGroup(groupElastic) {
        let group = Object.assign({id: groupElastic._id}, groupElastic._source)
        return group
    }

}