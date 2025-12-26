// src/components/pages/Etudiant/Etudiant.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { TableColumn } from 'react-data-table-component';
import DataTable from 'react-data-table-component';
import {
  Card, Button, Badge, Alert, Modal, Form, InputGroup,
  OverlayTrigger, Popover
} from 'react-bootstrap';

// ============================================================================
// Types et Interfaces
export interface Promotion {
  id: number;
  anneeAcademique: string;
  filiere: string;
  option: string;
  dateCreation: string;
  statut: 'Active' | 'Archivée';
}

export interface PromotionFormData {
  anneeAcademique: string;
  filiere: string;
  option: string;
  statut: 'Active' | 'Archivée';
}

export interface FilterOptions {
  filiere: string;
  annee: string;
  statut: string;
  sortBy: string;
}

// ============================================================================
// Service de données
export const promotionService = {
  getInitialPromotions(): Promotion[] {
    return [
      { id: 1, anneeAcademique: '2023-2024', filiere: 'Informatique', option: 'Développement Web', dateCreation: '2023-09-01', statut: 'Active' },
      { id: 2, anneeAcademique: '2023-2024', filiere: 'Informatique', option: 'Data Science', dateCreation: '2023-09-01', statut: 'Active' },
      { id: 3, anneeAcademique: '2022-2023', filiere: 'Gestion', option: 'Comptabilité', dateCreation: '2022-09-01', statut: 'Archivée' },
      { id: 4, anneeAcademique: '2023-2024', filiere: 'Marketing', option: 'Digital Marketing', dateCreation: '2023-09-01', statut: 'Active' },
      { id: 5, anneeAcademique: '2022-2023', filiere: 'Informatique', option: 'Réseaux', dateCreation: '2022-09-01', statut: 'Archivée' },
      { id: 6, anneeAcademique: '2024-2025', filiere: 'Design', option: 'UI/UX', dateCreation: '2024-01-15', statut: 'Active' },
      { id: 7, anneeAcademique: '2023-2024', filiere: 'Finance', option: 'Analyse Financière', dateCreation: '2023-09-01', statut: 'Active' },
      { id: 8, anneeAcademique: '2022-2023', filiere: 'Marketing', option: 'Communication', dateCreation: '2022-09-01', statut: 'Archivée' },
      { id: 9, anneeAcademique: '2024-2025', filiere: 'Informatique', option: 'Intelligence Artificielle', dateCreation: '2024-01-20', statut: 'Active' },
      { id: 10, anneeAcademique: '2023-2024', filiere: 'RH', option: 'Gestion des Talents', dateCreation: '2023-09-01', statut: 'Active' },
    ];
  },

  getAnneesOptions(): string[] {
    return ['Toutes', '2024-2025', '2023-2024', '2022-2023', '2021-2022'];
  },

  getFilieresOptions(): string[] {
    return ['Toutes', 'Informatique', 'Gestion', 'Marketing', 'Finance', 'Design', 'RH'];
  },

  filterPromotions(
    promotions: Promotion[], 
    searchTerm: string,
    filiereFilter: string,
    statutFilter: string,
    anneeFilter: string
  ): Promotion[] {
    let filtered = [...promotions];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.filiere.toLowerCase().includes(searchLower) ||
        p.option.toLowerCase().includes(searchLower) ||
        p.anneeAcademique.toLowerCase().includes(searchLower)
      );
    }
    
    if (filiereFilter && filiereFilter !== 'Toutes') {
      filtered = filtered.filter(p => p.filiere === filiereFilter);
    }
    
    if (statutFilter && statutFilter !== 'Tous') {
      filtered = filtered.filter(p => p.statut === statutFilter);
    }
    
    if (anneeFilter && anneeFilter !== 'Toutes') {
      filtered = filtered.filter(p => p.anneeAcademique === anneeFilter);
    }
    
    return filtered;
  },

  generateCSV(promotions: Promotion[]): string {
    const headers = 'ID,Année Académique,Filière,Option,Date Création,Statut\n';
    const rows = promotions.map(p => 
      `${p.id},${p.anneeAcademique},${p.filiere},${p.option},${p.dateCreation},${p.statut}`
    ).join('\n');
    return headers + rows;
  },

  sortPromotions(promotions: Promotion[], sortBy: string): Promotion[] {
    const sorted = [...promotions];
    
    switch (sortBy) {
      case 'Date création (récent)':
        return sorted.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
      case 'Date création (ancien)':
        return sorted.sort((a, b) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
      case 'Année académique':
        return sorted.sort((a, b) => b.anneeAcademique.localeCompare(a.anneeAcademique));
      case 'Filière (A-Z)':
        return sorted.sort((a, b) => a.filiere.localeCompare(b.filiere));
      default:
        return sorted;
    }
  }
};

