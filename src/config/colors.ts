// src/config/colors.ts

// On définit une interface pour s'assurer que les deux thèmes
// ont bien les mêmes propriétés. TypeScript nous préviendra si on en oublie une.
export interface ColorPalette {
    primary: string;
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    success: string;
    error: string;
}

// --- THÈME CLAIR ---
export const lightColors: ColorPalette = {
    primary: '#007AFF',      // Un bleu vif standard
    background: '#F2F2F7',  // Un gris très clair, presque blanc
    card: '#FFFFFF',         // Les cartes (comme les items de liste) sont blanches
    text: '#000000',          // Texte noir
    subtext: '#6E6E73',      // Texte secondaire en gris
    border: '#D1D1D6',       // Bordures légères
    success: '#34C759',      // Vert pour les succès
    error: '#FF3B30',        // Rouge pour les erreurs
};

// --- THÈME SOMBRE ---
export const darkColors: ColorPalette = {
    primary: '#0A84FF',      // Un bleu un peu plus clair pour mieux contraster sur fond sombre
    background: '#000000',  // Fond noir pur (idéal pour les écrans OLED)
    card: '#1C1C1E',         // Cartes en gris très foncé
    text: '#FFFFFF',         // Texte blanc
    subtext: '#8E8E93',      // Texte secondaire en gris clair
    border: '#38383A',       // Bordures subtiles
    success: '#30D158',      // Vert vif
    error: '#FF453A',        // Rouge vif
};
