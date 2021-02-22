import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';


//set matching password - maybe some verification steps?
export default function App() {
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [signUp, setSignUp] = useState(true);
  const [newUser, setNewUser] = useState({});

  const handlePressSignIn = () => {
    if(!email) {
      Alert.alert("E-mail field is required")
    }
    if(!password) {
      Alert.alert("Password field is required")
    }
    setUser({email, password});
    setEmail("");
    setPassword("");
  }

  const handlePressSignUp = () => {
    if(!email) {
      Alert.alert("E-mail field is required")
    }
    if(!password) {
      Alert.alert("Password field is required")
    }
    if(!firstName) {
      Alert.alert("First Name field is required")
    }
    if(!familyName) {
      Alert.alert("Family Name field is required")
    }
    setNewUser({firstName, familyName, email, password})
    setFirstName("");
    setFamilyName("");
    setEmail("");
    setPassword("");
    if(familyName && password && firstName && email)
    setSignUp(false);
  }

  const handleClick = () => {
    signUp ? 
    setSignUp(false)
    :
    setSignUp(true)
  }

  return (
    signUp ?
    <View style={styles.container}>
      <TextInput placeholder="First Name" value={firstName} onChangeText={(firstName) => {setFirstName(firstName)}} style={styles.inputbox} />

      <TextInput placeholder="Last Name" value={familyName} onChangeText={(familyName) => {setFamilyName(familyName)}} style={styles.inputbox} />

      <TextInput placeholder="E-mail" value={email} onChangeText={(email) => {setEmail(email)}} style={styles.inputbox} />

      <TextInput placeholder="Password" value={password} onChangeText={(password) => {setPassword(password)}} style={styles.inputbox} secureTextEntry={true} />
      <Button title="Sign-Up" onPress={handlePressSignUp}/>
      <Text onPress={handleClick}>I already have an account - Sign In</Text>
      </View>
      :
      <View style={styles.container}>
      <TextInput placeholder="E-mail" value={email} onChangeText={(email) => {setEmail(email)}} style={styles.inputbox} />

      <TextInput placeholder="Password" value={password} onChangeText={(password) => {setPassword(password)}} style={styles.inputbox} secureTextEntry={true} />

      <Button title="Sign-In" onPress={handlePressSignIn}/>
      <Text onPress={handleClick}>I don't have an account yet - Sign-Up</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputbox: {
    borderWidth: 2,
    width: 100,
    marginBottom: 10 
  }
});
