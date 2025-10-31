// // // src/screens/HomeScreen.tsx

// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Image,
// //   TouchableOpacity // Pour rendre la carte cliquable
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';

// // // Importations des fonctions et types que nous venons de créer
// // import { subscribeToReports } from '../utils/firebaseUtils';
// // import { Report } from '../types/report';

// // // --- Composant pour afficher un seul élément de la liste ---
// // const ReportItem = ({ report }: { report: Report }) => {
// //   // Fonction utilitaire pour formater la date
// //   const formatDate = (timestamp: { seconds: number, nanoseconds: number } | null | undefined) => {
// //     if (!timestamp || !timestamp.seconds) {
// //       return 'Date inconnue';
// //     }

// //     try {
// //       return new Date(timestamp.seconds * 1000).toLocaleDateString('fr-HT', {
// //         year: 'numeric',
// //         month: 'short',
// //         day: 'numeric',
// //         hour: '2-digit',
// //         minute: '2-digit',
// //       });
// //     } catch (error) {
// //       console.error('Erreur lors du formatage de la date:', error);
// //       return 'Date inconnue';
// //     }
// //   };
// //   // Fonction pour obtenir l'icône et le label de la catégorie
// //   const getCategoryInfo = (category: Report['category']) => {
// //     switch (category) {
// //       case 'road': return { icon: 'car', label: 'Wout (Route)' };
// //       case 'water': return { icon: 'water', label: 'Dlo (Eau)' };
// //       case 'security': return { icon: 'shield', label: 'Sekirite (Sécurité)' };
// //       default: return { icon: 'help-circle', label: 'Lòt (Autre)' };
// //     }
// //   };

// //   const categoryInfo = getCategoryInfo(report.category);

// //   return (
// //     <TouchableOpacity style={styles.reportCard} activeOpacity={0.8}>
// //       {/* Image du signalement */}
// //       <Image
// //         source={{ uri: report.imageUrl }}
// //         style={styles.reportImage}
// //         resizeMode="cover"
// //       />

// //       <View style={styles.contentContainer}>
// //         {/* Description */}
// //         <Text style={styles.reportDescription} numberOfLines={2}>
// //           {report.description}
// //         </Text>

// //         {/* Détails (Catégorie et Date) */}
// //         <View style={styles.reportDetails}>
// //           <View style={styles.detailItem}>
// //             <Ionicons name={categoryInfo.icon as any} size={16} color="#00209f" />
// //             <Text style={styles.detailText}>{categoryInfo.label}</Text>
// //           </View>
// //           <View style={styles.detailItem}>
// //             <Ionicons name="time-outline" size={16} color="#555" />
// //             <Text style={styles.detailText}>
// //               {report.createdAt && report.createdAt.seconds
// //                 ? formatDate(report.createdAt)
// //                 : 'Date inconnue'}
// //             </Text>
// //           </View>
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );
// // };

// // // --- Composant principal de l'écran d'accueil ---
// // const HomeScreen = () => {
// //   const [reports, setReports] = useState<Report[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   // Hook pour gérer l'abonnement aux données
// //   useEffect(() => {
// //     // Démarrer l'écouteur et obtenir la fonction de désabonnement
// //     const unsubscribe = subscribeToReports((newReports) => {
// //       setReports(newReports);
// //       setLoading(false);
// //     });

// //     // Fonction de nettoyage (pour arrêter l'écoute quand on quitte l'écran)
// //     return () => unsubscribe();
// //   }, []);

// //   // Affichage de l'état de chargement
// //   if (loading) {
// //     return (
// //       <View style={styles.center}>
// //         <ActivityIndicator size="large" color="#00209f" />
// //         <Text style={styles.loadingText}>Chaje Signalman yo...</Text>
// //       </View>
// //     );
// //   }

// //   // Affichage si la liste est vide
// //   if (reports.length === 0) {
// //     return (
// //       <View style={styles.center}>
// //         <Ionicons name="alert-circle-outline" size={60} color="#999" />
// //         <Text style={styles.emptyText}>Pa gen okenn signalman pou kounye a.</Text>
// //         <Text style={styles.emptyTextSmall}>(Soumettez le premier !)</Text>
// //       </View>
// //     );
// //   }

