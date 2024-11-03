import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD5RL79Q5HYy2s_RacsiAuFotPz7PzTd0c",
    authDomain: "klam-p2p.firebaseapp.com",
    projectId: "klam-p2p",
    storageBucket: "klam-p2p.firebasestorage.app",
    messagingSenderId: "4158287384",
    appId: "1:4158287384:web:0822f586b2897cb29e9d6d",
    measurementId: "G-X7G63RGGTZ"
};

const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  return firebase.firestore();
};

const useFirestore = () => {
  const [firestore, setFirestore] = useState(null);

  useEffect(() => {
    setFirestore(initializeFirebase());
  }, []);

  return firestore;
};

export default useFirestore;
