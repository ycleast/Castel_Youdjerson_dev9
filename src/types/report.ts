// Créer un nouveau fichier src/types/report.ts
export interface Report {
  id: string; // L'identifiant unique du document Firestore
  description: string;
  category: 'road' | 'water' | 'security' | 'other'; // Les catégories que nous avons définies
  imageUrl: string;
  lat: number;
  lon: number;
  // Firestore stocke la date sous forme de Timestamp
  createdAt: {
    seconds: number;
    nanoseconds: number;
  }; 
}
