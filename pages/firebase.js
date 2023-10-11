// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiQy_p5i5ojtr7O4ZhcMsXv3aO-Mke0f0",
  authDomain: "allogroup.firebaseapp.com",
  databaseURL: "https://allogroup-default-rtdb.firebaseio.com",
  projectId: "allogroup",
  storageBucket: "allogroup.appspot.com",
  messagingSenderId: "89306756252",
  appId: "1:89306756252:web:b2084662c787929ee6e959",
  measurementId: "G-M5K2T7JTDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);