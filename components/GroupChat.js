import React, { useEffect, useState ,useCallback} from "react";
import { View, Text, StyleSheet, Alert, Button , TextInput} from "react-native";
import * as firebase from "firebase";
import { auth,firestore} from "../my-app/config/firbase";
import {GiftedChat} from "react-native-gifted-chat";



//maybe pass this down props later to take user to right chat room.
export default function App(props) {
    const chatsRef = props.route.params.chatsRef;

    
       
  const [user,setUser] = useState(props.route.params.user);
  const [messages,setMessages]=useState([])

  useEffect(() => {
    setMessages([
        {
          _id: 1,
          text: 'Please do not exchange numbers or meet in private with someone you do not know well - Be safe always',
          
          user: {
            _id: 2,
            name: 'Safety Bot',
            avatar: 'https://cdn.dribbble.com/users/79449/screenshots/14019420/bot_4x.png',
          },
        },
      ])
    const unsubscribe = chatsRef.collection("messages-collection").onSnapshot((querySnapshot) => {
        const messagesFirestore = querySnapshot
            .docChanges()
            .filter(({ type }) => type === 'added')
            .map(({ doc }) => {
                const message = doc.data()
                //createdAt is firebase.firestore.Timestamp instance
                //https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
                return { ...message, createdAt: message.createdAt.toDate()}
            })
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        appendMessages(messagesFirestore)
    })
    return () => unsubscribe()
}, [])

const appendMessages = useCallback(
    (messages) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    },
    [messages]
)

async function handleSend(messages) {
    const writes = messages.map((m) => chatsRef.collection("messages-collection").add(m))
    await Promise.all(writes)
}


return <GiftedChat messages={messages} user={user} onSend={handleSend} />
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding:30,
  },
});