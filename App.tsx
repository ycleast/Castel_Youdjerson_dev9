// App.tsx
// Gère l'état d'authentification global et agit comme un routeur principal.

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js'; // Type pour la session Supabase
import { View, Text, StyleSheet } from 'react-native'; // Pour l'écran de chargement

// Importations locales
import { Report, Category } from './src/config/types';
import { supabase } from './src/lib/supabase';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

// Importation des navigateurs
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

// Un composant simple pour le chargement
const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Chargement...</Text>
  </View>
);

export default function App() {
  // --- ÉTATS GLOBAUX ---
  const [session, setSession] = useState<Session | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // --- GESTION DU CYCLE DE VIE ---

  // Effet pour gérer l'état d'authentification
  useEffect(() => {
    // 1. Récupérer la session existante au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // On a fini de vérifier l'auth, on peut arrêter le chargement
    });

    // 2. Écouter les changements d'état (connexion, déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Nettoyer l'écouteur quand le composant est démonté
    return () => subscription.unsubscribe();
  }, []);

  // Effet pour charger les données des signalements (ne se déclenche que si l'utilisateur est connecté)
  useEffect(() => {
    if (session) { // On ne charge les données que si une session existe
      const fetchInitialReports = async () => {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Erreur lors de la récupération des signalements:", error.message);
        } else if (data) {
          setReports(data as Report[]);
        }
      };
      fetchInitialReports();
    }
  }, [session]); // Se redéclenche si la session change (connexion/déconnexion)

  // --- FONCTIONS CRUD (Create, Read, Update, Delete) ---

  const handleAddReport = async (
    description: string,
    category: Category,
    imageUrl: string | null,
    latitude: number | null,
    longitude: number | null
  ) => {
    if (!session || !session.user) return; // Sécurité

    const newReportData = {
      description,
      category,
      user_id: session.user.id,
      image_url: imageUrl, // On ajoute la nouvelle donnée
      latitude: latitude,
      longitude: longitude,
    };

    const { data, error } = await supabase
      .from('reports')
      .insert([{ description, category, user_id: session.user.id }]) // On inclut l'ID de l'utilisateur
      .select();

    if (error) {
      console.error("Erreur lors de l'ajout:", error.message);
    } else if (data) {
      setReports(prevReports => [data[0] as Report, ...prevReports]);
    }
  };

  const handleUpdateReport = async (reportToUpdate: Report) => {
    const { data, error } = await supabase
      .from('reports')
      .update({ description: reportToUpdate.description, category: reportToUpdate.category })
      .eq('id', reportToUpdate.id)
      .select();

    if (error) {
      console.error("Erreur lors de la mise à jour:", error.message);
    } else if (data) {
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportToUpdate.id ? (data[0] as Report) : report
        )
      );
    }
  };

  const handleDeleteReport = async (id: string) => {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (!error) {
      setReports(prevReports => prevReports.filter(report => report.id.toString() !== id));
    } else {
      console.error("Erreur lors de la suppression:", error.message);
    }
  };

  const handleClearAllReports = () => {
    console.warn("La suppression de tous les signalements est désactivée.");
  };

  // --- LE RENDU ---

  // Affiche un écran de chargement pendant que la session est vérifiée
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <NavigationContainer>
          {/* Le "Gardien" : Affiche l'app principale ou les écrans d'auth */}
          {session && session.user ? (
            <AppNavigator
              session={session} // On passe la session pour pouvoir afficher l'email ou se déconnecter
              reports={reports}
              onAddReport={handleAddReport}
              onUpdateReport={handleUpdateReport}
              onDeleteReport={handleDeleteReport}
              onClearAllReports={handleClearAllReports}
            />
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      </ThemeProvider>
    </LanguageProvider>
  );
}
