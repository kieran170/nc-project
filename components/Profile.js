import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image,
} from "react-native";
import { loggingOut } from "../my-app/config/fireBaseMethods";

export default function App(props) {
  const { navigation } = props;
  const { email, firstName, lastName } = props.route.params.newUser;
  const [avatar, setAvatar] = useState(
    "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
  );
  const [addBio, setAddBio] = useState(true);
  const [bio, onChangeText] = useState("");
  const [haveBio, setHaveBio] = useState(false);

  const handlePress = () => {
    setAddBio(false);
    setHaveBio(true);
  };

  const handleLogOut = () => {
    loggingOut();
    navigation.navigate("Home");
  };

  const handleImageChange = () => {
    setAvatar("https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg");
  };

  return (
    <View style={styles.container}>
      <Text>Gig Buddy</Text>
      <Button title="logout" onPress={handleLogOut} />
      <Image
        style={styles.avatar}
        source={{ height: 180, width: 180, uri: avatar }}
      />
      <Button
        onPress={handleImageChange}
        style={styles.changeImage}
        title="change image"
      />
      <Text>
        {firstName} {lastName}
        {"\n"}
      </Text>
      {addBio && (
        <>
          <Text style={styles.bioTitle}>Add a Bio</Text>
          <TextInput
            style={styles.inputbox}
            multiline
            numberOfLines={4}
            onChangeText={(text) => onChangeText(text)}
            value={bio}
          />
          {bio.length > 0 && (
            <Button
              style={styles.bioButton}
              onPress={handlePress}
              title="Add bio"
            />
          )}
        </>
      )}
      {haveBio && (
        <>
          <Text>
            About me {"\n"}
            {"\n"}
            {bio}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  avatar: {
    marginTop: 50,
    borderRadius: 100,
  },
  inputbox: {
    borderWidth: 1,
    width: "50%",
    height: 200,
  },
  bioTitle: {
    marginTop: 20,
  },
  changeImage: {},
});
