import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlGWqekYEl0RRlp9ObLFuW6vllCp82K_w",
  authDomain: "projectfood-27c30.firebaseapp.com",
  projectId: "projectfood-27c30",
  storageBucket: "projectfood-27c30.appspot.com",
  messagingSenderId: "194306569371",
  appId: "1:194306569371:web:152fbd547c57ceeae8423e",
  measurementId: "G-6BHMFVHYDT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);