import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image
} from "react-native";
import { registration, signIn } from "../my-app/config/fireBaseMethods";
import * as colours from "../my-app/config/colours";

//set matching password - maybe some verification steps?
export default function App({ navigation, login }) {
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(true);

  const handlePressSignIn = () => {
    if (!email) {
      Alert.alert("E-mail field is required");
    }
    if (!password) {
      Alert.alert("Password field is required");
    }
    signIn(email, password).then((err) => {
      if (err) {
        Alert.alert("There is something wrong!", err.message);
      }
      if (!err) {
        login();
        setEmail("");
        setPassword("");
        navigation.navigate("Events");
      }
    });
  };

  const handlePressSignUp = () => {
    if (!email) {
      Alert.alert("E-mail field is required");
    }
    if (!password) {
      Alert.alert("Password field is required");
    }
    if (!firstName) {
      Alert.alert("First Name field is required");
    }
    if (!familyName) {
      Alert.alert("Family Name field is required");
    }
    if (firstName && familyName) {
      registration(firstName, familyName, email, password).then((err) => {
        if (!err) {
          setFirstName("");
          setFamilyName("");
          setEmail("");
          setPassword("");
          setSignUp(false);
        }
        if (err) {
          Alert.alert("There is something wrong!!!!", err.message);
        }
      });
    }
  };

  const handleClick = () => {
    signUp ? setSignUp(false) : setSignUp(true);
  };

  return signUp ? (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../my-app/assets/title-gig-buddy-guitar.png")}
      />
      <Text style={styles.subTitle}>Connecting fans of live music!</Text>
      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={(email) => {
          setEmail(email);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#fff"
        value={password}
        onChangeText={(password) => {
          setPassword(password);
        }}
        style={styles.inputbox}
        secureTextEntry={true}
      />

      <Button title="Sign-In" onPress={handlePressSignIn} color='#ff2400'/>
      <Text>{"\n"}{"\n"}</Text>
      <Text>Don't have an account yet? <Text onPress={handleClick} style={{textDecorationLine: "underline", fontWeight: "bold"}}>Sign Up Here!</Text></Text>
      <Image style={styles.bottomImage} source={require("../my-app/assets/landing-page-bottom.png")} />
      <StatusBar style="auto" />
    </View>
  ) : (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../my-app/assets/title-gig-buddy-guitar.png")}
      />
      <Text style={styles.subTitle}>Connecting fans of live music!</Text>
      <TextInput
        placeholder="First Name"
        placeholderTextColor="#fff"
        value={firstName}
        onChangeText={(firstName) => {
          setFirstName(firstName);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Last Name"
        placeholderTextColor="#fff"
        value={familyName}
        onChangeText={(familyName) => {
          setFamilyName(familyName);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={(email) => {
          setEmail(email);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#fff"
        value={password}
        onChangeText={(password) => {
          setPassword(password);
        }}
        style={styles.inputbox}
        secureTextEntry={true}
      />
      <Button title="Sign-Up" onPress={handlePressSignUp} color='#ff2400' />
      <Text>{"\n"}</Text>
      <Text onPress={handleClick}>Already have an account? <Text style={{textDecorationLine: "underline", fontWeight: "bold"}}>Sign In Here!</Text></Text>
      <Image style={styles.bottomImage} source={require("../my-app/assets/landing-page-bottom.png")} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#33e4ff",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0
  },
  subTitle: {
    color: '#FF2400',
    position: 'absolute',
    top: 210,
    left: 90,
    fontSize: 16,
    fontFamily: "notoserif", // alternate for iOS ?? 
    fontStyle: "italic",
    fontWeight: "bold"
  },
  inputbox: {
    borderWidth: 2,
    width: 180,
    marginBottom: 10,
    textAlign: "center",
    borderColor: '#991400',
    borderRadius: 10,
    backgroundColor: '#FF2400',
    color: '#fff'
  },
  image: {
    position: "absolute",
    top: 40,
    left: -10,
    height: 175,
    width: 400,
  },
  bottomImage: {
    position: "absolute",
    top: 400,
    left: 50,
    height: 350,
    width: 300,
    zIndex: -1,
  }
});
