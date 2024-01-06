export async function get(uri) {
    return await fetchInternal(uri)
}

export async function post(uri, body) {
    return await fetchInternal(uri, { method: "POST" }, body)
}

export async function put(uri, body) {
    return await fetchInternal(uri, { method: "PUT" }, body)
}

export async function del(uri) {
    return await fetchInternal(uri, { method: "DELETE" })
}


async function fetchInternal(uri, options = { }, body = undefined) {
    
    if(body) {
        options.headers = {
            'Content-Type': 'application/json'
        }
        options.body = JSON.stringify(body)
    }

    // console.log(`Fetching from ${uri} with these options`, options)

    const response = await fetch(uri, options)
    const responseJSON = await response.json()

    // console.log(`Received from ${uri}`)
    // console.log(JSON.stringify(responseJSON, null, 2))

    return responseJSON

}