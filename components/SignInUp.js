import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
<<<<<<< HEAD
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { registration, signIn } from "../my-app/config/fireBaseMethods";

//set matching password - maybe some verification steps?
export default function App({ navigation }) {
=======
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image,
} from "react-native";
import { registration, signIn } from "../my-app/config/fireBaseMethods";

//set matching password - maybe some verification steps?
export default function App({ navigation, login }) {
>>>>>>> 2a19f1d9ade670fe1f0818c02a383c8b3e8711b0
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
<<<<<<< HEAD
        setEmail("");
        setPassword("");
        navigation.navigate("NewPage");
=======
        login()
        setEmail("");
        setPassword("");
        navigation.navigate("Events");
>>>>>>> 2a19f1d9ade670fe1f0818c02a383c8b3e8711b0
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
<<<<<<< HEAD
      <Text>Gig Buddy</Text>
=======
      <Image
        style={styles.image}
        source={require("../my-app/assets/logo-first-draft.png")}
      />
>>>>>>> 2a19f1d9ade670fe1f0818c02a383c8b3e8711b0
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={(firstName) => {
          setFirstName(firstName);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Last Name"
        value={familyName}
        onChangeText={(familyName) => {
          setFamilyName(familyName);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={(email) => {
          setEmail(email);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(password) => {
          setPassword(password);
        }}
        style={styles.inputbox}
        secureTextEntry={true}
      />
      <Button title="Sign-Up" onPress={handlePressSignUp} />
      <Text onPress={handleClick}>I already have an account - Sign In</Text>
    </View>
  ) : (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text>Gig Buddy</Text>
=======
      <Image
        style={styles.image}
        source={require("../my-app/assets/logo-first-draft.png")}
      />
>>>>>>> 2a19f1d9ade670fe1f0818c02a383c8b3e8711b0
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={(email) => {
          setEmail(email);
        }}
        style={styles.inputbox}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(password) => {
          setPassword(password);
        }}
        style={styles.inputbox}
        secureTextEntry={true}
      />

      <Button title="Sign-In" onPress={handlePressSignIn} />
      <Text onPress={handleClick}>I don't have an account yet - Sign-Up</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  inputbox: {
    borderWidth: 2,
    width: 100,
    marginBottom: 10,
  },
<<<<<<< HEAD
=======
  image: {
    position: "absolute",
    top: 50,
    left: 0,
    height: 180,
    width: 360,
  },
>>>>>>> 2a19f1d9ade670fe1f0818c02a383c8b3e8711b0
});
