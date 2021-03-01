import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInUp from "./components/SignInUp";
<<<<<<< HEAD
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NewPage from "./components/NewPage";
import GroupChat from "./components/GroupChat";
import ChatRoom from "./components/ChatRoom"
import ContactList from "./components/ContactList";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={"Home"} component={SignInUp} />
        <Stack.Screen name={"NewPage"} component={NewPage} />
        <Stack.Screen name={"GroupChat"} component={GroupChat} />
        <Stack.Screen name={"ContactList"} component={ContactList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
=======
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import EventList from "./components/EventList";
import EventPage from "./components/EventPage";
import Profile from "./components/Profile";
import { loggingOut, getUserInfo } from "./my-app/config/fireBaseMethods";
import * as firebase from "firebase";
import "firebase/auth";

const Stack = createStackNavigator();

export default class App extends Component {

  state = {
    isLoggedIn: false,
    currentUser: {}
  }

  handleLogIn = () => {

    const uid = firebase.auth().currentUser.uid;
    Promise.resolve(getUserInfo(uid)).then((userInfo) => {
      this.setState({isLoggedIn: true, currentUser: {uid, ...userInfo}})
    })
  }

  handleLogOut = () => {
    loggingOut();
    this.setState({isLoggedIn: false, user: ''})
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name={"Home"} >
            {props => <SignInUp {...props} app={this.state} login={this.handleLogIn} logout={this.handleLogOut}/>}
          </Stack.Screen>

          <Stack.Screen name={"Events"}>
            {props => <EventList {...props} app={this.state} login={this.handleLogIn} logout={this.handleLogOut}/>}
          </Stack.Screen>

          <Stack.Screen name={"Event Details"} options={({ route }) => ({ title: route.params.name })}>
            {props => <EventPage {...props} app={this.state} login={this.handleLogIn} logout={this.handleLogOut}/>}
          </Stack.Screen>

          <Stack.Screen name={"Profile"}>
            {props => <Profile {...props} app={this.state} login={this.handleLogIn} logout={this.handleLogOut}/>}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
>>>>>>> 2a19f1d9ade670fe1f0818c02a383c8b3e8711b0
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
