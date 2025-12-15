// src/components/pages/EspacePedagogique.tsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Corrigez les imports d'icônes
import { 
  PlayFill, 
  Download, 
  ClockFill 
} from 'react-bootstrap-icons';

const EspacePedagogique: React.FC = () => {
  const courses = [
    { id: 1, title: 'React pour débutants', duration: '4h', lessons: 12 },
    { id: 2, title: 'TypeScript avancé', duration: '6h', lessons: 18 },
    { id: 3, title: 'Architecture Microservices', duration: '8h', lessons: 24 },
    { id: 4, title: 'UI/UX Design', duration: '5h', lessons: 15 },
  ];

  return (
    <div>
      <h1 className="mb-4">Espace Pédagogique</h1>
      <Row>
        {courses.map((course) => (
          <Col md={6} lg={3} key={course.id} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>
                  <small className="text-muted">
                    <ClockFill size={14} className="me-1" />
                    {course.duration} • {course.lessons} leçons
                  </small>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" size="sm" className="me-2">
                  <PlayFill className="me-1" /> Commencer
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <Download className="me-1" /> Télécharger
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EspacePedagogique;