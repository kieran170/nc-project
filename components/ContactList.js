import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button, FlatList } from "react-native";
import { auth, firestore } from "../my-app/config/firebase";
import ChatRoom from "../components/ChatRoom";

export default function ContactList(props) {
  //we only get the uid from props
  const uid = props.user.uid;

  //sets contacts in state to the contacts in the current user object
  //sets currentUser is state to the freshest data possible to make sure we display the updated contact list
  useEffect(() => {
    async function getUserData() {
      const doc = await firestore.collection("users").doc(uid).get();
      const currentUser = doc.data();
      setContacts(currentUser.contacts);
      SetCurrentUser(currentUser);
    }
    getUserData();
  }, []);

  //array of user's contacts + currentUser object.
  const [userContacts, setContacts] = useState([]);
  const [currentUser, SetCurrentUser] = useState({});
  const { navigation } = props;

  //Creates a list of contacts with a message me button to access/create chatroom
  const renderUser = ({ item }) => {
    return (
      <View style={styles.row}>
        <Text>{item.firstName}</Text>
        <ChatRoom
          currentUser={{
            firstName: currentUser.firstName,
            _id: uid,
            contacts: userContacts,
          }}
          secondUserObject={item}
          navigation={navigation}
        />
      </View>
    );
  };

  return (
    <View>
      <Text>Contacts</Text>
      <FlatList
        data={userContacts}
        renderItem={renderUser}
        keyExtractor={(item) => item.uid.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomColor: "#cacaca",
    borderBottomWidth: 1,
  },
  addUser: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    backgroundColor: "#cacaca",
    flex: 1,
    marginRight: 10,
    padding: 10,
  },
});
