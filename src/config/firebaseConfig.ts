// import { initializeApp, getApps } from 'firebase/app';
// // AJOUTEZ getAuth ici pour pouvoir récupérer l'instance existante
// import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
// import { getFirestore, initializeFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// // 1. L'objet de configuration que vous avez récupéré sur la console Firebase
// // ATTENTION : Remplacez les valeurs 'VOTRE_...' par vos vraies clés !
// const firebaseConfig = {
//   apiKey: "AIzaSyAU51pFY2tDvm2qXnVFpGKeaBofq0Wa9C0",
//   authDomain: "kominote-f6d3b.firebaseapp.com",
//   projectId: "kominote-f6d3b",
//   storageBucket: "kominote-f6d3b.firebasestorage.app",
//   messagingSenderId: "882258675305",
//   appId: "1:882258675305:web:0c0007ea90e854555b84f8"
// };

// // 2. Initialisation de l'application Firebase
// const app = getApps().length === 0
//   ? initializeApp(firebaseConfig)
//   : getApps()[0];

// // 3. Initialisation des services
// // VÉRIFIEZ SI AUTH EST DÉJÀ INITIALISÉ AVANT D'APPELER initializeAuth
// export const auth = getAuth(app) || initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

// export const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
// });

// export const storage = getStorage(app);

