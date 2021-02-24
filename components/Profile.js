import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { loggingOut } from "../my-app/config/fireBaseMethods";
import DialogInput from "react-native-dialog-input";

export default function App(props) {
  const { navigation } = props;
  const { email, firstName, lastName } = props.route.params.newUser;
  const [avatar, setAvatar] = useState(
    "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
  );
  const [addBio, setAddBio] = useState(true);
  const [bio, onChangeText] = useState("");
  const [haveBio, setHaveBio] = useState(false);
  const [dialogVisible, isDialogVisible] = useState(false);

  const handlePress = () => {
    setAddBio(false);
    setHaveBio(true);
  };

  const handleLogOut = () => {
    loggingOut();
    navigation.navigate("Home");
  };

  const handleImageChange = () => {
    isDialogVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 30 }}
      >
        <TouchableHighlight style={styles.chatButton}>
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
          {bio.length > 0 && (
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
            <Text style={styles.previousGigTitle}>Previous Gigs</Text>
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
    fontSize: 20,
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
    fontSize: 20,
    marginLeft: 5,
  },
  chatButton: {
    marginLeft: 5,
  },
});
