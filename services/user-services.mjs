import crypto from 'node:crypto'
import errors from '../common/errors.mjs'

export default function (usersData) {
    
    if(!usersData)
        throw errors.INVALID_ARGUMENT("usersData")

    return {
        createUser,
        getUserID
    }

    async function createUser(username) {

        // Error: Username isn't a string
        if(typeof username != 'string')
            throw errors.INVALID_ARGUMENT("Username")

        // Checks if username is taken or not
        const isUsernameTaken = await usersData.isUsernameTaken(username)

        // Error: User already exists
        if(isUsernameTaken == true)
            throw errors.ALREADY_EXISTS("User")

        // Creates the new user
        const newUser = {
            username: username,
            token: crypto.randomUUID()
        }

        // Success
        return await usersData.createUser(newUser)
        
    }

    async function getUserID(token) {

        // Tries to find a user with that token
        const user = await usersData.getUserID(token)

        // Error: User not found
        if(!user)
            throw errors.USER_NOT_FOUND()

        // Success
        return user

    }

}