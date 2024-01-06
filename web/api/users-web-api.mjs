import * as userServices from '../../services/user-services.mjs'


export function createUser(req, rsp) {

    // Gets the username requested from the user
    const userName = req.body.username

    // Creates a new user with that username
    const newUser = userServices.createUser(userName)

    // Error 400: Username already exists
    if (!newUser)
        return rsp.status(400).json(`Username ${userName} already exists`)

    // Success
    rsp.status(201).json({
        status: `User created`,
        user: newUser
    })
}