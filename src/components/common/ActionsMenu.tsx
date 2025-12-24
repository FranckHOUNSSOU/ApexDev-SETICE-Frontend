// src/components/common/ActionsMenu.tsx
import React, { useState } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import type { Promotion } from '../../types/promotion';

interface ActionsMenuProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: number) => void;
  onViewDetails: (promotion: Promotion) => void;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  promotion,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const [showActions, setShowActions] = useState(false);

  const actions = [
    {
      label: 'Voir détails',
      icon: 'bi-eye-fill',
      onClick: () => {
        onViewDetails(promotion);
        setShowActions(false);
      },
      variant: 'light',
      color: 'text-primary'
    },
    {
      label: 'Modifier',
      icon: 'bi-pencil-fill',
      onClick: () => {
        onEdit(promotion);
        setShowActions(false);
      },
      variant: 'light',
      color: 'text-warning'
    },
    {
      label: 'Supprimer',
      icon: 'bi-trash-fill',
      onClick: () => {
        onDelete(promotion.id);
        setShowActions(false);
      },
      variant: 'danger',
      color: 'text-danger'
    }
  ];

  return (
    <div className="position-relative">
      <OverlayTrigger
        trigger="click"
        placement="left"
        show={showActions}
        onToggle={setShowActions}
        rootClose
        overlay={
          <Popover className="border-0 shadow-lg" style={{ minWidth: '170px' }}>
            <Popover.Body className="p-1">
              {actions.map((action, index) => (
                <React.Fragment key={index}>
                  {index === actions.length - 1 && (
                    <div className="border-top my-1"></div>
                  )}
                  <button
                    className={`d-block w-100 text-start border-0 rounded px-3 py-2 ${action.color}`}
                    style={{ 
                      background: 'transparent',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={action.onClick}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = action.variant === 'danger' ? '#fee' : '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <i className={`bi ${action.icon} me-2`}></i>
                    {action.label}
                  </button>
                </React.Fragment>
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