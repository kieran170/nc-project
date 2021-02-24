import React, { useEffect, useState ,useCallback} from "react";
import { View, Text, StyleSheet, Alert, Button , TextInput} from "react-native";
import * as firebase from "firebase";
import { auth,firestore} from "../my-app/config/firbase";
import {GiftedChat} from "react-native-gifted-chat";
import {GroupChat} from "../components/GroupChat";



const chatsRef = firestore.collection("chats");
export default function ChatRoom ({firstName, _id, navigation}){
    const [Room,setRoom]=useState(_id)
    const handlePress = () => {
        chatsRef.doc(Room).set({});
        navigation.navigate("GroupChat", {user:{name : firstName, _id},chatsRef:Room})
    }
    return (
        
        <Button onPress={handlePress} title="Start a chat"></Button>
        
        
    )
} 