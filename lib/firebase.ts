// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD5RL79Q5HYy2s_RacsiAuFotPz7PzTd0c",
    authDomain: "klam-p2p.firebaseapp.com",
    projectId: "klam-p2p",
    storageBucket: "klam-p2p.firebasestorage.app",
    messagingSenderId: "4158287384",
    appId: "1:4158287384:web:0822f586b2897cb29e9d6d",
    measurementId: "G-X7G63RGGTZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = firebase.firestore();

