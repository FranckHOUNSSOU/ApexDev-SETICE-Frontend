import React from 'react';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

const Formateur: React.FC = () => {
  const formateurs = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', specialite: 'React', status: 'Actif' },
    { id: 2, nom: 'Martin', prenom: 'Sophie', specialite: 'TypeScript', status: 'Actif' },
    { id: 3, nom: 'Bernard', prenom: 'Pierre', specialite: 'Node.js', status: 'Inactif' },
    { id: 4, nom: 'Petit', prenom: 'Marie', specialite: 'UI/UX', status: 'Actif' },
  ];

  return (

    <div>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestion des Formateurs</h1>
        <Button variant="success">Ajouter un formateur</Button>
      </div>
      
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Spécialité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formateurs.map((formateur) => (
            <tr key={formateur.id}>
              <td>{formateur.id}</td>
              <td>{formateur.nom}</td>
              <td>{formateur.prenom}</td>
              <td>{formateur.specialite}</td>
              <td>
                <Badge bg={formateur.status === 'Actif' ? 'success' : 'secondary'}>
                  {formateur.status}
                </Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2">
                  Modifier
                </Button>
                <Button variant="outline-danger" size="sm">
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Formateur;