import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Importations de Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';
// Importation de notre instance d'authentification configurée
import { auth } from '../config/firebaseConfig'; 

/**
 * Écran de connexion pour l'application Kominote.
 * Permet à l'utilisateur de se connecter avec son email et mot de passe.
 * 
 * @param {object} props - Les propriétés passées au composant (ici, 'navigation' de React Navigation).
 */
const LoginScreen = ({ navigation }) => {
  // Déclaration des états pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fonction pour gérer la connexion
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erè", "Tanpri ranpli tout chan yo. (Veuillez remplir tous les champs.)");
      return;
    }
    
    try {
      // Appel à l'API Firebase pour la connexion
      await signInWithEmailAndPassword(auth, email, password);
      
      // Si succès, l'écouteur dans App.tsx prend le relais pour naviguer
      console.log("Koneksyon reyisi! (Connexion réussie!)");
    } catch (error) {
      // Gestion des erreurs (mot de passe incorrect, utilisateur non trouvé, etc.)
      // Note: error.message contient le message d'erreur de Firebase
      Alert.alert("Erè Koneksyon", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Konekte (Connexion)</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Imèl (Email)"
        value={email}
        onChangeText={setEmail} // Met à jour l'état 'email'
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Modpas (Mot de passe)"
        value={password}
        onChangeText={setPassword} // Met à jour l'état 'password'
        secureTextEntry // Cache le mot de passe
      />
      
      <Button title="Konekte" onPress={handleLogin} />
      
      <Button 
        title="Kreye yon kont (Créer un compte)" 
        // Navigue vers l'écran d'inscription (nommé 'Signup' dans App.tsx)
        onPress={() => navigation.navigate('Signup')} 
        color="gray"
      />
    </View>
  );
};

// Exportation par défaut
export default LoginScreen;

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
