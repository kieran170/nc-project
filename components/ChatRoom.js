import React, { useEffect, useState ,useCallback} from "react";
import { View, Text, StyleSheet, Alert, Button , TextInput} from "react-native";
import * as firebase from "firebase";
import { auth,firestore} from "../my-app/config/firbase";
import {GiftedChat} from "react-native-gifted-chat";
import {GroupChat} from "../components/GroupChat";


const chatsRef = firestore.collection("chats");
export default function ChatRoom (props){
    console.log(props)
    const [Room,setRoom]=useState(props._id)
    console.log(Room)
    const handlePress =()=>{
        chatsRef.doc(Room).set({});
        props.navigation.navigate("GroupChat",{user:{name:props.firstName,_id:props[_id]},chatsRef:Room})
    }
    return (
        
        <Button onPress={handlePress}>Start a chat</Button>
        
        
    )
} 