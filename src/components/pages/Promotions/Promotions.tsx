// src/components/pages/Promotions/Promotions.tsx - Version MUI X DataGrid
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Paper,
  Typography,
  TextField,
  Stack,
  Card,
  CardContent,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

import { PromotionDetailsModal } from './PromotionDetailsModal';
import { PromotionFormModal } from './PromotionFormModal';
import { promotionService } from '../../../Services/promotionService';
import type { Promotion, PromotionFormData } from '../../../types/promotion';

// ============================================================================
// Composant Menu Actions
interface ActionsMenuProps {
  promotion: Promotion;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ promotion, onView, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 160,
            borderRadius: 2,
            mt: 1
          }
        }}
      >
        <MenuItem onClick={onView} sx={{ py: 1.5 }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
          Voir détails
        </MenuItem>
        <MenuItem onClick={onEdit} sx={{ py: 1.5 }}>
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: 'warning.main' }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={onDelete} sx={{ py: 1.5, color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
          Supprimer
        </MenuItem>
      </Menu>
    </>
  );
};

// ============================================================================
// Toolbar personnalisée
interface CustomToolbarProps {
  onExport: () => void;
  onPrint: () => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ onExport, onPrint }) => {
  return (
    <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          startIcon={<PrintIcon />}
          onClick={onPrint}
          variant="outlined"
        >
          Imprimer
        </Button>
        <Button
          size="small"
          startIcon={<DownloadIcon />}
          onClick={onExport}
          variant="outlined"
          color="success"
        >
          Export XLSX
        </Button>
      </Box>
    </GridToolbarContainer>
  );
};

