import React, { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { Button, Form, Modal } from "react-bootstrap";
import { FcPrevious } from "react-icons/fc";
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
    filiere: yup.string().required("La filière est requise").max(100, "Maximum 100 caractères"),
    option: yup.string().required("L'option est requise").max(100, "Maximum 100 caractères"),
    anneeAcademique: yup.string().required("L'année académique est requise").max(100, "Maximum 100 caractères"),
    formateur: yup.string().required("Le formateur est requis").max(100, "Maximum 100 caractères"),
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: "",
      matiere: "",
      description: "",
      filiere: "",
      option: "",
      anneeAcademique: "",
      formateur: "",
    },
  });

  const ajouterEspace = async (data: any) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/api/task_create/createTask",
        {
          nom: data.nom,
          matiere: data.matiere,
          description: data.description,
          filiere: data.filiere,
          option: data.option,
          anneeAcademique: data.anneeAcademique,
          formateur: data.formateur,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Espace pédagogique ajouté");
      setTimeout(() => {
        setSuccess("");
        if (onEspaceAdded) onEspaceAdded();
        onClose();
        reset();
      }, 1000);
    } catch (err) {
      setError("Erreur d'enregistrement de l'espace pédagogique");
    }
  }; 

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un espace pédagogique</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(ajouterEspace)}>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              maxLength={25}
              {...register("nom")}
            />
            <p className="text-danger">{errors.nom?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Matière</Form.Label>
            <Form.Control
              as="textarea"
              maxLength={100}
              {...register("matiere")}
            />
            <p className="text-danger">{errors.matiere?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Formateur</Form.Label>
            <Form.Control
              as="textarea"
              maxLength={100}
              {...register("formateur")}
            />
            <p className="text-danger">{errors.formateur?.message}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Promotion</Form.Label>
            <Form.Control
              as="textarea"
              maxLength={100}
              {...register("promotion")}
            />
            <p className="text-danger">{errors.promotion?.message}</p>
          </Form.Group>
          
          
          {error && (
            <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "green", marginBottom: 10 }}>{success}</div>
          )}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCancel} className="me-2">
              <FcPrevious />
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default AjoutEspaceModal;