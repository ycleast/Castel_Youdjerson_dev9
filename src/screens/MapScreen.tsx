// // src/screens/MapScreen.tsx

// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ActivityIndicator } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { getReports } from '../utils/firebaseUtils';
// import { Report } from '../types/report';
// import { subscribeToReports } from './firebaseUtils';

// const MapScreen = () => {
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

//   // Générer le HTML de la carte Leaflet
//   const generateMapHTML = () => {
//     // Coordonnées par défaut (Port-au-Prince, Haïti)
//     const defaultLat = 18.9712;
//     const defaultLon = -72.2852;

//     // Créer les marqueurs pour chaque rapport
//     const markers = reports.map((report) => {
//       return `
//         L.marker([${report.lat}, ${report.lon}])
//           .bindPopup("<b>${report.description}</b>  
// Catégorie: ${report.category}")
//           .addTo(map);
//       `;
//     }).join('\n');

//     const html = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
//         <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
//         <style>
//           body { margin: 0; padding: 0; }
//           #map { position: absolute; top: 0; bottom: 0; width: 100%; }
//         </style>
//       </head>
//       <body>
//         <div id="map"></div>
//         <script>
//           // Créer la carte
//           const map = L.map('map' ).setView([${defaultLat}, ${defaultLon}], 12);

//           // Ajouter la couche de tuiles OpenStreetMap
//           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '© OpenStreetMap contributors',
//             maxZoom: 19
//           } ).addTo(map);

//           // Ajouter les marqueurs
//           ${markers}

//           // Ajouter un marqueur pour la position actuelle (optionnel)
//           // L.marker([${defaultLat}, ${defaultLon}])
//           //   .bindPopup("Votre position")
//           //   .addTo(map);
//         </script>
//       </body>
//       </html>
//     `;

//     return html;
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#00209f" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <WebView
//         source={{ html: generateMapHTML() }}
//         style={styles.webview}
//         scalesPageToFit={true}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   webview: {
//     flex: 1,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default MapScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getReports } from '../utils/firebaseUtils'; // Le chemin corrigé pour src/utils/firebaseUtils

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

const MapScreen = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Démarrer l'écoute en temps réel
    const fetchReports = async () => {
      const newReports = await getReports();
      setReports(newReports);
      setLoading(false);
    };

    fetchReports();

    // 2. Fonction de nettoyage pour arrêter l'écoute
    return () => {
      console.log("Stopping Firestore reports listener for map.");
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00209f" />
        <Text>Chargement de la carte et des signalements...</Text>
      </View>
    );
  }

  // Coordonnées par défaut (ex: Port-au-Prince)
  const initialRegion = {
    latitude: 18.5392,
    longitude: -72.3364,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{ latitude: report.lat, longitude: report.lon }}
            title={report.category}
            description={report.description}
          />
        ))}
      </MapView>
      {reports.length === 0 && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Pa gen signalman sou kat la.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  overlayText: {
    fontWeight: 'bold',
  }
});

export default MapScreen;