// navigation/AppNavigator.tsx
// Définit la barre de navigation principale et distribue les props aux écrans.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importation des écrans
import HomeScreen from '../screens/HomeScreen';
import AddReportScreen from '../screens/Auth/AddReportScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Importation des types et des contextes
import { Report, Category } from '../config/types'; // Assure-toi que Category est bien importé
import { useI18n } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

// 1. Définition des props que le navigateur reçoit de App.tsx
// C'est ici que se trouvait l'erreur. onAddReport est maintenant corrigé.
type AppNavigatorProps = {
  reports: Report[];
  onAddReport: (description: string, category: Category) => void; // <--- CORRIGÉ !
  onUpdateReport: (report: Report) => void;
  onDeleteReport: (id: string) => void;
  onClearAllReports: () => void;
};

const Tab = createBottomTabNavigator();

export default function AppNavigator({
  reports,
  onAddReport,
  onUpdateReport,
  onDeleteReport,
  onClearAllReports,
}: AppNavigatorProps) {
  // On récupère les contextes pour les traductions et les couleurs de la barre d'onglets
  const { t } = useI18n();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Style global de la barre d'onglets
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
        },

        // Définition des icônes pour chaque onglet
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'alert-circle';

          if (route.name === t.homeTab) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === t.addReportTab) {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === t.mapTab) {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === t.profileTab) {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* 2. Définition des écrans et distribution des props */}
      
      {/* L'écran d'accueil reçoit la liste des signalements et la fonction de suppression */}
      <Tab.Screen name={t.homeTab}>
        {(props) => (
          <HomeScreen
            {...props}
            reports={reports}
            onDeleteReport={onDeleteReport}
          />
        )}
      </Tab.Screen>

      {/* L'écran de signalement reçoit les fonctions d'ajout et de mise à jour */}
      <Tab.Screen name={t.addReportTab}>
        {(props) => (
          <AddReportScreen
            {...props}
            onAddReport={onAddReport}
            onUpdateReport={onUpdateReport}
          />
        )}
      </Tab.Screen>

      {/* L'écran de la carte reçoit la liste des signalements */}
      <Tab.Screen name={t.mapTab}>
        {(props) => <MapScreen {...props} reports={reports} />}
      </Tab.Screen>

      {/* L'écran de profil reçoit la liste et la fonction de suppression totale */}
      <Tab.Screen name={t.profileTab}>
        {(props) => (
          <ProfileScreen
            {...props}
            reports={reports}
            onClearAllReports={onClearAllReports}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
