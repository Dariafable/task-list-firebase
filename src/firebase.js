// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCxy1rJdK4AxRPq9o_jZ2ABLwZxJ-UlKI4',
  authDomain: 'task-list-9af14.firebaseapp.com',
  projectId: 'task-list-9af14',
  storageBucket: 'task-list-9af14.appspot.com',
  messagingSenderId: '406609524317',
  appId: '1:406609524317:web:16d931ed9e0e78d04fffb4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
