// src/components/pages/Dashboard.tsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Utilisez les bons noms d'icônes
import { 
  BarChartFill, 
  PeopleFill, 
  BookFill, 
  PersonBadgeFill 
} from 'react-bootstrap-icons';

const Dashboard: React.FC = () => {
  const stats = [
    { 
      title: 'Étudiants actifs', 
      value: '1,245', 
      icon: <PeopleFill size={30} />, 
      color: 'primary' 
    },
    { 
      title: 'Cours disponibles', 
      value: '48', 
      icon: <BookFill size={30} />, 
      color: 'success' 
    },
    { 
      title: 'Formateurs', 
      value: '32', 
      icon: <PersonBadgeFill size={30} />, 
      color: 'warning' 
    },
    { 
      title: 'Taux de complétion', 
      value: '78%', 
      icon: <BarChartFill size={30} />, 
      color: 'info' 
    },
  ];

  return (
    <div className="dashboard">
      <h1 className="mb-4">Tableau de Bord</h1>
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col md={3} sm={6} key={index} className="mb-3">
            <Card className={`text-white bg-${stat.color} h-100`}>
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">{stat.icon}</div>
                <div>
                  <Card.Title className="mb-1">{stat.value}</Card.Title>
                  <Card.Text>{stat.title}</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Activité récente</Card.Title>
            </Card.Header>
            <Card.Body>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Nouveau cours ajouté: "React Avancé"</li>
                <li className="list-group-item">5 nouveaux étudiants inscrits</li>
                <li className="list-group-item">3 devoirs soumis aujourd'hui</li>
                <li className="list-group-item">Mise à jour du système terminée</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Notifications</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="alert alert-info">
                <small>2 messages non lus</small>
              </div>
              <div className="alert alert-warning">
                <small>1 devoir en attente</small>
              </div>
              <div className="alert alert-success">
                <small>3 cours complétés cette semaine</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;