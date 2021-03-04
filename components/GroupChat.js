import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
//GiftedChat is a separate package we have used, which can be found here: https://github.com/FaridSafi/react-native-gifted-chat


export default function GroupChat(props) {
  //We get the reference of the chat where to send messages to from props passed down from the ChatRoom component.
  const chatsRef = props.route.params.chatsRef;

  //We set the user using the Gifted Messages syntax: {_id, avatar, name}
  //We hold all of the messages in the conversation in state as well as in firestore
  const [user, setUser] = useState(props.route.params.user);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    //the first set message is the safety message
    setMessages([
      {
        _id: 1,
        text:
          "Please do not exchange numbers or meet in private with someone you do not know well - Be safe always",

        user: {
          _id: 2,
          name: "Safety Bot",
          avatar:
            "https://cdn.dribbble.com/users/79449/screenshots/14019420/bot_4x.png",
        },
      },
    ]);

    //The function handles the real time exchange of messages, using the onSnapshot method to do so
    const unsubscribe = chatsRef
      .collection("messages-collection")
      .onSnapshot((querySnapshot) => {
        const messagesFirestore = querySnapshot
          .docChanges()
          .filter(({ type }) => type === "added")
          .map(({ doc }) => {
            const message = doc.data();
            //createdAt is firebase.firestore.Timestamp instance
            //https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
            return { ...message, createdAt: message.createdAt.toDate() };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        appendMessages(messagesFirestore);
      });
    return () => unsubscribe();
  }, []);

  //Updates the state and adds the messages to the previous messages
  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  //updates the firestore database with the new messages written using the .add() method to update the collection
  async function handleSend(messages) {
    const writes = messages.map((m) =>
      chatsRef.collection("messages-collection").add(m)
    );
    await Promise.all(writes);
  }

  //renders the chat with Gifted Chat
  return <GiftedChat messages={messages} user={user} onSend={handleSend} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
});
