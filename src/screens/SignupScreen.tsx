import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Importations de Firebase Auth
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Importation de notre instance d'authentification configurée
import { auth } from '../config/firebaseConfig'; 

/**
 * Écran d'inscription pour l'application Kominote.
 * Permet à un nouvel utilisateur de créer un compte.
 * 
 * @param {object} props - Les propriétés passées au composant (ici, 'navigation').
 */
const SignupScreen = ({ navigation }) => {
  // Déclaration des états pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Pour la vérification

  // Fonction pour gérer l'inscription
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erè", "Tanpri ranpli tout chan yo. (Veuillez remplir tous les champs.)");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Erè", "Modpas yo pa menm. (Les mots de passe ne correspondent pas.)");
      return;
    }

    try {
      // Appel à l'API Firebase pour la création de compte
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Si succès, l'utilisateur est automatiquement connecté et App.tsx navigue vers TabNavigator
      console.log("Enskripsyon reyisi! (Inscription réussie!)");
    } catch (error) {
      // Gestion des erreurs (mot de passe trop faible, email déjà utilisé, etc.)
      Alert.alert("Erè Enskripsyon", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kreye Yon Kont (Inscription)</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Imèl (Email)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Modpas (Mot de passe)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Konfime Modpas"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <Button title="Enskri (S'inscrire)" onPress={handleSignup} />
      
      <Button 
        title="Retounen nan Koneksyon (Retour à la connexion)" 
        onPress={() => navigation.navigate('Login')} // Navigue vers l'écran de connexion
        color="gray"
      />
    </View>
  );
};

// Exportation par défaut
export default SignupScreen;

// Styles pour l'interface
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
});
