import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button ,FlatList} from "react-native";
import { auth, firestore } from "../my-app/config/firebase";
import ChatRoom from "../components/ChatRoom";

export default function ContactList(props) {
  
  const contacts = props.user.userData.contacts;
  

  //list of contacts
  //we have the current user in props - we need to get the data for the contact user passed down
  const [userContacts, setContacts] = useState(contacts);
  const { navigation } = props;
  const renderUser =(({item})=> {

    const currentUserId= props.user.uid;
    
    return (
    <View  style={styles.row}>
        <Text>{item.name}</Text>
        <ChatRoom
          secondUser={{_id:item._id,firstName: item.firstName}}
          currentUser={{    
          firstName:props.user.userData.firstName,
          _id:currentUserId,
          }}
        navigation={navigation}
        ></ChatRoom>
    </View>
    );
    });

  return (
    <View>

      <Text>Contacts</Text>

       <FlatList data={contacts} renderItem={renderUser} keyExtractor={(item)=>item._id.toString()} />
        
       
     

    </View>
  );
}
const styles=StyleSheet.create({
  avatar:{
      width:50,
      height:50,
      marginRight:10,
  },
  row:{
      flexDirection: 'row',
      padding:10,
      alignItems:'center',
      borderBottomColor:"#cacaca",
      borderBottomWidth:1,
  },
  addUser:{
      flexDirection: 'row',
      padding:10,
  },
  input:{
      backgroundColor: '#cacaca',
      flex:1,
      marginRight:10,
      padding:10,
  },
});
