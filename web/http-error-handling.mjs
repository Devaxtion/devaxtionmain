import { errorCodes } from '../common/errors.mjs'

export default function(error) {
    
    switch(error.code) {

        case errorCodes.INVALID_ARGUMENT: return new responseHTTP(400, error)
        case errorCodes.NOT_FOUND: return new responseHTTP(404, error)
        case errorCodes.USER_NOT_FOUND: return new responseHTTP(401, error)
        case errorCodes.NOT_AUTHORIZED: return new responseHTTP(401, error)
        case errorCodes.ALREADY_EXISTS: return new responseHTTP(400, error)

        default: return new responseHTTP(500, "Internal server error.")

    }
}

function responseHTTP(status, error) {
    this.status = status
    this.body = {
        code: error.code,
        error: error.message
    }
}