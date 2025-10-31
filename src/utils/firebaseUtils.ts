// // // Importations pour Storage et Firestore
// // import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// // import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

// // // Importations des instances Firebase configurées
// // import { db, storage, auth } from '../config/firebaseConfig';
// // import { Alert } from 'react-native'; // Pour les messages d'erreur

// // import { Report } from '../types/report'; // Importation de l'interface


// // /**
// //  * Fonction temporaire pour tester sans Firebase Storage
// //  * Retourne l'URI locale de l'image
// //  */
// // export const uploadImage = async (uri: string): Promise<string> => {
// //     // Retourner une URL d'image par défaut
// //     return 'https://via.placeholder.com/400x300?text=Signalement+Kominote';
// // };

// // // 2. Fonction utilitaire pour la sauvegarde
// // export const saveReport = async (reportData: {
// //     description: string,
// //     imageUrl: string,
// //     category: string,
// //     lat: number,
// //     lon: number
// // }) => {
// //     try {
// //         const currentUser = auth.currentUser;

// //         if (!currentUser) {
// //             throw new Error("Utilisateur non authentifié");
// //         }

// //         await addDoc(collection(db, 'reports'), {
// //             ...reportData,
// //             userId: currentUser.uid,
// //             createdAt: serverTimestamp(), // ← IMPORTANT : Ajouter serverTimestamp()
// //         });
// //     } catch (error) {
// //         console.error("Erreur lors de la sauvegarde du rapport:", error);
// //         throw error;
// //     }
// // };

// // /**
// //  * Écoute les signalements en temps réel et les retourne via un callback.
// //  * @param callback La fonction à appeler à chaque mise à jour des données.
// //  * @returns Une fonction de désabonnement (pour arrêter l'écoute).
// //  */
// // export const subscribeToReports = (callback: (reports: Report[]) => void) => {
// //     // 1. Créer une référence à la collection 'reports'
// //     const reportsCollection = collection(db, 'reports');

// //     // 2. Créer une requête : trier par date de création (le plus récent en premier)
// //     // Nous trions par 'createdAt' en ordre descendant (desc) pour avoir les plus récents en haut.
// //     const q = query(reportsCollection, orderBy('createdAt', 'desc'));

// //     // 3. Mettre en place l'écouteur en temps réel (onSnapshot)
// //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
// //         const reports: Report[] = [];

// //         // 4. Parcourir les documents reçus
// //         querySnapshot.forEach((doc) => {
// //             // On récupère les données et on ajoute l'ID du document
// //             reports.push({
// //                 id: doc.id,
// //                 ...doc.data() as Omit<Report, 'id'>, // On s'assure que les données correspondent à l'interface
// //             });
// //         });

// //         // 5. Appeler le callback avec la nouvelle liste de rapports
// //         callback(reports);
// //     });

// //     // 6. Retourner la fonction pour "nettoyer" l'écouteur
// //     return unsubscribe;
// // };

// // src/utils/firebaseUtils.ts

// // Importations nécessaires pour Firestore
// import {
//     collection,
//     query,
//     orderBy,
//     getDocs, // <-- NOUVEL IMPORT pour la lecture unique
//     addDoc,
//     serverTimestamp
// } from 'firebase/firestore';

// // Importations des instances Firebase configurées
// import { db, auth } from '../config/firebaseConfig';
// import { Report } from '../types/report'; // Importation de l'interface

// /**
//  * Fonction temporaire pour tester sans Firebase Storage
//  * Retourne une URL d'image par défaut en ligne
//  */
// export const uploadImage = async (uri: string): Promise<string> => {
//     // Retourner une URL d'image par défaut
//     return 'https://via.placeholder.com/400x300?text=Signalement+Kominote';
// };

// // ------------------------------------------------------------------
// // FONCTIONS DE SAUVEGARDE (ÉCRITURE)
// // ------------------------------------------------------------------

// // Assurez-vous que cette fonction est correcte (avec userId et serverTimestamp)
// export const saveReport = async (reportData: {
//     description: string,
//     imageUrl: string,
//     category: string,
//     lat: number,
//     lon: number
// }) => {
//     try {
//         const currentUser = auth.currentUser;

//         if (!currentUser) {
//             throw new Error("Utilisateur non authentifié");
//         }

//         await addDoc(collection(db, 'reports'), {
//             ...reportData,
//             userId: currentUser.uid,
//             createdAt: serverTimestamp(),
//         });
//     } catch (error) {
//         console.error("Erreur lors de la sauvegarde du rapport:", error);
//         throw error;
//     }
// };

// // ------------------------------------------------------------------
// // FONCTIONS DE LECTURE (LECTURE UNIQUE)
// // ------------------------------------------------------------------

