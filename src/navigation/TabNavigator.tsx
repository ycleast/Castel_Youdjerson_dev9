import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// On importe les icônes d'Expo (Ionicons)
import { Ionicons } from '@expo/vector-icons';

// On importe les 4 écrans principaux
import HomeScreen from '../screens/HomeScreen';
import ReportFormScreen from '../screens/ReportFormScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

// 1. On crée l'objet Tab Navigator
const Tab = createBottomTabNavigator();

/**
 * Composant de navigation par onglets (Bottom Tab Navigator)
 * C'est le conteneur principal de l'application une fois l'utilisateur connecté.
 */
const TabNavigator = () => {
  return (
    // 2. Le conteneur de navigation
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // 3. Fonction pour définir l'icône de chaque onglet
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap; // Type pour la sécurité TypeScript

          // Logique pour choisir l'icône en fonction du nom de l'écran (route.name)
          if (route.name === 'Accueil') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Ajouter') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Carte') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'alert-circle-outline'; // Icône par défaut en cas d'erreur
          }

          // On retourne le composant icône
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Styles de la barre d'onglets
        tabBarActiveTintColor: '#00209f', // Bleu du drapeau haïtien (Challenge M2)
        tabBarInactiveTintColor: 'gray',
        headerShown: true, // Affiche la barre de titre en haut de chaque écran
      })}
    >
      {/* 4. On définit chaque onglet (Screen) */}
      <Tab.Screen
        name="Accueil" // Le nom de l'onglet
        component={HomeScreen} // Le composant que nous venons de créer
        options={{
          tabBarLabel: 'Lakay', // Accueil en Créole
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="Ajouter" component={ReportFormScreen} options={{ title: 'Ajoute Signalman' }} />
      <Tab.Screen name="Carte" component={MapScreen} options={{ title: 'Kat' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Pwofil' }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
