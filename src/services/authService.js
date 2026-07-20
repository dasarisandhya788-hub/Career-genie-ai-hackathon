import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export const registerUser = async (email, password, name) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Please check your Firebase environment configuration.");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: name });
  
  if (db) {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      name,
      email,
      createdAt: serverTimestamp(),
      progress: 0,
      dreamCareer: "",
      careerGoal: "",
      completedTasks: [],
      savedRoadmaps: []
    });
  }
  return user;
};

export const loginUser = async (email, password) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Please check your Firebase environment configuration.");
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  if (!auth) return;
  return await signOut(auth);
};

export const getUserProfile = async (uid) => {
  if (!db) return null;
  const userDocRef = doc(db, "users", uid);
  const docSnap = await getDoc(userDocRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (uid, updates) => {
  if (!db) return;
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, updates);
};
