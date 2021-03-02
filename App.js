import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import SignInUp from "./components/SignInUp";
import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import EventList from "./components/EventList";
import EventPage from "./components/EventPage";
import Profile from "./components/Profile";
import { loggingOut, getUserInfo } from "./my-app/config/fireBaseMethods";
import * as firebase from "firebase";
import "firebase/auth";
import GroupChat from "./components/GroupChat";
import { TouchableOpacity } from "react-native-gesture-handler";

const Stack = createStackNavigator();

export default class App extends Component {
  state = {
    isLoggedIn: false,
    currentUser: {},
  };

  handleLogIn = () => {
    const uid = firebase.auth().currentUser.uid;
    Promise.resolve(getUserInfo(uid)).then((userInfo) => {
      this.setState({ isLoggedIn: true, currentUser: { uid, ...userInfo } });
    });
  };

  handleLogOut = () => {
    loggingOut();
    this.setState({ isLoggedIn: false, user: "" });
  };

  render() {

    return (
      <NavigationContainer>

      {/* <Image style={styles.logo} source={require('./my-app/assets/mini-logo.png')} /> */}

      {/* Default header on all screens unless overwritten lower down*/}
        <Stack.Navigator screenOptions={
        ({navigation})=>({
          headerStyle: { backgroundColor: '#33e4ff', borderBottomColor: 'grey', borderBottomWidth: 1},
          headerLeft: () => 
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} >
            <Image style={styles.backImage} source={require('./my-app/assets/back-button.png')} />
            </TouchableOpacity>,
          headerTitle: () => 
            <TouchableOpacity onPress={() => navigation.navigate("Events")} style={styles.logoOpacity}>
              <Image style={styles.miniLogo} source={require('./my-app/assets/mini-logo.png')}/>
            </TouchableOpacity>,
          headerTitleAlign: 'center',
          headerRight: () => (
          <>
          <Button
            title="Messages"
            color="#FF2400"
          />
          <Text>{"\t"}</Text>
          
          <Button
            title="Profile"
            color="#FF2400"
            onPress={() => {
             navigation.navigate("Profile");
            }}
          />
          <Text>{"\t"}</Text>
          
          <Button 
            title="Log Out"
            color="#FF2400"
            onPress={()=>{ 
              navigation.navigate("Home"),
            this.handleLogOut()}}
          />
          <Text>{"\t"}</Text>
          </>
          ),
          headerRightContainerStyle: {flexDirection: "row", marginBottom: 15},
          headerMode: 'screen'
        })}>

          {/* No header on home screen*/}
          <Stack.Screen name={"Home"} options={{headerShown: false}}>
            {(props) => (
              <SignInUp
                {...props}
                app={this.state}
                login={this.handleLogIn}
                logout={this.handleLogOut}
              />
            )}
          </Stack.Screen>

          {/* Disables back button on events screen to prevent user accidentally logging out */}
          <Stack.Screen name={"Events"} options={{headerLeft: null}}>
            {(props) => (
              <EventList
                {...props}
                app={this.state}
                login={this.handleLogIn}
                logout={this.handleLogOut}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name={"Event Details"}
            options={({ route }) => ({ title: route.params.name })}
          >
            {(props) => (
              <EventPage
                {...props}
                app={this.state}
                login={this.handleLogIn}
                logout={this.handleLogOut}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name={"Profile"}>
            {(props) => (
              <Profile
                {...props}
                app={this.state}
                login={this.handleLogIn}
                logout={this.handleLogOut}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name={"GroupChat"} component={GroupChat}></Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
    backButton: {
      paddingBottom: 10,
      paddingLeft: 35
    },
    backImage: {
      height: 60,
      width: 60
    },
    miniLogo: {
      height: 70,
      width: 70,
      resizeMode: 'contain'
    },
    logoOpacity: {
      paddingBottom: 110
    }
})
