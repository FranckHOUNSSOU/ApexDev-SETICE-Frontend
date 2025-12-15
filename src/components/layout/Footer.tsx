import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col className="text-center py-0">
            <p className="mb-0">
              © {new Date().getFullYear()} EduPlateforme - Tous droits réservés
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;