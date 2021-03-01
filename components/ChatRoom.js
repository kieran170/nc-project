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

  const [chatRoomsCurrentUser, setChatroomsCurrentUser] = useState([]);
  const [Room, setRoom] = useState("room not found");
  useEffect(() => {
    async function getUserData() {
      let doc = await firestore.collection("users").doc(currentUser._id).get();

      let dataObj = doc.data();
      setChatroomsCurrentUser(dataObj.chatrooms);
    }
    getUserData();
  }, []);

  const matchUsersRooms = (chatRoomsCurrentUser, secondUser) => {
    for (let i = 0; i < chatRoomsCurrentUser.length; i++) {
      if (Room === "room not found" && chatRoomsCurrentUser.length) {
        for (let j = 0; j < secondUser.chatrooms.length; j++) {
          if (chatRoomsCurrentUser[i] === secondUser.chatrooms[j]) {
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

      const newRoom = currentUser._id + secondUserUid;

      async function updateUsers(
        chatRoomsCurrentUser,
        secondUser,
        secondUserUid
      ) {
        const updatedChatRoomsCurrentUser = [...chatRoomsCurrentUser];
        const updatedChatRoomsSecondUser = [...secondUser.chatrooms];

        updatedChatRoomsCurrentUser.push(newRoom);
        updatedChatRoomsSecondUser.push(newRoom);

        console.log(currentUser._id, secondUserUid, Room, "here are the ids");

        const currentUserRef = firestore
          .collection("users")
          .doc(currentUser._id);
        const res1 = await currentUserRef.update({
          chatrooms: updatedChatRoomsCurrentUser,
        });
        const secondUserRef = firestore.collection("users").doc(secondUserUid);
        const res2 = await secondUserRef.update({
          chatrooms: updatedChatRoomsSecondUser,
        });
      }
      updateUsers(chatRoomsCurrentUser, secondUser, secondUserUid);

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
