import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAdFFYEewMHWp1kpxZcHOKbdHE3XlfZW8Y",
  authDomain: "msci-342-project-64796.firebaseapp.com",
  projectId: "msci-342-project-64796",
  storageBucket: "msci-342-project-64796.appspot.com",
  messagingSenderId: "227792107035",
  appId: "1:227792107035:web:91cdccab7b418246c32abe"
};

const app = initializeApp(firebaseConfig);

class Firebase {
  constructor() {
    this.auth = getAuth(app);
  }
  doCreateUserWithEmailAndPassword = (email, password) => createUserWithEmailAndPassword(this.auth, email, password);
  doSignInWithEmailAndPassword = (email, password) => signInWithEmailAndPassword(this.auth, email, password);
  doSignOut = () => signOut(this.auth);
  doPasswordReset = email => sendPasswordResetEmail(this.auth, email);
  doPasswordUpdate = password => updatePassword(this.auth.currentUser, password);
  
  doDeleteAccount = () => {
    return new Promise((resolve, reject) => {
      const user = this.auth.currentUser;
      if (user) {
        deleteUser(user)
          .then(() => {
            resolve('User account deleted successfully.');
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject(new Error('No user is signed in.'));
      }
    });
  };
  
  doGetIdToken = () => {
    return new Promise((resolve, reject) => {
      const user = this.auth.currentUser;
      if (user) {
        user
        .getIdToken()
        .then(token => {
          resolve(token);
        })
        .catch(error => {
          reject(error);
        });
      } else {
        reject(new Error('No user is signed in.'));
      }
    });
  };
}
export default Firebase;
