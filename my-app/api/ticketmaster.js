import axios from 'axios';

const apiKey = 'apikey=v1DQXdduptbOblISnoeBRMNvW5eBDgfj&';
const request = axios.create({
    baseURL: "https://app.ticketmaster.com/discovery/v2"
})

export const getEvents = (size = 20) => { 
    return request.get(`/events.json?classificationName=music&city=manchester&size=${size}&${apiKey}`)
    .then(({data: { _embedded: { events } } }) => {
        return events.map((event) => {
            return { 
                name: event.name,
                date: event.dates.start.localDate,
                time: event.dates.start.localTime, 
                venue: `${event._embedded.venues[0].name}, ${event._embedded.venues[0].city.name}`, 
                postCode: event._embedded.venues[0].postalCode, 
                location: event._embedded.venues[0].location, 
                id: event.id }
            }
        )}
    )
    .catch((err) => console.log(err))
}