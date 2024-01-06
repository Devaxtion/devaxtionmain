

export const errorCodes = {
    INVALID_ARGUMENT: 1,
    NOT_FOUND: 2,
    USER_NOT_FOUND: 3,
    NOT_AUTHORIZED: 4,
    ALREADY_EXISTS: 5
}

// Object with functions that return the specific errors
export default {

    INVALID_ARGUMENT: argName => new Error (
        errorCodes.INVALID_ARGUMENT,
        `Invalid argument: ${argName}`
    ),

    NOT_FOUND: (what) => new Error(
        errorCodes.NOT_FOUND, `${what} not found.`
    ),

    USER_NOT_FOUND: () => new Error (
        errorCodes.USER_NOT_FOUND, "User not found."
    ),

    NOT_AUTHORIZED: () => new Error (
        errorCodes.NOT_AUTHORIZED,
        `You have no access to this.`
    ),

    ALREADY_EXISTS: (what) => new Error (
        errorCodes.ALREADY_EXISTS,
        `${what} already exists.`
    )

}

function Error(code, message) {
    this.code = code
    this.message = message
}