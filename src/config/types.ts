// src/config/types.ts
// Ce fichier contient toutes les définitions de types et les constantes
// partagées à travers l'application pour éviter les cycles d'importation.

import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// 1. Définition des catégories
export const CATEGORIES = ["Route", "Électricité", "Eau", "Déchets", "Autre"] as const;
export type Category = typeof CATEGORIES[number];

// 2. Définition du type Report
export type Report = {
    id: string;
    description: string;
    category: Category;
    latitude?: number;
    longitude?: number;
    // Si on ajoute la carte, la location ira ici aussi
    // location?: { latitude: number; longitude: number; };
};

// 3. Mapping des icônes de catégories
export const CATEGORY_ICONS: { [key in Category]: React.ComponentProps<typeof Ionicons>['name'] } = {
    Route: 'car-sport-outline',
    Électricité: 'flash-outline',
    Eau: 'water-outline',
    Déchets: 'trash-bin-outline',
    Autre: 'help-circle-outline',
};
