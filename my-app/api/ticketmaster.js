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

                const findImage = (imgArr) => {
                    const index = imgArr.findIndex((img) => img.ratio === "16_9")
                    if (index >= 0) return imgArr[index].url
                    else return imgArr[0].url
                }

                return { 
                    name: event.name,
                    date: event.dates.start.localDate,
                    time: event.dates.start.localTime, 
                    venue: `${event._embedded.venues[0].name}, ${event._embedded.venues[0].city.name}`, 
                    postCode: event._embedded.venues[0].postalCode, 
                    location: event._embedded.venues[0].location,
                    image: findImage(event.images),
                    id: event.id,
                    genre: event.classifications[0].genre.name, 
                    subGenre: event.classifications[0].subGenre.name }
                }
            )
        } else {
            return {errMsg: 'No events found - pick another location'}
        }
    } 
    )
   // .catch((err) => console.log(err))
}