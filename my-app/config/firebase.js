import { firebase } from "@firebase/app";
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyD8bgkHZyCRQAgdE4Nxz6Z-UMqzE4arwVc",
    authDomain: "nc-project-f9422.firebaseapp.com",
    projectId: "nc-project-f9422",
    storageBucket: "nc-project-f9422.appspot.com",
    messagingSenderId: "585741165159",
    appId: "1:585741165159:web:584a512f84348393fc6ac2",
    measurementId: "G-ZQ489ZK9JH",
}      
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();