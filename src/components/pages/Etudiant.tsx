// Etudiant.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Pagination from 'react-bootstrap/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  UserPlus,
  Search,
  Calendar,
  BookOpen,
  GraduationCap,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  User,
  Mail,
  Settings,
  PlusCircle,
  FileText
} from 'lucide-react';

interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
  annee: number;
  statut: 'actif' | 'inactif' | 'diplome';
  dateCreation: string;
  dateModification: string;
  telephone?: string;
}

interface FiltreEtudiant {
  filiere: string;
  annee: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
  recherche: string;
}

interface ActionMenuProps {
  etudiant: Etudiant;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ etudiant, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={menuRef}>
      <Button
        variant="link"
        className="text-muted p-0 d-flex align-items-center justify-content-center"
        onClick={() => setShowMenu(!showMenu)}
        style={{ width: '32px', height: '32px' }}
      >
        <MoreVertical size={20} />
      </Button>

      {showMenu && (
        <div className="position-absolute end-0 mt-1 bg-white rounded shadow-lg border"
             style={{ zIndex: 1000, minWidth: '200px' }}>
          <div className="p-2">
            <div className="d-flex align-items-center px-3 py-2 text-muted small">
              <User size={14} className="me-2" />
              <span className="fw-medium">{etudiant.prenom} {etudiant.nom}</span>
            </div>
            <hr className="my-1" />
            <button
              className="dropdown-item d-flex align-items-center px-3 py-2"
              onClick={() => {
                onView(etudiant.id);
                setShowMenu(false);
              }}
            >
              <Eye size={16} className="me-2 text-primary" />
              <span>Voir détails</span>
            </button>
            <button
              className="dropdown-item d-flex align-items-center px-3 py-2"
              onClick={() => {
                onEdit(etudiant.id);
                setShowMenu(false);
              }}
            >
              <Edit size={16} className="me-2 text-success" />
              <span>Modifier</span>
            </button>
            <button
              className="dropdown-item d-flex align-items-center px-3 py-2"
              onClick={() => {
                onDelete(etudiant.id);
                setShowMenu(false);
              }}
            >
              <Trash2 size={16} className="me-2 text-danger" />
              <span className="text-danger">Supprimer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Etudiant: React.FC = () => {
  // États
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null);
  
  // Référence et état pour la largeur du conteneur
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  
  // États des filtres
  const [filtres, setFiltres] = useState<FiltreEtudiant>({
    filiere: '',
    annee: '',
    statut: '',
    dateDebut: '',
    dateFin: '',
    recherche: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  // Options pour les filtres
  const filieres = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Économie', 'Droit'];
  const annees = [1, 2, 3, 4, 5];
  const statuts = [
    { value: 'actif', label: 'Actif', variant: 'success' },
    { value: 'inactif', label: 'Inactif', variant: 'warning' },
    { value: 'diplome', label: 'Diplômé', variant: 'primary' }
  ];

  // Chargement initial des données
  useEffect(() => {
    fetchEtudiants();
  }, []);

  useEffect(() => {
    appliquerFiltres();
  }, [etudiants]);

  // Mesurer la largeur du conteneur
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Mesurer initialement
    updateWidth();

    // Écouter les redimensionnements
    window.addEventListener('resize', updateWidth);

    // Nettoyer
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const fetchEtudiants = async () => {
    setLoading(true);
    try {
      // Simulation de données
      const mockData: Etudiant[] = [
        {
          id: 'ETU-001',
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@email.com',
          telephone: '+33 6 12 34 56 78',
          filiere: 'Informatique',
          annee: 3,
          statut: 'actif',
          dateCreation: '2023-09-01',
          dateModification: '2024-01-15'
        },
        {
          id: 'ETU-002',
          nom: 'Martin',
          prenom: 'Marie',
          email: 'marie.martin@email.com',
          telephone: '+33 6 23 45 67 89',
          filiere: 'Mathématiques',
          annee: 2,
          statut: 'actif',
          dateCreation: '2023-09-02',
          dateModification: '2024-01-10'
        },
        {
          id: 'ETU-003',
          nom: 'Bernard',
          prenom: 'Pierre',
          email: 'pierre.bernard@email.com',
          telephone: '+33 6 34 56 78 90',
          filiere: 'Physique',
          annee: 4,
          statut: 'diplome',
          dateCreation: '2022-09-01',
          dateModification: '2023-12-20'
        },
        {
          id: 'ETU-004',
          nom: 'Thomas',
          prenom: 'Claire',
          email: 'claire.thomas@email.com',
          telephone: '+33 6 45 67 89 01',
          filiere: 'Informatique',
          annee: 1,
          statut: 'actif',
          dateCreation: '2024-09-01',
          dateModification: '2024-12-01'
        },
        {
          id: 'ETU-005',
          nom: 'Petit',
          prenom: 'Luc',
          email: 'luc.petit@email.com',
          telephone: '+33 6 56 78 90 12',
          filiere: 'Chimie',
          annee: 3,
          statut: 'inactif',
          dateCreation: '2023-09-01',
          dateModification: '2024-06-15'
        }
      ];
      
      // Ajout de 20 étudiants supplémentaires
      const additionalData = Array.from({ length: 20 }, (_, i) => ({
        id: `ETU-${String(i + 6).padStart(3, '0')}`,
        nom: ['Leroy', 'Moreau', 'Simon', 'Laurent', 'Michel', 'David', 'Fournier', 'Girard'][i % 8],
        prenom: ['Thomas', 'Julie', 'Antoine', 'Catherine', 'Philippe', 'Isabelle', 'François', 'Émilie'][i % 8],
        email: `etudiant${i + 6}@email.com`,
        telephone: `+33 6 ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')}`,
        filiere: filieres[i % filieres.length],
        annee: (i % 5) + 1,
        statut: ['actif', 'inactif', 'diplome'][i % 3] as 'actif' | 'inactif' | 'diplome',
        dateCreation: `202${Math.floor(Math.random() * 4) + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        dateModification: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      }));
      
      setEtudiants([...mockData, ...additionalData]);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Application des filtres
  const appliquerFiltres = useMemo(() => {
    return () => {
      let result = [...etudiants];

      if (filtres.recherche) {
        const recherche = filtres.recherche.toLowerCase();
        result = result.filter(e =>
          e.nom.toLowerCase().includes(recherche) ||
          e.prenom.toLowerCase().includes(recherche) ||
          e.email.toLowerCase().includes(recherche) ||
          e.id.toLowerCase().includes(recherche)
        );
      }

      if (filtres.filiere) {
        result = result.filter(e => e.filiere === filtres.filiere);
      }

      if (filtres.annee) {
        result = result.filter(e => e.annee === parseInt(filtres.annee));
      }

      if (filtres.statut) {
        result = result.filter(e => e.statut === filtres.statut);
      }

      if (filtres.dateDebut) {
        const dateDebut = new Date(filtres.dateDebut);
        result = result.filter(e => new Date(e.dateCreation) >= dateDebut);
      }

      if (filtres.dateFin) {
        const dateFin = new Date(filtres.dateFin);
        result = result.filter(e => new Date(e.dateCreation) <= dateFin);
      }

      setFilteredEtudiants(result);
      setCurrentPage(1);
      setShowFilters(false);
    };
  }, [etudiants, filtres]);

  // Réinitialisation des filtres
  const reinitialiserFiltres = () => {
    setFiltres({
      filiere: '',
      annee: '',
      statut: '',
      dateDebut: '',
      dateFin: '',
      recherche: ''
    });
    setCurrentPage(1);
    setShowFilters(false);
  };

  // Gestion de la sélection
  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === currentEtudiants.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(currentEtudiants.map(e => e.id));
      setSelectedRows(allIds);
    }
  };

  // Suppression des lignes sélectionnées
  const supprimerSelection = () => {
    if (selectedRows.size === 0) return;
    
    const nouveauxEtudiants = etudiants.filter(
      etudiant => !selectedRows.has(etudiant.id)
    );
    setEtudiants(nouveauxEtudiants);
    setSelectedRows(new Set());
    setShowDeleteModal(false);
  };

  // Actions individuelles
  const voirDetails = (id: string) => {
    const etudiant = etudiants.find(e => e.id === id);
    if (etudiant) {
      setSelectedEtudiant(etudiant);
      setShowDetailModal(true);
    }
  };

  const modifierEtudiant = (id: string) => {
    const etudiant = etudiants.find(e => e.id === id);
    if (etudiant) {
      setSelectedEtudiant(etudiant);
      // Logique de modification - ouvrir un modal d'édition
      console.log('Modifier:', id);
      alert(`Modification de l'étudiant ${etudiant.prenom} ${etudiant.nom}`);
    }
  };

  const supprimerEtudiant = (id: string) => {
    const etudiant = etudiants.find(e => e.id === id);
    if (etudiant && window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant ${etudiant.prenom} ${etudiant.nom} ?`)) {
      const nouveauxEtudiants = etudiants.filter(e => e.id !== id);
      setEtudiants(nouveauxEtudiants);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(startIndex, endIndex);

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters = Object.values(filtres).some(value => value !== '' && value !== 'recherche');

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtenir le badge selon le statut
  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge bg="success" className="px-2 py-1">Actif</Badge>;
      case 'inactif':
        return <Badge bg="warning" text="dark" className="px-2 py-1">Inactif</Badge>;
      case 'diplome':
        return <Badge bg="primary" className="px-2 py-1">Diplômé</Badge>;
      default:
        return <Badge bg="secondary" className="px-2 py-1">{statut}</Badge>;
    }
  };

  return (
    <Container 
      fluid 
      className="py-4" 
      style={{ minHeight: 'calc(100vh - 100px)' }}
      ref={containerRef}
    >
      {/* Modal de suppression multiple */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="h5">Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
              <AlertCircle size={24} className="text-danger" />
            </div>
            <div>
              <p className="mb-1 fw-medium">Êtes-vous sûr de vouloir supprimer {selectedRows.size} étudiant{selectedRows.size > 1 ? 's' : ''} ?</p>
              <p className="text-muted small mb-0">Cette action est irréversible.</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={supprimerSelection} className="d-flex align-items-center gap-2">
            <Trash2 size={16} />
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de détails */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="h5">Détails de l'étudiant</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedEtudiant && (
            <div>
              <div className="d-flex align-items-start mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <h5 className="mb-1">{selectedEtudiant.prenom} {selectedEtudiant.nom}</h5>
                  <div className="text-muted small d-flex align-items-center">
                    <Mail size={14} className="me-1" />
                    {selectedEtudiant.email}
                  </div>
                </div>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <div className="border rounded p-3">
                    <div className="small text-muted mb-1">Informations personnelles</div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-medium me-2" style={{ width: '100px' }}>ID:</span>
                      <Badge bg="light" text="dark" className="font-monospace">{selectedEtudiant.id}</Badge>
                    </div>
                    {selectedEtudiant.telephone && (
                      <div className="d-flex align-items-center mb-2">
                        <span className="fw-medium me-2" style={{ width: '100px' }}>Téléphone:</span>
                        <span>{selectedEtudiant.telephone}</span>
                      </div>
                    )}
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-medium me-2" style={{ width: '100px' }}>Filière:</span>
                      <div className="d-flex align-items-center">
                        <BookOpen size={14} className="me-1 text-muted" />
                        {selectedEtudiant.filiere}
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-medium me-2" style={{ width: '100px' }}>Année:</span>
                      <Badge bg="info" pill className="px-2">
                        Année {selectedEtudiant.annee}
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border rounded p-3">
                    <div className="small text-muted mb-1">Statut et dates</div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-medium me-2" style={{ width: '100px' }}>Statut:</span>
                      {getStatutBadge(selectedEtudiant.statut)}
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-medium me-2" style={{ width: '100px' }}>Créé le:</span>
                      <div className="d-flex align-items-center">
                        <Calendar size={14} className="me-1 text-muted" />
                        {formatDate(selectedEtudiant.dateCreation)}
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="fw-medium me-2" style={{ width: '100px' }}>Modifié le:</span>
                      <div className="d-flex align-items-center">
                        <Calendar size={14} className="me-1 text-muted" />
                        {formatDate(selectedEtudiant.dateModification)}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
            Fermer
          </Button>
          <Button variant="primary" onClick={() => {
            setShowDetailModal(false);
            if (selectedEtudiant) modifierEtudiant(selectedEtudiant.id);
          }}>
            <Edit size={16} className="me-1" />
            Modifier
          </Button>
        </Modal.Footer>
      </Modal>

      {/* En-tête */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
              <GraduationCap size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="h3 mb-1">Gestion des Étudiants</h1>
              <p className="text-muted mb-0">
                {filteredEtudiants.length} étudiant{filteredEtudiants.length > 1 ? 's' : ''} 
                {selectedRows.size > 0 && ` • ${selectedRows.size} sélectionné${selectedRows.size > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </Col>
        <Col md={6} className="mt-3 mt-md-0">
          <div className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
            <div className="d-flex gap-2">
              <Button
                variant={showFilters || hasActiveFilters ? "primary" : "outline-secondary"}
                onClick={() => setShowFilters(!showFilters)}
                className="d-flex align-items-center gap-2"
              >
                <Filter size={18} />
                <span className="d-none d-md-inline">Filtrer</span>
                {hasActiveFilters && (
                  <Badge bg="light" text="primary" pill className="ms-1">
                    {Object.values(filtres).filter(v => v !== '' && v !== 'recherche').length}
                  </Badge>
                )}
              </Button>
              
              {selectedRows.size > 0 && (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="delete-tooltip">Supprimer la sélection</Tooltip>}
                >
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                    className="d-flex align-items-center gap-2"
                  >
                    <Trash2 size={18} />
                    <span className="d-none d-md-inline">Supprimer ({selectedRows.size})</span>
                  </Button>
                </OverlayTrigger>
              )}
              
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="add-tooltip">Ajouter un nouvel étudiant</Tooltip>}
              >
                <Button variant="primary" className="d-flex align-items-center gap-2">
                  <PlusCircle size={18} />
                  <span className="d-none d-md-inline">Ajouter</span>
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        </Col>
      </Row>

      {/* Barre de recherche */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Rechercher un étudiant par nom, prénom, email ou ID..."
                  value={filtres.recherche}
                  onChange={(e) => setFiltres({...filtres, recherche: e.target.value})}
                  className="border-start-0"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      appliquerFiltres();
                    }
                  }}
                />
                {filtres.recherche && (
                  <Button
                    variant="link"
                    className="text-muted border"
                    onClick={() => setFiltres({...filtres, recherche: ''})}
                  >
                    <X size={18} />
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={6} className="mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end align-items-center gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center gap-2"
                >
                  <FileText size={16} />
                  <span className="d-none d-md-inline">Exporter</span>
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center gap-2"
                >
                  <Download size={16} />
                  <span className="d-none d-md-inline">Télécharger</span>
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center gap-2"
                >
                  <Settings size={16} />
                  <span className="d-none d-md-inline">Colonnes</span>
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Panneau des filtres */}
      {showFilters && (
        <Card className="mb-4 border-primary">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-medium">
                <Filter size={18} className="me-2" />
                Filtres avancés
              </h6>
              <Button
                variant="link"
                onClick={reinitialiserFiltres}
                className="text-decoration-none p-0"
                disabled={!hasActiveFilters}
              >
                Réinitialiser
              </Button>
            </div>
            <Row className="g-3">
              <Col md={6} lg={3}>
                <Form.Group>
                  <Form.Label className="small fw-medium mb-1">Filière</Form.Label>
                  <Form.Select
                    value={filtres.filiere}
                    onChange={(e) => setFiltres({...filtres, filiere: e.target.value})}
                    size="sm"
                  >
                    <option value="">Toutes les filières</option>
                    {filieres.map(filiere => (
                      <option key={filiere} value={filiere}>{filiere}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} lg={2}>
                <Form.Group>
                  <Form.Label className="small fw-medium mb-1">Année</Form.Label>
                  <Form.Select
                    value={filtres.annee}
                    onChange={(e) => setFiltres({...filtres, annee: e.target.value})}
                    size="sm"
                  >
                    <option value="">Toutes</option>
                    {annees.map(annee => (
                      <option key={annee} value={annee}>Année {annee}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} lg={2}>
                <Form.Group>
                  <Form.Label className="small fw-medium mb-1">Statut</Form.Label>
                  <Form.Select
                    value={filtres.statut}
                    onChange={(e) => setFiltres({...filtres, statut: e.target.value})}
                    size="sm"
                  >
                    <option value="">Tous</option>
                    {statuts.map(statut => (
                      <option key={statut.value} value={statut.value}>{statut.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} lg={3}>
                <Form.Group>
                  <Form.Label className="small fw-medium mb-1">Période de création</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="date"
                      value={filtres.dateDebut}
                      onChange={(e) => setFiltres({...filtres, dateDebut: e.target.value})}
                      size="sm"
                      placeholder="Du"
                    />
                    <Form.Control
                      type="date"
                      value={filtres.dateFin}
                      onChange={(e) => setFiltres({...filtres, dateFin: e.target.value})}
                      size="sm"
                      placeholder="Au"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={12} lg={2} className="d-flex align-items-end">
                <Button
                  variant="primary"
                  onClick={appliquerFiltres}
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  size="sm"
                >
                  <Filter size={16} />
                  Appliquer
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Tableau */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Chargement des étudiants...</p>
            </div>
          ) : filteredEtudiants.length === 0 ? (
            <div className="text-center py-5">
              <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
                <GraduationCap size={48} className="text-muted" />
              </div>
              <h5 className="mb-2">Aucun étudiant trouvé</h5>
              <p className="text-muted mb-4">
                {hasActiveFilters || filtres.recherche
                  ? "Aucun étudiant ne correspond à vos critères de recherche."
                  : "La liste des étudiants est vide."}
              </p>
              <div className="d-flex justify-content-center gap-2">
                {(hasActiveFilters || filtres.recherche) ? (
                  <Button variant="outline-primary" onClick={reinitialiserFiltres}>
                    Réinitialiser les filtres
                  </Button>
                ) : (
                  <Button variant="primary" className="d-flex align-items-center gap-2">
                    <PlusCircle size={18} />
                    Ajouter un étudiant
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '50px' }} className="ps-4">
                        <Form.Check
                          type="checkbox"
                          className="form-check-sm"
                          checked={selectedRows.size === currentEtudiants.length && currentEtudiants.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>ID</th>
                      <th>Étudiant</th>
                      <th>Filière</th>
                      <th>Année</th>
                      <th>Statut</th>
                      <th>Date d'inscription</th>
                      <th className="text-end pe-4" style={{ width: '80px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEtudiants.map((etudiant) => (
                      <tr key={etudiant.id} className={selectedRows.has(etudiant.id) ? 'table-active' : ''}>
                        <td className="ps-4">
                          <Form.Check
                            type="checkbox"
                            className="form-check-sm"
                            checked={selectedRows.has(etudiant.id)}
                            onChange={() => toggleRowSelection(etudiant.id)}
                          />
                        </td>
                        <td>
                          <span className="font-monospace small">{etudiant.id}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <User size={18} className="text-primary" />
                            </div>
                            <div>
                              <div className="fw-medium">
                                {etudiant.prenom} {etudiant.nom}
                              </div>
                              <div className="text-muted small">{etudiant.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <BookOpen size={16} className="me-2 text-muted" />
                            {etudiant.filiere}
                          </div>
                        </td>
                        <td>
                          <Badge bg="info" pill className="px-3 py-1">
                            Année {etudiant.annee}
                          </Badge>
                        </td>
                        <td>{getStatutBadge(etudiant.statut)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Calendar size={16} className="me-2 text-muted" />
                            {formatDate(etudiant.dateCreation)}
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <ActionMenu
                            etudiant={etudiant}
                            onView={voirDetails}
                            onEdit={modifierEtudiant}
                            onDelete={supprimerEtudiant}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-top p-3">
                  <Row className="align-items-center">
                    <Col md={6} className="mb-2 mb-md-0">
                      <div className="text-muted small">
                        Affichage de <span className="fw-medium">{startIndex + 1}</span> à{' '}
                        <span className="fw-medium">{Math.min(endIndex, filteredEtudiants.length)}</span> sur{' '}
                        <span className="fw-medium">{filteredEtudiants.length}</span> étudiants
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-md-end">
                        <div className="d-flex align-items-center gap-1">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="d-flex align-items-center"
                          >
                            <ChevronsLeft size={16} />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="d-flex align-items-center"
                          >
                            <ChevronLeft size={16} />
                          </Button>
                          
                          <div className="d-flex mx-2">
                            {[...Array(Math.min(5, totalPages))].map((_, index) => {
                              const page = currentPage <= 3 
                                ? index + 1
                                : currentPage >= totalPages - 2
                                  ? totalPages - 4 + index
                                  : currentPage - 2 + index;
                              
                              if (page < 1 || page > totalPages) return null;
                              
                              return (
                                <Button
                                  key={page}
                                  variant={page === currentPage ? "primary" : "outline-secondary"}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className="mx-1"
                                  style={{ minWidth: '36px' }}
                                >
                                  {page}
                                </Button>
                              );
                            })}
                          </div>
                          
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="d-flex align-items-center"
                          >
                            <ChevronRight size={16} />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="d-flex align-items-center"
                          >
                            <ChevronsRight size={16} />
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Notification de sélection */}
      {selectedRows.size > 0 && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="bg-dark text-white rounded shadow-lg p-3 animate__animated animate__fadeInUp">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white bg-opacity-25 rounded-circle p-2">
                <User size={20} />
              </div>
              <div>
                <div className="fw-medium">
                  {selectedRows.size} étudiant{selectedRows.size > 1 ? 's' : ''} sélectionné{selectedRows.size > 1 ? 's' : ''}
                </div>
                <div className="small opacity-75">
                  Cliquez sur "Supprimer" pour les supprimer ou sur la croix pour annuler
                </div>
              </div>
              <Button
                variant="link"
                className="text-white p-0 ms-3"
                onClick={() => setSelectedRows(new Set())}
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Indicateur de largeur du conteneur (optionnel - pour débogage) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}>
          Container: {containerWidth}px
        </div>
      )}
    </Container>
  );
};

export default Etudiant;