import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAU-nnanHH5gDbkUZjLsPICInqKeW4BReI",
  authDomain: "jawado-f3c44.firebaseapp.com",
  projectId: "jawado-f3c44",
  storageBucket: "jawado-f3c44.appspot.com",
  messagingSenderId: "696205066613",
  appId: "1:696205066613:web:6de6c0c7b49bdca5e3933c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);