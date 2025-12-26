import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import HeaderUserbox from './Navbar/userbox';
import logo from '../../assets/insigne.png';
import './Navbar.css';
// Brand style (split into two colored spans: SET / ICE)
const brandStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 800,
  marginBottom: '0',
  letterSpacing: '0.2px'
};


const brandWrapper: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 12,
};

const brandLogoStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  objectFit: 'contain',
  borderRadius: 6,
};

import { CaretRightFill } from 'react-bootstrap-icons';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const CustomNavbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarCollapsed }) => {
  return (
    <Navbar bg="light" variant="light" expand="lg" fixed='top' style={{ zIndex: 1040, height: 56 }}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <div style={brandWrapper}>
            <img src={logo} alt="SETICE" style={brandLogoStyle} />
            <h1 style={brandStyle} className="brand-title"><span className="brand-set">SET</span><span className="brand-ice">ICE</span></h1>
          </div>
        </Navbar.Brand>
        <span
          role="button"
          tabIndex={0}
          onClick={toggleSidebar}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSidebar(); } }}
          className="me-3 sidebar-toggle-icon"
          aria-label={sidebarCollapsed ? 'Ouvrir le menu' : 'Fermer le menu'}
        >
          <span className={`single-chevron ${sidebarCollapsed ? '' : 'open'}`} aria-hidden="true">
            <CaretRightFill size={18} />
          </span>
        </span>
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