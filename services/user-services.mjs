import crypto from 'node:crypto'
import { users } from '../seca-data-mem.mjs'


let nextID = users.length + 1

export function createUser(userName) {

    // Finds the user index with the given username
    const userIdx = users.findIndex(user => user.username == userName)

    // Error: If a user with username already exists, returns undefined
    if (userIdx != -1) return

    // Creates the new user
    const newUser = {
        id: nextID++,
        username: userName,
        token: crypto.randomUUID()
    }

    // Puts the new user into the array
    users.push(newUser)

    // Returns the user
    return newUser
    
}

export function getUserID(token) {

    // Tries to find a user with that token
    const user = users.find(user => user.token == token)

    // Success
    if(user)
        return user.id

}