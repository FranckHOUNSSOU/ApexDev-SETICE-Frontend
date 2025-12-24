// src/types/promotion.ts

export interface Promotion {
  id: number;
  nomPromotion: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  anneeDebut: string;
  anneeFin: string;
  filiere: string;
  option: string;
  specialite: string;
  statut: 'Active' | 'Archivée';
  nombreEtudiants: number;
}

export interface PromotionFormData {
  nomPromotion: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  anneeDebut: string;
  anneeFin: string;
  filiere: string;
  option: string;
  specialite: string;
  statut: 'Active' | 'Archivée';
  nombreEtudiants: number;
}

export interface FilterOptions {
  nomPromotion: string;
  annee: string;
  filiere: string;
  statut: string;
  sortBy: string;
}