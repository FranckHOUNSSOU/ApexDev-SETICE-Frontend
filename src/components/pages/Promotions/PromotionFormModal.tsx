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
  filieres: string[];
  options: string[];
  onCreateFiliere: (filiere: string) => void;
  onCreateOption: (option: string) => void;
}

export const PromotionFormModal: React.FC<PromotionFormModalProps> = ({
  show,
  promotion,
  onHide,
  onSubmit,
  filieres,
  options,
  onCreateFiliere,
  onCreateOption
}) => {
  const [formData, setFormData] = useState<PromotionFormData>({
    nomPromotion: 'L1',
    anneeDebut: '',
    anneeFin: '',
    filiere: '',
    option: '',
    specialite: '',
    statut: 'Active',
    nombreEtudiants: 0
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const isEditing = !!promotion;

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
        statut: 'Active',
        nombreEtudiants: 0
      });
    }
    setErrors({});
    setTouched({});
  }, [promotion, show]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.nomPromotion) newErrors.nomPromotion = true;
    if (!formData.anneeDebut.trim()) newErrors.anneeDebut = true;
    if (!formData.anneeFin.trim()) newErrors.anneeFin = true;
    if (!formData.filiere.trim()) newErrors.filiere = true;
    if (!formData.option.trim()) newErrors.option = true;
    if (!formData.specialite.trim()) newErrors.specialite = true;

    // Validation des années
    if (formData.anneeDebut && formData.anneeFin) {
      const debut = parseInt(formData.anneeDebut);
      const fin = parseInt(formData.anneeFin);
      if (debut >= fin) {
        newErrors.anneeFin = true;
      }
    }

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
      onSubmit(formData);
      onHide();
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const isFieldInvalid = (field: string) => {
    return touched[field] && errors[field];
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header 
        closeButton 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          border: 'none'
        }}
      >
        <Modal.Title>
          <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {isEditing ? 'Modifier la promotion' : 'Nouvelle promotion'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <Form>
          <Row className="g-3">
            {/* Nom de la promotion */}
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Nom de la promotion <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.nomPromotion}
                  onChange={(e) => setFormData({ ...formData, nomPromotion: e.target.value as any })}
                  onBlur={() => handleBlur('nomPromotion')}
                  isInvalid={isFieldInvalid('nomPromotion')}
                  className="form-control-lg"
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

            {/* Années */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Année de début <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="2023"
                  value={formData.anneeDebut}
                  onChange={(e) => setFormData({ ...formData, anneeDebut: e.target.value })}
                  onBlur={() => handleBlur('anneeDebut')}
                  isInvalid={isFieldInvalid('anneeDebut')}
                  className="form-control-lg"
                  maxLength={4}
                />
                <Form.Control.Feedback type="invalid">
                  L'année de début est obligatoire
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Année de fin <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="2024"
                  value={formData.anneeFin}
                  onChange={(e) => setFormData({ ...formData, anneeFin: e.target.value })}
                  onBlur={() => handleBlur('anneeFin')}
                  isInvalid={isFieldInvalid('anneeFin')}
                  className="form-control-lg"
                  maxLength={4}
                />
                <Form.Control.Feedback type="invalid">
                  L'année de fin doit être supérieure à l'année de début
                </Form.Control.Feedback>
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
                <Form.Label className="fw-semibold">
                  Spécialité <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Frontend React, Machine Learning, Audit Financier..."
                  value={formData.specialite}
                  onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                  onBlur={() => handleBlur('specialite')}
                  isInvalid={isFieldInvalid('specialite')}
                  className="form-control-lg"
                />
                <Form.Control.Feedback type="invalid">
                  La spécialité est obligatoire
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Nombre d'étudiants */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Nombre d'étudiants
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.nombreEtudiants}
                  onChange={(e) => setFormData({ ...formData, nombreEtudiants: parseInt(e.target.value) || 0 })}
                  className="form-control-lg"
                />
                <Form.Text className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Nombre actuel d'étudiants inscrits
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Statut */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Statut</Form.Label>
                <Form.Select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                  className="form-control-lg"
                >
                  <option value="Active">✓ Active</option>
                  <option value="Archivée">📦 Archivée</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* Alerte d'information */}
        <Alert variant="info" className="mt-4 mb-0">
          <div className="d-flex align-items-start">
            <i className="bi bi-info-circle-fill fs-5 me-3"></i>
            <div>
              <strong>Important :</strong>
              <ul className="mb-0 mt-2" style={{ fontSize: '0.9rem' }}>
                <li>Tous les champs marqués d'un astérisque (*) sont obligatoires</li>
                <li>Utilisez le bouton "➕ Créer" pour ajouter de nouvelles filières ou options</li>
                <li>L'année de fin doit être supérieure à l'année de début</li>
              </ul>
            </div>
          </div>
        </Alert>
      </Modal.Body>
      
      <Modal.Footer style={{ backgroundColor: '#f8f9fa' }}>
        <Button variant="outline-secondary" onClick={onHide} size="lg">
          <i className="bi bi-x-lg me-2"></i>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          size="lg"
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
  );
};