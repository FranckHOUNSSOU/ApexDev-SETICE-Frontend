import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import HeaderUserbox from './Navbar/userbox';
// Styles locaux pour le dégradé du logo
const brandStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  marginBottom: '0',
  background: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
  WebkitBackgroundClip: 'text' as any,
  WebkitTextFillColor: 'transparent' as any,
};

interface NavbarProps {
  toggleSidebar: () => void;
}

const CustomNavbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <Navbar bg="light" variant="light" expand="lg" fixed='top' style={{ zIndex: 1040, height: 56 }}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <h1 style={brandStyle}>SETICE</h1>
        </Navbar.Brand>
         <Button 
          variant="outline-dark" 
          onClick={toggleSidebar}
          className="me-3"
          style={{ width: 40, height: 40, padding: 0, borderRadius: 6 }}
          aria-label="Toggle sidebar"
        >
          ☰
        </Button>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <div className="navbar-nav">
           <HeaderUserbox/>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;