// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTUPO-Sntb0BNu5LYcWAM_J9UlhoNZuNQ",
  authDomain: "msci342---project.firebaseapp.com",
  projectId: "msci342---project",
  storageBucket: "msci342---project.appspot.com",
  messagingSenderId: "308723578929",
  appId: "1:308723578929:web:e8353d01311240fada7d10",
  measurementId: "G-0Y0VZC6GGQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);