// //   // Affichage de la liste des rapports
// //   return (
// //     <FlatList
// //       data={reports}
// //       keyExtractor={(item) => item.id}
// //       renderItem={({ item }) => <ReportItem report={item} />}
// //       contentContainerStyle={styles.list}
// //       // Ajout d'un indicateur de rafraîchissement (optionnel mais bonne pratique)
// //       refreshing={loading}
// //       onRefresh={() => { /* La fonction onRefresh n'est pas nécessaire ici car onSnapshot gère le temps réel */ }}
// //     />
// //   );
// // };

// // // --- Styles ---
// // const styles = StyleSheet.create({
// //   center: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f5f5f5',
// //   },
// //   loadingText: {
// //     marginTop: 10,
// //     fontSize: 16,
// //     color: '#00209f',
// //   },
// //   emptyText: {
// //     marginTop: 15,
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#555',
// //     textAlign: 'center',
// //   },
// //   emptyTextSmall: {
// //     fontSize: 14,
// //     color: '#999',
// //     marginTop: 5,
// //   },
// //   list: {
// //     padding: 10,
// //     backgroundColor: '#f5f5f5',
// //   },
// //   reportCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     marginBottom: 15,
// //     overflow: 'hidden',
// //     elevation: 3, // Ombre sur Android
// //     shadowColor: '#000', // Ombre sur iOS
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   reportImage: {
// //     width: '100%',
// //     height: 200,
// //   },
// //   contentContainer: {
// //     padding: 15,
// //   },
// //   reportDescription: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginBottom: 10,
// //     color: '#333',
// //   },
// //   reportDetails: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 5,
// //     borderTopWidth: 1,
// //     borderTopColor: '#eee',
// //     paddingTop: 10,
// //   },
// //   detailItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   detailText: {
// //     marginLeft: 5,
// //     fontSize: 13,
// //     color: '#555',
// //   }
// // });

// // export default HomeScreen;


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
//   TouchableOpacity
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// // Importations des fonctions et types
// import { getReports } from '../utils/firebaseUtils'; // <-- CHANGEMENT : getReports au lieu de subscribeToReports
// import { Report } from '../types/report';

// import { subscribeToReports } from './firebaseUtils';

// // ------------------------------------------------------------------
// // FONCTION UTILITAIRE POUR LE FORMATAGE DE LA DATE
// // ------------------------------------------------------------------

// const formatDate = (timestamp: { seconds: number, nanoseconds: number } | null | undefined) => {
//   if (!timestamp || !timestamp.seconds) {
//     return 'Date inconnue';
//   }

//   try {
//     return new Date(timestamp.seconds * 1000).toLocaleDateString('fr-HT', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   } catch (error) {
//     return 'Date inconnue';
//   }
// };

// // ------------------------------------------------------------------
// // COMPOSANT POUR AFFICHER UN SEUL ÉLÉMENT DE LA LISTE
// // ------------------------------------------------------------------

// const ReportItem = ({ report }: { report: Report }) => {
//   // Fonction pour obtenir l'icône et le label de la catégorie
//   const getCategoryInfo = (category: Report['category']) => {
//     switch (category) {
//       case 'road': return { icon: 'car', label: 'Wout (Route)' };
//       case 'water': return { icon: 'water', label: 'Dlo (Eau)' };
//       case 'security': return { icon: 'shield', label: 'Sekirite (Sécurité)' };
//       default: return { icon: 'help-circle', label: 'Lòt (Autre)' };
//     }
//   };

//   const categoryInfo = getCategoryInfo(report.category);

//   return (
//     <TouchableOpacity style={styles.reportCard} activeOpacity={0.8}>
//       {/* Image du signalement */}
//       <Image
//         source={{ uri: report.imageUrl }}
//         style={styles.reportImage}
//         resizeMode="cover"
//       />

//       <View style={styles.contentContainer}>
//         {/* Description */}
//         <Text style={styles.reportDescription} numberOfLines={2}>
//           {report.description}
//         </Text>

//         {/* Détails (Catégorie et Date) */}
//         <View style={styles.reportDetails}>
//           <View style={styles.detailItem}>
//             <Ionicons name={categoryInfo.icon as any} size={16} color="#00209f" />
//             <Text style={styles.detailText}>{categoryInfo.label}</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Ionicons name="time-outline" size={16} color="#555" />
//             <Text style={styles.detailText}>
//               {report.createdAt && report.createdAt.seconds
//                 ? formatDate(report.createdAt)
//                 : 'Date inconnue'}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// // ------------------------------------------------------------------
// // COMPOSANT PRINCIPAL DE L'ÉCRAN D'ACCUEIL
// // ------------------------------------------------------------------

// const HomeScreen = () => {
//   const [reports, setReports] = useState<Report[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Démarrer l'écoute en temps réel
//     const unsubscribe = subscribeToReports((newReports) => {
//       setReports(newReports);
//       setLoading(false);
//     });

//     // Fonction de nettoyage pour arrêter l'écoute
//     return () => unsubscribe();
//   }, []);

//   // Affichage de l'état de chargement
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#00209f" />
//         <Text style={styles.loadingText}>Chaje Signalman yo...</Text>
//       </View>
//     );
//   }

//   // Affichage si la liste est vide
//   if (reports.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Ionicons name="alert-circle-outline" size={60} color="#999" />
//         <Text style={styles.emptyText}>Pa gen okenn signalman pou kounye a.</Text>
//         <Text style={styles.emptyTextSmall}>(Soumettez le premier !)</Text>
//       </View>
//     );
//   }

//   // Affichage de la liste des rapports
//   return (
//     <FlatList
//       data={reports}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => <ReportItem report={item} />}
//       contentContainerStyle={styles.list}
//       // Ajout d'un indicateur de rafraîchissement
//       refreshing={loading}
//       onRefresh={fetchReports} // <-- Permet de rafraîchir manuellement
//     />
//   );
// };

// // ------------------------------------------------------------------
// // STYLES (Inclus pour la complétude)
// // ------------------------------------------------------------------

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#00209f',
//   },
//   emptyText: {
//     marginTop: 15,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#555',
//     textAlign: 'center',
//   },
//   emptyTextSmall: {
//     fontSize: 14,
//     color: '#999',
//     marginTop: 5,
//   },
//   list: {
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   reportCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 15,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   reportImage: {
//     width: '100%',
//     height: 200,
//   },
//   contentContainer: {
//     padding: 15,
//   },
//   reportDescription: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   reportDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 5,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     paddingTop: 10,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   detailText: {
//     marginLeft: 5,
//     fontSize: 13,
//     color: '#555',
//   }
// });

// export default HomeScreen;



import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
// import { subscribeToReports } from '../utils/firebaseUtils'; // Le chemin corrigé pour src/utils/firebaseUtils
import { getReports } from '../utils/firebaseUtils';

// Définition simulée du type Report
interface Report {
  id: string;
  description: string;
  imageUrl: string;
  category: string;
  lat: number;
  lon: number;
  createdAt: any;
}

// Composant pour afficher un seul signalement
const ReportItem: React.FC<{ report: Report }> = ({ report }) => (
  <View style={styles.reportCard}>
    <Text style={styles.reportTitle}>{report.description}</Text>
    <Text style={styles.reportMeta}>Catégorie: {report.category}</Text>
    <Text style={styles.reportMeta}>Posté le: {report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</Text>
    {/* L'image et d'autres détails seraient ici */}
  </View>
);

const HomeScreen = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // AVANT : const unsubscribe = subscribeToReports((newReports) => { ... });

        // APRÈS : Appel de la fonction de lecture unique
        const newReports = await getReports();
        setReports(newReports);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des rapports:", error);
        setLoading(false);
      }
    };

    fetchReports();

    // Puisque ce n'est plus un écouteur en temps réel, il n'y a plus de fonction de nettoyage à retourner.
    // return () => unsubscribe(); // Cette ligne doit être supprimée ou commentée si elle existe.
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une seule fois au montage

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00209f" />
        <Text>Chargement des signalements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dènye Signalman (Derniers Signalements)</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportItem report={item} />}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text>Pa gen signalman pou montre. Kreye youn!</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reportCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportMeta: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;