// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAww0TpLlefD7y0HB6A1Hs0i3HAP6fvT0",
  authDomain: "test-project-8d490.firebaseapp.com",
  projectId: "test-project-8d490",
  storageBucket: "test-project-8d490.appspot.com",
  messagingSenderId: "282673992673",
  appId: "1:282673992673:web:40cc1111321eecaea778a0",
  measurementId: "G-LJW4XQ5JF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Use getFirestore to get the Firestore instance

export { db };
