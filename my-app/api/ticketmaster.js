import axios from 'axios';

const apiKey = 'apikey=v1DQXdduptbOblISnoeBRMNvW5eBDgfj&';
const request = axios.create({
    baseURL: "https://app.ticketmaster.com/discovery/v2"
})

export const getEvents = (city = 'manchester', size = 20) => { 
    return request.get(`/events.json?classificationName=music&city=${city}&size=${size}&${apiKey}`)
    .then(({data}) => {

        if (data.hasOwnProperty('_embedded')) {
            const events = data._embedded.events;
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
            )
        } else {
            return {errMsg: 'No events found for this place - pick another city'}
        }
    } 
    )
   // .catch((err) => console.log(err))
}