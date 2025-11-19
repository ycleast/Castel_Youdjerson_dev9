// screens/Auth/SignUpScreen.tsx
// Permet à un nouvel utilisateur de créer un compte.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase'; // Importe le client Supabase
import { useTheme } from '../../context/ThemeContext'; // Pour le style
import { useI18n } from '../../context/LanguageContext'; // Pour les traductions

export default function SignUpScreen({ navigation }: { navigation: any }) {
  // --- HOOKS DE CONTEXTE ---
  const { colors } = useTheme();
  const { t } = useI18n();

  // --- ÉTATS LOCAUX ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- FONCTION D'INSCRIPTION ---
  async function signUpWithEmail() {
    // 1. Validation simple côté client
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    // 2. Active l'indicateur de chargement
    setLoading(true);

    // 3. Appelle la fonction d'inscription de Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // 4. Gère la réponse
    if (error) {
      Alert.alert("Erreur lors de l'inscription", error.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // Cas spécifique où l'utilisateur existe déjà mais n'est pas confirmé
      Alert.alert("Utilisateur existant", "Cet email est déjà utilisé mais n'a pas été confirmé. Veuillez vérifier vos emails.");
    }
    else {
      // Si l'inscription réussit, Supabase envoie un email de confirmation.
      // L'utilisateur n'est pas encore "connecté".
      Alert.alert(
        "Inscription réussie !",
        "Veuillez vérifier votre boîte de réception pour confirmer votre adresse email."
      );
      // On pourrait rediriger vers l'écran de connexion
      navigation.navigate('Login');
    }

    // 5. Désactive l'indicateur de chargement
    setLoading(false);
  }

  // --- STYLES ---
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
      <Text style={styles.title}>Créer un Compte</Text>

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
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        placeholderTextColor={colors.subtext}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title="S'inscrire"
            onPress={signUpWithEmail}
            disabled={loading}
            color={colors.primary}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => navigation.navigate('Login')} // Navigue vers l'écran de connexion
        disabled={loading}
      >
        <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}
