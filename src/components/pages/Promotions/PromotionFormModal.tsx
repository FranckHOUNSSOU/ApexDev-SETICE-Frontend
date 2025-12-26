// src/components/pages/Promotions/PromotionFormModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { CreatableSelect } from '../../common/CreatableSelect';
import type { Promotion, PromotionFormData } from '../../../types/promotion';

interface PromotionFormModalProps {
  show: boolean;
  promotion: Promotion | null;
  onHide: () => void;
  onSubmit: (data: PromotionFormData) => void;
  onShowNotification?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  filieres: string[];
  options: string[];
  onCreateFiliere: (filiere: string) => void;
  onCreateOption: (option: string) => void;
  existingPromotions?: Promotion[];
}

export const PromotionFormModal: React.FC<PromotionFormModalProps> = ({
  show,
  promotion,
  onHide,
  onSubmit,
  filieres,
  options,
  onCreateFiliere,
  onCreateOption,
  existingPromotions = []
}) => {
  const [formData, setFormData] = useState<PromotionFormData>({
    nomPromotion: 'L1',
    anneeDebut: '',
    anneeFin: '',
    filiere: '',
    option: '',
    specialite: '',
    statut: 'Active'
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  const isEditing = !!promotion;

  // Auto-fermeture de la notification après 5 secondes
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    if (promotion) {
      const { id, ...rest } = promotion;
      setFormData(rest);
    } else {
      setFormData({
        nomPromotion: 'L1',
        anneeDebut: '',
        anneeFin: '',
        filiere: '',
        option: '',
        specialite: '',
        statut: 'Active'
      });
    }
    setErrors({});
    setTouched({});
  }, [promotion, show]);

  const handleAnneeDebutChange = (value: string) => {
    setFormData({ 
      ...formData, 
      anneeDebut: value,
      anneeFin: value ? (parseInt(value) + 1).toString() : ''
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.nomPromotion) newErrors.nomPromotion = true;
    if (!formData.anneeDebut.trim()) newErrors.anneeDebut = true;
    if (!formData.filiere.trim()) newErrors.filiere = true;
    if (!formData.option.trim()) newErrors.option = true;
    if (!formData.specialite.trim()) newErrors.specialite = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Marquer tous les champs comme "touchés"
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      // Vérifier si une promotion avec le même nom, année et filière existe déjà
      const duplicatePromotion = existingPromotions.find(
        p => p.nomPromotion === formData.nomPromotion && 
             p.anneeDebut === formData.anneeDebut && 
             p.filiere === formData.filiere &&
             p.id !== promotion?.id // Exclure la promotion actuelle en mode édition
      );

      if (duplicatePromotion && !isEditing) {
        // Afficher une notification pour doublon
        setNotification({
          show: true,
          message: 'Cette promotion existe déjà !',
          type: 'warning'
        });
        return;
      }

      // Soumettre les données et fermer le modal
      onSubmit(formData);
      onHide();
      
      // Afficher la notification de succès après la fermeture du modal
      setTimeout(() => {
        setNotification({
          show: true,
          message: isEditing ? 'Promotion modifiée avec succès !' : 'Promotion ajoutée avec succès !',
          type: 'success'
        });
      }, 300); // Petit délai pour s'assurer que le modal est fermé
    } else {
      // Afficher une notification d'erreur de validation
      setNotification({
        show: true,
        message: 'Veuillez remplir tous les champs obligatoires',
        type: 'error'
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const isFieldInvalid = (field: string) => {
    return touched[field] && errors[field];
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xl" backdrop="static">
        <Modal.Header 
          closeButton 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title className="h6">
            <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
            {isEditing ? 'Modifier la promotion' : 'Nouvelle promotion'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          <Row>
            <Col lg={8}>
              <Form>
                <Row className="g-3">
                  {/* Nom de la promotion */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">
                        Nom de la promotion <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={formData.nomPromotion}
                        onChange={(e) => setFormData({ ...formData, nomPromotion: e.target.value as any })}
                        onBlur={() => handleBlur('nomPromotion')}
                        isInvalid={isFieldInvalid('nomPromotion')}
                        className="form-control form-control-sm"
                      >
                        <option value="L1">L1 - Licence 1ère année</option>
                        <option value="L2">L2 - Licence 2ème année</option>
                        <option value="L3">L3 - Licence 3ème année</option>
                        <option value="M1">M1 - Master 1ère année</option>
                        <option value="M2">M2 - Master 2ème année</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Veuillez sélectionner un nom de promotion
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Année académique */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">
                        Année académique <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="2023"
                        value={formData.anneeDebut}
                        onChange={(e) => handleAnneeDebutChange(e.target.value)}
                        onBlur={() => handleBlur('anneeDebut')}
                        isInvalid={isFieldInvalid('anneeDebut')}
                        className="form-control form-control-sm"
                        maxLength={4}
                      />
                      <Form.Control.Feedback type="invalid">
                        L'année académique est obligatoire
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted small">
                        <i className="bi bi-info-circle me-1"></i>
                        L'année de fin sera automatiquement calculée (année de début + 1)
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Filière avec CreatableSelect */}
                  <Col xs={12}>
                    <CreatableSelect
                      label="Filière"
                      value={formData.filiere}
                      options={filieres}
                      onChange={(val) => {
                        setFormData({ ...formData, filiere: val });
                        setTouched({ ...touched, filiere: true });
                      }}
                      onCreateOption={onCreateFiliere}
                      error={isFieldInvalid('filiere')}
                      required
                    />
                  </Col>

                  {/* Option avec CreatableSelect */}
                  <Col xs={12}>
                    <CreatableSelect
                      label="Option"
                      value={formData.option}
                      options={options}
                      onChange={(val) => {
                        setFormData({ ...formData, option: val });
                        setTouched({ ...touched, option: true });
                      }}
                      onCreateOption={onCreateOption}
                      error={isFieldInvalid('option')}
                      required
                    />
                  </Col>

                  {/* Spécialité */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">
                        Spécialité <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: Frontend React, Machine Learning, Audit Financier..."
                        value={formData.specialite}
                        onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                        onBlur={() => handleBlur('specialite')}
                        isInvalid={isFieldInvalid('specialite')}
                        className="form-control form-control-sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        La spécialité est obligatoire
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Statut */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">Statut</Form.Label>
                      <Form.Select
                        value={formData.statut}
                        onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                        className="form-control form-control-sm"
                      >
                        <option value="Active">✓ Active</option>
                        <option value="Archivée">📦 Archivée</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
            
            <Col lg={4}>
              {/* Alerte d'information */}
              <Alert variant="info" className="sticky-top">
                <div className="d-flex align-items-start">
                  <i className="bi bi-info-circle-fill fs-5 me-3"></i>
                  <div>
                    <strong>Important :</strong>
                    <ul className="mb-0 mt-3" style={{ fontSize: '0.9rem' }}>
                      <li className="mb-2">Tous les champs marqués d'un astérisque (*) sont obligatoires</li>
                      <li className="mb-2">Utilisez le bouton "➕ Créer" pour ajouter de nouvelles filières ou options</li>
                      <li className="mb-2">L'année académique est automatiquement calculée (année de début + 1)</li>
                    </ul>
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer style={{ backgroundColor: '#f8f9fa' }}>
          <Button variant="outline-secondary" onClick={onHide}>
            <i className="bi bi-x-lg me-2"></i>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
            {isEditing ? 'Enregistrer les modifications' : 'Ajouter la promotion'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Notification flottante - À l'extérieur du modal */}
      {notification.show && (
        <Alert 
          variant={notification.type === 'success' ? 'success' : 
                   notification.type === 'error' ? 'danger' : 
                   notification.type === 'warning' ? 'warning' : 'info'}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 99999,
            minWidth: '350px',
            maxWidth: '500px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: 'none',
            borderRadius: '12px',
            padding: '20px 24px',
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center'
          }}
        >
          <div className="d-flex align-items-center justify-content-center">
            <i className={`bi ${
              notification.type === 'success' ? 'bi-check-circle-fill text-success' :
              notification.type === 'error' ? 'bi-x-circle-fill text-danger' :
              notification.type === 'warning' ? 'bi-exclamation-triangle-fill text-warning' :
              'bi-info-circle-fill text-info'
            } me-3`} style={{ fontSize: '24px' }}></i>
            <span className="flex-grow-1">{notification.message}</span>
            <button 
              type="button" 
              className="btn-close ms-3"
              onClick={() => setNotification({ ...notification, show: false })}
              style={{ fontSize: '16px' }}
            ></button>
          </div>
        </Alert>
      )}
    </>
  );
};