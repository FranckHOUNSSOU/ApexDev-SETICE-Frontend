import { useState, useEffect, useRef } from "react";
import './AjoutEspaceModal.css';
import axios from "axios";
import * as yup from "yup";
import { Button, Form, Modal, Alert, Spinner, Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface AjoutEspaceModalProps {
  show: boolean;
  onClose: () => void;
  onEspaceAdded?: () => void;
}

function AjoutEspaceModal({ show, onClose, onEspaceAdded }: AjoutEspaceModalProps) {
  const schema = yup.object().shape({
    nom: yup.string().required("Le nom est requis").max(25, "Maximum 25 caractères"),
    matiere: yup.string().required("La matière est requise").max(100, "Maximum 100 caractères"),
    description: yup.string().required("La description est requise").max(255, "Maximum 255 caractères"),
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: "",
      matiere: "",
      description: "",
    },
  });

  const watchNom = watch("nom");
  const watchMatiere = watch("matiere");
  const watchDescription = watch("description");

  // Matière autocomplete
  const DEFAULT_MATIERES = [
    "Mathématiques",
    "Physique",
    "Chimie",
    "Français",
    "Histoire",
    "Géographie",
    "Informatique",
    "Biologie",
    "Économie",
    "Anglais",
    "Espagnol",
    "Philosophie",
    "Arts Plastiques",
    "Musique",
    "Technologie",
    "Sciences de la Vie et de la Terre",
  ];

  const [filteredMatieres, setFilteredMatieres] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const q = (watchMatiere || "").trim();
    if (!q) {
      setFilteredMatieres([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }
    const filtered = DEFAULT_MATIERES.filter((m) => m.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
    setFilteredMatieres(filtered);
    setShowSuggestions(filtered.length > 0);
    setHighlightedIndex(-1);
  }, [watchMatiere]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelectSuggestion = (value: string) => {
    setValue("matiere", value, { shouldValidate: true, shouldDirty: true });
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleMatiereKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredMatieres.length === 0) {
      if (e.key === "ArrowDown" && filteredMatieres.length > 0) {
        setShowSuggestions(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    const len = filteredMatieres.length;
    if (e.key === "ArrowDown") {
      setHighlightedIndex((i) => (i + 1 + len) % len);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((i) => (i - 1 + len) % len);
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < len) {
        handleSelectSuggestion(filteredMatieres[highlightedIndex]);
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      e.preventDefault();
    }
  };

  const ajouterEspace = async (data: any) => {
    setError("");
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/task_create/createTask",
        {
          nom: data.nom,
          matiere: data.matiere,
          description: data.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Espace pédagogique ajouté avec succès");
      setTimeout(() => {
        setSuccess("");
        if (onEspaceAdded) onEspaceAdded();
        reset();
        onClose();
      }, 900);
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || "Erreur d'enregistrement de l'espace pédagogique";
      setError(serverMessage);
    }
  };

  const handleCancel = () => {
    reset();
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      centered
      dialogClassName="ep-modal-dialog"
    >
      <Modal.Header closeButton className="ep-modal-header">
        <div>
          <Modal.Title className="mb-0">Ajouter un espace pédagogique</Modal.Title>
        </div>
      </Modal.Header>
      
      <Modal.Body className="ep-modal-body">
        <Form onSubmit={handleSubmit(ajouterEspace)}>
          <Row className="mb-3">
          <Form.Group as={Col} md="6" className="mb-3" controlId="nom">
            <Form.Label className="ep-form-label fw-semibold">Nom de l'espace</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              maxLength={25}
              isInvalid={!!errors.nom}
              {...register("nom")}
              aria-label="Nom de l'espace"
            />
            <div className="d-flex justify-content-between mt-1">
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.nom?.message}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group as={Col} md="6" className="mb-3" controlId="matiere">
            <Form.Label className="ep-form-label fw-semibold">Matière</Form.Label>

            <div className="position-relative" ref={suggestionsRef}>
              <Form.Control
                type="text"
                placeholder=""
                maxLength={100}
                isInvalid={!!errors.matiere}
                {...register("matiere")}
                aria-label="Matière"
                onKeyDown={handleMatiereKeyDown}
                autoComplete="off"
              />

              {showSuggestions && (
                <div className="ep-suggestions" role="listbox" id="matiere-listbox">
                  {filteredMatieres.map((m, idx) => (
                    <div
                      key={m}
                      role="option"
                      id={`matiere-option-${idx}`}
                      aria-selected={highlightedIndex === idx}
                      className={`ep-suggestion-item ${highlightedIndex === idx ? 'active' : ''}`}
                      onMouseDown={() => handleSelectSuggestion(m)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between mt-1">
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.matiere?.message}
              </Form.Control.Feedback>
            </div>
          </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label className="ep-form-label fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Brève description de l'espace (objectifs, contenu, etc.)"
              maxLength={255}
              isInvalid={!!errors.description}
              {...register("description")}
              aria-label="Description"
            />
            <div className="d-flex justify-content-between mt-1">
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.description?.message}
              </Form.Control.Feedback>
            </div>
          </Form.Group>
          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="py-2">
              {success}
            </Alert>
          )}
          <div className="ep-divider" />

          <div className="d-flex justify-content-end">
            <Button variant="outline-secondary" onClick={handleCancel} className="me-2 ep-btn-outline" disabled={isSubmitting}>
              Fermer
            </Button>
            <Button variant="primary" type="submit" className="ep-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default AjoutEspaceModal;