// context/LanguageContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fr } from '../../locales/fr';
import { cr } from '../../locales/cr';

// 1. Définir les langues disponibles
export const LANGUAGES = { fr, cr };
export const LANG_CODES = Object.keys(LANGUAGES); // ['fr', 'cr']

// 2. Définir le type du contexte
type LanguageContextType = {
    lang: 'fr' | 'cr';
    setLang: (lang: 'fr' | 'cr') => void;
    t: typeof fr; // 't' sera un objet contenant toutes nos traductions
};

// 3. Créer le contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 4. Créer le Provider
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<'fr' | 'cr'>('fr'); // Français par défaut

    // Charger la langue sauvegardée au démarrage
    useEffect(() => { 
        const loadLang = async () => {
            const savedLang = await AsyncStorage.getItem('@lang');
            if (savedLang && (savedLang === 'fr' || savedLang === 'cr')) {
                setLang(savedLang);
            }
        };
        loadLang();
    }, []);

    const setLanguage = (newLang: 'fr' | 'cr') => {
        setLang(newLang);
        AsyncStorage.setItem('@lang', newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: setLanguage, t: LANGUAGES[lang] }}>
            {children}
        </LanguageContext.Provider>
    );
};

// 5. Créer le Hook personnalisé
export const useI18n = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within a LanguageProvider');
    }
    return context;
};
