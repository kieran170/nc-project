import axios from 'axios';

export const getFirst15Events = () => { 
    return axios.get('https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=manchester&size=15&apikey=v1DQXdduptbOblISnoeBRMNvW5eBDgfj')
    .then(({data}) => {
        return data._embedded.events
    })
    .then((events) => {
        return events.map((event) => {
            return { name: event.name, date: event.dates.start.localDate, time: event.dates.start.localTime, 
            venue: `${event._embedded.venues[0].name}, ${event._embedded.venues[0].city.name}`, postCode: event._embedded.venues[0].postalCode, location: event._embedded.venues[0].location, id: event.id }
            }
        )}
    )
}