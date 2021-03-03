import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image,
  Platform,
  Dimensions,
  SafeAreaView
} from "react-native";
import { registration, signIn } from "../my-app/config/fireBaseMethods";
import * as colours from "../my-app/config/colours";
import { TouchableHighlight } from "react-native-gesture-handler";

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
          setSignUp(true);
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
    <SafeAreaView style={styles.container}>

      <View style={styles.topSection}>
      <Image
        style={styles.image}
        source={require("../my-app/assets/title-gig-buddy-guitar.png")}
      />
      <Text style={styles.subTitle}>Connecting fans of live music!</Text>
      </View>

      <View style={styles.inputSection}>
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

      <TouchableHighlight onPress={handlePressSignIn}>
        <View style={styles.signButton}>
          <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>Sign In</Text>
        </View>
      </TouchableHighlight>
 
      <Text style={styles.swapText}>Don't have an account yet? <Text onPress={handleClick} style={{textDecorationLine: "underline", fontWeight: "bold"}}>Sign Up Here!</Text></Text>
      </View>
      
      <View style={styles.bottomSection}>
      <Image style={styles.bottomImage} source={require("../my-app/assets/landing-page-bottom.png")} />
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>

      <View style={styles.topSection}>
      <Image
        style={styles.image}
        source={require("../my-app/assets/title-gig-buddy-guitar.png")}
      />
      <Text style={styles.subTitle}>Connecting fans of live music!</Text>
      </View>

      <View style={styles.inputSection}>
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

      <TouchableHighlight onPress={handlePressSignUp}>
        <View style={styles.signButton}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>Sign Up</Text>
        </View>
      </TouchableHighlight>

      <Text style={styles.swapText} onPress={handleClick}>Already have an account? <Text style={{textDecorationLine: "underline", fontWeight: "bold"}}>Sign In Here!</Text></Text>

      </View>

      <View style={styles.bottomSection}>
      <Image style={styles.bottomImage} source={require("../my-app/assets/landing-page-bottom.png")} />
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#33e4ff",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    height: Dimensions.get('window').height
  },
  subTitle: {
    color: '#FF2400',
    fontSize: 20,
    fontFamily: Platform.OS === "android" ? "notoserif" : "Times New Roman", // alternate for iOS ?? 
    fontStyle: "italic",
    fontWeight: "bold",
    alignSelf: 'center'
  },
  inputbox: {
    alignSelf: 'center',
    borderWidth: 2,
    width: 180,
    height: 35,
    marginBottom: 10,
    textAlign: "center",
    borderColor: '#991400',
    borderRadius: 10,
    backgroundColor: '#FF2400',
    color: '#fff',
  },
  image: {
    height: 175,
    width: '105%',
    alignSelf: 'center'
  },
  bottomImage: {
    alignSelf: 'flex-end',
    height: 350,
    width: 300,
    zIndex: -1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
    paddingRight: 10,
    width: Dimensions.get('window').width - 10
  },
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 80
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 120
  },
  signButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    width: 150,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: '#991400',
    borderWidth: 1,
  },
  swapText: {
    fontSize: 18,
    paddingTop: 20,
    paddingBottom: 10
  }
});
