// screens/ProfileScreen.tsx
// Affiche les infos utilisateur, les stats, les options, et permet la déconnexion.

// 1. Importations
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import { Session } from '@supabase/supabase-js'; // On importe le type Session
import { Report } from '../../src/config/types';
import { useTheme } from '../context/ThemeContext';
import { useI18n, LANG_CODES } from '../context/LanguageContext';
import { supabase } from '../../src/lib/supabase'; // On importe le client Supabase pour la déconnexion

// 2. Définition des props
// Le composant reçoit maintenant la 'session' en plus du reste.
type ProfileScreenProps = {
  session: Session;
  reports: Report[];
  onClearAllReports: () => void;
};

// 3. Le composant ProfileScreen
export default function ProfileScreen({ session, reports, onClearAllReports }: ProfileScreenProps) {
  // --- HOOKS DE CONTEXTE ---
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { lang, setLang, t } = useI18n();

  // --- CALCUL DES STATISTIQUES ---
  const totalReports = reports.length;

  // --- GESTIONNAIRES D'ACTIONS ---

  const handleClearPress = () => {
    Alert.alert(t.alert_DeleteAllTitle, t.alert_DeleteAllMessage, [
      { text: t.alert_Cancel, style: "cancel" },
      { text: t.alert_ConfirmDeleteAll, onPress: onClearAllReports, style: "destructive" },
    ]);
  };

  // NOUVELLE FONCTION : Déconnexion
  const handleSignOut = async () => {
    setLoading(true); // On pourrait ajouter un état de chargement
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Erreur", error.message);
    }
    // Si la déconnexion réussit, l'écouteur 'onAuthStateChange' dans App.tsx
    // mettra automatiquement la session à 'null', ce qui affichera l'AuthNavigator.
    setLoading(false);
  };
  const [loading, setLoading] = useState(false); // État pour la déconnexion

  // 4. Définition des styles dynamiques
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    section: { backgroundColor: colors.card, marginHorizontal: 15, marginTop: 20, padding: 20, borderRadius: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: colors.text },
    userInfoContainer: { alignItems: 'center', marginBottom: 10 },
    userEmail: { fontSize: 16, color: colors.subtext },
    langSelectorContainer: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.primary },
    langButton: { flex: 1, padding: 10, backgroundColor: 'transparent', alignItems: 'center' },
    langButtonSelected: { backgroundColor: colors.primary },
    langButtonText: { color: colors.primary, fontWeight: 'bold' },
    langButtonTextSelected: { color: 'white' },
    themeToggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    themeToggleText: { fontSize: 16, color: colors.text },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 48, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: 16, color: colors.subtext },
    aboutText: { fontSize: 15, lineHeight: 22, color: colors.subtext, marginBottom: 10 },
    dangerZone: { borderColor: '#e94e77', borderWidth: 1 },
  });

  // 5. Le rendu du composant
  return (
    <ScrollView style={styles.container}>
      {/* --- NOUVEAU : Section Utilisateur --- */}
      {session && session.user && ( // On ajoute cette vérification !
        <View style={styles.section}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userEmail}>{session.user.email}</Text>
          </View>
          <Button
            title="Se déconnecter"
            onPress={handleSignOut}
            color={colors.primary}
            disabled={loading}
          />
        </View>
      )}

      {/* --- Section Langue --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Langue / Lang</Text>
        <View style={styles.langSelectorContainer}>
          {(LANG_CODES as Array<'fr' | 'cr'>).map(code => (
            <TouchableOpacity key={code} style={[styles.langButton, lang === code && styles.langButtonSelected]} onPress={() => setLang(code)}>
              <Text style={[styles.langButtonText, lang === code && styles.langButtonTextSelected]}>{code.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* --- Section Apparence --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.appearanceTitle}</Text>
        <View style={styles.themeToggleContainer}>
          <Text style={styles.themeToggleText}>{t.darkThemeLabel}</Text>
          <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={isDarkMode ? colors.primary : "#f4f3f4"} onValueChange={toggleTheme} value={isDarkMode} />
        </View>
      </View>

      {/* --- Section Statistiques --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.statsTitle}</Text>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalReports}</Text>
          <Text style={styles.statLabel}>{t.totalReports}</Text>
        </View>
      </View>

      {/* --- Section À Propos --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.aboutTitle}</Text>
        <Text style={styles.aboutText}>{t.aboutText}</Text>
      </View>

      {/* --- Section Zone de Danger --- */}
      <View style={[styles.section, styles.dangerZone]}>
        <Text style={[styles.sectionTitle, { color: '#e94e77' }]}>{t.dangerZoneTitle}</Text>
        <Button title={t.clearAllButton} color="#e94e77" onPress={handleClearPress} />
      </View>
    </ScrollView>
  );
}