// ============================================================================
// Composant ActionButtons
interface ActionButtonsProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  promotion,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const [showActions, setShowActions] = useState(false);

  const actions = [
    {
      label: 'Voir',
      icon: 'bi-eye-fill',
      onClick: () => onViewDetails(promotion.id),
      variant: 'light'
    },
    {
      label: 'Modifier',
      icon: 'bi-pencil-fill',
      onClick: () => {
        onEdit(promotion);
        setShowActions(false);
      },
      variant: 'light'
    },
    {
      label: 'Supprimer',
      icon: 'bi-trash-fill',
      onClick: () => {
        onDelete(promotion.id);
        setShowActions(false);
      },
      variant: 'danger'
    }
  ];

  return (
    <div className="position-relative">
      <OverlayTrigger
        trigger="click"
        placement="left"
        show={showActions}
        onToggle={setShowActions}
        overlay={
          <Popover className="border-0 shadow-sm" style={{ minWidth: '150px' }}>
            <Popover.Body className="p-0">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={`d-block w-100 text-start border-0 rounded-0 px-3 py-2 ${
                    action.variant === 'danger' ? 'text-danger' : 'text-dark'
                  }`}
                  style={{ 
                    background: 'transparent',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={action.onClick}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <i className={`bi ${action.icon} me-2`}></i>
                  {action.label}
                </button>
              ))}
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          variant="outline-secondary"
          size="sm"
          className="border-0 bg-transparent"
          style={{ minWidth: '40px' }}
        >
          <i className="bi bi-three-dots-vertical"></i>
        </Button>
      </OverlayTrigger>
    </div>
  );
};

