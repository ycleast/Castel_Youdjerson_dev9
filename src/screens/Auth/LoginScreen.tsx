// screens/Auth/LoginScreen.tsx
// Permet à un utilisateur existant de se connecter à l'application.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase'; // Importe le client Supabase
import { useTheme } from '../../context/ThemeContext'; // Pour le style
import { useI18n } from '../../context/LanguageContext'; // Pour les traductions

// Le type 'navigation' est fourni par React Navigation à tous les écrans
export default function LoginScreen({ navigation }: { navigation: any }) {
  // --- HOOKS DE CONTEXTE ---
  const { colors } = useTheme();
  const { t } = useI18n(); // On pourrait ajouter des traductions pour cet écran

  // --- ÉTATS LOCAUX ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- FONCTION DE CONNEXION ---
  async function signInWithEmail() {
    // 1. Active l'indicateur de chargement et désactive le bouton
    setLoading(true);

    // 2. Appelle la fonction de connexion de Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    // 3. Gère la réponse
    if (error) {
      // Si Supabase retourne une erreur, on l'affiche à l'utilisateur.
      Alert.alert("Erreur de connexion", error.message);
    }
    // Si la connexion réussit, l'écouteur 'onAuthStateChange' dans App.tsx
    // détectera la nouvelle session et basculera automatiquement vers AppNavigator.
    // Nous n'avons rien de plus à faire ici !

    // 4. Désactive l'indicateur de chargement
    setLoading(false);
  }

  // --- STYLES ---
  // Les styles sont définis dans le composant pour utiliser les couleurs du thème
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 30,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      marginBottom: 15,
      color: colors.text,
    },
    buttonContainer: {
      marginTop: 10,
    },
    linkContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    linkText: {
      color: colors.primary,
      fontSize: 16,
    },
  });

  // --- LE RENDU ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kominote</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.subtext}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={colors.subtext}
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Masque le mot de passe
      />

      {/* Affiche un indicateur de chargement si 'loading' est true */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title="Se connecter"
            onPress={signInWithEmail}
            disabled={loading}
            color={colors.primary}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => navigation.navigate('SignUp')} // Navigue vers l'écran d'inscription
        disabled={loading}
      >
        <Text style={styles.linkText}>Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}
