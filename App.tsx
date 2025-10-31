import React, { useState, useEffect } from 'react';
import { Text } from 'react-native'; // Pour afficher le texte de chargement
import { NavigationContainer } from '@react-navigation/native';
// L'importation correcte pour le Stack Navigator moderne
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
// Importations de Firebase pour l'écouteur d'état
import { onAuthStateChanged, User } from 'firebase/auth'; 
import { auth } from './src/config/firebaseConfig'; // Notre instance d'auth

// Nos composants d'écran et de navigation
import TabNavigator from './src/navigation/TabNavigator'; 
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

const Stack = createNativeStackNavigator();

/**
 * AuthStack : Groupe d'écrans pour les utilisateurs NON connectés (Login et Signup)
 */
const AuthStack = () => (
  // headerShown: false masque la barre de titre par défaut pour ces écrans
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

/**
 * AppStack : Groupe d'écrans pour les utilisateurs CONNECTÉS (le TabNavigator)
 */
const AppStack = () => (
  // On peut ajouter d'autres écrans ici plus tard si nécessaire
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={TabNavigator} />
  </Stack.Navigator>
);

/**
 * Composant principal de l'application Kominote.
 * Gère la logique de navigation conditionnelle.
 */
export default function App() {
  // État pour stocker l'objet utilisateur (User) ou null s'il est déconnecté
  const [user, setUser] = useState<User | null>(null);
  // État pour savoir si l'application est en train de vérifier l'état initial de l'utilisateur
  const [loading, setLoading] = useState(true); 

  // useEffect : S'exécute une seule fois au démarrage de l'application
  useEffect(() => {
    // onAuthStateChanged écoute les changements d'état de connexion de Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Met à jour l'état 'user'
      setLoading(false); // La vérification est terminée
    });

    // Fonction de nettoyage : arrête l'écouteur lorsque le composant est retiré
    return unsubscribe;
  }, []); 

  // Affichage conditionnel pendant le chargement
  if (loading) {
    // Simple texte de chargement. Vous pouvez mettre ici un Splash Screen plus tard.
    return <Text>Loading...</Text>; 
  }

  return (
    <NavigationContainer>
      {/* Si l'utilisateur est non-null (connecté), on affiche AppStack, sinon AuthStack */}
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
