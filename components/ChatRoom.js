import React, { useEffect, useState ,useCallback} from "react";
import { View, Text, StyleSheet, Alert, Button , TextInput} from "react-native";
import * as firebase from "firebase";
import { auth, firestore} from "../my-app/config/firbase";
import {GiftedChat} from "react-native-gifted-chat";
import {GroupChat} from "../components/GroupChat";



const chatsRef = firestore.collection("chats");
export default function ChatRoom (props){
    console.log(props)
    
    const {navigation}= props;
    const {currentUser}= props;
    const {secondUser} = props;
    const firstName=currentUser.firstName;
    const _id = currentUser._id;

   

    const [chatRoomsCurrentUser, setChatroomsCurrentUser] = useState("");
    const [Room, setRoom] = useState("");

    useEffect(() => {
        async function getUserData(){ 
            let doc = await firestore
            .collection("users")
            .doc(currentUser._id)
            .get()
            //dataObj coming up as undefined on the latest console.log()
            let dataObj = doc.data();
            setChatroomsCurrentUser(dataObj.chatrooms);
        }  getUserData();
    }, []);

 
    
    

    const matchUsersRooms = (chatRoomsCurrentUser, secondUser) => {
        for (let i = 0; i < chatRoomsCurrentUser.length; i++) {
            if (!Room) {
                for (let j = 0; j < secondUser.chatrooms.length; j++) {
                    if(chatRoomsCurrentUser[i] === secondUser.chatrooms[j]) {
                    const room = chatRoomsCurrentUser[i];
                        setRoom(room)
                    };
               }
            }
            else break;   
        };
        return ;
    }

    
    matchUsersRooms(chatRoomsCurrentUser, secondUser)
    const handlePress = () => {
        chatsRef.doc(Room).set({});
        const chatsRefPassed= firestore.collection("chats").doc(Room);
        navigation.navigate("GroupChat", {user:{name : name, _id}, chatsRef:chatsRefPassed})
    }


    return (
        
        <Button onPress={handlePress} title="Start a chat"></Button>
        
        
    )
} 