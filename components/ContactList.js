import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { auth, firestore } from "../my-app/config/firbase";
import { loggingOut } from "../my-app/config/fireBaseMethods";
import ChatRoom from "../components/ChatRoom";

export default function ContactList(props) {
    const contactsRef = firestore.collection("users").doc(`${props.route.params.user._id}`);
    //we have the current user in props - we need to get the data for the contact user passed down
    const [secondUser, setSecondUser] = useState([]);
    console.log(secondUser)

useEffect(() => {
    async function getUserData(){ 
        let doc = await contactsRef
        .get();
   
        let dataObj = doc.data();
        setSecondUser(dataObj.contact);
    }  getUserData();
}, []);

return (
        <View>
            <Text>Contacts</Text>
            {secondUser.length === 0
            ? <Text>Loading Contacts</Text>        
            :
            <ChatRoom title={secondUser.firstName} secondUser={secondUser[0]} currentUser={{firstName : props.route.params.user.firstName, _id : props.route.params.user._id } }></ChatRoom>
            }
        </View>
    )
}
