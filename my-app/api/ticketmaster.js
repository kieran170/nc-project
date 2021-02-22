import axios from 'axios';

export const getFirst15Events = () => { 
    return axios.get('https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=leeds&size=15&apikey=v1DQXdduptbOblISnoeBRMNvW5eBDgfj')
    .then(({data}) => {
        return data._embedded.events
    })
}