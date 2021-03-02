import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { auth, firestore } from "../my-app/config/firebase";
import ChatRoom from "../components/ChatRoom";

export default function ContactList(props) {
  const contacts = props.user.userData.contacts;
  //list of contacts
  //we have the current user in props - we need to get the data for the contact user passed down
  const [userContacts, setContacts] = useState(contacts);
  const { navigation } = props;

  return (
    <View>
      <Text>Contacts</Text>
      {secondUser.length ? (
        <ChatRoom
          secondUser={userContacts}
          currentUser={{
            firstName: props.route.params.user.name,
            _id: props.route.params.user._id,
          }}
          navigation={navigation}
        ></ChatRoom>
      ) : (
        <Text>Loading Contacts</Text>
      )}
    </View>
  );
}
