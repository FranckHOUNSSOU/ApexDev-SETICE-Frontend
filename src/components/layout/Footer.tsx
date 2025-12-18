import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  if (isMobile) return null;

  return (
    <footer className="bg-white" style={{ padding: '8px 0' }}>
      <Container fluid>
        <Row>
          <Col className="text-center py-0">
            <p className="mb-0 text-muted small">
              © {new Date().getFullYear()} EduPlateforme - Tous droits réservés
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;