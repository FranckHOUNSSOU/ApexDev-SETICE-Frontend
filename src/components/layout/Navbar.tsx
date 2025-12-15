import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
}

const CustomNavbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
      <Container fluid>
        <Button 
          variant="outline-light" 
          onClick={toggleSidebar}
          className="me-3"
        >
          ☰
        </Button>
        <Navbar.Brand as={Link} to="/">
          🚀 EduPlateforme
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <div className="navbar-nav">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/espace-pedagogique" className="nav-link">
              Espace Pédagogique
            </Link>
            <Link to="/formateur" className="nav-link">
              Formateur
            </Link>
            <Link to="/etudiant" className="nav-link">
              Étudiant
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;