// /**
//  * Récupère tous les signalements une seule fois (non en temps réel).
//  * Utilisé pour stabiliser l'application en cas de problèmes de connexion onSnapshot.
//  * @returns Une promesse qui résout en un tableau de rapports.
//  */
// export const getReports = async (): Promise<Report[]> => {
//     // 1. Créer une référence à la collection 'reports'
//     const reportsCollection = collection(db, 'reports');

//     // 2. Créer une requête : trier par date de création (le plus récent en premier)
//     const q = query(reportsCollection, orderBy('createdAt', 'desc'));

//     // 3. Exécuter la requête pour obtenir les documents (lecture unique)
//     const querySnapshot = await getDocs(q);

//     const reports: Report[] = [];

//     // 4. Parcourir les documents reçus
//     querySnapshot.forEach((doc) => {
//         // On récupère les données et on ajoute l'ID du document
//         reports.push({
//             id: doc.id,
//             ...doc.data() as Omit<Report, 'id'>, // On s'assure que les données correspondent à l'interface
//         });
//     });

//     // 5. Retourner la liste des rapports
//     return reports;
// };

// // NOTE : La fonction subscribeToReports a été supprimée.


// src/utils/firebaseUtils.ts

// Importations nécessaires pour Firestore
import {
    collection,
    query,
    orderBy,
    getDocs, // Lecture unique
    addDoc,
    serverTimestamp
} from 'firebase/firestore';

// Importations des instances Firebase configurées
// ASSUREZ-VOUS QUE CES IMPORTS SONT CORRECTS ET QUE LES INSTANCES SONT EXPORTÉES DEPUIS firebaseConfig.ts
import { db, auth } from '../config/firebaseConfig';
import { Report } from '../types/report'; // Importation de l'interface

// ------------------------------------------------------------------
// FONCTION D'UPLOAD D'IMAGE (SOLUTION TEMPORAIRE)
// ------------------------------------------------------------------

/**
 * Fonction temporaire pour tester sans Firebase Storage
 * Retourne une URL d'image par défaut en ligne
 */
export const uploadImage = async (uri: string): Promise<string> => {
    // NOTE : Cette fonction est temporaire et retourne une URL par défaut.
    // Le problème pourrait être ici si vous avez réintroduit le code de Storage sans les permissions.
    return 'https://via.placeholder.com/400x300?text=Signalement+Kominote';
};

// ------------------------------------------------------------------
// FONCTIONS DE SAUVEGARDE (ÉCRITURE )
// ------------------------------------------------------------------

/**
 * Sauvegarde un nouveau signalement dans Firestore.
 * @param reportData Les données du signalement (sans id ni createdAt).
 */
export const saveReport = async (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    // NOUVELLES VÉRIFICATIONS DE DIAGNOSTIC
    if (!db) {
        console.error("FIREBASE CONFIG ERROR: Firestore DB instance is not initialized (db is null or undefined).");
        throw new Error("Firestore DB instance is not initialized.");
    }
    if (!auth) {
        console.error("FIREBASE CONFIG ERROR: Auth instance is not initialized (auth est null ou undefined).");
        throw new Error("Auth instance is not initialized.");
    }
    if (typeof db.app === 'undefined') {
        console.error("FIREBASE CONFIG ERROR: Firestore DB instance is not properly configured.");
        throw new Error("Firestore DB instance is not properly configured.");
    }

    try {
        const docRef = await addDoc(collection(db, 'reports'), {
            ...reportData,
            createdAt: serverTimestamp(),
            userId: auth.currentUser ? auth.currentUser.uid : null,
        });

        console.log("Report saved successfully with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erreur DÉTAILLÉE lors de la sauvegarde du rapport dans Firestore:", error);
        throw new Error("Failed to save report to Firestore.");
    }
};

// ------------------------------------------------------------------
// FONCTIONS DE LECTURE (LECTURE UNIQUE)
// ------------------------------------------------------------------

/**
 * Récupère tous les signalements en lecture unique.
 */
export const getReports = async (): Promise<Report[]> => {
    if (!db) {
        console.error("FIREBASE CONFIG ERROR: Firestore DB instance is not initialized (db is null or undefined).");
        return [];
    }

    try {
        const reportsCollection = collection(db, 'reports');
        const q = query(reportsCollection, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);

        const reports: Report[] = [];
        querySnapshot.forEach((doc) => {
            reports.push({
                id: doc.id,
                ...doc.data() as Omit<Report, 'id'>,
            });
        });

        return reports;
    } catch (error) {
        console.error("Erreur lors de la récupération des rapports:", error);
        return [];
    }
};