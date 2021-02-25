import React, { Component } from 'react';
import { Image, SafeAreaView, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getEventBuddySeekers } from '../my-app/config/fireBaseMethods';

export default class EventPage extends Component {

    state = {
        buddySeekers: [],
    }

    componentDidMount() {
        getEventBuddySeekers('test-event')
            .then((data) => {
                console.log('DATA --->', data)
            })
    }

    render() {

        const {name, date, time, venue, postCode, image, location, id, genre, subGenre} = this.props.route.params

        return (
            <SafeAreaView>
            <Text style={styles.eventName}>{name}</Text>
            <Text>{"\n"}</Text>
            <Button style={styles.button} title="i'm attending" />
            <Text>{"\n"}</Text>
            <Button style={styles.button} title="i'm looking for a buddy" />
            <Text>{venue}, {postCode}</Text>
            <Text>{date}, {time}</Text>
            <Text>Genre: {genre} / {subGenre}</Text>
            <Image style={styles.image} source={{uri: image}}/>
            <MapView
            style={styles.map}
            region={{
                longitude: +location.longitude,
                latitude: +location.latitude,
                longitudeDelta: 0.005,
                latitudeDelta: 0.005}}
            >
                <Marker image={require('../my-app/assets/small-guitar-icon.png')} key={id} coordinate={{latitude: +location.latitude, longitude: +location.longitude}}/>
            </MapView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: 160,
        height: 90
    },
    map: {
        width: '100%',
        height: 200
    },
    eventName: {
        fontWeight: "bold",
        fontSize: 20
    },
    button: {
        flex: 0.1
    }
})
