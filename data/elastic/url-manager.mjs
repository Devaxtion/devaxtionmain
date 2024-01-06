const prefixURL ='http://localhost:9200/'

export default function(index) {
    return {
        createIndex: () => `${prefixURL}${index}`,
        getAll: () => `${prefixURL}${index}/_search`,
        get: (id) => `${prefixURL}${index}/_doc/${id}`,
        create: () => `${prefixURL}${index}/_doc/?refresh=wait_for`,
        update: (id) => `${prefixURL}${index}/_doc/${id}?refresh=wait_for`,
        delete: (id) => `${prefixURL}${index}/_doc/${id}?refresh=wait_for`,
    }
}