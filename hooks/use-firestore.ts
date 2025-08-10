import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaEsoBz0xhqs4GuwSFFbLOX_SeoKHSLTM",
  authDomain: "klam-p2p.firebaseapp.com",
  projectId: "klam-p2p",
  storageBucket: "klam-p2p.firebasestorage.app",
  messagingSenderId: "4158287384",
  appId: "1:4158287384:web:a75d4db0eb5383ca9e9d6d",
  measurementId: "G-31EB5C7X3F"
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
