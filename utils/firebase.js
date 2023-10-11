import firebase from "firebase/app";
import "firebase/firestore";

const config = {
    apiKey: "AIzaSyCiQy_p5i5ojtr7O4ZhcMsXv3aO-Mke0f0",
    authDomain: "allogroup.firebaseapp.com",
    databaseURL: "https://allogroup-default-rtdb.firebaseio.com",
    projectId: "allogroup",
    storageBucket: "allogroup.appspot.com",
    messagingSenderId: "89306756252",
    appId: "1:89306756252:web:ab22ef994c780e97e6e959",
    measurementId: "G-WN263N57TZ",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firestore = firebase.firestore();

export { firestore };