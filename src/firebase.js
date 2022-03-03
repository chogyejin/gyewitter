import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCBADs0oO6jmC4vaOS2gxDauiJz_LEfxPY",
  authDomain: "gyewitter.firebaseapp.com",
  projectId: "gyewitter",
  storageBucket: "gyewitter.appspot.com",
  messagingSenderId: "1043768984096",
  appId: "1:1043768984096:web:ff02a36eb4b84a3bb8b245",
};

const firebase = initializeApp(firebaseConfig);
export default firebase;
