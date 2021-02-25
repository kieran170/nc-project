import { Alert } from "react-native";
import { firebaseApp, auth, firestore } from "./firbase";

export async function registration(firstName, familyName, email, password) {

  console.log('trying to register...')

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    const currentUser = auth.currentUser;

    const db = firestore;
    db.collection("users").doc(currentUser.uid).set({
      email: currentUser.email,
      lastName: familyName,
      firstName: firstName,
    });
    Alert.alert("Sign Up Successful");
  } catch (err) {
    if (err) return err;
  }
}

export async function signIn(email, password) {

  console.log('trying to sign in...')

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    if (err) return err;
  }
}

export async function loggingOut() {

  console.log('trying to log out...')

  try {
    await auth.signOut();
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function getEventBuddySeekers(eventID) {

  console.log('getting buddy seekers...')

  try {

    const db = firestore;
    const eventRef = db.collection('events').doc(eventID);
    const doc = await eventRef.get();

    return doc.data();

  } catch (err) {
    Alert.alert("There is something wrong!", err.message)
  }
}