// ============================================================================
// Composant PromotionModal
interface PromotionModalProps {
  show: boolean;
  promotion: Promotion | null;
  onHide: () => void;
  onSubmit: (data: PromotionFormData) => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({
  show,
  promotion,
  onHide,
  onSubmit
}) => {
  const [formData, setFormData] = useState<PromotionFormData>({
    anneeAcademique: '',
    filiere: '',
    option: '',
    statut: 'Active'
  });

  const isEditing = !!promotion;

  useEffect(() => {
    if (promotion) {
      const { id, dateCreation, ...rest } = promotion;
      setFormData(rest);
    } else {
      setFormData({
        anneeAcademique: '',
        filiere: '',
        option: '',
        statut: 'Active'
      });
    }
  }, [promotion]);

  const handleChange = useCallback((field: keyof PromotionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(formData);
    onHide();
  }, [formData, onSubmit, onHide]);

  const isFormValid = useMemo(() => {
    return formData.anneeAcademique.trim() !== '' &&
           formData.filiere.trim() !== '' &&
           formData.option.trim() !== '';
  }, [formData]);

  const filiereOptions = [
    'Informatique', 'Gestion', 'Marketing', 'Finance', 
    'Design', 'RH', 'SIL', 'SI'
  ];

  const anneeOptions = [
    '2024-2025', '2023-2024', '2022-2023', '2021-2022'
  ];

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="h5">
          <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-folder-plus'} me-2`}></i>
          {isEditing ? 'Modifier la promotion' : 'Nouvelle promotion'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group controlId="anneeAcademique">
                <Form.Label className="fw-semibold">
                  Année Académique <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.anneeAcademique}
                  onChange={(e) => handleChange('anneeAcademique', e.target.value)}
                  className="form-control-lg"
                  required
                >
                  <option value="">Sélectionner une année</option>
                  {anneeOptions.map(annee => (
                    <option key={annee} value={annee}>{annee}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="filiere">
                <Form.Label className="fw-semibold">
                  Filière <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.filiere}
                  onChange={(e) => handleChange('filiere', e.target.value)}
                  className="form-control-lg"
                  required
                >
                  <option value="">Sélectionner une filière</option>
                  {filiereOptions.map(filiere => (
                    <option key={filiere} value={filiere}>{filiere}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="option">
                <Form.Label className="fw-semibold">
                  Option / Spécialité <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.option}
                  onChange={(e) => handleChange('option', e.target.value)}
                  placeholder="Ex: Développement Web, Data Science, Comptabilité, etc."
                  className="form-control-lg"
                  required
                />
              </Form.Group>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="statut">
                <Form.Label className="fw-semibold mb-3">Statut</Form.Label>
                <div className="d-flex gap-4">
                  <Form.Check
                    type="radio"
                    name="statut"
                    id="statut-active"
                    label={
                      <>
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span>Active</span>
                      </>
                    }
                    value="Active"
                    checked={formData.statut === 'Active'}
                    onChange={(e) => handleChange('statut', e.target.value as 'Active' | 'Archivée')}
                    className="border rounded p-3 flex-grow-1"
                  />
                  <Form.Check
                    type="radio"
                    name="statut"
                    id="statut-archivee"
                    label={
                      <>
                        <i className="bi bi-archive text-secondary me-2"></i>
                        <span>Archivée</span>
                      </>
                    }
                    value="Archivée"
                    checked={formData.statut === 'Archivée'}
                    onChange={(e) => handleChange('statut', e.target.value as 'Active' | 'Archivée')}
                    className="border rounded p-3 flex-grow-1"
                  />
                </div>
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="bg-light">
        <Button variant="outline-secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={!isFormValid}
          className="px-4"
        >
          <i className={`bi ${isEditing ? 'bi-check' : 'bi-plus-circle'} me-2`}></i>
          {isEditing ? 'Modifier' : 'Ajouter'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// ============================================================================
// Composant PromotionFilters
interface PromotionFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onSearch: (searchTerm: string) => void;
}

const PromotionFilters: React.FC<PromotionFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filiereOptions = promotionService.getFilieresOptions();
  const anneeOptions = promotionService.getAnneesOptions();
  const statutOptions = ['Tous', 'Active', 'Archivée'];
  const sortOptions = [
    'Date création (récent)',
    'Date création (ancien)',
    'Année académique',
    'Filière (A-Z)'
  ];

  const handleClearFilters = () => {
    onFilterChange({
      filiere: 'Toutes',
      annee: 'Toutes',
      statut: 'Tous',
      sortBy: 'Date création (récent)'
    });
    setSearchTerm('');
    onSearch('');
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-4">
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <InputGroup className="shadow-sm">
            <InputGroup.Text className="bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par filière, option ou année académique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-start-0"
            />
            <Button 
              variant="primary" 
              onClick={handleSearch}
              className="px-4"
            >
              <i className="bi bi-search me-2"></i>
              Rechercher
            </Button>
          </InputGroup>
        </div>
        
        <div className="col-md-4 d-flex gap-2">
          <Button 
            variant="outline-secondary" 
            onClick={handleClearFilters}
            className="flex-grow-1"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-3">
          <Form.Group>
            <Form.Label className="small text-muted mb-1">
              <i className="bi bi-filter me-1"></i>
              Filière
            </Form.Label>
            <Form.Select 
              value={filters.filiere}
              onChange={(e) => onFilterChange({ ...filters, filiere: e.target.value })}
              className="form-control-sm shadow-sm"
            >
              {filiereOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        <div className="col-md-3">
          <Form.Group>
            <Form.Label className="small text-muted mb-1">
              <i className="bi bi-calendar me-1"></i>
              Année
            </Form.Label>
            <Form.Select 
              value={filters.annee}
              onChange={(e) => onFilterChange({ ...filters, annee: e.target.value })}
              className="form-control-sm shadow-sm"
            >
              {anneeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        <div className="col-md-3">
          <Form.Group>
            <Form.Label className="small text-muted mb-1">
              <i className="bi bi-info-circle me-1"></i>
              Statut
            </Form.Label>
            <Form.Select 
              value={filters.statut}
              onChange={(e) => onFilterChange({ ...filters, statut: e.target.value })}
              className="form-control-sm shadow-sm"
            >
              {statutOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        <div className="col-md-3">
          <Form.Group>
            <Form.Label className="small text-muted mb-1">
              <i className="bi bi-sort-down me-1"></i>
              Trier par
            </Form.Label>
            <Form.Select 
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
              className="form-control-sm shadow-sm"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Composant Principal Etudiant (pour gérer les promotions)
const Etudiant: React.FC = () => {
  // États principaux
  const [promotions, setPromotions] = useState<Promotion[]>(promotionService.getInitialPromotions());
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>(promotionService.getInitialPromotions());
  
  // États pour les filtres
  const [filters, setFilters] = useState<FilterOptions>({
    filiere: 'Toutes',
    annee: 'Toutes',
    statut: 'Tous',
    sortBy: 'Date création (récent)'
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // États UI
  const [showModal, setShowModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    variant: 'success' | 'danger' | 'info';
  }>({
    show: false,
    message: '',
    variant: 'success'
  });

  // Appliquer les filtres
  useEffect(() => {
    const filtered = promotionService.filterPromotions(
      promotions,
      searchTerm,
      filters.filiere,
      filters.statut,
      filters.annee
    );

    const sorted = promotionService.sortPromotions(filtered, filters.sortBy);
    setFilteredPromotions(sorted);
  }, [promotions, searchTerm, filters]);

  // Gestion des notifications
  const showNotification = useCallback((message: string, variant: 'success' | 'danger' | 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ ...alert, show: false }), 4000);
  }, [alert]);

  // Gestion des actions CRUD
  const handleAdd = () => {
    setSelectedPromotion(null);
    setShowModal(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
      showNotification('Promotion supprimée avec succès', 'success');
    }
  };

  const handleViewDetails = (id: number) => {
    const promotion = promotions.find(p => p.id === id);
    if (promotion) {
      showNotification(
        `Détails: ${promotion.filiere} - ${promotion.option} (${promotion.anneeAcademique})`,
        'info'
      );
    }
  };

  const handleSubmit = (data: PromotionFormData) => {
    try {
      if (selectedPromotion) {
        // Modification
        setPromotions(prev => prev.map(p => 
          p.id === selectedPromotion.id 
            ? { ...data, id: p.id, dateCreation: p.dateCreation }
            : p
        ));
        showNotification('Promotion modifiée avec succès', 'success');
      } else {
        // Ajout
        const newPromotion: Promotion = {
          id: promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1,
          ...data,
          dateCreation: new Date().toISOString().split('T')[0]
        };
        setPromotions(prev => [...prev, newPromotion]);
        showNotification('Promotion ajoutée avec succès', 'success');
      }
    } catch {
      showNotification('Erreur lors de l\'opération', 'danger');
    }
  };

  const handleExport = () => {
    try {
      const csvContent = promotionService.generateCSV(promotions);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `promotions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('Export CSV réalisé avec succès', 'success');
    } catch {
      showNotification('Erreur lors de l\'export CSV', 'danger');
    }
  };

  // Configuration des colonnes avec largeurs ajustées
  const columns = useMemo<TableColumn<Promotion>[]>(
    () => [
      {
        name: 'ID',
        selector: (row) => row.id,
        sortable: true,
        width: '16.66%',  // Largeur égale pour toutes les colonnes
        cell: (row) => (
          <div className="text-center fw-bold" style={{ fontSize: '0.85rem' }}>
            {row.id}
          </div>
        ),
      },
      {
        name: 'ANNÉE ACADÉMIQUE',
        selector: (row) => row.anneeAcademique,
        sortable: true,
        width: '16.66%',  // Largeur égale pour toutes les colonnes
        cell: (row) => (
          <div className="d-flex align-items-center text-truncate" style={{ padding: '8px 0' }}>
            <i className="bi bi-calendar3 text-primary me-2 flex-shrink-0"></i>
            <span className="fw-semibold text-truncate">{row.anneeAcademique}</span>
          </div>
        ),
      },
      {
        name: 'FILIÈRE',
        selector: (row) => row.filiere,
        sortable: true,
        width: '16.66%',  // Largeur égale pour toutes les colonnes
        cell: (row) => (
          <div className="text-truncate" style={{ padding: '8px 0' }}>
            <div className="fw-bold text-dark text-truncate" title={row.filiere}>
              {row.filiere}
            </div>
            <div className="text-muted small text-truncate" title={row.option}>
              {row.option}
            </div>
          </div>
        ),
      },
      {
        name: 'DATE CRÉATION',
        selector: (row) => row.dateCreation,
        sortable: true,
        width: '16.66%',  // Largeur égale pour toutes les colonnes
        cell: (row) => (
          <div className="text-muted text-truncate" style={{ padding: '8px 0' }}>
            <i className="bi bi-calendar-plus me-1"></i>
            {new Date(row.dateCreation).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        ),
      },
      {
        name: 'STATUT',
        selector: (row) => row.statut,
        sortable: true,
        width: '16.66%',  // Largeur égale pour toutes les colonnes
        cell: (row) => (
          <div className="text-truncate" style={{ padding: '8px 0' }}>
            <Badge
              bg={row.statut === 'Active' ? 'success' : 'secondary'}
              className="px-2 py-1 d-flex align-items-center justify-content-center"
              style={{ fontSize: '0.7rem' }}
            >
              <i
                className="bi bi-circle-fill me-1"
                style={{ fontSize: '0.4rem' }}
              ></i>
              <span className="text-truncate">{row.statut}</span>
            </Badge>
          </div>
        ),
      },
      {
        name: 'ACTIONS',
        cell: (row) => (
          <div className="d-flex justify-content-center" style={{ padding: '8px 0' }}>
            <ActionButtons
              promotion={row}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          </div>
        ),
        width: '16.66%',  // Largeur égale pour toutes les colonnes
        center: true,
        allowOverflow: true,
        ignoreRowClick: true,
      },
    ],
    []
  );

  // Styles personnalisés pour DataTable
  const customStyles = {
    table: {
      style: {
        tableLayout: 'fixed',
        width: '100%',
        minWidth: '100%', // Assure que le tableau prend toute la largeur
      },
    },
    head: {
      style: {
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
      },
    },
    headCells: {
      style: {
        backgroundColor: '#f8f9fa',
        padding: '8px 4px',
        borderBottom: '2px solid #dee2e6',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    cells: {
      style: {
        padding: '8px 4px',
        fontSize: '0.85rem',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        verticalAlign: 'middle',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottom: '1px solid #edf2f7',
        },
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
  };

  return (
    <div style={{padding: '0',margin: '0',fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", overflowX: 'auto',maxWidth: '100%', width: '100%' }}>
      {/* Notification */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
          className="position-fixed top-3 end-3 shadow-lg"
          style={{ 
            zIndex: 9999, 
            minWidth: '350px',
            borderRadius: '10px',
            borderLeft: `4px solid ${
              alert.variant === 'success' ? '#28a745' :
              alert.variant === 'danger' ? '#dc3545' :
              '#17a2b8'
            }`
          }}
        >
          <div className="d-flex align-items-center">
            <i className={`bi ${
              alert.variant === 'success' ? 'bi-check-circle-fill' : 
              alert.variant === 'danger' ? 'bi-exclamation-triangle-fill' : 
              'bi-info-circle-fill'
            } fs-4 me-3`}></i>
            <div>
              <Alert.Heading className="h6 mb-1">
                {alert.variant === 'success' ? 'Succès' : 
                 alert.variant === 'danger' ? 'Attention' : 
                 'Information'}
              </Alert.Heading>
              <p className="mb-0 small">{alert.message}</p>
            </div>
          </div>
        </Alert>
      )}

      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">
            <i className="bi bi-people-fill text-primary me-2"></i>
            Gestion des Promotions
          </h1>
          <p className="text-muted mb-0">
            Gérez l'ensemble des promotions académiques de votre établissement
          </p>
        </div>
        <Button 
          variant="primary" 
          size="lg"
          onClick={handleAdd}
          className="px-4 py-2 shadow"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Ajouter une promotion
        </Button>
      </div>

      {/* Card principale */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <Card.Header className="bg-white border-bottom py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="h5 mb-1 fw-bold">
                <i className="bi bi-table me-2 text-primary"></i>
                Liste des Promotions
              </h5>
              <small className="text-muted">
                {filteredPromotions.length} promotion{filteredPromotions.length !== 1 ? 's' : ''} trouvée{filteredPromotions.length !== 1 ? 's' : ''}
                {(searchTerm || filters.filiere !== 'Toutes' || filters.statut !== 'Tous' || filters.annee !== 'Toutes') && ' (avec filtres)'}
              </small>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleExport}
                className="d-flex align-items-center"
              >
                <i className="bi bi-file-earmark-arrow-down me-2"></i>
                Exporter
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => window.print()}
                className="d-flex align-items-center"
              >
                <i className="bi bi-printer me-2"></i>
                Imprimer
              </Button>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-4">
          {/* Filtres */}
          <PromotionFilters
            filters={filters}
            onFilterChange={setFilters}
            onSearch={setSearchTerm}
          />

          {/* Badges des filtres actifs */}
          {(searchTerm || filters.filiere !== 'Toutes' || filters.statut !== 'Tous' || filters.annee !== 'Toutes') && (
            <div className="mb-3">
              <small className="text-muted me-2 d-inline-block mb-2">Filtres actifs :</small>
              <div className="d-flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge bg="info" className="px-3 py-2 d-flex align-items-center">
                    <i className="bi bi-search me-2"></i>
                    "{searchTerm}"
                    <button 
                      className="btn-close btn-close-white ms-2" 
                      style={{ fontSize: '0.5rem' }}
                      onClick={() => setSearchTerm('')}
                      aria-label="Supprimer"
                    ></button>
                  </Badge>
                )}
                {filters.filiere !== 'Toutes' && (
                  <Badge bg="primary" className="px-3 py-2 d-flex align-items-center">
                    <i className="bi bi-filter me-2"></i>
                    {filters.filiere}
                    <button 
                      className="btn-close btn-close-white ms-2" 
                      style={{ fontSize: '0.5rem' }}
                      onClick={() => setFilters({...filters, filiere: 'Toutes'})}
                      aria-label="Supprimer"
                    ></button>
                  </Badge>
                )}
                {filters.statut !== 'Tous' && (
                  <Badge bg="warning" className="px-3 py-2 d-flex align-items-center">
                    <i className="bi bi-info-circle me-2"></i>
                    {filters.statut}
                    <button 
                      className="btn-close btn-close-white ms-2" 
                      style={{ fontSize: '0.5rem' }}
                      onClick={() => setFilters({...filters, statut: 'Tous'})}
                      aria-label="Supprimer"
                    ></button>
                  </Badge>
                )}
                {filters.annee !== 'Toutes' && (
                  <Badge bg="success" className="px-3 py-2 d-flex align-items-center">
                    <i className="bi bi-calendar me-2"></i>
                    {filters.annee}
                    <button 
                      className="btn-close btn-close-white ms-2" 
                      style={{ fontSize: '0.5rem' }}
                      onClick={() => setFilters({...filters, annee: 'Toutes'})}
                      aria-label="Supprimer"
                    ></button>
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Tableau */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <DataTable
              columns={columns}
              data={filteredPromotions}
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
              paginationComponentOptions={{
                rowsPerPageText: 'Lignes par page :',
                rangeSeparatorText: 'sur',
                selectAllRowsItem: true,
                selectAllRowsItemText: 'Tous',
              }}
              noDataComponent={
                <div className="text-center py-5 my-5">
                  <i className="bi bi-folder-x display-1 text-muted mb-4"></i>
                  <h4 className="h4 text-muted mb-3">Aucune promotion trouvée</h4>
                  <p className="text-muted mb-4">
                    {searchTerm || filters.filiere !== 'Toutes' || filters.statut !== 'Tous' || filters.annee !== 'Toutes' 
                      ? "Essayez de modifier vos critères de recherche"
                      : "Cliquez sur 'Ajouter une promotion' pour créer votre première promotion"}
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={handleAdd}
                    className="px-4"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Ajouter une promotion
                  </Button>
                </div>
              }
              highlightOnHover
              pointerOnHover
              responsive
              striped
              fixedHeader
              fixedHeaderScrollHeight="500px"
            />
          </div>
        </Card.Body>

        <Card.Footer className="bg-light border-top py-3">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Cliquez sur <i className="bi bi-three-dots-vertical mx-1"></i> pour afficher les actions disponibles
            </small>
            <small className="text-muted">
              <i className="bi bi-clock-history me-1"></i>
              Mis à jour: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        </Card.Footer>
      </Card>

      {/* Modal */}
      <PromotionModal
        show={showModal}
        promotion={selectedPromotion}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* Styles CSS inline */}
      <style>{`
        .rdt_TableBody .rdt_TableRow {
          animation: fadeInRow 0.3s ease-out;
        }
        
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .rdt_Table {
          min-width: 100% !important;
        }
        
        .rdt_TableCol {
          white-space: nowrap;
        }
        
        .form-check-input:checked {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }
        
        .modal-content {
          border: none;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .table-responsive {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .popover {
          max-width: 200px;
        }
        
        .btn-close-white {
          filter: invert(1) grayscale(100%) brightness(200%);
        }
      `}</style>
    </div>
  );
};

export default Etudiant;