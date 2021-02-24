import React, { Component } from 'react';
import { Image, SafeAreaView, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class EventPage extends Component {



    render() {

        const {name, date, time, venue, postCode, image, location, id} = this.props.route.params

        return (
            <SafeAreaView>
            <Text>{name}</Text>
            <Text>{venue}, {postCode}</Text>
            <Text>{date}, {time}</Text>
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
    }
})
