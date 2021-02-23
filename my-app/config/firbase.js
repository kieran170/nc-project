import * as firebase from "firebase";
import { database } from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXCFhIZHOlErk5jlVE1z3qGWQKc4lRcYg",
  authDomain: "nc-project-f7a5b.firebaseapp.com",
  projectId: "nc-project-f7a5b",
  storageBucket: "nc-project-f7a5b.appspot.com",
  messagingSenderId: "992843238778",
  appId: "1:992843238778:web:543653378e3fb9659fdac3",
  measurementId: "G-5BYSEE5KYG",
  databaseURL: "https://nc-project-f7a5b.firebaseio.com",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();
