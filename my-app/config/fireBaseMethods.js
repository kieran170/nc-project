import { Alert } from "react-native";
import { firebaseApp, auth, firestore } from "./firbase";

export async function registration(firstName, familyName, email, password) {
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
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    if (err) return err;
  }
}

export async function loggingOut() {
  try {
    await auth.signOut();
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}
