// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS0L0lYFl9S_NcYoVfP4Dk4WJnAdFYLho",
  authDomain: "ashokatracker.firebaseapp.com",
  projectId: "ashokatracker",
  storageBucket: "ashokatracker.firebasestorage.app",
  messagingSenderId: "92957788422",
  appId: "1:92957788422:web:23c120ec835be5ed42f687",
  measurementId: "G-KM0KNFWHJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export {auth , analytics};