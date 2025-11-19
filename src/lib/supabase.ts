import 'react-native-url-polyfill/auto'; // Polyfill nécessaire pour Supabase
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Remplace ces valeurs par les tiennes !
const supabaseUrl = "https://mbpvrviixvnnnziagduy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icHZydmlpeHZubm56aWFnZHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTk1ODQsImV4cCI6MjA3ODQzNTU4NH0.EIeoeIhnbAngWT2ux5Gnn_aCQrVKfbrt1B0Rstc8v7U";

// createClient est la fonction qui nous connecte à notre projet Supabase.
// Le troisième argument est crucial pour React Native : il dit à Supabase
// d'utiliser AsyncStorage pour stocker les informations de session de l'utilisateur (comme le JWT ).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
