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
} from "react-native";
import MapView, { Marker } from "react-native-maps";

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
  };

  componentDidMount() {
    api.getEvents().then((events) => {
      if (events.length) {

        const noPrime = events.filter((event) => !event.name.includes('Prime View'));

        const newRegion = {
          longitude: +noPrime[0].location.longitude,
          latitude: +noPrime[0].location.latitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        this.setState({ events: noPrime, newRegion });
      } else {
        this.setState({ errMsg: events.errMsg });
      }
    });
  }

  render() {
    
    const { events, defaultRegion, newRegion, errMsg, userInput } = this.state;

    return (
      <SafeAreaView style={styles.page}>
        <TextInput
          style={styles.textInput}
          value={userInput}
          onChangeText={(text) => this.setState({ userInput: text })}
        />
        <Button
          style={styles.button}
          title="search"
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

  handleSearch = () => {
    const { userInput } = this.state;

    api.getEvents(userInput).then((events) => {
      if (events.length) {
        const newRegion = {
          longitude: +events[0].location.longitude,
          latitude: +events[0].location.latitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        this.setState({ events, newRegion, userInput: "" });
      } else {
        this.setState({ errMsg: events.errMsg, userInput: "" });
      }
    });
  };
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
