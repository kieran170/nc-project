import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInUp from "./components/SignInUp";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import EventList from "./components/EventList";
import EventPage from "./components/EventPage";
import Profile from "./components/Profile";
import * as firebaseMethods from "./my-app/config/fireBaseMethods";
import * as firebase from "firebase";
import "firebase/auth";

const Stack = createStackNavigator();

export default class App extends Component {

  state = {
    isLoggedIn: false,
    user: ''
  }

  handleLogIn = () => {

    const user = firebase.auth().currentUser.uid;

    this.setState({isLoggedIn: true, user})
  }

  handleLogOut = () => {
    firebaseMethods.loggingOut();
    this.setState({isLoggedIn: false, user: ''})
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name={"Home"}>
            {props => <SignInUp {...props} app={this.state} login={this.handleLogIn} logout={this.handleLogOut}/>}
          </Stack.Screen>

          <Stack.Screen name={"EventList"}>
            {props => <EventList {...props} app={this.state} login={this.handleLogIn} logout={this.handleLogOut}/>}
          </Stack.Screen>

          <Stack.Screen name={"EventPage"}>
            {props => <EventPage {...props} app={this.state} login={this.handleLogIn} logout={this.handleLogOut}/>}
          </Stack.Screen>

          <Stack.Screen name={"Profile"}>
            {props => <Profile {...props} app={this.state} login={this.handleLogIn} logout={this.handleLogOut}/>}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
