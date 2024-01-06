// Function to generate random events for a group
function generateRandomEvents(groupID) {
    //const numEvents = Math.floor(Math.random() * 5) + 1; // Adjust the range as needed
    const numEvents = 3
    const events = [];

    for (let i = 1; i <= numEvents; i++) {
        events.push({
            id: "Unknown ID",
            name: `Event ${i}`,
            date: `Event ${i} date`,
            segment: `Segment ${i}`,
            genre: `Genre ${i}`,
            localID: i,
            groupID: groupID
        })
    }

    return events;
}

// Random groups
const groupsNum = 6

export const groups = new Array(groupsNum)
                .fill(0).map((v, idx) => {
                    return {
                        id: idx+1,
                        name: `Group ${idx+1}`,
                        description: `Task ${idx+1} description`,
                        userID: idx % 2 + 1,
                        nextEventID: 4,
                        events: generateRandomEvents(idx + 1)
                    }
                })

// Users

export const users = [
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