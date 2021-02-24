import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import * as firebase from "firebase";
import { auth, firestore } from "../my-app/config/firbase";
import { loggingOut } from "../my-app/config/fireBaseMethods";

export default function NewPage({ navigation }) {
  let currentUserUID = auth.currentUser?.uid;

  const [firstName, setFirstName] = useState("");

  const handleLogOut = () => {
    loggingOut();
    navigation.navigate("Home");
  };
  
  useEffect(() => {
    async function getUserInfo() {
      let doc = await firebase
        .firestore()
        .collection("users")
        .doc(currentUserUID)
        .get();

      if (!doc.exists) {
        Alert.alert("No user data found!");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
      }
    }
    getUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello {firstName}</Text>
      <Button title="log out" onPress={handleLogOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    padding: 5,
    backgroundColor: "#ff9999",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 15,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#3FC5AB",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontStyle: "italic",
    marginTop: "2%",
    marginBottom: "10%",
    fontWeight: "bold",
    color: "black",
  },
  titleText: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#2E6194",
  },
});
