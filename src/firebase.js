import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAP5lCavwQXpFYCfYX7GgFJU_TasuqoKMQ",
  authDomain: "friday-challenge.firebaseapp.com",
  projectId: "friday-challenge",
  storageBucket: "friday-challenge.firebasestorage.app",
  messagingSenderId: "191681781164",
  appId: "1:191681781164:web:e78e6868594945606aee09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper to get current day (0 = Sunday, 5 = Friday)
export const isFriday = () => {
  const today = new Date();
  return today.getDay() === 5;
};

// Generates an ID like "friday-08-05-2026"
export const getCurrentFridayDocId = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();
  return `friday-${dd}-${mm}-${yyyy}`;
};

// Get the doc reference for the current Friday
export const getFridayDocRef = (docId = getCurrentFridayDocId()) => {
  return doc(db, "challenges", docId);
};

// Increment user count
export const incrementUserDhikr = async (userName) => {
  if (!userName) return;
  
  const docId = getCurrentFridayDocId();
  const docRef = getFridayDocRef(docId);
  const userRef = doc(db, "challenges", docId, "users", userName);

  try {
    // 1. Try to increment user's count directly in the subcollection
    // We use a subcollection "users" inside the friday document for scalability
    await setDoc(userRef, {
      name: userName,
      count: increment(1),
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    // 2. Increment global total for the day
    await setDoc(docRef, {
      totalCount: increment(1),
      date: docId
    }, { merge: true });

  } catch (error) {
    console.error("Error updating Dhikr count:", error);
  }
};

// Listen to Global Squad Counter
export const subscribeToGlobalCount = (docId, callback) => {
  const docRef = getFridayDocRef(docId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().totalCount || 0);
    } else {
      callback(0);
    }
  });
};

// Listen to Leaderboard
export const subscribeToLeaderboard = (docId, callback) => {
  const usersRef = collection(db, "challenges", docId, "users");
  const q = query(usersRef, orderBy("count", "desc"), limit(50));
  
  return onSnapshot(q, (snapshot) => {
    const leaderboard = [];
    snapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
    callback(leaderboard);
  });
};

// Listen to Personal Count
export const subscribeToPersonalCount = (docId, userName, callback) => {
  if (!userName) return () => {};
  
  const userRef = doc(db, "challenges", docId, "users", userName);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().count || 0);
    } else {
      callback(0);
    }
  });
};
