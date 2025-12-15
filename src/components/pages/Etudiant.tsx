import React from 'react';
import Table from 'react-bootstrap/Table';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const Etudiant: React.FC = () => {
  const etudiants = [
    { id: 1, nom: 'Durand', prenom: 'Alice', cours: 'React', progression: 80 },
    { id: 2, nom: 'Leroy', prenom: 'Thomas', cours: 'TypeScript', progression: 45 },
    { id: 3, nom: 'Moreau', prenom: 'Julie', cours: 'Node.js', progression: 90 },
    { id: 4, nom: 'Simon', prenom: 'Luc', cours: 'UI/UX', progression: 30 },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestion des Étudiants</h1>
        <div className="d-flex">
          <InputGroup className="me-3" style={{ width: '300px' }}>
            <Form.Control placeholder="Rechercher un étudiant..." />
          </InputGroup>
          <button className="btn btn-primary">Exporter</button>
        </div>
      </div>
      
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Cours suivi</th>
            <th>Progression</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {etudiants.map((etudiant) => (
            <tr key={etudiant.id}>
              <td>{etudiant.id}</td>
              <td>{etudiant.nom}</td>
              <td>{etudiant.prenom}</td>
              <td>{etudiant.cours}</td>
              <td>
                <div className="d-flex align-items-center">
                  <ProgressBar 
                    now={etudiant.progression} 
                    label={`${etudiant.progression}%`}
                    className="flex-grow-1 me-2"
                  />
                  <span>{etudiant.progression}%</span>
                </div>
              </td>
              <td>
                {etudiant.progression === 100 ? (
                  <span className="badge bg-success">Terminé</span>
                ) : etudiant.progression > 50 ? (
                  <span className="badge bg-primary">En cours</span>
                ) : (
                  <span className="badge bg-warning">Débutant</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Etudiant;