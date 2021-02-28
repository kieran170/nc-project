import * as api from "../my-app/api/ticketmaster";
import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
  Button,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class EventList extends Component {

  // need to return to this and adjust the default map values so it looks good on both platforms!!!

  state = {
    events: [],
    defaultRegion:
      Platform.OS === "android"
        ? {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 250,
            longitudeDelta: 250,
          }
        : {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
          },
    newRegion: {},
    errMsg: "",
    userInput: "",
    userLocation: {}
  };

  componentDidMount() {

    api.getEvents().then((events) => {
      if (events.length) {

        const filteredEvents = this.filterEvents(events)

        const newRegion = {
          longitude: +filteredEvents[0].location.longitude,
          latitude: +filteredEvents[0].location.latitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        this.setState({ events: filteredEvents, newRegion });
      } else {
        this.setState({ errMsg: events.errMsg });
      }
    });
  }

  render() {
    
    const { events, defaultRegion, newRegion, errMsg, userInput, userLocation } = this.state;

    console.log(JSON.stringify(userLocation));

    return (
      <SafeAreaView style={styles.page}>
        <Button 
          title="Events Near Me"
          onPress={this.handleLocationSearch}
        />
        <TextInput
          style={styles.textInput}
          value={userInput}
          onChangeText={(text) => this.setState({ userInput: text })}
        />
        <Button
          style={styles.button}
          title="Manual Search"
          onPress={this.handleSearch}
        />
        <Button
          title="My Profile"
          onPress={() => {
            this.props.navigation.navigate("Profile");
          }}
        />
        <MapView
          style={styles.map}
          region={newRegion.latitude ? newRegion : defaultRegion}
        >
          {userLocation.latitude ? 
            <Marker
            title="Your location"
            key="user"
            coordinate={userLocation}
            image={require("../my-app/assets/user-loc-pin.png")}
            />
            : null
          }
          {events.map((event) => {
            return (
              <Marker
                title={event.name}
                description={`${event.date}`}
                image={require("../my-app/assets/small-guitar-icon.png")}
                key={event.id}
                coordinate={{
                  latitude: +event.location.latitude,
                  longitude: +event.location.longitude,
                }}
                onCalloutPress={() => {
                  this.props.navigation.navigate("EventPage", event)
                }}
              />
            );
          })}
        </MapView>
        <ScrollView style={styles.container}>
          {errMsg ? (
            <View style={styles.eventText}>
              <Text>{errMsg}</Text>
            </View>
          ) : (
            events.map((event) => {
              return (
                <View key={event.id} style={styles.eventText}>
                  <Text>
                    <Text style={styles.eventName}>{event.name}</Text> {"\n"}
                    <Text style={styles.eventDate}>
                    Date: {event.date} {event.time}
                    </Text>{" "}
                    {"\n"}
                    Venue: {event.venue}
                  </Text>
                  <Button
                    title="more info"
                    onPress={() =>
                      this.props.navigation.navigate("EventPage", event)
                    }
                  />
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  handleLocationSearch = () => {
    this.getUserLocation().then(() => {

      const { latitude, longitude } = this.state.userLocation;

      api.getEventsNearUser(latitude, longitude).then((events) => {
        if (events.length) {

          const filteredEvents = this.filterEvents(events)

          const newRegion = {
            longitude: +filteredEvents[0].location.longitude,
            latitude: +filteredEvents[0].location.latitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          };
          this.setState({events: filteredEvents, newRegion})
        } else {
          this.setState({ errMsg: events.errMsg})
        }
      })
    })
  }

  handleSearch = () => {
    const { userInput } = this.state;

    api.getEvents(userInput).then((events) => {
      if (events.length) {

        const filteredEvents = this.filterEvents(events)

        const newRegion = {
          longitude: +filteredEvents[0].location.longitude,
          latitude: +filteredEvents[0].location.latitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        this.setState({ events: filteredEvents, newRegion, userInput: "" });
      } else {
        this.setState({ errMsg: events.errMsg, userInput: "" });
      }
    });
  };

  filterEvents = (events) => {
    const noPrime = events.filter((event) => !event.name.includes('Prime'))
    const noVip = noPrime.filter((event) => !event.name.includes('VIP'));
    const extraNoVip = noVip.filter((event) => !event.name.includes('Vip'));
    const noHotels = extraNoVip.filter((event) => !event.name.includes('Hotel'));
    const filteredEvents = noHotels.filter((event) => !event.name.includes('Premium'));

    return filteredEvents
  }

  getUserLocation = async () => {

    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
  
      if (status !== 'granted') {
        Alert.alert('You must grant permission to use this feature')
      } else {
        const location = await Location.getCurrentPositionAsync();
    
        this.setState({ userLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        } })
      }

    } catch (err) {
      const status = Location.getProviderStatusAsync();
      if (!status.locationServicesEnabled) {
        Alert.alert('Please enable location services to use this feature')
      } else {
        Alert.alert('Problem getting location', err.message)
      }
    }
  }
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    height: "100%",
  },
  header: {
    flex: 0.2,
    backgroundColor: "pink",
    paddingBottom: 20,
  },
  textInput: {
    flex: 0.1,
    height: 1,
    width: "75%",
  },
  button: {
    flex: 0.1,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "pink",
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
    width: "100%",
  },
  eventName: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
