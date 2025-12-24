// src/components/pages/Promotions/PromotionDetailsModal.tsx
import React from 'react';
import { Modal, Row, Col, Card, Badge } from 'react-bootstrap';
import type { Promotion } from '../../../types/promotion';

interface PromotionDetailsModalProps {
  show: boolean;
  promotion: Promotion | null;
  onHide: () => void;
}

export const PromotionDetailsModal: React.FC<PromotionDetailsModalProps> = ({
  show,
  promotion,
  onHide
}) => {
  if (!promotion) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
        <Modal.Title>
          <i className="bi bi-info-circle-fill me-2"></i>
          Détails de la promotion
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <Row className="g-3">
          {/* Carte principale - Nom de la promotion */}
          <Col xs={12}>
            <Card 
              className="border-0 shadow-sm" 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px'
              }}
            >
              <Card.Body className="text-white p-4">
                <small className="text-white-50 text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>
                  Nom de la promotion
                </small>
                <h2 className="mb-0 mt-2 fw-bold" style={{ fontSize: '2.5rem' }}>
                  {promotion.nomPromotion}
                </h2>
              </Card.Body>
            </Card>
          </Col>

          {/* Année académique */}
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-3">
                <small className="text-muted text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Année académique
                </small>
                <h5 className="mb-0 mt-2 fw-bold">
                  <i className="bi bi-calendar-range text-primary me-2" style={{ fontSize: '1.2rem' }}></i>
                  {promotion.anneeDebut} - {promotion.anneeFin}
                </h5>
              </Card.Body>
            </Card>
          </Col>

          {/* Nombre d'étudiants */}
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
              <Card.Body className="p-3">
                <small className="text-muted text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Nombre d'étudiants
                </small>
                <h5 className="mb-0 mt-2 fw-bold">
                  <i className="bi bi-people-fill me-2" style={{ fontSize: '1.2rem', color: '#667eea' }}></i>
                  <span style={{ fontSize: '1.8rem', color: '#667eea' }}>{promotion.nombreEtudiants}</span>
                  <span className="ms-2" style={{ fontSize: '1rem', color: '#666' }}>étudiant(s)</span>
                </h5>
              </Card.Body>
            </Card>
          </Col>

          {/* Filière */}
          <Col xs={12}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-3">
                <small className="text-muted text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Filière
                </small>
                <h5 className="mb-0 mt-2 fw-bold">
                  <i className="bi bi-mortarboard-fill text-warning me-2" style={{ fontSize: '1.2rem' }}></i>
                  {promotion.filiere}
                </h5>
              </Card.Body>
            </Card>
          </Col>

          {/* Option */}
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-3">
                <small className="text-muted text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Option
                </small>
                <p className="mb-0 mt-2 fw-semibold" style={{ fontSize: '1rem', color: '#333' }}>
                  <i className="bi bi-bookmark-fill text-info me-2"></i>
                  {promotion.option}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Spécialité */}
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-3">
                <small className="text-muted text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Spécialité
                </small>
                <p className="mb-0 mt-2 fw-semibold" style={{ fontSize: '1rem', color: '#333' }}>
                  <i className="bi bi-star-fill text-success me-2"></i>
                  {promotion.specialite}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Statut */}
          <Col xs={12}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-3">
                <small className="text-muted text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                  Statut de la promotion
                </small>
                <div className="mt-2">
                  <Badge 
                    bg={promotion.statut === 'Active' ? 'success' : 'secondary'}
                    className="px-4 py-2"
                    style={{ fontSize: '0.95rem', borderRadius: '20px' }}
                  >
                    <i className={`bi ${promotion.statut === 'Active' ? 'bi-check-circle-fill' : 'bi-archive-fill'} me-2`}></i>
                    {promotion.statut}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
        <small className="text-muted me-auto">
          <i className="bi bi-hash me-1"></i>
          ID: {promotion.id}
        </small>
      </Modal.Footer>
    </Modal>
  );
};