export default function () {
    
    return {
        getAllGroups,
        createGroup,
        getGroupDetails,
        updateGroup,
        deleteGroup
    }

    function getAllGroups(userID) {

        return groups.filter(group => group.userID == userID)

    }

    async function createGroup(group) {

        group.id = nextGroupID++
        groups.push(group)
        return group

    }

    async function getGroupDetails(groupID) {

        return groups.find(group => {
            return group.id == groupID
        })

    }

    async function updateGroup(group) {
        
        const groupIdx = groups.findIndex(g => g.id === group.id)

        groups[groupIdx] = group

        return group

    }

    async function deleteGroup(groupID) {

        // Finds the index of the group selected
        const groupIdx = groups.findIndex(g => g.id === groupID)

        // Delete the group that index
        groups.splice(groupIdx, 1)

    }

}

const groups = []

let nextGroupID = groups.length + 1