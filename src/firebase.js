// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCmqZKhAy77JLq_MknKhZPizylO_7dcILQ",
  authDomain: "instagram-clone-react-2e7cd.firebaseapp.com",
  databaseURL:
    "https://instagram-clone-react-2e7cd-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-2e7cd",
  storageBucket: "instagram-clone-react-2e7cd.appspot.com",
  messagingSenderId: "189613351397",
  appId: "1:189613351397:web:6838d2a736a5a53c214f0c",
  measurementId: "G-4L8HF2BC1T",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

//export default db;
