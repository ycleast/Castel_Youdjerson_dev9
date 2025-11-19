// screens/HomeScreen.tsx
// Affiche la liste des signalements avec filtres, recherche et animations avancées.

// 1. Importations
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable'; // Librairie d'animation
import { Ionicons } from '@expo/vector-icons';

// Importations locales
import { Report, Category, CATEGORIES, CATEGORY_ICONS } from '../config/types';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/LanguageContext';

// 2. Définition des types
type HomeScreenProps = {
  navigation: any;
  reports: Report[];
  onDeleteReport: (id: string) => void;
};

// Type pour nos références Animatable, pour un typage plus sûr
type AnimatableRef = any;

// 3. Le composant HomeScreen
export default function HomeScreen({ navigation, reports, onDeleteReport }: HomeScreenProps) {
  // --- HOOKS DE CONTEXTE ---
  const { colors } = useTheme();
  const { t } = useI18n();

  // --- ÉTATS LOCAUX ---
  const [activeFilter, setActiveFilter] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- RÉFÉRENCES POUR LES ANIMATIONS ---
  const filterRefs = useRef<{ [key: string]: AnimatableRef | null }>({});
  const reportItemRefs = useRef<{ [key: string]: AnimatableRef | null }>({});

  // --- GESTIONNAIRES D'ACTIONS ---

  // Gère le clic sur un bouton de filtre avec animation
  const handleFilterPress = (filter: Category | null) => {
    setActiveFilter(filter);
    const refKey = filter === null ? 'Tous' : filter;
    if (filterRefs.current[refKey]) {
      filterRefs.current[refKey]?.pulse(800);
    }
  };

  // Gère la suppression d'un item avec une animation de sortie
  const handleDeletePress = (id: string) => {
    if (reportItemRefs.current[id]) {
      reportItemRefs.current[id]
        ?.fadeOutLeft(500)
        .then(() => {
          onDeleteReport(id);
        });
    } else {
      onDeleteReport(id);
    }
  };

  // --- DONNÉE DÉRIVÉE : LA LISTE FILTRÉE ---
  const filteredReports = reports
    .filter(report => activeFilter ? report.category === activeFilter : true)
    .filter(report => report.description.toLowerCase().includes(searchQuery.toLowerCase()));

  // 4. Définition des styles dynamiques (le StyleSheet est dans le composant pour accéder à `colors`)
  const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: colors.background },
    searchContainer: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
    searchInput: { backgroundColor: colors.background, borderRadius: 10, padding: 10, fontSize: 16, color: colors.text },
    filterContainer: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: colors.card },
    filterButton: { backgroundColor: colors.border, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, flexDirection: 'row', alignItems: 'center' },
    filterButtonSelected: { backgroundColor: colors.primary },
    filterButtonText: { color: colors.subtext, fontWeight: '500', marginLeft: 5 },
    filterButtonTextSelected: { color: 'white' },
    reportItemContainer: { backgroundColor: colors.card, paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    reportDetails: { flex: 1, marginRight: 10 },
    categoryBadge: { backgroundColor: colors.background, borderRadius: 5, paddingVertical: 3, paddingHorizontal: 8, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
    categoryBadgeText: { fontSize: 12, fontWeight: 'bold', color: colors.subtext, marginLeft: 5 },
    reportText: { fontSize: 16, color: colors.text, marginTop: 8 },
    // --- NOUVEAU STYLE POUR L'IMAGE ---
    reportImage: { width: '100%', height: 200, borderRadius: 8, marginTop: 10 },
    buttonsContainer: { flexDirection: 'row' },
    editButton: { backgroundColor: colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
    deleteButton: { backgroundColor: '#e94e77', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    emptyContainer: { marginTop: 100, alignItems: 'center', paddingHorizontal: 20 },
    emptyText: { fontSize: 16, color: colors.subtext, textAlign: 'center' },
  });

  // 5. Le rendu du composant
  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Barre de filtres */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          <TouchableOpacity onPress={() => handleFilterPress(null)}>
            <Animatable.View ref={ref => (filterRefs.current['Tous'] = ref as AnimatableRef)} style={[styles.filterButton, activeFilter === null && styles.filterButtonSelected]}>
              <Text style={[styles.filterButtonText, { marginLeft: 0 }, activeFilter === null && styles.filterButtonTextSelected]}>{t.allFilter}</Text>
            </Animatable.View>
          </TouchableOpacity>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} onPress={() => handleFilterPress(cat)}>
              <Animatable.View ref={ref => (filterRefs.current[cat] = ref as AnimatableRef)} style={[styles.filterButton, activeFilter === cat && styles.filterButtonSelected]}>
                <Ionicons name={CATEGORY_ICONS[cat]} size={16} color={activeFilter === cat ? 'white' : colors.subtext} />
                <Text style={[styles.filterButtonText, activeFilter === cat && styles.filterButtonTextSelected]}>{t[cat]}</Text>
              </Animatable.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder={t.searchPlaceholder} placeholderTextColor={colors.subtext} value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {/* Liste des résultats */}
      <FlatList
        data={filteredReports}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <Animatable.View ref={ref => (reportItemRefs.current[item.id] = ref as AnimatableRef)} animation="fadeInUp" duration={500} delay={index * 50} style={styles.reportItemContainer}>
            <View style={styles.reportDetails}>
              <Animatable.View animation="zoomIn" duration={300} delay={200} style={styles.categoryBadge}>
                <Ionicons name={CATEGORY_ICONS[item.category]} size={14} color={colors.subtext} />
                <Text style={styles.categoryBadgeText}>{t[item.category]}</Text>
              </Animatable.View>
              {(item as any).image_url && (
                <Image
                  source={{ uri: (item as any).image_url }}
                  style={styles.reportImage}
                  resizeMode="cover" // Assure que l'image couvre bien la zone
                />
              )}
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate(t.addReportTab, { reportToEdit: item })}>
                <Text style={styles.buttonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePress(item.id)}>
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t.emptyList}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
