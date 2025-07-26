// company-main/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "muster-consultants-b7ae0.firebaseapp.com",
  projectId: "muster-consultants-b7ae0",
  storageBucket: "muster-consultants-b7ae0.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "1:186817537631:web:4ecbbe363c3e4135c51dea"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { collection, addDoc }; 