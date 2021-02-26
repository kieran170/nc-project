import React, { Component } from 'react';
import { Image, SafeAreaView, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getEventUsers, getUserInfo, toggleUserAtEvent } from '../my-app/config/fireBaseMethods';
import { FlatList } from 'react-native-gesture-handler';

export default class EventPage extends Component {

    state = {
        buddySeekers: [],
        attendees: [],
    }

    componentDidMount() {

        getEventUsers('test-event')
            .then((data) => {
                const buddySeekers = data.buddySeekers.map((uid) => getUserInfo(uid));
                const attendees = data.attendees.map((uid) => getUserInfo(uid));

                const buddyLength = buddySeekers.length;
                const attendeesLength = attendees.length;
                
                return Promise.all([attendeesLength, buddyLength, ...attendees, ...buddySeekers])
            })
            .then((users) => {

                const buddySeekers = users.splice(-users[1])
                const attendees = users.splice(-users[0])

                this.setState({buddySeekers, attendees})
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handlePress = (event) => {
        const currentUid = this.props.app.currentUser.uid;

        const isLookingForBuddy = event === 'buddySeekers' && this.state.buddySeekers.findIndex((buddySeeker) => buddySeeker.uid === currentUid) > -1;

        const isAttending = event === 'attendees' && this.state.attendees.findIndex((attendee) => attendee.uid === currentUid) > -1;

        const uidReducer = (users) => {
            return users.reduce((acc, cur) => {
                acc.push(cur.uid)
                return acc
            }, [])
        }

        if (isLookingForBuddy || isAttending) {
            const removedUser = this.state[event].filter((user) => user.uid !== currentUid)
            this.setState({ [event]: removedUser }, () => {
                toggleUserAtEvent('test-event', uidReducer(this.state[event]), event)
            })
        } else {
            this.setState((currentState) => {
                return { [event]: [...currentState[event], this.props.app.currentUser] }
            }, () => {
                toggleUserAtEvent('test-event', uidReducer(this.state[event]), event)
            })
        }
    }

    render() {

        const {name, date, time, venue, postCode, image, location, id, genre, subGenre} = this.props.route.params;

       // console.log(this.state) // remove this when done!!!

        const listItem = ({item}) => (
            <Text>{item.userData.firstName}</Text>
        )

        return (
            <SafeAreaView>
            <Text style={styles.eventName}>{name}</Text>
            <Text>{"\n"}</Text>
            <Button style={styles.button} title="i'm attending" onPress={() => this.handlePress('attendees')}/>
            <Button style={styles.button} title="i'm looking for a buddy" onPress={() => this.handlePress('buddySeekers')}/>
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

            <Text style={{fontWeight: "bold"}}>Looking for a buddy: </Text>
            <FlatList styles={{flex: 1}} data={this.state.buddySeekers} renderItem={listItem} keyExtractor={item=> item.uid}/>
            <Text></Text>
            <Text style={{fontWeight: "bold"}}>Attending this gig: </Text>
            <FlatList styles={{flex: 1}} data={this.state.attendees} renderItem={listItem} keyExtractor={item=> item.uid}/>
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
