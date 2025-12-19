import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useLocation } from 'react-router-dom';
import {
  HouseFill,
  BookFill,
  PersonBadgeFill,
  PeopleFill
} from 'react-bootstrap-icons';

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onClose, isMobile }) => {
  const location = useLocation();
  const menuItems = [
    { path: '/dashboard', icon: <HouseFill />, label: 'Dashboard' },
    { path: '/espace-pedagogique', icon: <BookFill />, label: 'Espace Pédagogique' },
    { path: '/formateur', icon: <PersonBadgeFill />, label: 'Formateur' },
    { path: '/etudiant', icon: <PeopleFill />, label: 'Étudiant' },
  ];

  // Sur mobile, afficher l'Offcanvas lorsque collapsed est false
  if (isMobile) {
    return (
      <Offcanvas show={!collapsed} onHide={() => onClose?.()} scroll={true} backdrop={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Nav.Item key={item.path}>
                  <Nav.Link as={Link} to={item.path} active={isActive} onClick={() => onClose?.()}>
                    <span className="me-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  const desktopWidth = collapsed ? 70 : 220;
  const desktopStyle: React.CSSProperties = {
    width: desktopWidth,
    minHeight: 'calc(100vh - 56px)',
    position: 'fixed',
    top: 56,
    left: 0,
    paddingTop: 12,
    backgroundColor: 'rgba(255,255,255,0.98)',
    transition: 'width 0.2s ease',
    boxShadow: '2px 0 6px rgba(0,0,0,0.04)'
  };

  return (
    <div style={desktopStyle} aria-hidden={isMobile}>
      <Nav className="flex-column">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Nav.Item key={item.path}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={`d-flex align-items-center px-3 py-2 ${isActive ? 'active' : 'text-muted'}`}
                onClick={() => onClose?.()}
              >
                <span className="me-2" style={{ minWidth: 24, textAlign: 'center' }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </div>
  );
};

export default Sidebar;