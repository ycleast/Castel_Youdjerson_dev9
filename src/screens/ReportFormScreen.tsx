// // src/screens/ReportFormScreen.tsx

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
// import { Ionicons } from '@expo/vector-icons';

// // Importation des fonctions utilitaires
// import { uploadImage, saveReport } from '../utils/firebaseUtils';

// import { TabActions } from '@react-navigation/native';

// // Définition des types pour la sécurité TypeScript
// type LocationObject = {
//   latitude: number;
//   longitude: number;
// };

// // Liste des catégories pour le Picker
// const CATEGORIES = [
//   { label: 'Wout (Route)', value: 'road' },
//   { label: 'Dlo (Eau)', value: 'water' },
//   { label: 'Sekirite (Sécurité)', value: 'security' },
//   { label: 'Lòt (Autre)', value: 'other' },
// ];

// const ReportFormScreen = ({ navigation }) => {
//   // --- 1. ÉTATS DU FORMULAIRE ---
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState(CATEGORIES[0].value);
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [location, setLocation] = useState<LocationObject | null>(null);
//   const [loading, setLoading] = useState(false);

//   // --- 2. LOGIQUE IMAGE PICKER ---
//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert("Permisyon", "Nou bezwen aksè nan galri a pou chwazi yon foto.");
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.5,
//     });

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   // --- 3. LOGIQUE GÉOLOCALISATION ---
//   const getCurrentLocation = async () => {
//     setLoading(true);
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert("Permisyon", "Nou bezwen aksè nan kote ou ye a pou rapò a.");
//       setLoading(false);
//       return;
//     }

//     try {
//       let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
//       setLocation({
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude,
//       });
//       Alert.alert("Siksè", "Pozisyon jwenn! (Position trouvée!)");
//     } catch (error) {
//       Alert.alert("Erè GPS", "Pa ka jwenn pozisyon an. (Impossible de trouver la position.)");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- 4. SOUMISSION FINALE (LE CHEF D'ORCHESTRE) ---
//   const handleReportSubmit = async () => {
//     if (!description || !imageUri || !location) {
//       Alert.alert("Erè", "Tanpri ranpli tout jaden yo epi ajoute yon foto ak pozisyon.");
//       return;
//     }

//     setLoading(true);
//     let finalImageUrl = '';

//     try {
//       // 1. Upload de l'image (Appel à la fonction utilitaire)
//       finalImageUrl = await uploadImage(imageUri);

//       // 2. Sauvegarde dans Firestore (Appel à la fonction utilitaire)
//       await saveReport({
//         description,
//         imageUrl: finalImageUrl,
//         category,
//         lat: location.latitude,
//         lon: location.longitude,
//       });

//       // 3. Succès et réinitialisation
//       Alert.alert("Siksè!", "Rapò a te anrejistre avèk siksè. Mèsi!");
//       setDescription('');
//       setImageUri(null);
//       setLocation(null);

//       // CORRECTION: Naviguer vers l'écran d'accueil après soumission réussie
//       navigation.navigate('Home');

//     } catch (error) {
//       console.error("Erreur lors de la soumission du rapport:", error);
//       Alert.alert("Erè", "Yon erè rive pandan anrejistreman an. Eseye ankò.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- 5. RENDU DE L'INTERFACE ---
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Ajoute Signalman</Text>

//       {/* Champ Description */}
//       <Text style={styles.label}>Deskripsyon (Description)</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Dekri sa w wè a (Décrivez ce que vous voyez)"
//         value={description}
//         onChangeText={setDescription}
//         multiline
//         numberOfLines={4}
//       />

//       {/* Sélecteur de Catégorie */}
//       <Text style={styles.label}>Kategori (Catégorie)</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={category}
//           onValueChange={(itemValue) => setCategory(itemValue)}
//           style={styles.picker}
//         >
//           {CATEGORIES.map((cat) => (
//             <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
//           ))}
//         </Picker>
//       </View>

//       {/* Bouton Photo */}
//       <TouchableOpacity
//         style={styles.actionButton}
//         onPress={pickImage}
//         disabled={loading}
//       >
//         <Ionicons name="camera" size={24} color="#fff" />
//         <Text style={styles.buttonText}>
//           {imageUri ? "Chanje Foto" : "Ajoute Foto"}
//         </Text>
//       </TouchableOpacity>
//       {imageUri && (
//         <View style={styles.imagePreviewContainer}>
//           <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//         </View>
//       )}

//       {/* Bouton Localisation */}
//       <TouchableOpacity
//         style={[styles.actionButton, location && styles.locationFoundButton]}
//         onPress={getCurrentLocation}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Ionicons name="locate" size={24} color="#fff" />
//         )}
//         <Text style={styles.buttonText}>
//           {location ? "Pozisyon Jwenn" : "Jwenn Pozisyon"}
//         </Text>
//       </TouchableOpacity>
//       {location && (
//         <Text style={styles.locationText}>
//           <Ionicons name="location" size={16} color="green" /> Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
//         </Text>
//       )}

//       {/* Bouton Soumettre */}
//       <TouchableOpacity
//         style={[styles.submitButton, loading && styles.submitButtonDisabled]}
//         onPress={handleReportSubmit}
//         disabled={loading}
//       >
//         <Text style={styles.submitButtonText}>
//           {loading ? "Anrejistreman..." : "Soumèt Rapò"}
//         </Text>
//       </TouchableOpacity>

//     </ScrollView>
//   );
// };

// export default ReportFormScreen;

