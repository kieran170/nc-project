import * as api from '../api/ticketmaster';
import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class EventList extends Component {

    state = {
        events: [],
        initialLatitude: 53.48,
        initialLongitude: -2.24
    }

    componentDidMount() {
        
       api.getFirst15Events().then((events) => {
            this.setState({events, initialLatitude: +events[0].location.latitude, initialLongitude: +events[0].location.longitude})
        })
    }

    render() {

        const { events, initialLatitude, initialLongitude } = this.state;

        return (
            <SafeAreaView style={styles.page}>
            <View style={styles.header}><Text>{"\n"}{"\n"}{"\t"}Header goes here! NC-Proj</Text></View>
            <MapView style={styles.map} 
            initialRegion={{
            latitude: initialLatitude,
            longitude: initialLongitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
            }}>
                {events.map((event) => {
                    return <Marker key={event.id} coordinate={{latitude: +event.location.latitude, longitude: +event.location.longitude}}/>
                })}
            </MapView>
            <ScrollView style={styles.container}>
                {events.map((event) => {
                    return <View key={event.id} style={styles.eventText}>
                                <Text>
                                  <Text style={styles.eventName}>{event.name}</Text> {"\n"}
                                  <Text style={styles.eventDate}>Date: {event.date} {event.time}</Text> {"\n"}
                                  Venue: {event.venue} {"\n"}Post Code: {event.postCode}
                                </Text>
                            </View>
                })}
            </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 0.2,
        backgroundColor: 'pink'
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: 'pink',
    },
    map: {
        flex: 1,
    },
    eventText: {
        marginBottom: 25,
        borderColor: "red",
        borderStyle: "solid",
        borderWidth: 1,
        flex: 1,
        width: '100%'
    },
    eventName: {
        fontWeight: "bold",
        fontSize: 20
    },

})