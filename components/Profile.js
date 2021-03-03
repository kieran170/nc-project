import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Image, Button } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import DialogInput from "react-native-dialog-input";
import { firestore } from "../my-app/config/firebase";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

export default function App(props) {
  const { navigation } = props;
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
  const readOnlyProfile = props.route.params;
  const user = { userAvatar: avatar, userBio: bio };

  const handlePress = () => {
    setAddBio(false);
    setHaveBio(true);
    const res = firestore.collection("users").doc(userUid).update(user);
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
    if (!readOnlyProfile) {
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
      getUserInfo();
    }
  }, []);

  return !readOnlyProfile ? (
    <ScrollView style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ height: 180, width: 180, uri: avatar }}
      />
      <TouchableHighlight
        onPress={handleImageChange}
        style={styles.buttonImageContainer}
      >
        <View style={styles.button}>
          <Text style={styles.ImageButtonText}>Change Image</Text>
        </View>
      </TouchableHighlight>
      {imageChange === true && (
        <TouchableHighlight
          onPress={handleImageConfirm}
          style={styles.buttonImageContainer}
        >
          <View style={styles.button}>
            <Text style={styles.ImageButtonText}>Confirm Image</Text>
          </View>
        </TouchableHighlight>
      )}
      <Text style={styles.name}>
        {firstName} {lastName}
        {"\n"}
      </Text>
      {addBio && (
        <>
          <Text style={styles.bioTitle}>Add A Bio</Text>
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
                <Text style={styles.buttonText}>Add Bio</Text>
              </View>
            </TouchableHighlight>
          )}
        </>
      )}
      {haveBio && (
        <>
          <View style={styles.aboutMeContainer}>
            <Text style={styles.aboutMeTitle}>About Me {"\n"}</Text>
            <Text style={styles.aboutMe}>{bio}</Text>
          </View>
          <View>
            <Text style={styles.previousGigTitle}>Previous Gigs{"\n"}</Text>
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
    </ScrollView>
  ) : (
    <ScrollView style={styles.container}>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 30 }}
      >
        <TouchableHighlight
          onPress={() => {
            const res = firestore.collection("users").doc(userUid).update(user);
          }}
          style={styles.chatButton}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Chats</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.buttonLogoutContainer}
          onPress={handleLogOut}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
          </View>
        </TouchableHighlight>
      </View>
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
        <Text style={styles.aboutMeTitle}>About Me {"\n"}</Text>
        {readOnlyProfile.userData.userBio ? (
          <Text style={styles.aboutMe}>{readOnlyProfile.userData.userBio}</Text>
        ) : (
          <Text style={styles.aboutMeTitle}>User doesn't have a bio yet</Text>
        )}
      </View>
      <View>
        <Text style={styles.previousGigTitle}>Previous Gigs{"\n"}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
  },
  avatar: {
    borderRadius: 100,
    marginLeft: 5,
  },
  inputbox: {
    borderWidth: 1,
    width: "50%",
    height: 200,
    marginLeft: 5,
    paddingLeft: 5,
  },
  bioTitle: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 20,
  },
  aboutMeContainer: {
    marginLeft: 5,
    marginRight: 5,
    width: "60%",
  },
  button: {
    borderWidth: 1,
    width: 130,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
  },
  buttonLogoutContainer: {
    marginLeft: 140,
  },
  buttonImageContainer: {
    marginTop: 5,
    marginLeft: 30,
  },
  buttonBioContainer: {
    marginTop: 10,
    marginLeft: 5,
  },
  name: {
    marginTop: 5,
    marginLeft: 5,
    fontSize: 35,
  },
  aboutMeTitle: {
    fontSize: 25,
  },
  buttonChatContainer: {
    width: 100,
  },
  ImageButtonText: {
    fontSize: 15,
    textAlign: "center",
  },
  previousGigTitle: {
    marginTop: 20,
    fontSize: 25,
    marginLeft: 5,
  },
  textGigs: {
    marginLeft: 5,
  },
  gigTitles: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 17,
  },
  chatButton: {
    marginLeft: 5,
  },
});
