// src/services/promotionService.ts
import * as XLSX from 'xlsx';
import type { Promotion } from '../types/promotion';

export const promotionService = {
  getInitialPromotions(): Promotion[] {
    return [
      { 
        id: 1, 
        nomPromotion: 'L1', 
        anneeDebut: '2023', 
        anneeFin: '2024', 
        filiere: 'Informatique', 
        option: 'Développement Web', 
        specialite: 'Frontend React', 
        statut: 'Active', 
        nombreEtudiants: 45 
      },
      { 
        id: 2, 
        nomPromotion: 'L2', 
        anneeDebut: '2023', 
        anneeFin: '2024', 
        filiere: 'Informatique', 
        option: 'Data Science', 
        specialite: 'Machine Learning', 
        statut: 'Active', 
        nombreEtudiants: 38 
      },
      { 
        id: 3, 
        nomPromotion: 'L3', 
        anneeDebut: '2022', 
        anneeFin: '2023', 
        filiere: 'Gestion', 
        option: 'Comptabilité', 
        specialite: 'Audit Financier', 
        statut: 'Archivée', 
        nombreEtudiants: 52 
      },
      { 
        id: 4, 
        nomPromotion: 'M1', 
        anneeDebut: '2023', 
        anneeFin: '2024', 
        filiere: 'Marketing', 
        option: 'Digital Marketing', 
        specialite: 'SEO/SEM', 
        statut: 'Active', 
        nombreEtudiants: 30 
      },
      { 
        id: 5, 
        nomPromotion: 'M2', 
        anneeDebut: '2023', 
        anneeFin: '2024', 
        filiere: 'Finance', 
        option: 'Analyse Financière', 
        specialite: 'Trading & Investment', 
        statut: 'Active', 
        nombreEtudiants: 25 
      },
      { 
        id: 6, 
        nomPromotion: 'L1', 
        anneeDebut: '2024', 
        anneeFin: '2025', 
        filiere: 'Design', 
        option: 'UI/UX Design', 
        specialite: 'Design Thinking', 
        statut: 'Active', 
        nombreEtudiants: 28 
      },
      { 
        id: 7, 
        nomPromotion: 'M1', 
        anneeDebut: '2024', 
        anneeFin: '2025', 
        filiere: 'Informatique', 
        option: 'Cybersécurité', 
        specialite: 'Ethical Hacking', 
        statut: 'Active', 
        nombreEtudiants: 22 
      },
    ];
  },

  getFilieresInitiales(): string[] {
    return [
      'Informatique', 
      'Gestion', 
      'Marketing', 
      'Finance', 
      'Design', 
      'RH', 
      'Commerce',
      'Droit'
    ];
  },

  getOptionsInitiales(): string[] {
    return [
      'Développement Web',
      'Data Science',
      'Cybersécurité',
      'Intelligence Artificielle',
      'Comptabilité',
      'Management',
      'Digital Marketing',
      'Communication',
      'Analyse Financière',
      'Banque',
      'UI/UX Design',
      'Graphisme',
      'Gestion des Ressources Humaines',
    ];
  },

  exportToXLSX(promotions: Promotion[], filename: string = 'promotions.xlsx'): void {
    try {
      const dataForExport = promotions.map(p => ({
        'Nom Promotion': p.nomPromotion,
        'Année Début': p.anneeDebut,
        'Année Fin': p.anneeFin,
        'Année Académique': `${p.anneeDebut}-${p.anneeFin}`,
        'Filière': p.filiere,
        'Option': p.option,
        'Spécialité': p.specialite,
        'Nombre Étudiants': p.nombreEtudiants,
        'Statut': p.statut
      }));

      const ws = XLSX.utils.json_to_sheet(dataForExport);
      
      // Largeur des colonnes
      ws['!cols'] = [
        { wch: 15 },  // Nom Promotion
        { wch: 12 },  // Année Début
        { wch: 12 },  // Année Fin
        { wch: 18 },  // Année Académique
        { wch: 20 },  // Filière
        { wch: 25 },  // Option
        { wch: 25 },  // Spécialité
        { wch: 18 },  // Nombre Étudiants
        { wch: 12 },  // Statut
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Promotions');
      
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Erreur lors de l\'export XLSX:', error);
      throw error;
    }
  },

  filterPromotions(
    promotions: Promotion[],
    searchTerm: string,
    nomPromotionFilter: string,
    filiereFilter: string,
    anneeFilter: string,
    statutFilter: string
  ): Promotion[] {
    let filtered = [...promotions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nomPromotion.toLowerCase().includes(searchLower) ||
        p.filiere.toLowerCase().includes(searchLower) ||
        p.option.toLowerCase().includes(searchLower) ||
        p.specialite.toLowerCase().includes(searchLower) ||
        `${p.anneeDebut}-${p.anneeFin}`.includes(searchLower)
      );
    }

    if (nomPromotionFilter && nomPromotionFilter !== 'Toutes') {
      filtered = filtered.filter(p => p.nomPromotion === nomPromotionFilter);
    }

    if (filiereFilter && filiereFilter !== 'Toutes') {
      filtered = filtered.filter(p => p.filiere === filiereFilter);
    }

    if (anneeFilter && anneeFilter !== 'Toutes') {
      filtered = filtered.filter(p => `${p.anneeDebut}-${p.anneeFin}` === anneeFilter);
    }

    if (statutFilter && statutFilter !== 'Tous') {
      filtered = filtered.filter(p => p.statut === statutFilter);
    }

    return filtered;
  },

  sortPromotions(promotions: Promotion[], sortBy: string): Promotion[] {
    const sorted = [...promotions];

    switch (sortBy) {
      case 'Nom (A-Z)':
        return sorted.sort((a, b) => a.nomPromotion.localeCompare(b.nomPromotion));
      case 'Nom (Z-A)':
        return sorted.sort((a, b) => b.nomPromotion.localeCompare(a.nomPromotion));
      case 'Année (récent)':
        return sorted.sort((a, b) => {
          const aYear = parseInt(a.anneeDebut);
          const bYear = parseInt(b.anneeDebut);
          return bYear - aYear;
        });
      case 'Année (ancien)':
        return sorted.sort((a, b) => {
          const aYear = parseInt(a.anneeDebut);
          const bYear = parseInt(b.anneeDebut);
          return aYear - bYear;
        });
      case 'Filière (A-Z)':
        return sorted.sort((a, b) => a.filiere.localeCompare(b.filiere));
      case 'Étudiants (↑)':
        return sorted.sort((a, b) => a.nombreEtudiants - b.nombreEtudiants);
      case 'Étudiants (↓)':
        return sorted.sort((a, b) => b.nombreEtudiants - a.nombreEtudiants);
      default:
        return sorted;
    }
  },

  getUniqueAnnees(promotions: Promotion[]): string[] {
    const annees = promotions.map(p => `${p.anneeDebut}-${p.anneeFin}`);
    return ['Toutes', ...Array.from(new Set(annees)).sort((a, b) => {
      if (a === 'Toutes') return -1;
      if (b === 'Toutes') return 1;
      return b.localeCompare(a);
    })];
  }
};