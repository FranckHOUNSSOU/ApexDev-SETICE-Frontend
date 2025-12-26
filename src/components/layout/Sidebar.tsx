import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Collapse from 'react-bootstrap/Collapse';
import { Link, useLocation } from 'react-router-dom';
import {
  HouseFill,
  BookFill,
  PersonBadgeFill,
  PeopleFill,
  GearFill,
  PersonFill,
  BellFill,
  BarChartFill,
  ChevronDown,
  ChevronUp
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

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Ouvrir automatiquement Paramètre si la route courante en fait partie
  React.useEffect(() => {
    const paths = ['/profile', '/notifications', '/rapports'];
    if (paths.includes(location.pathname)) setSettingsOpen(true);
  }, [location.pathname]);

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

            {/* Section Paramètre */}
            <Nav.Item>
              <Nav.Link
                as="button"
                onClick={() => setSettingsOpen((s) => !s)}
                className={`d-flex align-items-center px-3 py-2 ${settingsOpen ? 'active' : 'text-muted'}`}
                aria-expanded={settingsOpen}
              >
                <span className="me-2 text-dark"><GearFill /></span>
                <span>Paramètre</span>
                <span className={`sidebar-chev ${settingsOpen ? 'open' : 'closed'}`}>{settingsOpen ? <ChevronUp /> : <ChevronDown />}</span>
              </Nav.Link>

              <Collapse in={settingsOpen}>
                <div className="sidebar-submenu">
                  <Nav.Link as={Link} to="/profile" className="px-3 py-2 d-flex align-items-center" onClick={() => onClose?.()}>
                    <PersonFill className="me-2" /> Profil
                  </Nav.Link>
                  <Nav.Link as={Link} to="/notifications" className="px-3 py-2 d-flex align-items-center" onClick={() => onClose?.()}>
                    <BellFill className="me-2" /> Notification
                  </Nav.Link>
                  <Nav.Link as={Link} to="/rapports" className="px-3 py-2 d-flex align-items-center" onClick={() => onClose?.()}>
                    <BarChartFill className="me-2" /> Rapports
                  </Nav.Link>
                </div>
              </Collapse>
            </Nav.Item>

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

        {/* Section Paramètre (desktop) */}
        <Nav.Item>
          <Nav.Link
            as="button"
            onClick={() => setSettingsOpen((s) => !s)}
            className={`d-flex align-items-center px-3 py-2 ${settingsOpen ? 'active' : 'text-muted'}`}
            aria-expanded={settingsOpen}
          >
            <span className="me-2"><GearFill /></span>
            {!collapsed && <span>Paramètre</span>}
            {!collapsed && (
              <span className={`sidebar-chev ${settingsOpen ? 'open' : 'closed'}`}>{settingsOpen ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </Nav.Link>

          <Collapse in={settingsOpen}>
            <div className="sidebar-submenu">
              <Nav.Link as={Link} to="/profile" className={`d-flex align-items-center px-3 py-2 ${location.pathname === '/profile' ? 'active' : 'text-muted'}`}>
                <PersonFill className="me-2" /> {!collapsed && 'Profil'}
              </Nav.Link>
              <Nav.Link as={Link} to="/notifications" className={`d-flex align-items-center px-3 py-2 ${location.pathname === '/notifications' ? 'active' : 'text-muted'}`}>
                <BellFill className="me-2" /> {!collapsed && 'Notification'}
              </Nav.Link>
              <Nav.Link as={Link} to="/rapports" className={`d-flex align-items-center px-3 py-2 ${location.pathname === '/rapports' ? 'active' : 'text-muted'}`}>
                <BarChartFill className="me-2" /> {!collapsed && 'Rapports'}
              </Nav.Link>
            </div>
          </Collapse>
        </Nav.Item>

      </Nav>
    </div>
  );
};

export default Sidebar;