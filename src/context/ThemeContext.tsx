// context/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Définir les couleurs pour chaque thème
export const lightColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  subtext: '#666666',
  border: '#e0e0e0',
  primary: '#4a90e2',
  // ... autres couleurs
};

export const darkColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#e0e0e0',
  subtext: '#a0a0a0',
  border: '#272727',
  primary: '#4a90e2', // On peut garder la même couleur primaire
  // ... autres couleurs
};

// 2. Définir le type pour notre contexte
type ThemeContextType = {
  isDarkMode: boolean;
  colors: typeof lightColors | typeof darkColors;
  toggleTheme: () => void;
};

// 3. Créer le contexte avec une valeur par défaut
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 4. Créer le "Provider" (le fournisseur de contexte)
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const systemScheme = useColorScheme(); // Détecte le thème du téléphone ('light' ou 'dark')
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    AsyncStorage.setItem('@theme', newIsDarkMode ? 'dark' : 'light');
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5. Créer le Hook personnalisé pour utiliser le contexte
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
