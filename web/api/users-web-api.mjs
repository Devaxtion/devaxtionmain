import errorToHTTP from '../http-error-handling.mjs'

export default function (userServices) {
    if(!userServices)
        throw errors.INVALID_ARGUMENT("userServices")

    return {
        createUser: processErrors(_createUser)
    }

    // High-order function that processes the request
    function processErrors(internalFunction) {

        return async function(req, rsp) {

            try {

                return await internalFunction(req, rsp)

            } catch (error) {
                const rspError = errorToHTTP(error)
                rsp.status(rspError.status).json(rspError.body)
            }

        }
    }

    async function _createUser(req, rsp) {

        // Gets the username requested from the user
        const username = req.body.username

        // Creates a new user with that username
        const newUser = await userServices.createUser(username)

        // Success
        rsp.status(201).json({
            status: `User created`,
            user: newUser
        })
    }

}