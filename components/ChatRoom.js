import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Alert, Button, TextInput } from "react-native";
import { auth, firestore } from "../my-app/config/firebase";

export default function ChatRoom(props) {
  const { navigation } = props;
  const { currentUser } = props;
  let { secondUser } = props;
  const firstName = currentUser.firstName;
  const _id = currentUser._id;
  const { secondUserObject } = props;
  const secondUserUid = secondUserObject.uid;
  const currentUserContacts = currentUser.contacts;
  const secondUserContacts = secondUser.contacts;

  const [chatRoomsCurrentUser, setChatroomsCurrentUser] = useState([]);
  const [Room, setRoom] = useState("room not found");
  const [currentUserObj, setCurrentUserObj] = useState({
    uid: _id,
    firstName: currentUser.firstName,
  });
  const [secondUserObj, setSecondUserObj] = useState({
    uid: secondUserUid,
    firstName: secondUser.firstName,
  });
  const [chatroomsSecondUser, setChatroomsSecondUser] = useState([]);

  useEffect(() => {
    async function getUserData() {
      let doc = await firestore.collection("users").doc(currentUser._id).get();

      let dataObj = doc.data();
      setChatroomsCurrentUser(dataObj.chatrooms);
    }
    async function getSecondUserData() {
      let doc = await firestore.collection("users").doc(secondUserUid).get();
      let dataObj = doc.data();
      setChatroomsSecondUser(dataObj.chatrooms);
    }
    getUserData();
    getSecondUserData();
  }, []);

  const matchUsersRooms = (chatRoomsCurrentUser, chatroomsSecondUser) => {
    for (let i = 0; i < chatRoomsCurrentUser.length; i++) {
      if (Room === "room not found" && chatRoomsCurrentUser.length) {
        for (let j = 0; j < chatroomsSecondUser.length; j++) {
          if (chatRoomsCurrentUser[i] === chatroomsSecondUser[j]) {
            const room = chatRoomsCurrentUser[i];
            setRoom(room);
          }
        }
      } else {
        break;
      }
    }
    return;
  };

  matchUsersRooms(chatRoomsCurrentUser, secondUser, secondUserUid);

  const handlePress = () => {
    const chatsRef = firestore.collection("chats");
    if (Room === "room not found") {
      //add two users ids together  and save it as room-name ;
      //push the room-name at the array of the both users;

      const newRoom = _id + secondUserUid;

      async function updateUsers(
        chatRoomsCurrentUser,
        secondUser,
        secondUserUid,
        currentUserContacts,
        secondUserContacts
      ) {
        const updatedChatRoomsCurrentUser = [...chatRoomsCurrentUser];
        const updatedChatRoomsSecondUser = [...chatroomsSecondUser];
        const updatedUserContacts = [...currentUserContacts];
        const updatedSecondUserContacts = [...secondUserContacts];

        updatedChatRoomsCurrentUser.push(newRoom);
        updatedChatRoomsSecondUser.push(newRoom);

        updatedUserContacts.push(secondUserObj);
        updatedSecondUserContacts.push(currentUserObj);

        const currentUserRef = firestore.collection("users").doc(_id);
        const res1 = await currentUserRef.update({
          chatrooms: updatedChatRoomsCurrentUser,
          contacts: updatedUserContacts,
        });
        const secondUserRef = firestore.collection("users").doc(secondUserUid);
        const res2 = await secondUserRef.update({
          chatrooms: updatedChatRoomsSecondUser,
          contacts: updatedSecondUserContacts,
        });
      }
      updateUsers(
        chatRoomsCurrentUser,
        secondUser,
        secondUserUid,
        currentUserContacts,
        secondUserContacts
      );

      chatsRef.doc(newRoom).set({});
      const chatsRefPassed = firestore.collection("chats").doc(newRoom);
      navigation.navigate("GroupChat", {
        user: { name: firstName, _id },
        chatsRef: chatsRefPassed,
      });
    } else {
      chatsRef.doc(Room).set({});
      const chatsRefPassed = firestore.collection("chats").doc(Room);
      navigation.navigate("GroupChat", {
        user: { name: firstName, _id },
        chatsRef: chatsRefPassed,
      });
    }
  };
  return (
    <>
      <Button onPress={handlePress} title="Message me!"></Button>
    </>
  );
}
