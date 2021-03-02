import React, { Component } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  StyleSheet,
  Button,
  View,
  Alert,
  Dimensions
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  getEventUsers,
  getUserInfo,
  toggleUserAtEvent,
  eventDocExists,
  createUserArrays,
} from "../my-app/config/fireBaseMethods";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import ChatRoom from "./ChatRoom.js";

export default class EventPage extends Component {
  state = {
    buddySeekers: [],
    attendees: [],
  };

  componentDidMount() {
    const { id } = this.props.route.params;

    // checks if the event is already in the db - if not there is no need to get the data as the arrays can stay empty
    Promise.resolve(eventDocExists(id)).then((exists) => {
      if (exists) {
        getEventUsers(id)
          .then((data) => {
            // gets a promise of full user info for the users in each array
            const buddySeekers = data.buddySeekers.map((uid) =>
              getUserInfo(uid)
            );
            const attendees = data.attendees.map((uid) => getUserInfo(uid));

            // lengths needed as we can't be sure how many of each there are
            const buddyLength = buddySeekers.length;
            const attendeesLength = attendees.length;

            // returns lengths and resolved promises with user info
            return Promise.all([
              attendeesLength,
              buddyLength,
              ...attendees,
              ...buddySeekers,
            ]);
          })
          .then((users) => {
            // if the length is zero set to empty array
            // if not use the length to get the right users into the right array
            // buddySeekers first as they are at the end of the users array

            const buddySeekers = users[1] === 0 ? [] : users.splice(-users[1]);
            const attendees = users[0] === 0 ? [] : users.splice(-users[0]);

            this.setState({ buddySeekers, attendees });
          })
          .catch((err) => {
            Alert.alert("Problem fetching data", err.message);
          });
      } else {
        // sets up the attendees and buddySeekers as empty arrays in the DB
        createUserArrays(id);
      }
    });
  }

  handlePress = (event) => {
    const { id } = this.props.route.params;
    const currentUid = this.props.app.currentUser.uid;

    // boolean - true only if user clicks buddy button and they are already in the buddySeekers array
    const isLookingForBuddy =
      event === "buddySeekers" &&
      this.state.buddySeekers.findIndex(
        (buddySeeker) => buddySeeker.uid === currentUid
      ) > -1;

    // boolean - true only if user clicks attending button and they are already in attendees array
    const isAttending =
      event === "attendees" &&
      this.state.attendees.findIndex(
        (attendee) => attendee.uid === currentUid
      ) > -1;

    // to reduce the full user info back down to just the uid
    const uidReducer = (users) => {
      return users.reduce((acc, cur) => {
        acc.push(cur.uid);
        return acc;
      }, []);
    };

    if (isLookingForBuddy || isAttending) {
      // optimistically re-render the list by filtering out the user and setting state
      const removedUser = this.state[event].filter(
        (user) => user.uid !== currentUid
      );
      this.setState({ [event]: removedUser }, () => {
        // use this updated list to update the correct event doc & list in the db
        toggleUserAtEvent(id, uidReducer(this.state[event]), event);
      });
    } else {
      this.setState(
        (currentState) => {
          // optimistically adds the user on to the appropriate list
          return {
            [event]: [...currentState[event], this.props.app.currentUser],
          };
        },
        () => {
          // adds user to the right event doc & list in the db
          toggleUserAtEvent(id, uidReducer(this.state[event]), event);
        }
      );
    }
  };

  render() {
    const {
      name,
      date,
      time,
      venue,
      postCode,
      image,
      location,
      id,
      genre,
      subGenre,
    } = this.props.route.params;
    const { attendees, buddySeekers } = this.state;
    const { navigation } = this.props;
    const currentUid = this.props.app.currentUser.uid;

    const ListItem = ({ item }) => (
      <View>
        <Text onPress={() => navigation.navigate("Profile", item)}>
          {item.userData.firstName} {item.userData.lastName}
        </Text>
        {item.uid !== currentUid ? (
          <ChatRoom
            secondUserObject={item}
            secondUser={item.userData}
            navigation={navigation}
            currentUser={{
              firstName: this.props.app.currentUser.userData.firstName,
              avatar: this.props.app.currentUser.userData.userAvatar,
              _id: currentUid,
            }}
          />
        ) : null}
      </View>
    );
    return (
      <SafeAreaView style={styles.eventPage}>

        <Text style={styles.eventName}>{name}</Text>

        <View style={styles.detailsView}>
        <Text style={styles.detailsSection}>
         <Text style={styles.eventDetails}>Venue: </Text> {venue}, {postCode}
        </Text>
        <Text style={styles.detailsSection}>
          <Text style={styles.eventDetails}>Date & Time: </Text>{date}, {time}
        </Text>
        <Text style={styles.detailsSection}> 
          <Text style={styles.eventDetails}>Genre: </Text>{genre} / {subGenre}
        </Text>
        </View>

        <View style={styles.touchableArea}>
          <TouchableHighlight onPress={() => this.handlePress("buddySeekers")}>
            <View style={styles.buddyButtons}>
              <Text style={{color: 'white', textAlign: 'center'}}>Looking For A Buddy</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.handlePress("attendees")}>
            <View style={styles.buddyButtons}>
              <Text style={{color: 'white', textAlign: 'center'}}>I'm Attending</Text>
            </View>
          </TouchableHighlight>
        </View>

        <Image style={styles.image} source={{ uri: image }} />
        <MapView
          style={styles.map}
          region={{
            longitude: +location.longitude,
            latitude: +location.latitude,
            longitudeDelta: 0.005,
            latitudeDelta: 0.005,
          }}
        >
          <Marker
            image={require("../my-app/assets/mini-stratocaster.png")}
            key={id}
            coordinate={{
              latitude: +location.latitude,
              longitude: +location.longitude,
            }}
          />
        </MapView>

        <View style={styles.lists}>

        <View style={styles.listTitles}>
        <Text style={{ fontWeight: "bold", marginRight: 30 }}>Looking for a buddy: </Text>
        <Text style={{ fontWeight: "bold", marginLeft: 30 }}>Attending this gig: </Text>
        </View>

        <View style={styles.listItems}>

        <View style={styles.buddyList}>
        <FlatList
          styles={{ flex: 1 }}
          data={buddySeekers}
          renderItem={ListItem}
          keyExtractor={(item) => item.uid}
        />
        </View>
        
        <View style={styles.attendeeList}>
        <FlatList
          styles={{ flex: 1 }}
          data={attendees}
          renderItem={ListItem}
          keyExtractor={(item) => item.uid}
        />
        </View>

        </View>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 224,
    height: 126,
    alignSelf: 'center',
    marginBottom: 10
  },
  map: {
    width: "100%",
    height: 200,
  },
  eventName: {
    fontWeight: "bold",
    fontSize: 26,
    alignSelf: 'center'
  },
  eventPage: {
    backgroundColor: "#33e4ff",
    minHeight: Dimensions.get('window').height
  },
  eventDetails: {
    fontWeight: 'bold',
  },
  detailsSection: {
    textAlign: 'center'
  },
  buddyButtons: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
    width: 150,
  },
  touchableArea: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 10,
    paddingTop: 10
  },
  lists: {
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderColor: 'grey',
    alignItems: 'center'
  },
  listTitles: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listItems: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  buddyList: {
    position: 'absolute',
    bottom: -20,
    left: -140
  },
  attendeeList: {
    position: 'absolute',
    bottom: -20,
    left: 50
  }
});
