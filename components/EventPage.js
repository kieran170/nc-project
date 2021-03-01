import React, { Component } from 'react';
import { Image, SafeAreaView, Text, StyleSheet, Button, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getEventUsers, getUserInfo, toggleUserAtEvent, eventDocExists, createUserArrays } from '../my-app/config/fireBaseMethods';
import { FlatList } from 'react-native-gesture-handler';

export default class EventPage extends Component {

    state = {
        buddySeekers: [],
        attendees: [],
    }

    componentDidMount() {

        const { id } = this.props.route.params;

        // checks if the event is already in the db - if not there is no need to get the data as the arrays can stay empty
        Promise.resolve(eventDocExists(id))
            .then((exists) => {
                if (exists) {
                    
                    getEventUsers(id)
                        .then((data) => {
            
                            // gets a promise of full user info for the users in each array
                            const buddySeekers = data.buddySeekers.map((uid) => getUserInfo(uid));
                            const attendees = data.attendees.map((uid) => getUserInfo(uid));
            
                            // lengths needed as we can't be sure how many of each there are
                            const buddyLength = buddySeekers.length;
                            const attendeesLength = attendees.length;
                            
                            // returns lengths and resolved promises with user info
                            return Promise.all([attendeesLength, buddyLength, ...attendees, ...buddySeekers])
                        })
                        .then((users) => {
            
                            // if the length is zero set to empty array
                            // if not use the length to get the right users into the right array
                            // buddySeekers first as they are at the end of the users array
            
                            const buddySeekers = users[1] === 0 ? [] : users.splice(-users[1])
                            const attendees = users[0] === 0 ? [] : users.splice(-users[0])
            
                            this.setState({buddySeekers, attendees})
                        })
                        .catch((err) => {
                            Alert.alert('Problem fetching data', err.message)
                        })
                } else {
                    // sets up the attendees and buddySeekers as empty arrays in the DB
                    createUserArrays(id)
                }
            })
    }

    handlePress = (event) => {

        const { id } = this.props.route.params;
        const currentUid = this.props.app.currentUser.uid;

        // boolean - true only if user clicks buddy button and they are already in the buddySeekers array
        const isLookingForBuddy = event === 'buddySeekers' && this.state.buddySeekers.findIndex((buddySeeker) => buddySeeker.uid === currentUid) > -1;

        // boolean - true only if user clicks attending button and they are already in attendees array
        const isAttending = event === 'attendees' && this.state.attendees.findIndex((attendee) => attendee.uid === currentUid) > -1;

        // to reduce the full user info back down to just the uid
        const uidReducer = (users) => {
            return users.reduce((acc, cur) => {
                acc.push(cur.uid)
                return acc
            }, [])
        }

        if (isLookingForBuddy || isAttending) {
            // optimistically re-render the list by filtering out the user and setting state
            const removedUser = this.state[event].filter((user) => user.uid !== currentUid)
            this.setState({ [event]: removedUser }, () => {
                // use this updated list to update the correct event doc & list in the db
                toggleUserAtEvent(id, uidReducer(this.state[event]), event)
            })
        } else {
            this.setState((currentState) => {
                // optimistically adds the user on to the appropriate list
                return { [event]: [...currentState[event], this.props.app.currentUser] }
            }, () => {
                // adds user to the right event doc & list in the db
                toggleUserAtEvent(id, uidReducer(this.state[event]), event)
            })
        }
    }

    render() {

        const { name, date, time, venue, postCode, image, location, id, genre, subGenre } = this.props.route.params;
        const { attendees, buddySeekers } = this.state;
        const currentUid = this.props.app.currentUser.uid;

        const listItem = ({item}) => (

            <View>
                <Text>{item.userData.firstName} {item.userData.lastName}</Text>
                {item.uid !== currentUid ? <Button title="chat" /> : null}
            </View>
            //Chatroom button to add here + method to cycle through users to pass down proper props.
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
            {/* {buddySeekers.length ? */}
            <FlatList styles={{flex: 1}} data={this.state.buddySeekers} renderItem={listItem} keyExtractor={item=> item.uid}/>
            {/* : null
            } */}
            <Text></Text>
            <Text style={{fontWeight: "bold"}}>Attending this gig: </Text>
            {/* {attendees.length ?  */}
            <FlatList styles={{flex: 1}} data={this.state.attendees} renderItem={listItem} keyExtractor={item=> item.uid}/>
            {/* : null
            } */}
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
