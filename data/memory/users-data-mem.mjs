export default function () {

    return {
        getUserID,
        createUser,
        isUsernameTaken
    }

    async function getUserID(token) {
        return users.find(user => user.token == token)
    }

    async function createUser(user) {

        user.id = nextUserID++

        // Puts the new user into the array
        users.push(user)

        // Success
        return user
        
    }

    async function isUsernameTaken(username) {

        // Finds the user index with the given username
        const userIdx = users.findIndex(user => user.username == username)

        // If the username already exists, returns true
        if(userIdx !== -1)
            return true

        return false

    }

}

const users = [
    {
        "id": 1,
        "username": "devaxtion",
        "token": "936cdcf9-6f2f-4ef6-aec8-f8c8bfea1471"
    },
    {
        "id": 2,
        "username": "wild_show",
        "token": "936cdcf9-6f2f-4ef6-aec8-f8c8bfea1472"
    },
    {
        "id": 3,
        "username": "aaa",
        "token": "936cdcf9-6f2f-4ef6-aec8-f8c8bfea1473"
    }
]

let nextUserID = users.length + 1