// ============================================================================
// Composant Principal
const Promotions: React.FC = () => {
  // États principaux
  const [promotions, setPromotions] = useState<Promotion[]>(promotionService.getInitialPromotions());
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>(promotionService.getInitialPromotions());
  
  // États pour les listes dynamiques
  const [filieres, setFilieres] = useState<string[]>(promotionService.getFilieresInitiales());
  const [options, setOptions] = useState<string[]>(promotionService.getOptionsInitiales());
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [nomPromotionFilter, setNomPromotionFilter] = useState('Toutes');
  const [filiereFilter, setFiliereFilter] = useState('Toutes');
  const [anneeFilter, setAnneeFilter] = useState('Toutes');
  const [statutFilter, setStatutFilter] = useState('Tous');
  
  // États UI
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Appliquer les filtres
  useEffect(() => {
    const filtered = promotionService.filterPromotions(
      promotions,
      searchTerm,
      nomPromotionFilter,
      filiereFilter,
      anneeFilter,
      statutFilter
    );
    setFilteredPromotions(filtered);
  }, [promotions, searchTerm, nomPromotionFilter, filiereFilter, anneeFilter, statutFilter]);

  // Récupérer les années uniques
  const anneesDisponibles = useMemo(() => {
    return promotionService.getUniqueAnnees(promotions);
  }, [promotions]);

  // Gestion des notifications
  const showNotification = useCallback((message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Gestion des actions CRUD
  const handleAdd = () => {
    setSelectedPromotion(null);
    setShowFormModal(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowFormModal(true);
  };

  const handleDelete = (id: number) => {
    const promotion = promotions.find(p => p.id === id);
    if (promotion && window.confirm(`Êtes-vous sûr de vouloir supprimer la promotion ${promotion.nomPromotion} (${promotion.filiere}) ?`)) {
      setPromotions(prev => prev.filter(p => p.id !== id));
      showNotification('Promotion supprimée avec succès', 'success');
    }
  };

  const handleViewDetails = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowDetailsModal(true);
  };

  const handleSubmit = (data: PromotionFormData) => {
    try {
      if (selectedPromotion) {
        setPromotions(prev => prev.map(p => 
          p.id === selectedPromotion.id ? { ...data, id: p.id } : p
        ));
        showNotification('Promotion modifiée avec succès', 'success');
      } else {
        const newPromotion: Promotion = {
          id: promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1,
          ...data
        };
        setPromotions(prev => [...prev, newPromotion]);
        showNotification('Promotion ajoutée avec succès', 'success');
      }
    } catch {
      showNotification('Erreur lors de l\'opération', 'error');
    }
  };

  const handleCreateFiliere = (newFiliere: string) => {
    if (!filieres.includes(newFiliere)) {
      setFilieres(prev => [...prev, newFiliere].sort());
    }
  };

  const handleCreateOption = (newOption: string) => {
    if (!options.includes(newOption)) {
      setOptions(prev => [...prev, newOption].sort());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportXLSX = () => {
    try {
      promotionService.exportToXLSX(
        filteredPromotions,
        `promotions_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      showNotification('Export XLSX réalisé avec succès', 'success');
    } catch {
      showNotification('Erreur lors de l\'export', 'error');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setNomPromotionFilter('Toutes');
    setFiliereFilter('Toutes');
    setAnneeFilter('Toutes');
    setStatutFilter('Tous');
  };

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: promotions.length,
      actives: promotions.filter(p => p.statut === 'Active').length,
      archivees: promotions.filter(p => p.statut === 'Archivée').length
    };
  }, [promotions]);

  // Configuration des colonnes MUI X DataGrid
  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'nomPromotion',
      headerName: 'NOM PROMOTION',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          size="small"
          sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}
        />
      ),
    },
    {
      field: 'anneeAcademique',
      headerName: 'ANNÉE ACADÉMIQUE',
      width: 180,
      valueGetter: (value, row) => `${row.anneeDebut}-${row.anneeFin}`,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ color: 'primary.main' }}>📅</Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row.anneeDebut} - {params.row.anneeFin}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'filiere',
      headerName: 'FILIÈRE',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ color: 'warning.main' }}>🎓</Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'option',
      headerName: 'OPTION',
      width: 220,
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value as string}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'specialite',
      headerName: 'SPÉCIALITÉ',
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box component="span" sx={{ color: 'info.main' }}>⭐</Box>
          <Typography variant="body2" noWrap title={params.value as string}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'nombreEtudiants',
      headerName: 'NB ÉTUDIANTS',
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={`👥 ${params.value}`}
          color="success"
          size="small"
          sx={{ fontWeight: 'bold' }}
        />
      ),
    },
    {
      field: 'statut',
      headerName: 'STATUT',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Active' ? 'success' : 'default'}
          size="small"
          icon={
            params.value === 'Active' ? (
              <Box component="span">✓</Box>
            ) : (
              <Box component="span">📦</Box>
            )
          }
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <ActionsMenu
          promotion={params.row}
          onView={() => handleViewDetails(params.row)}
          onEdit={() => handleEdit(params.row)}
          onDelete={() => handleDelete(params.row.id)}
        />
      ),
    },
  ], []);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🎓 Gestion des Promotions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez l'ensemble des promotions académiques de votre établissement
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 3,
              px: 3,
              py: 1.5,
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            Ajouter une promotion
          </Button>
        </Stack>

        {/* Statistiques */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ minWidth: 280, flex: '1 1 280px' }}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      TOTAL PROMOTIONS
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                      {stats.total}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'primary.light',
                      borderRadius: '50%',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography fontSize="2rem">📚</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ minWidth: 280, flex: '1 1 280px' }}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      ACTIVES
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main" sx={{ mt: 1 }}>
                      {stats.actives}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'success.light',
                      borderRadius: '50%',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography fontSize="2rem">✓</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ minWidth: 280, flex: '1 1 280px' }}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      ARCHIVÉES
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="text.secondary" sx={{ mt: 1 }}>
                      {stats.archivees}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'grey.300',
                      borderRadius: '50%',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography fontSize="2rem">📦</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* DataGrid Container */}
      <Paper sx={{ boxShadow: 4, borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                📋 Liste des Promotions
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {filteredPromotions.length} promotion(s) trouvée(s)
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={showFilters ? <ClearIcon /> : <FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Masquer' : 'Afficher'} les filtres
            </Button>
          </Stack>
        </Box>

        {/* Filtres */}
        {showFilters && (
          <Box sx={{ p: 3, backgroundColor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ minWidth: 300, flex: '2 1 300px' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Box sx={{ mr: 1 }}>🔍</Box>
                  }}
                />
              </Box>
              <Box sx={{ minWidth: 150, flex: '1 1 150px' }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Nom"
                  value={nomPromotionFilter}
                  onChange={(e) => setNomPromotionFilter(e.target.value)}
                >
                  <MenuItem value="Toutes">Toutes</MenuItem>
                  <MenuItem value="L1">L1</MenuItem>
                  <MenuItem value="L2">L2</MenuItem>
                  <MenuItem value="L3">L3</MenuItem>
                  <MenuItem value="M1">M1</MenuItem>
                  <MenuItem value="M2">M2</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ minWidth: 150, flex: '1 1 150px' }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Filière"
                  value={filiereFilter}
                  onChange={(e) => setFiliereFilter(e.target.value)}
                >
                  <MenuItem value="Toutes">Toutes</MenuItem>
                  {filieres.map(f => (
                    <MenuItem key={f} value={f}>{f}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ minWidth: 150, flex: '1 1 150px' }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Année"
                  value={anneeFilter}
                  onChange={(e) => setAnneeFilter(e.target.value)}
                >
                  {anneesDisponibles.map(annee => (
                    <MenuItem key={annee} value={annee}>{annee}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ minWidth: 150, flex: '1 1 150px' }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Statut"
                  value={statutFilter}
                  onChange={(e) => setStatutFilter(e.target.value)}
                >
                  <MenuItem value="Tous">Tous</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Archivée">Archivée</MenuItem>
                </TextField>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
              >
                Réinitialiser les filtres
              </Button>
            </Box>
          </Box>
        )}

        {/* DataGrid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredPromotions}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{
              toolbar: () => (
                <CustomToolbar
                  onExport={handleExportXLSX}
                  onPrint={handlePrint}
                />
              ),
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.100',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'grey.200',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </Box>
      </Paper>

      {/* Modals */}
      <PromotionFormModal
        show={showFormModal}
        promotion={selectedPromotion}
        onHide={() => setShowFormModal(false)}
        onSubmit={handleSubmit}
        filieres={filieres}
        options={options}
        onCreateFiliere={handleCreateFiliere}
        onCreateOption={handleCreateOption}
      />

      <PromotionDetailsModal
        show={showDetailsModal}
        promotion={selectedPromotion}
        onHide={() => setShowDetailsModal(false)}
      />
    </Box>
  );
};

export default Promotions;