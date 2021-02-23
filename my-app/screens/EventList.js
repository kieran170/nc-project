import * as api from '../api/ticketmaster';
import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class EventList extends Component {

    state = {
        events: [],
        defaultRegion: {
            latitude: 53.48,
            longitude: -2.21,
            latitudeDelta: 0.1, 
            longitudeDelta: 0.1
        },
        newRegion: {}
    }

    componentDidMount() {
        
       api.getEvents().then((events) => {
           const newRegion = {longitude: +events[0].location.longitude, latitude: +events[0].location.latitude, latitudeDelta: 0.1, longitudeDelta: 0.1}
           console.log(newRegion)
            this.setState({events, newRegion})
        })
    }

    render() {

        const { events, defaultRegion, newRegion } = this.state;

        return (
            <SafeAreaView style={styles.page}>
            <View style={styles.header}><Text>{"\n"}{"\n"}{"\t"}Header goes here! NC-Proj</Text></View>
            <MapView 
                style={styles.map} 
                region={newRegion} 
            >
                {events.map((event) => {
                    return <Marker image={require('../assets/small-guitar-icon.png')} key={event.id} coordinate={{latitude: +event.location.latitude, longitude: +event.location.longitude}}/>
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