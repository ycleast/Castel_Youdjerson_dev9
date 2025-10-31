import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
/**
 * Composant de l'écran "Profil utilisateur"
 * Contient les informations de l'utilisateur et un bouton de déconnexion.
 */
const ProfileScreen = () => {

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // L'écouteur dans App.tsx détectera le changement et basculera vers LoginScreen
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Alert.alert("Erè Dekoneksyon", errorMessage);
        }
    };
    return (
        <View style={styles.container}>
            {/* Titre de l'écran en créole */}
            <Text style={styles.title}>Pwofil</Text>

            {/* Explication en créole et français */}
            <Text>Enfòmasyon sou itilizatè a ak opsyon yo. (Informations sur l'utilisateur et options.)</Text>

            <Button
                title="Dekonekte (Déconnexion)"
                onPress={handleLogout}
                color="red"
            />
            {/* Message temporaire */}
            <Text style={styles.placeholderText}>
                (Gestion de l'authentification et affichage des données utilisateur au Milestone 3)
            </Text>
        </View>
    );
};

// L'exportation par défaut est essentielle pour que React Navigation puisse l'utiliser
export default ProfileScreen;

// Définition des styles
const styles = StyleSheet.create({
    container: {
        flex: 1, // Prend tout l'espace disponible
        justifyContent: 'center', // Centre verticalement
        alignItems: 'center', // Centre horizontalement
        backgroundColor: '#fff', // Fond blanc
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    placeholderText: {
        marginTop: 20,
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
    }
});
