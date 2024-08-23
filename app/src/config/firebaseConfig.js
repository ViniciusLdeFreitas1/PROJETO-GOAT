import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBxkGLxEWDLvwdxk7ng5elZsVkCKa48n3M",
    authDomain: "goat-7d302.firebaseapp.com",
    projectId: "goat-7d302",
    storageBucket: "goat-7d302.appspot.com",
    messagingSenderId: "105533645985",
    appId: "1:105533645985:web:174dcb4b95a33856debce0",
    measurementId: "G-PLZ5MVQ7D8"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
});
export const db = getFirestore(app);