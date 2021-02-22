import * as api from '../api/ticketmaster';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class EventList extends Component {

    state = {
        events: []
    }

    componentDidMount() {
        
       api.getFirst15Events().then((events) => {
            this.setState({events})
        })
    }

    render() {

        const { events } = this.state;

        return (
            <View>
                {events.map((event) => {
                    return <Text>Event: {event.name}, Date & Time: {event.date} {event.time}, 
                            Venue: {event.venue}, Post Code: {event.postCode}</Text>
                })}
            </View>
        )
    }
}
