// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, type User } from 'firebase/auth';
import { getDatabase, ref, get, set, child } from 'firebase/database';
import { signOut as firebaseSignOut } from "firebase/auth";
import { readable } from "svelte/store";

const firebaseConfig = {
  apiKey: "AIzaSyC0SkY_uSkrB-oIaFxeC0wOVc_jgF3NMVo",
  authDomain: "csma-blend.firebaseapp.com",
  projectId: "csma-blend",
  storageBucket: "csma-blend.appspot.com",
  messagingSenderId: "958586010509",
  appId: "1:958586010509:web:44c736a1b5f873147b1bc4",
  measurementId: "G-HBJML0L0RM"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);

export const getUserData = async (path?: string) => auth.currentUser && (await get(child(ref(database), `users/${auth.currentUser.uid}/${path}`))).val();
export const setUserData = async (path: string, value: any) => auth.currentUser && (await set(child(ref(database), `users/${auth.currentUser.uid}/${path}`), value))

export const setWillAttempLogin = (willAttempt: boolean) => localStorage.setItem('willAttemptLogin', willAttempt ? 'yes' : 'no'); 
export const willAttemptLogin = () => localStorage.getItem('willAttemptLogin') === 'yes';

export const user = readable(auth.currentUser, (set) => {
    console.log(`Initial user: ${auth.currentUser}`);
    set(auth.currentUser);
    auth.onAuthStateChanged(user => {
      setWillAttempLogin(!!user);
      set(user);
    });
});

export const signOut = async () => {
  setWillAttempLogin(false);
  await firebaseSignOut(auth);
};