// src/components/pages/Promotions/ConfirmationModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header 
        closeButton 
        style={{ 
          background: variant === 'danger' ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' :
                     variant === 'warning' ? 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' :
                     'linear-gradient(135deg, #17a2b8 0%, #138496 100%)', 
          color: 'white',
          border: 'none'
        }}
      >
        <Modal.Title className="h6">
          <i className={`bi ${
            variant === 'danger' ? 'bi-exclamation-triangle-fill' :
            variant === 'warning' ? 'bi-exclamation-circle-fill' :
            'bi-info-circle-fill'
          } me-2`}></i>
          {title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <div className="text-center">
          <i className={`bi ${
            variant === 'danger' ? 'bi-x-circle text-danger' :
            variant === 'warning' ? 'bi-exclamation-circle text-warning' :
            'bi-info-circle text-info'
          }`} style={{ fontSize: '48px', marginBottom: '20px' }}></i>
          <p className="fs-5 mb-0">{message}</p>
        </div>
      </Modal.Body>
      
      <Modal.Footer style={{ backgroundColor: '#f8f9fa' }}>
        <Button variant="outline-secondary" onClick={onHide}>
          <i className="bi bi-x-lg me-2"></i>
          {cancelText}
        </Button>
        <Button 
          variant={variant}
          onClick={handleConfirm}
          style={{ 
            background: variant === 'danger' ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' :
                     variant === 'warning' ? 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' :
                     'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
            border: 'none'
          }}
        >
          <i className={`bi ${
            variant === 'danger' ? 'bi-trash-fill' :
            variant === 'warning' ? 'bi-exclamation-triangle-fill' :
            'bi-check-circle-fill'
          } me-2`}></i>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
