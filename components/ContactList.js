import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { auth, firestore } from "../my-app/config/firebase";
import ChatRoom from "../components/ChatRoom";

export default function ContactList(props) {    
    const contactsRef = firestore.collection("users").doc(`${props.route.params.user._id}`);
    //we have the current user in props - we need to get the data for the contact user passed down
    const [secondUser, setSecondUser] = useState([]);
    const {navigation} =props;
  

useEffect(() => { 
    async function getUserData(){ 
        let doc = await contactsRef
        .get();
        let dataObj = doc.data();
        setSecondUser(dataObj.contacts);
    }  getUserData();
}, []);

return (
        <View>
            <Text>Contacts</Text>
            {secondUser.length ?
            <ChatRoom  secondUser={secondUser[0]} currentUser={{firstName : props.route.params.user.name, _id : props.route.params.user._id }} navigation={navigation} ></ChatRoom>
            :
            <Text>Loading Contacts</Text>
            }
        </View>
    )
}
