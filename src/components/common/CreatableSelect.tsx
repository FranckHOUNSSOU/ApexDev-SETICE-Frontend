// src/components/common/CreatableSelect.tsx
import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

interface CreatableSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onCreateOption: (newOption: string) => void;
  placeholder?: string;
  label: string;
  error?: boolean;
  required?: boolean;
}

export const CreatableSelect: React.FC<CreatableSelectProps> = ({
  value,
  options,
  onChange,
  onCreateOption,
  placeholder,
  label,
  error,
  required
}) => {
  const [showInput, setShowInput] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleCreate = () => {
    if (newValue.trim()) {
      onCreateOption(newValue.trim());
      onChange(newValue.trim());
      setNewValue('');
      setShowInput(false);
    }
  };

  if (showInput) {
    return (
      <Form.Group>
        <Form.Label className="fw-semibold">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Nouvelle ${label.toLowerCase()}...`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreate();
              } else if (e.key === 'Escape') {
                setShowInput(false);
                setNewValue('');
              }
            }}
            className="form-control-lg"
          />
          <Button variant="success" onClick={handleCreate}>
            <i className="bi bi-check-lg"></i>
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowInput(false);
              setNewValue('');
            }}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </InputGroup>
        <Form.Text className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Appuyez sur <kbd>Entrée</kbd> pour créer ou <kbd>Échap</kbd> pour annuler
        </Form.Text>
      </Form.Group>
    );
  }

  return (
    <Form.Group>
      <Form.Label className="fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => {
          if (e.target.value === '__CREATE_NEW__') {
            setShowInput(true);
          } else {
            onChange(e.target.value);
          }
        }}
        isInvalid={error}
        className="form-control-lg"
      >
        <option value="">{placeholder || `Sélectionner ${label.toLowerCase()}...`}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        <option 
          value="__CREATE_NEW__" 
          style={{ 
            backgroundColor: '#e7f3ff', 
            color: '#0d6efd', 
            fontWeight: 'bold',
            borderTop: '2px solid #dee2e6'
          }}
        >
          ➕ Créer une nouvelle {label.toLowerCase()}
        </option>
      </Form.Select>
      {error && (
        <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
          Ce champ est obligatoire
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};