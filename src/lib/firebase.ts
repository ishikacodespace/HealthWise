// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-108620306-975ce",
  "appId": "1:531255266956:web:77d37cab57c5ae6d0a35a9",
  "storageBucket": "studio-108620306-975ce.firebasestorage.app",
  "apiKey": "AIzaSyAP_pSHNeImz9B-maH_lpVW8SsRN2K6r6U",
  "authDomain": "studio-108620306-975ce.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "531255266956"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
