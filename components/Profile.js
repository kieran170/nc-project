import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import DialogInput from "react-native-dialog-input";
import { firestore } from "../my-app/config/firebase";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

export default function App(props) {
  const { navigation, app } = props;
  const [avatar, setAvatar] = useState(
    "https://image.freepik.com/free-vector/sitting-man-playing-guitar_24877-62236.jpg"
  );
  const [addBio, setAddBio] = useState(true);
  const [bio, onChangeText] = useState("");
  const [haveBio, setHaveBio] = useState(false);
  const [dialogVisible, isDialogVisible] = useState(false);
  const [imageChange, setImageSave] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const userUid = firebase.auth().currentUser.uid;

  let readOnlyProfile;

  if (app.currentUser.uid === props.route.params.uid) {
    readOnlyProfile = false;
  } else {
    readOnlyProfile = props.route.params
  }
 
  const user = { userAvatar: avatar, userBio: bio };

  const handlePress = () => {
    setAddBio(false);
    setHaveBio(true);
    const res = firestore.collection("users").doc(userUid).update(user);
  };
  const handleEdit = () => {
    setAddBio(true);
    setHaveBio(false);
  };

  const handleLogOut = () => {
    props.logout();
    const res = firestore.collection("users").doc(userUid).update(user);
    navigation.navigate("Home");
  };

  const handleImageChange = () => {
    isDialogVisible(true);
    setImageSave(true);
  };

  const handleImageConfirm = () => {
    const res = firestore.collection("users").doc(userUid).update(user);
    setImageSave(false);
  };

  useEffect(() => {

    console.log(app.currentUser)

    async function getUserInfo() {
      let doc = await firebase
        .firestore()
        .collection("users")
        .doc(userUid)
        .get();

      if (!doc.exists) {
        Alert.alert("No user data found!");
      } else {
        let dataObj = doc.data();
        setFirstName(dataObj.firstName);
        setLastName(dataObj.lastName);

        if (dataObj.userAvatar && dataObj.userBio !== undefined) {
          setAvatar(dataObj.userAvatar);
          onChangeText(dataObj.userBio);
          setHaveBio(true);
          setAddBio(false);
        }
      }
    }

    if (!readOnlyProfile) {
      getUserInfo();
    } else {
      setAvatar(app.currentUser.userData.userAvatar)
      onChangeText(app.currentUser.userData.userBio)
      setHaveBio(true)
      setAddBio(false)
    }
  }, []);

  return !readOnlyProfile ? (
    <View style={styles.container}>

      <View style={{alignItems: 'center'}} >
      <Image
        style={styles.avatar}
        source={{ height: 180, width: 180, uri: avatar }}
      />
      <TouchableHighlight
        onPress={handleImageChange}  
      >
        <View style={styles.button}>
          <Text  style={styles.buttonText}>Change Image</Text>
        </View>
      </TouchableHighlight>

      {imageChange === true && (
        <TouchableHighlight
          onPress={handleImageConfirm}
        >
          <View style={styles.button}>
            <Text style={styles.ImageButtonText}>Confirm Image</Text>
          </View>
        </TouchableHighlight>
      )}
      </View>
        
      <Text style={styles.name}>
        {firstName} {lastName}
      </Text>
      {addBio && (
        <>
          <TextInput
            style={styles.inputbox}
            multiline
            numberOfLines={10}
            onChangeText={(text) => onChangeText(text)}
            value={bio}
          />
          {bio.length > 1 && (
            <TouchableHighlight
              onPress={handlePress}
              style={styles.buttonBioContainer}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Submit Bio</Text>
              </View>
            </TouchableHighlight>
          )}
        </>
      )}
      {haveBio && (
        <>
          <View style={styles.aboutMeContainer}>
            <Text style={styles.aboutMeTitle}>About Me</Text>
            <Text style={styles.aboutMe}>{bio}</Text>
          </View>
          <TouchableHighlight onPress={handleEdit}  style={styles.buttonBioContainer}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Edit Bio</Text>
            </View>

          </TouchableHighlight>
          <View>
            <Text style={styles.previousGigTitle}>Previous Gigs</Text>
            <Text style={styles.gigTitles}>Miley Cyrus</Text>
            <Text style={styles.textGigs}>
              May 28th 2019 Leeds Direct Arena{"\n"}
            </Text>
            <Text style={styles.gigTitles}>Slipknot</Text>
            <Text style={styles.textGigs}>
              March 1st 2019 Leeds Direct Arena{"\n"}
            </Text>
            <Text style={styles.gigTitles}>Beatles HoloGram Tour</Text>
            <Text style={styles.textGigs}>
              December 15th 2017 Las Vegas MGM hotel
            </Text>
          </View>
          
        </>
      )}
      <DialogInput
        isDialogVisible={dialogVisible}
        title={"Please Add Avatar URL"}
        submitInput={(inputText) => {
          setAvatar(inputText);
          isDialogVisible(false);
        }}
        closeDialog={() => {
          isDialogVisible(false);
        }}
      ></DialogInput>
      <Text>
        {"\n"}
        {"\n"}
        {"\n"}
        {"\n"}
        {"\n"}
      </Text>
    </View>
  ) : (
    <View style={styles.container}>
      {readOnlyProfile.userData.userAvatar ? (
        <Image
          style={styles.avatar}
          source={{
            height: 180,
            width: 180,
            uri: readOnlyProfile.userData.userAvatar,
          }}
        />
      ) : (
        <Image
          style={styles.avatar}
          source={{
            height: 180,
            width: 180,
            uri: avatar,
          }}
        />
      )}
      <Text style={styles.name}>
        {readOnlyProfile.userData.firstName} {readOnlyProfile.userData.lastName}
        {"\n"}
      </Text>
      <View style={styles.aboutMeContainer}>
        <Text style={styles.aboutMeTitle}>About Me</Text>
        {readOnlyProfile.userData.userBio ? (
          <Text style={styles.aboutMe}>{readOnlyProfile.userData.userBio}</Text>
        ) : (
          <Text style={styles.noBio}>{readOnlyProfile.userData.firstName} has not written a bio yet</Text>
        )}
      </View>
      <View>
        <Text style={styles.previousGigTitle}>Previous Gigs</Text>
        <Text style={styles.gigTitles}>Miley Cyrus</Text>
        <Text style={styles.textGigs}>
          May 28th 2019 Leeds Direct Arena{"\n"}
        </Text>
        <Text style={styles.gigTitles}>Slipknot</Text>
        <Text style={styles.textGigs}>
          March 1st 2019 Leeds Direct Arena{"\n"}
        </Text>
        <Text style={styles.gigTitles}>Beatles HoloGram Tour</Text>
        <Text style={styles.textGigs}>
          December 15th 2017 Las Vegas MGM hotel
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    backgroundColor: "#33e4ff",
    alignItems: "center",
    flexDirection: 'column'
  },
  avatar: {
    borderRadius: 100,
    marginLeft: 5,
    marginBottom: 10
  },
  inputbox: {
    borderWidth: 1,
    width: "70%",
    height: 100,
    marginLeft: 5,
    paddingLeft: 5,
    backgroundColor: "white",
  },
  bioTitle: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 20,
  },
  aboutMeContainer: {
    marginLeft: 5,
    marginRight: 5,
    width: "75%",
    alignSelf: 'center',
  },
  button: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    borderColor: '#991400',
    borderWidth: 1,
    width: 150,
  },
  buttonText: {
    color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16
  },
  buttonImageContainer: {
    marginTop: 5,
    marginLeft: 30,
    alignSelf: 'center'
  },
  buttonBioContainer: {
    marginTop: 10,
    marginLeft: 5,
  },
  name: {
    marginTop: 5,
    marginLeft: 5,
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 10
  },
  aboutMeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  ImageButtonText: {
    fontSize: 15,
    textAlign: "center",
  },
  previousGigTitle: {
    marginTop: 40,
    fontSize: 25,
    marginLeft: 5,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  textGigs: {
    marginLeft: 5,
  },
  gigTitles: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 17,
  },
  aboutMe:{
    fontSize: 17,
    textAlign: 'center'
  },
  noBio: {
    fontStyle: 'italic',
    alignSelf: 'center',
    fontSize: 17
  }
});