// // --- 6. STYLES ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 15,
//     marginBottom: 5,
//   },
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   pickerContainer: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 15,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   imagePreviewContainer: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   imagePreview: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     resizeMode: 'cover',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 15,
//   },
//   locationFoundButton: {
//     backgroundColor: 'green',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   locationText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//   },
//   submitButton: {
//     backgroundColor: '#00209f',
//     padding: 18,
//     borderRadius: 8,
//     marginTop: 30,
//     marginBottom: 50,
//     alignItems: 'center',
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#999',
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator // Pour indiquer le chargement
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native';

// Importation des fonctions utilitaires
import { uploadImage, saveReport } from '../utils/firebaseUtils'; // Le chemin est déjà correct, mais je le laisse pour la cohérence 

// Définition des types pour la sécurité TypeScript
type LocationObject = {
  latitude: number;
  longitude: number;
};

// Liste des catégories pour le Picker
const CATEGORIES = [
  { label: 'Wout (Route)', value: 'road' },
  { label: 'Dlo (Eau)', value: 'water' },
  { label: 'Sekirite (Sécurité)', value: 'security' },
  { label: 'Lòt (Autre)', value: 'other' },
];

// Définition du type de props pour la navigation
type ReportFormScreenProps = {
  navigation: any; // Utiliser le type approprié de React Navigation si connu
};

const ReportFormScreen: React.FC<ReportFormScreenProps> = ({ navigation }) => {
  // --- 1. ÉTATS DU FORMULAIRE ---
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'road' | 'water' | 'security' | 'other'>(CATEGORIES[0].value as 'road' | 'water' | 'security' | 'other'); // Catégorie par défaut
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [loading, setLoading] = useState(false); // État de chargement global

  // --- 2. LOGIQUE IMAGE PICKER ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permisyon", "Nou bezwen aksè nan galri a pou chwazi yon foto.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- 3. LOGIQUE GÉOLOCALISATION ---
  const getCurrentLocation = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permisyon", "Nou bezwen aksè nan kote ou ye a pou jwenn pozisyon an.");
      setLoading(false);
      return;
    }

    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      Alert.alert("Siksè", "Pozisyon jwenn!");
    } catch (error) {
      console.error("Erreur de localisation:", error);
      Alert.alert("Erè", "Nou pa ka jwenn pozisyon an. Eseye ankò.");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. SOUMISSION FINALE (LE CHEF D'ORCHESTRE) ---
  const handleReportSubmit = async () => {
    if (!description || !imageUri || !location) {
      Alert.alert("Erè", "Tanpri ranpli tout jaden yo epi ajoute yon foto ak pozisyon.");
      return;
    }

    setLoading(true);
    let finalImageUrl = '';

    try {
      console.log("Starting image upload..."); // Debug log
      // 1. Upload de l'image (Appel à la fonction utilitaire)
      finalImageUrl = await uploadImage(imageUri);

      console.log("Image upload successful. Starting Firestore save..."); // Debug log
      // 2. Sauvegarde dans Firestore (Appel à la fonction utilitaire)
      await saveReport({
        description,
        imageUrl: finalImageUrl,
        category,
        lat: location.latitude,
        lon: location.longitude,
      });

      // 3. Succès et réinitialisation
      Alert.alert("Siksè!", "Rapò a te anrejistre avèk siksè. Mèsi!");
      setDescription('');
      setImageUri(null);
      setLocation(null);

      console.log("Report saved successfully. Navigating to Home..."); // Debug log
      // CORRECTION: Naviguer vers l'écran d'accueil après soumission réussie
      navigation.navigate('Home');

    } catch (error) {
      console.error("Erreur lors de la soumission du rapport:", error);
      Alert.alert("Erè", "Yon erè rive pandan anrejistreman an. Eseye ankò.");
    } finally {
      setLoading(false);
    }
  };

  // --- 5. RENDU DE L'INTERFACE ---
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ajoute Signalman</Text>

      {/* Champ Description */}
      <Text style={styles.label}>Deskripsyon (Description)</Text>
      <TextInput
        style={styles.input}
        placeholder="Dekri pwoblèm nan..."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      {/* Sélecteur de Catégorie */}
      <Text style={styles.label}>Kategori (Catégorie)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue as 'road' | 'water' | 'security' | 'other')}
          style={styles.picker}
        >
          {CATEGORIES.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>

      {/* Bouton Photo */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={pickImage}
        disabled={loading}
      >
        <Ionicons name="camera" size={24} color="#fff" />
        <Text style={styles.buttonText}>
          {imageUri ? "Chanje Foto" : "Ajoute Foto"}
        </Text>
      </TouchableOpacity>
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        </View>
      )}

      {/* Bouton Localisation */}
      <TouchableOpacity
        style={[styles.actionButton, location && styles.locationFoundButton]}
        onPress={getCurrentLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="locate" size={24} color="#fff" />
        )}
        <Text style={styles.buttonText}>
          {location ? "Pozisyon Jwenn" : "Jwenn Pozisyon"}
        </Text>
      </TouchableOpacity>
      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
          </Text>
        </View>
      )}

      {/* Bouton Soumettre */}
      <View style={styles.submitButtonContainer}>
        <Button
          title="Soumèt Rapò (Soumettre Rapport)"
          onPress={handleReportSubmit}
          color="#00209f"
          disabled={loading}
        />
        {loading && <ActivityIndicator size="large" color="#00209f" style={styles.loadingIndicator} />}
      </View>

    </ScrollView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  locationFoundButton: {
    backgroundColor: '#28a745', // Vert pour indiquer que la position est trouvée
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  locationContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  submitButtonContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  loadingIndicator: {
    marginTop: 10,
  }
});

export default ReportFormScreen;