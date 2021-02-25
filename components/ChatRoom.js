import React, { useEffect, useState ,useCallback} from "react";
import { View, Text, StyleSheet, Alert, Button , TextInput} from "react-native";
import * as firebase from "firebase";
import { auth, firestore} from "../my-app/config/firbase";
import {GiftedChat} from "react-native-gifted-chat";
import {GroupChat} from "../components/GroupChat";



const chatsRef = firestore.collection("chats");
export default function ChatRoom (props){
    const {navigation}=props;
    const {name, _id}=props;
    
    const [Room, setRoom]=useState(_id)
    const handlePress = () => {
        chatsRef.doc(Room).set({});
        const chatsRefPassed= firestore.collection("chats").doc(Room);
        navigation.navigate("GroupChat", {user:{name : name, _id}, chatsRef:chatsRefPassed})
    }
    return (
        
        <Button onPress={handlePress} title="Start a chat"></Button>
        
        
    )
} 