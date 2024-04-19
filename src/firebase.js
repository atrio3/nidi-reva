import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCaOy-W5vwUE4_RoaAVSiQKx313i3yQSpM",
  authDomain: "nidi-databases.firebaseapp.com",
  databaseURL: "https://nidi-databases-default-rtdb.firebaseio.com",
  projectId: "nidi-databases",
  storageBucket: "nidi-databases.appspot.com",
  messagingSenderId: "1064415780499",
  appId: "1:1064415780499:web:133dae2db3155f1305b766"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, db, auth, database };
