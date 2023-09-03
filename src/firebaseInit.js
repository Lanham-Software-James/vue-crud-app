// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_apiKey,
  authDomain: VUE_APP_FIREBASE_authDomain,
  projectId: VUE_APP_FIREBASE_projectId,
  storageBucket: VUE_APP_FIREBASE_storageBucket,
  messagingSenderId: VUE_APP_FIREBASE_messagingSenderId,
  appId: VUE_APP_FIREBASE_appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);