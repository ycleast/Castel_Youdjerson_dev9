// screens/Auth/AddReportScreen.tsx
// Gère la création et la modification d'un signalement, avec ajout de photo optionnel.

// 1. Importations
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Librairie pour la caméra/galerie
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// Importations locales
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/LanguageContext';
import { Report, Category, CATEGORIES, CATEGORY_ICONS } from '../../config/types';

// 2. Définition des props
type AddReportScreenProps = {
  navigation: any;
  route: any;
  onAddReport: (description: string, category: Category, imageUrl: string | null) => void;
  onUpdateReport: (report: Report) => void;
};

// 3. Le composant
export default function AddReportScreen({ navigation, route, onAddReport, onUpdateReport }: AddReportScreenProps) {
  // --- HOOKS DE CONTEXTE ---
  const { colors } = useTheme();
  const { t } = useI18n();

  // --- ÉTATS LOCAUX ---
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Autre');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null); // Pour l'objet image sélectionné
  const [isEditing, setIsEditing] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const { width, height } = useWindowDimensions();

  // 3. Déterminer l'orientation actuelle
  const isPortrait = height > width;

  // --- GESTION DU CYCLE DE VIE ---
  // Effet pour pré-remplir le formulaire en mode édition
  useEffect(() => {
    const reportToEdit = route.params?.reportToEdit;
    if (reportToEdit) {
      setIsEditing(reportToEdit);
      setDescription(reportToEdit.description);
      setCategory(reportToEdit.category);
      // Note : On ne pré-charge pas l'image pour l'instant pour garder les choses simples.
    } else {
      // S'assure que le formulaire est vide quand on n'est pas en mode édition
      resetForm();
    }
  }, [route.params?.reportToEdit]);

  // --- FONCTIONS UTILITAIRES ---
  const resetForm = () => {
    setDescription('');
    setCategory('Autre');
    setImage(null);
    setIsEditing(null);
    // On efface les paramètres de navigation pour éviter de rester en mode édition
    navigation.setParams({ reportToEdit: undefined });
  };

  // --- GESTIONNAIRES D'ACTIONS ---

  // Ouvre la galerie pour choisir une image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "L'application a besoin d'accès à la galerie pour sélectionner une image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Erreur', 'La description est requise.');
      return;
    }
    setLoading(true);

    let location: Location.LocationObject | null = null;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "Permission de localisation refusée.");
      } else {
        location = await Location.getCurrentPositionAsync({});
      }
    } catch (error) {
      console.warn("Impossible de récupérer la position:", error);
    }

    let imageUrl: string | null = null;

    // --- LOGIQUE D'UPLOAD DE L'IMAGE ---
    if (image) {
      try {
        const fileExt = image.uri.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        // Supabase JS v2 requiert un objet FormData pour l'upload depuis React Native
        const formData = new FormData();
        formData.append('file', {
          uri: image.uri,
          name: fileName,
          type: image.type ? `image/${fileExt}` : `image/jpeg`,
        } as any);

        const { error: uploadError } = await supabase.storage
          .from('report-images') // Le nom de notre bucket
          .upload(filePath, formData);

        if (uploadError) throw uploadError;

        // Si l'upload réussit, on récupère l'URL publique
        const { data } = supabase.storage.from('report-images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;

      } catch (error: any) {
        Alert.alert("Erreur d'upload", error.message);
        setLoading(false);
        return;
      }
    }

    // --- APPEL À LA FONCTION PARENTE (DANS App.tsx) ---
    if (isEditing) {
      // La logique de mise à jour devrait aussi gérer le changement d'image
      onUpdateReport({ ...isEditing, description, category });
    } else {
      // onAddReport attend uniquement (description, category, imageUrl)
      onAddReport(description, category, imageUrl);
    }

    setLoading(false);
    Alert.alert('Succès', 'Le signalement a été envoyé.');
    resetForm();
    navigation.navigate(t.homeTab); // Redirige vers l'accueil
  };

  // --- STYLES ---
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContainer: { padding: 20 },
    label: { fontSize: 18, fontWeight: '500', color: colors.text, marginBottom: 10 },
    input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 15, fontSize: 16, marginBottom: 20, color: colors.text, minHeight: 100, textAlignVertical: 'top' },
    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    categoryButton: { backgroundColor: colors.border, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
    categoryButtonSelected: { backgroundColor: colors.primary },
    categoryButtonText: { color: colors.subtext, fontWeight: '500', marginLeft: 5 },
    categoryButtonTextSelected: { color: 'white' },
    imagePreviewContainer: { alignItems: 'center', marginVertical: 20 },
    imagePreview: {
      width: '100%',
      // On rend la hauteur de l'aperçu dynamique
      height: isPortrait ? 200 : 250, // Un peu plus haute en paysage
      borderRadius: 8,
    },
    buttonContainer: { marginTop: 20 },
    formContainer: {
      flexDirection: isPortrait ? 'column' : 'row', // Colonne en portrait, ligne en paysage
    },
    leftColumn: {
      flex: 1,
      marginRight: isPortrait ? 0 : 10,
    },
    rightColumn: {
      flex: 1,
      marginLeft: isPortrait ? 0 : 10,
    }
  });

  // --- LE RENDU ---
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {isPortrait ? (
        <>
          <Text style={styles.label}>{isEditing ? t.editReportTitle : t.addReportTitle}</Text>

          {/* Champ de description */}
          <TextInput style={styles.input} placeholder={t.descriptionLabel} placeholderTextColor={colors.subtext} value={description} onChangeText={setDescription} multiline />

          {/* Sélecteur de catégorie */}
          <Text style={styles.label}>{t.categoryLabel}</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} style={[styles.categoryButton, category === cat && styles.categoryButtonSelected]} onPress={() => setCategory(cat)}>
                <Ionicons name={CATEGORY_ICONS[cat]} size={16} color={category === cat ? 'white' : colors.subtext} />
                <Text style={[styles.categoryButtonText, category === cat && styles.categoryButtonTextSelected]}>{t[cat]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sélecteur d'image */}
          <Text style={styles.label}>{'Photo'}</Text>
          <Button title={'Choisir une photo'} onPress={pickImage} color={colors.primary} />
          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <Button title={'Supprimer la photo'} onPress={() => setImage(null)} color="#e94e77" />
            </View>
          )}


        </>
      ) : (
        <View style={styles.formContainer}>
          {/* Colonne de gauche avec le texte et la catégorie */}
          <View style={styles.leftColumn}>
            <Text style={styles.label}>{isEditing ? t.editReportTitle : t.addReportTitle}</Text>

            {/* Champ de description */}
            <TextInput style={styles.input} placeholder={t.descriptionLabel} placeholderTextColor={colors.subtext} value={description} onChangeText={setDescription} multiline />

            {/* Sélecteur de catégorie */}
            <Text style={styles.label}>{t.categoryLabel}</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity key={cat} style={[styles.categoryButton, category === cat && styles.categoryButtonSelected]} onPress={() => setCategory(cat)}>
                  <Ionicons name={CATEGORY_ICONS[cat]} size={16} color={category === cat ? 'white' : colors.subtext} />
                  <Text style={[styles.categoryButtonText, category === cat && styles.categoryButtonTextSelected]}>{t[cat]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.label}>{'Photo'}</Text>
            <Button title={'Choisir une photo'} onPress={pickImage} color={colors.primary} />
            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <Button title={'Supprimer la photo'} onPress={() => setImage(null)} color="#e94e77" />
              </View>
            )}
          </View>
        </View>
      )}
      {/* Bouton de soumission */}
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Button title={isEditing ? t.updateButton : t.submitButton} onPress={handleSubmit} color={colors.primary} />
        )}
      </View>
    </ScrollView>
  );
}
