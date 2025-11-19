import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps';
import { Report } from '../config/types';
import { useTheme } from '../context/ThemeContext';

type MapScreenProps = {
  reports: Report[];
};

const INITIAL_REGION = {
  latitude: 19.0,
  longitude: -72.4,
  latitudeDelta: 2.5, // Le "zoom" initial sur la latitude
  longitudeDelta: 2.5, // Le "zoom" initial sur la longitude
};

// ... (INITIAL_REGION reste le même)

// --- CONFIGURATION MAPBOX (VERSION SIMPLIFIÉE) ---

// 1. Colle ta clé d'API publique ici (celle que tu as déjà)
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoieW91ZHNvbiIsImEiOiJjbWk2NG9kd2EybGY1MmtvZjIwc3JpbzUyIn0.zRLq24IkvGSAM-AmdVrQyQ"; 

// 2. Choisis un ID de style directement dans cette liste. Pas besoin d'aller sur le site.
const MAPBOX_STYLE_ID = "mapbox/streets-v12"; // Style standard, parfait pour commencer.

// 3. L'URL se construit automatiquement. Tu n'as rien à toucher ici.
const MAPBOX_TILE_URL = `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;

export default function MapScreen({ reports }: MapScreenProps ) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
      >
        <UrlTile
          urlTemplate={MAPBOX_TILE_URL}
          maximumZ={19}
        />
        {/* Le reste du code pour les marqueurs ne change pas */}
        {reports.map(report => (
          (report.latitude && report.longitude) && (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              pinColor={colors.primary}
            >
              <Callout tooltip>
                <View style={[styles.calloutView, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.calloutTitle, { color: colors.text }]}>{report.category}</Text>
                  <Text style={{ color: colors.subtext }}>{report.description}</Text>
                </View>
              </Callout>
            </Marker>
          )
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calloutView: {
    padding: 10,
    width: 200,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
