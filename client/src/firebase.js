import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPiFhsBsja7T630GcEyYvGbu7ifp7Tk4I",
  authDomain: "auth-197e4.firebaseapp.com",
  projectId: "auth-197e4",
  storageBucket: "auth-197e4.firebasestorage.app",
  messagingSenderId: "143956261590",
  appId: "1:143956261590:web:33bdb2ba47cdae68652777"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthprovider = new GoogleAuthProvider();
